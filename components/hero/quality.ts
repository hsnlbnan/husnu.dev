// Kalite katmanları ve duyarlı sahne düzeni (DESIGN.md §11–12).
import type { CrowdVariant } from "./characters.config";

export type Tier = "high" | "mid" | "low";

export type TierSettings = {
  dpr: [number, number];
  shadows: boolean;
  sheen: boolean;
  sphereSegments: number;
};

export const TIERS: Record<Tier, TierSettings> = {
  high: { dpr: [1, 2], shadows: true, sheen: true, sphereSegments: 48 },
  mid: { dpr: [1, 1.5], shadows: false, sheen: false, sphereSegments: 32 },
  low: { dpr: [1, 1], shadows: false, sheen: false, sphereSegments: 24 },
};

export function lowerTier(tier: Tier): Tier {
  return tier === "high" ? "mid" : "low";
}

/** Başlangıç katmanı cihaz ipuçlarından seçilir; sonra yalnızca aşağı iner. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;

  if ((memory !== undefined && memory <= 4) || (coarse && width < 768)) return "low";
  if (coarse || width < 1280 || cores <= 4) return "mid";
  return "high";
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export type SceneLayout = {
  breakpoint: "desktop" | "tablet" | "mobile";
  fov: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  laptopScale: number;
  crowd: CrowdVariant;
  /** Pin mesafesi, viewport yüksekliğinin katı. */
  pinDistance: number;
};

export function getLayout(width: number, height: number, tier: Tier): SceneLayout {
  const portrait = height > width;

  if (width < 768 || (portrait && width < 900)) {
    return {
      breakpoint: "mobile",
      fov: 36,
      camPos: [0, 1.9, 11.5],
      camTarget: [0, 1.25, 0],
      laptopScale: 1.15,
      crowd: "compact",
      pinDistance: 3.2,
    };
  }

  if (width < 1280) {
    return {
      breakpoint: "tablet",
      fov: 28,
      camPos: [0, 1.6, 10.2],
      camTarget: [0, 1.15, 0],
      laptopScale: 1,
      crowd: tier === "low" ? "sparse" : "medium",
      pinDistance: 4,
    };
  }

  return {
    breakpoint: "desktop",
    fov: 28,
    camPos: [0, 1.55, 9.2],
    camTarget: [0, 1.15, 0],
    laptopScale: 1,
    crowd: tier === "high" ? "wide" : tier === "mid" ? "medium" : "sparse",
    pinDistance: 4,
  };
}
