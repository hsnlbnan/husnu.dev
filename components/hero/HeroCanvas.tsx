"use client";

// Dinamik import hedefi (ssr: false). Canvas, kalite katmanı ve render
// döngüsü kontrolü burada; sahne içeriği Scene'de.
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import { buildCrowd } from "./characters.config";
import { SCREEN_ASPECT } from "./constants";
import { attachPointer } from "./focus";
import { detectTier, getLayout, lowerTier, TIERS, type Tier } from "./quality";
import Scene from "./Scene";

type Props = {
  /** Hero görünür ve sekans bitmemişse true; değilse render durur. */
  active: boolean;
  still: boolean;
  onReady: () => void;
  onFail: () => void;
};

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}

/**
 * frameloop="demand" (azaltılmış hareket) iken tek kare yetmez: drei Html'in
 * useFrame'i laptopun dönüşü uygulanmadan önce çalışır ve bir önceki karenin
 * matrislerini okur. İlk açılışta ve her boyut değişiminde birkaç kare
 * çizdirerek her şeyin oturmasını sağlar.
 */
function SettleFrames() {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const left = useRef(3);
  useEffect(() => {
    left.current = 3;
    invalidate();
  }, [size.width, size.height, invalidate]);
  useFrame(() => {
    if (left.current-- > 0) invalidate();
  });
  return null;
}

function useViewport() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSize({ width: window.innerWidth, height: window.innerHeight }));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return size;
}

export default function HeroCanvas({ active, still, onReady, onFail }: Props) {
  // Kalabalık boyutu ilk katmandan seçilir ve sabit kalır; sonradan düşüş
  // yalnızca dpr/gölge/sheen'i kısar ki karakterler ekranda "pat" diye
  // kaybolmasın.
  const [initialTier] = useState<Tier>(detectTier);
  const [tier, setTier] = useState<Tier>(initialTier);
  const viewport = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cssWidth, setCssWidth] = useState(0);

  const layout = useMemo(
    () => getLayout(viewport.width, viewport.height, initialTier),
    [viewport.width, viewport.height, initialTier]
  );
  const characters = useMemo(
    () => buildCrowd(layout.crowd, layout.laptopScale),
    [layout.crowd, layout.laptopScale]
  );

  // Ekrandaki klon, canvas'ın CSS genişliğinde render edilir.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCssWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => (still ? undefined : attachPointer()), [still]);

  const settings = TIERS[tier];
  const screenPx = { width: cssWidth || viewport.width, height: Math.round((cssWidth || viewport.width) / SCREEN_ASPECT) };

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        aria-hidden="true"
        tabIndex={-1}
        frameloop={still ? "demand" : active ? "always" : "never"}
        dpr={settings.dpr}
        shadows={settings.shadows ? { type: PCFSoftShadowMap } : false}
        camera={{ fov: layout.fov, near: 0.05, far: 60, position: layout.camPos }}
        gl={{
          antialias: window.devicePixelRatio < 2,
          powerPreference: "high-performance",
          alpha: false,
          toneMapping: ACESFilmicToneMapping,
        }}
        onCreated={(state) => {
          const { gl } = state;
          if (process.env.NODE_ENV === "development") {
            (window as unknown as { __hero?: unknown }).__hero = state;
          }
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onFail();
          });
        }}
        style={{ pointerEvents: "none" }}
      >
        {!still && (
          <PerformanceMonitor
            bounds={() => [45, 1000]}
            flipflops={Infinity}
            onDecline={() => setTier((t) => lowerTier(t))}
          />
        )}
        <FirstFrame onReady={onReady} />
        {still && <SettleFrames />}
        <Scene layout={layout} characters={characters} tier={settings} screenPx={screenPx} still={still} />
      </Canvas>
    </div>
  );
}
