"use client";

// Laptop ekranındaki husnu.dev önizlemesi (DESIGN.md §9).
//
// İçerik ikinci kez React ile render edilmez: canvas'ın hemen altında zaten
// duran gerçek üst bölüm (Header + bento) `cloneNode` ile kopyalanır. Klon,
// viewport genişliğinde render edildiği ve bitiş kamerası ekranı tam viewport
// genişliğine oturttuğu için devir anında önizleme ile gerçek DOM piksel
// piksel üst üste gelir.
//
// Yerleştirme: drei <Html transform> KULLANILMAZ. O bileşen CSS `perspective`
// ile tarayıcının 3D kamerasını taklit eder ve WebKit (iOS Safari) katmanı
// dikeyde kaydırıyordu. Bunun yerine ekranın 4 köşesi her karede kameradan
// ekrana yansıtılır ve düz bir DOM katmanı tek bir projektif `matrix3d`
// (homografi) ile o dörtgene oturtulur — perspective yok, her motorda aynı.
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Object3D, Vector3 } from "three";
import { CLONE_AT, LAPTOP } from "./constants";
import { rig, screenSource } from "./rig";

const REFRESH_AT = 0.85;
const FOCUSABLE = "a, button, input, select, textarea, summary, [tabindex]";

/** Canvas dışındaki katman; projektör buna yazar. */
const overlay: { wrapper: HTMLDivElement | null; host: HTMLDivElement | null } = { wrapper: null, host: null };

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

type Size = { width: number; height: number };

/** Canvas'ın kardeşi olarak render edilir (aynı konteyner, aynı koordinatlar). */
export function ScreenOverlay({ width, height }: Size) {
  const setWrapper = useCallback((el: HTMLDivElement | null) => {
    overlay.wrapper = el;
    if (el) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }
  }, []);
  const setHost = useCallback((el: HTMLDivElement | null) => {
    overlay.host = el;
  }, []);

  return (
    <div
      ref={setWrapper}
      className="pointer-events-none absolute left-0 top-0 overflow-hidden"
      style={{
        width,
        height,
        background: "#1D1D1D",
        transformOrigin: "0 0",
        visibility: "hidden",
        opacity: 0,
        willChange: "transform",
      }}
    >
      <div ref={setHost} />
    </div>
  );
}

// ─── Homografi: (0,0)(w,0)(w,h)(0,h) → yansıtılmış 4 köşe ────────────────────
type M3 = number[]; // 3×3, satır sıralı

const adj = (m: M3): M3 => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mul = (a: M3, b: M3): M3 => {
  const c = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
};
const mulV = (m: M3, v: number[]) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
function basis(p: number[]): M3 {
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
  const v = mulV(adj(m), [p[6], p[7], 1]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}
function homography(src: number[], dst: number[]) {
  const t = mul(basis(dst), adj(basis(src)));
  const h = t.map((x) => x / t[8]);
  // CSS matrix3d sütun sıralıdır.
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,${h[8]})`;
}

const corner = new Vector3();
const w2 = LAPTOP.screenW / 2;
const h2 = LAPTOP.screenH / 2;
// Sol üst, sağ üst, sağ alt, sol alt (ekran merkezine göre, kapak yerel uzayı).
const LOCAL = [
  [-w2, h2],
  [w2, h2],
  [w2, -h2],
  [-w2, -h2],
];

/**
 * Kapak grubundaki bir çapaya göre katmanı ekran dörtgenine oturtur.
 * `project()` Laptop'ın useFrame'inin SONUNDA çağrılır: kamera (CameraRig,
 * sahnede ilk) ve kapak dönüşü o karede güncellendikten sonra — yoksa
 * scroll sırasında katman bir kare geride kalıp titrer.
 */
export function useScreenProjection({ width, height }: Size) {
  const anchor = useRef<Object3D>(null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  // Hangi genişlik + aşama için klonlandığı. Devirden hemen önce (p ≥ 0.85)
  // bir kez daha klonlanır ki canlı kartlar gerçek DOM'la aynı anı göstersin.
  const clonedFor = useRef("");

  useEffect(() => {
    clonedFor.current = "";
  }, [width]);

  const project = () => {
    const { wrapper, host } = overlay;
    const a = anchor.current;
    if (!wrapper || !host || !a) return;

    const needed = rig.progress >= CLONE_AT || rig.screenOn > 0;
    const key = `${width}:${rig.progress >= REFRESH_AT ? 2 : 1}`;
    if (needed && clonedFor.current !== key && screenSource.el) {
      host.replaceChildren(cloneSource(screenSource.el, width));
      clonedFor.current = key;
    }

    // Kapak kameraya dönmeden ekran içeriği hiçbir koşulda görünmez.
    const facing = rig.laptopRotY > Math.PI * 0.5;
    if (!facing || rig.screenOn < 0.001) {
      wrapper.style.visibility = "hidden";
      return;
    }

    a.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();
    const dst: number[] = [];
    for (const [x, y] of LOCAL) {
      corner.set(x, y, 0);
      a.localToWorld(corner);
      corner.project(camera);
      if (corner.z > 1) {
        // Köşe kameranın arkasında: yansıtma anlamsız (dalışta olmaz, güvence).
        wrapper.style.visibility = "hidden";
        return;
      }
      dst.push(((corner.x + 1) / 2) * size.width, ((1 - corner.y) / 2) * size.height);
    }
    wrapper.style.transform = homography([0, 0, width, 0, width, height, 0, height], dst);
    wrapper.style.visibility = "visible";
    wrapper.style.opacity = String(rig.screenOn);
  };

  return { anchor, project, position: [0, LAPTOP.screenCenterY, LAPTOP.lidT / 2 + 0.002] as [number, number, number] };
}
