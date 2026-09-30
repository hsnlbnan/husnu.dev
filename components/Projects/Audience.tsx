"use client";

// Proje sahnesinin alt kenarındaki seyirciler (hero kalabalığının 2D hâli).
//
// Boşta: patlamış mısır yiyip çiğner, kola içer, göz kırpar, gözleriyle
// imleci izler. Her yeni projede (`beat`) sırayla zıplar, ağızlarını "O"
// yapar, kaşlarını kaldırır; kovalardan mısır taneleri fırlar.
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Prop = "popcorn" | "soda" | "glasses3d" | null;

const CAST: { color: string; size: number; prop: Prop; desktopOnly?: boolean }[] = [
  { color: "#F2A98F", size: 92, prop: "popcorn", desktopOnly: true },
  { color: "#7C5CFF", size: 104, prop: "glasses3d" },
  { color: "#2FBF71", size: 94, prop: "soda" },
  { color: "#DFFF1F", size: 116, prop: "popcorn" }, // kahraman
  { color: "#FF5A4E", size: 98, prop: null },
  { color: "#3D7BFF", size: 92, prop: "popcorn" },
  { color: "#C98F6B", size: 100, prop: "soda", desktopOnly: true },
];

const KEYFRAMES = `
@keyframes aud-feed { 0%,28% { transform: translate(0,0) } 42%,58% { transform: translate(var(--dx), var(--dy)) } 72%,100% { transform: translate(0,0) } }
@keyframes aud-kernel { 0%,40% { opacity: 1 } 44%,100% { opacity: 0 } }
@keyframes aud-chew { 0%,55% { transform: scaleY(1) } 60% { transform: scaleY(.3) } 66% { transform: scaleY(1) } 72% { transform: scaleY(.3) } 78%,100% { transform: scaleY(1) } }
@keyframes aud-blink { 0%,93%,100% { transform: scaleY(1) } 96% { transform: scaleY(.08) } }
@keyframes aud-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2.5%) } }
@keyframes aud-sip { 0%,55%,100% { transform: translateY(0) rotate(0) } 65%,85% { transform: translateY(-14%) rotate(-6deg) } }
`;

export type Mood = "idle" | "happy" | "calm" | "wow";

type AudienceProps = {
  beat: number;
  /** CAST içinden gösterilecek karakterler (varsayılan: hepsi). */
  cast?: number[];
  /** Dışarıdan verilen ifade; "wow" beat tepkisiyle aynı görünür. */
  mood?: Mood;
  /** Kök konumlandırma sınıfı (varsayılan: sahnenin alt kenarı). */
  className?: string;
};

const ROOT_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex origin-bottom scale-[0.5] items-end justify-center gap-1 md:scale-[0.85] md:gap-3 xl:scale-100";

export default function Audience({ beat, cast, mood = "idle", className = ROOT_CLASS }: AudienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const first = useRef(true);
  const [wow, setWow] = useState(0); // 0: sakin; >0: tepki (her beat'te artar)

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setWow((w) => w + 1);
    const t = window.setTimeout(() => setWow(0), 950);
    return () => window.clearTimeout(t);
  }, [beat, reduced]);

  // Göz bebekleri imleci izler; yalnızca sahne görünürken çalışır.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0;
    let running = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      root.querySelectorAll<HTMLElement>("[data-eye]").forEach((eye) => {
        const r = eye.getBoundingClientRect();
        if (!r.width) return;
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 220) * r.width * 0.22;
        (eye.firstElementChild as HTMLElement).style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
      });
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
    >
      <style>{KEYFRAMES}</style>
      {CAST.map((c, i) =>
        cast && !cast.includes(i) ? null : (
          <Spectator
            key={i}
            index={i}
            {...c}
            desktopOnly={cast ? false : c.desktopOnly}
            beat={beat}
            mood={wow > 0 ? "wow" : mood}
            still={!!reduced}
          />
        )
      )}
    </div>
  );
}

function Spectator({
  index,
  color,
  size: s,
  prop,
  desktopOnly,
  beat,
  mood,
  still,
}: {
  index: number;
  color: string;
  size: number;
  prop: Prop;
  desktopOnly?: boolean;
  beat: number;
  mood: Mood;
  still: boolean;
}) {
  const wow = mood === "wow";
  const happy = mood === "happy";
  const calm = mood === "calm";
  const controls = useAnimationControls();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (still) return;
    controls.start({
      y: [0, -s * 0.3, 0, -s * 0.08, 0],
      rotate: [0, index % 2 ? 4 : -4, 0],
      transition: { duration: 0.7, delay: index * 0.05, ease: "easeOut" },
    });
  }, [beat, still, controls, index, s]);

  const W = s * 1.5;
  const H = s * 1.55;
  const headLeft = (W - s) / 2;
  const headBottom = s * 0.5;
  // Döngüler karakter başına farklı ritimde ki kalabalık senkron görünmesin.
  const loop = (name: string, dur: number, delay = 0): CSSProperties =>
    still ? {} : { animation: `${name} ${dur}s ${delay}s infinite ease-in-out` };
  const feedDur = 3.2 + (index % 3) * 0.7;
  const feedDelay = index * 0.6;
  const eats = prop === "popcorn";

  return (
    <motion.div
      animate={controls}
      className={`relative shrink-0 ${desktopOnly ? "hidden md:block" : ""}`}
      style={{ width: W, height: H, marginBottom: -s * 0.3, marginInline: -s * 0.08 }}
    >
      {/* Gövde */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#0B0B0C] shadow-[inset_0_6px_0_rgba(255,255,255,0.05)]"
        style={{ width: s * 1.3, height: s * 0.78, borderRadius: `${s * 0.6}px ${s * 0.6}px 0 0` }}
      />

      {/* Kafa */}
      <div className="absolute" style={{ left: headLeft, bottom: headBottom, width: s, height: s, ...loop("aud-bob", 2.4 + index * 0.2) }}>
        <div
          className="relative h-full w-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `inset ${-s * 0.1}px ${-s * 0.13}px 0 rgba(0,0,0,0.16)` }}
        >
          {/* Kaşlar */}
          {[0, 1].map((e) => (
            <span
              key={e}
              className="absolute rounded-full bg-[#0A0A0A] transition-transform duration-200"
              style={{
                width: s * 0.2,
                height: s * 0.05,
                top: s * 0.2,
                left: e ? s * 0.56 : s * 0.24,
                transform: `translateY(${wow ? -s * 0.07 : happy ? -s * 0.03 : 0}px) rotate(${wow ? (e ? 10 : -10) : calm ? (e ? 6 : -6) : e ? -4 : 4}deg)`,
              }}
            />
          ))}

          {/* Gözler */}
          <div
            className="absolute flex transition-transform duration-200"
            style={{ top: s * 0.28, left: s * 0.2, gap: s * 0.08, transform: `scale(${wow ? 1.12 : 1})` }}
          >
            {[0, 1].map((e) => (
              <span
                key={e}
                data-eye=""
                className="relative block overflow-hidden rounded-full bg-[#F4F4F0]"
                style={{ width: s * 0.26, height: s * 0.26, ...loop("aud-blink", 3.6 + index * 0.45, index * 0.3) }}
              >
                <span
                  className="absolute inset-0 m-auto block rounded-full bg-[#0A0A0A]"
                  style={{ width: s * (wow ? 0.1 : 0.12), height: s * (wow ? 0.1 : 0.12) }}
                />
                {/* Sakin: yarı kapalı göz kapağı */}
                <span
                  className="absolute inset-x-[-4%] top-[-4%] block rounded-t-full transition-[height] duration-300"
                  style={{ backgroundColor: color, height: calm ? "52%" : "0%" }}
                />
              </span>
            ))}
          </div>

          {/* 3D sinema gözlüğü */}
          {prop === "glasses3d" && (
            <div
              className="absolute flex items-center justify-center rounded-md bg-[#0A0A0A]"
              style={{ top: s * 0.25, left: s * 0.12, width: s * 0.76, height: s * 0.32, gap: s * 0.06, padding: s * 0.04 }}
            >
              <span className="h-full flex-1 rounded-sm bg-[#FF3B3B]/60" />
              <span className="h-full flex-1 rounded-sm bg-[#22D3EE]/60" />
            </div>
          )}

          {/* Ağız: sakin / çiğneme / "O" */}
          {happy ? (
            // Mutlu: geniş gülümseme
            <span
              className="absolute left-1/2 block -translate-x-1/2 rounded-b-full bg-[#2A0A0A]"
              style={{ top: s * 0.62, width: s * 0.3, height: s * 0.15 }}
            />
          ) : wow ? (
            <span
              className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-full bg-[#2A0A0A]"
              style={{ top: s * 0.62, width: s * 0.2, height: s * 0.22 }}
            >
              <span className="absolute inset-x-[20%] bottom-0 h-[40%] rounded-t-full bg-[#FF6B8A]" />
            </span>
          ) : (
            <span
              className="absolute left-1/2 block origin-center rounded-full bg-[#2A0A0A]"
              style={{
                top: s * 0.66,
                width: s * 0.2,
                height: s * 0.08,
                marginLeft: -s * 0.1,
                ...(eats ? loop("aud-chew", feedDur, feedDelay) : {}),
              }}
            />
          )}
        </div>
      </div>

      {prop === "popcorn" && <Popcorn s={s} still={still} dur={feedDur} delay={feedDelay} color={color} burst={wow} beat={beat} />}
      {prop === "soda" && <Soda s={s} still={still} index={index} />}
    </motion.div>
  );
}

function Popcorn({
  s,
  still,
  dur,
  delay,
  color,
  burst,
  beat,
}: {
  s: number;
  still: boolean;
  dur: number;
  delay: number;
  color: string;
  burst: boolean;
  beat: number;
}) {
  const bw = s * 0.5;
  const bh = s * 0.52;
  const left = s * 0.06;
  const bottom = s * 0.12;
  // El kovadan ağza gider: ağız merkezi ile kovanın üst ortası arasındaki fark.
  const handSize = s * 0.2;
  const mouthX = (s * 1.5) / 2 - handSize / 2;
  const mouthY = s * 0.5 + s * (1 - 0.7);
  const handX = left + bw / 2 - handSize / 2;
  const handY = bottom + bh;
  const handStyle = {
    left: handX,
    bottom: handY,
    width: handSize,
    height: handSize,
    backgroundColor: color,
    ["--dx" as string]: `${mouthX - handX}px`,
    ["--dy" as string]: `${-(mouthY - handY)}px`,
    ...(still ? {} : { animation: `aud-feed ${dur}s ${delay}s infinite ease-in-out` }),
  } as CSSProperties;

  return (
    <>
      {/* Kova: çizgili, üstü taşan mısırlar */}
      <div className="absolute" style={{ left, bottom, width: bw, height: bh }}>
        <div className="absolute inset-x-0 -top-[22%] flex flex-wrap justify-center" style={{ gap: s * 0.005 }}>
          {Array.from({ length: 7 }).map((_, k) => (
            <span
              key={k}
              className="rounded-full bg-[#FFF4D6] shadow-[inset_-2px_-2px_0_rgba(214,170,80,0.5)]"
              style={{ width: s * 0.14, height: s * 0.13, marginTop: k > 3 ? -s * 0.06 : 0 }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)",
            background: "repeating-linear-gradient(90deg, #E8375A 0 18%, #FFF7F0 18% 36%)",
            boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)",
          }}
        />
        {/* Tepki: kovadan fırlayan taneler */}
        {burst &&
          Array.from({ length: 6 }).map((_, k) => (
            <motion.span
              key={`${beat}-${k}`}
              className="absolute left-1/2 top-0 block rounded-full bg-[#FFF4D6]"
              style={{ width: s * 0.1, height: s * 0.09 }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: (k - 2.5) * s * 0.14,
                y: [0, -s * (0.55 + (k % 3) * 0.18), s * 0.2],
                opacity: [1, 1, 0],
                rotate: (k - 2.5) * 60,
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          ))}
      </div>
      {/* El (elinde bir tane mısırla) */}
      <span className="absolute rounded-full shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.15)]" style={handStyle}>
        <span
          className="absolute -top-[30%] left-[20%] block rounded-full bg-[#FFF4D6]"
          style={{ width: s * 0.09, height: s * 0.08, ...(still ? {} : { animation: `aud-kernel ${dur}s ${delay}s infinite` }) }}
        />
      </span>
    </>
  );
}

function Soda({ s, still, index }: { s: number; still: boolean; index: number }) {
  return (
    <div
      className="absolute"
      style={{
        right: s * 0.1,
        bottom: s * 0.1,
        width: s * 0.3,
        height: s * 0.48,
        transformOrigin: "bottom center",
        ...(still ? {} : { animation: `aud-sip ${4 + index * 0.3}s ${index * 0.5}s infinite ease-in-out` }),
      }}
    >
      {/* Pipet ağza doğru */}
      <span
        className="absolute bottom-[85%] left-[35%] block origin-bottom rounded-full bg-[#F4F4F0]"
        style={{ width: s * 0.035, height: s * 0.42, transform: "rotate(-38deg)" }}
      />
      <span className="absolute inset-x-[-6%] top-0 block h-[14%] rounded-md bg-[#F4F4F0]" />
      <span
        className="absolute inset-x-0 bottom-0 top-[12%] block"
        style={{
          clipPath: "polygon(0 0, 100% 0, 84% 100%, 16% 100%)",
          background: "linear-gradient(90deg, #FF5A4E 0 45%, #FF7A6E 45% 60%, #FF5A4E 60%)",
        }}
      />
    </div>
  );
}
