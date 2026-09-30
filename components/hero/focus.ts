// İmleç / dokunma / otomatik gezinme → dünya uzayında `cursorTarget`
// (DESIGN.md §6). Tüm vektörler modül seviyesinde; kare başına tahsis yok.
import { MathUtils, Plane, Raycaster, Vector2, Vector3, type Camera } from "three";

const IDLE_AFTER = 3; // sn hareketsizlikten sonra otomatik gezinme
const TOUCH_HOLD = 2.5; // dokunma noktası bu kadar sn hedef kalır
const LEAVE_BLEND = 1; // pencereden çıkınca otomatik gezinmeye geçiş

const pointer = {
  ndc: new Vector2(),
  lastMove: -Infinity, // performance.now() / 1000
  inside: false,
  touchUntil: -Infinity,
  coarse: false,
};

/** Kalabalığın ve laptopun paylaştığı hedefler. */
export const targets = {
  cursor: new Vector3(0, 1.6, 5),
  laptop: new Vector3(0, 0.6, 3.3),
};

const now = () => performance.now() / 1000;

export function attachPointer(): () => void {
  pointer.coarse = window.matchMedia("(pointer: coarse)").matches;

  const onMove = (e: PointerEvent) => {
    pointer.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    if (e.pointerType === "mouse") {
      pointer.lastMove = now();
      pointer.inside = true;
    } else {
      pointer.touchUntil = now() + TOUCH_HOLD;
    }
  };
  const onLeave = (e: PointerEvent) => {
    if (!e.relatedTarget) pointer.inside = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}

const raycaster = new Raycaster();
const plane = new Plane(new Vector3(0, 0, 1), -5); // z = 5 düzlemi
const hit = new Vector3();
const raw = new Vector3();

/**
 * Her kare çağrılır. İmleç yakın zamanda hareket ettiyse onu, yoksa yavaş bir
 * Lissajous eğrisini hedefler; geçişler sönümlüdür ki bakış sıçramasın.
 */
export function updateCursorTarget(camera: Camera, t: number, delta: number) {
  const time = now();
  const touching = time < pointer.touchUntil;
  const mouseActive = !pointer.coarse && pointer.inside && time - pointer.lastMove < IDLE_AFTER;

  if (touching || mouseActive) {
    raycaster.setFromCamera(pointer.ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      raw.set(MathUtils.clamp(hit.x, -4, 4), MathUtils.clamp(hit.y, 0.3, 3.2), 5);
    }
  } else {
    raw.set(Math.sin(t * 0.31) * 2.6, 1.6 + Math.sin(t * 0.47) * 0.7, 5);
  }

  // İmleç aktifken hızlı, otomatik gezinmeye dönerken ~1 sn'lik yumuşak geçiş.
  const lambda = touching || mouseActive ? 10 : 3 / LEAVE_BLEND;
  const dt = Math.min(delta, 0.1);
  targets.cursor.x = MathUtils.damp(targets.cursor.x, raw.x, lambda, dt);
  targets.cursor.y = MathUtils.damp(targets.cursor.y, raw.y, lambda, dt);
  targets.cursor.z = 5;
}
