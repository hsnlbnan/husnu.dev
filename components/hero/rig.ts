// Scroll ile 3D sahne arasındaki tek paylaşılan durum (DESIGN.md §7).
//
// GSAP timeline'ı bu düz nesneye yazar, `useFrame` okur. React state'e ya da
// three nesnelerine doğrudan yazılmadığı için scroll yeniden render tetiklemez.
export type Rig = {
  laptopRotY: number; // 0 → π
  laptopLift: number; // 0 → 0.22 → 0
  lidAngle: number; // derece; 105 → 90
  focusMix: number; // 0 imleç, 1 laptop
  crowdSpread: number; // 0 → 1, ön sıra yana açılır
  crowdDim: number; // 0 → 1, kalabalık kararır
  screenOn: number; // ekran içeriği opaklığı ve glow şiddeti
  camT: number; // 0 başlangıç pozu → 1 ekran-dolduran poz
  handoff: number; // 0 → 1, canvas söner
  progress: number; // ham scroll ilerlemesi (p)
};

export const RIG_DEFAULTS: Readonly<Rig> = {
  laptopRotY: 0,
  laptopLift: 0,
  lidAngle: 105,
  focusMix: 0,
  crowdSpread: 0,
  crowdDim: 0,
  screenOn: 0,
  camT: 0,
  handoff: 0,
  progress: 0,
};

export const rig: Rig = { ...RIG_DEFAULTS };

export function resetRig(values: Partial<Rig> = {}) {
  Object.assign(rig, RIG_DEFAULTS, values);
}

// Azaltılmış harekette tek kare: laptop 3/4 açıyla, ekran görünür.
export const REDUCED_MOTION_RIG: Partial<Rig> = {
  laptopRotY: Math.PI * 0.78,
  focusMix: 1,
  screenOn: 1,
  crowdSpread: 0.6,
};

/**
 * Ekranda klonlanacak gerçek içerik; HeroSection atar, ScreenContent okur.
 * Burada durur (ScreenContent'te değil) ki HeroSection 3D paketini ilk
 * yükleme chunk'ına çekmesin.
 */
export const screenSource: { el: HTMLElement | null } = { el: null };
