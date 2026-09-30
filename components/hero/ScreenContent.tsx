"use client";

// Laptop ekranındaki husnu.dev önizlemesi (DESIGN.md §9).
//
// İçerik ikinci kez React ile render edilmez: canvas'ın hemen altında zaten
// duran gerçek üst bölüm (Header + bento) `cloneNode` ile kopyalanır. Klon,
// viewport genişliğinde render edildiği ve bitiş kamerası ekranı tam viewport
// genişliğine oturttuğu için devir anında önizleme ile gerçek DOM piksel
// piksel üst üste gelir.
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { CLONE_AT, LAPTOP } from "./constants";
import { rig, screenSource } from "./rig";

const REFRESH_AT = 0.85;
const FOCUSABLE = "a, button, input, select, textarea, summary, [tabindex]";

function cloneSource(src: HTMLElement, width: number): HTMLElement {
  const clone = src.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.querySelectorAll(FOCUSABLE).forEach((el) => el.setAttribute("tabindex", "-1"));
  // cloneNode canvas piksellerini kopyalamaz.
  const from = src.querySelectorAll("canvas");
  clone.querySelectorAll("canvas").forEach((c, i) => {
    try {
      c.getContext("2d")?.drawImage(from[i], 0, 0);
    } catch {
      /* WebGL ya da tainted canvas: boş kalması sorun değil */
    }
  });
  clone.style.width = `${width}px`;
  clone.style.pointerEvents = "none";
  return clone;
}

type Props = { width: number; height: number };

export default function ScreenContent({ width, height }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  // Hangi genişlik + aşama için klonlandığı ("1280:1"). Devirden hemen önce
  // (p ≥ 0.85) bir kez daha klonlanır ki terminal gibi canlı bento'lar
  // gerçek DOM'la aynı anı göstersin.
  const clonedFor = useRef("");

  const setWrapper = useCallback((el: HTMLDivElement | null) => {
    wrapperRef.current = el;
    if (el) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }
  }, []);

  // Genişlik değişince (resize) klon tazelenir.
  useEffect(() => {
    clonedFor.current = "";
  }, [width]);

  useFrame(() => {
    const wrapper = wrapperRef.current;
    const host = hostRef.current;
    if (!wrapper || !host) return;

    const needed = rig.progress >= CLONE_AT || rig.screenOn > 0;
    const key = `${width}:${rig.progress >= REFRESH_AT ? 2 : 1}`;
    if (needed && clonedFor.current !== key && screenSource.el) {
      host.replaceChildren(cloneSource(screenSource.el, width));
      clonedFor.current = key;
    }

    // backface-visibility tek başına yeterli değil; kapak kameraya dönmeden
    // ekran içeriği hiçbir koşulda görünmez.
    const facing = rig.laptopRotY > Math.PI * 0.5;
    const visible = facing && rig.screenOn > 0.001;
    wrapper.style.visibility = visible ? "visible" : "hidden";
    wrapper.style.opacity = String(rig.screenOn);
  });

  return (
    <Html
      transform
      // drei: transform modunda 1 CSS px = distanceFactor / 400 dünya birimi.
      distanceFactor={(400 * LAPTOP.screenW) / width}
      position={[0, LAPTOP.screenCenterY, LAPTOP.lidT / 2 + 0.002]}
      zIndexRange={[1, 0]}
      pointerEvents="none"
    >
      <div
        ref={setWrapper}
        style={{
          width,
          height,
          overflow: "hidden",
          background: "#1D1D1D",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={hostRef} />
      </div>
    </Html>
  );
}
