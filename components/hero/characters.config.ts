// Tohumlu kalabalık üreticisi (DESIGN.md §3–4).
//
// Rastgelelik sabit seed'lidir: her yüklemede aynı sahne, aynı ekran görüntüsü.
// Karakterler Math.random ile değil burada üretilir ki poster, sunucu ve
// istemci arasında tutarlı kalsın.
import { HEAD_COLORS, LIME, SEED } from "./constants";

export type EyeStyle = "normal" | "big" | "squint" | "surprised" | "wink";
export type BrowStyle = "neutral" | "curious" | "frown" | "sad";
export type AccessoryKind =
  | "glasses"
  | "headphones"
  | "beanie"
  | "cap"
  | "antenna"
  | "bowtie"
  | "curls"
  | "bandana"
  | "pencil";

export type CharacterConfig = {
  id: number;
  row: number;
  /** Boyun noktası (HeadPivot) dünya konumu. */
  position: [number, number, number];
  scale: number;
  color: string;
  squash: number; // kafa y ölçeği, 0.9–1.0
  eyes: EyeStyle;
  brows: BrowStyle;
  accessory: AccessoryKind | null;
  accessoryColor: string;
  stiffness: number; // damp hızı, 3.5–8
  maxYaw: number; // radyan
  blinkOffset: number; // sn
  blinkInterval: number; // sn, 2.5–6
  phase: number; // nefes/sallanma fazı
  hero: boolean;
  /** Ön sırada, laptopun hangi yanında (-1 sol, 1 sağ, 0 arka sıralar). */
  side: -1 | 0 | 1;
};

type RowSpec = {
  count: number;
  z: number;
  headY: number; // kafa merkezi
  width: number;
  scale: number;
};

export type CrowdVariant = "wide" | "medium" | "sparse" | "compact";

// Masaüstü 5-6-6-5; tablet 3 sıra; mobilde 5 sıra × 2 (DESIGN.md §3, §12).
const ROWS: Record<CrowdVariant, RowSpec[]> = {
  wide: [
    { count: 5, z: 2.0, headY: 0.55, width: 5.4, scale: 0.95 },
    { count: 6, z: 1.0, headY: 1.0, width: 6.4, scale: 1.0 },
    { count: 6, z: 0.0, headY: 1.5, width: 7.4, scale: 1.07 },
    { count: 5, z: -1.1, headY: 2.05, width: 8.2, scale: 1.15 },
  ],
  medium: [
    { count: 4, z: 2.0, headY: 0.55, width: 5.0, scale: 0.95 },
    { count: 5, z: 1.0, headY: 1.0, width: 5.8, scale: 1.02 },
    { count: 5, z: -0.2, headY: 1.6, width: 6.8, scale: 1.12 },
  ],
  sparse: [
    { count: 2, z: 2.0, headY: 0.55, width: 4.6, scale: 0.95 },
    { count: 3, z: 0.9, headY: 1.05, width: 5.0, scale: 1.05 },
    { count: 4, z: -0.3, headY: 1.65, width: 6.4, scale: 1.12 },
  ],
  compact: [
    { count: 2, z: 2.0, headY: 0.55, width: 3.2, scale: 0.95 },
    { count: 2, z: 1.15, headY: 1.0, width: 2.2, scale: 1.0 },
    { count: 2, z: 0.3, headY: 1.45, width: 2.9, scale: 1.05 },
    { count: 2, z: -0.55, headY: 1.9, width: 2.2, scale: 1.1 },
    { count: 2, z: -1.4, headY: 2.35, width: 3.0, scale: 1.15 },
  ],
};

const EYES: EyeStyle[] = ["normal", "normal", "big", "squint", "surprised", "wink"];
const BROWS: BrowStyle[] = ["neutral", "neutral", "curious", "frown", "sad"];
const ACCESSORIES: AccessoryKind[] = [
  "glasses",
  "headphones",
  "beanie",
  "cap",
  "antenna",
  "bowtie",
  "curls",
  "bandana",
  "pencil",
];

const ACCESSORY_COLORS: Record<AccessoryKind, readonly string[]> = {
  glasses: ["#0A0A0A", "#2B2B2E"],
  headphones: ["#2B2B2E", "#D9D9D4", "#3D7BFF"],
  beanie: ["#FF5A4E", "#3D7BFF", "#2FBF71", "#FF8A3D"],
  cap: ["#2B2B2E", "#7C5CFF", "#F15BB5"],
  antenna: ["#FF5A4E", "#3D7BFF"],
  bowtie: ["#FF5A4E", "#7C5CFF"],
  curls: ["#2B2B2E", "#8A5A44", "#1A1A1C"],
  bandana: ["#FF5A4E", "#3D7BFF"],
  pencil: ["#FF8A3D"],
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ön sıranın ortasında laptop için bırakılan boşluk (laptop ölçeğiyle büyür). */
const LAPTOP_GAP = 1.7;

export function buildCrowd(variant: CrowdVariant, laptopScale = 1): CharacterConfig[] {
  const rand = mulberry32(SEED);
  const range = (min: number, max: number) => min + rand() * (max - min);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];

  const rows = ROWS[variant];
  const out: CharacterConfig[] = [];
  const gap = LAPTOP_GAP * laptopScale;

  rows.forEach((row, r) => {
    const xs: number[] = [];
    const sides: (-1 | 0 | 1)[] = [];

    if (r === 0) {
      // Ön sıra: laptopun iki yanına bölünür, merkezde boşluk kalır.
      const right = Math.ceil(row.count / 2);
      const left = row.count - right;
      const half = row.width / 2;
      const inner = gap / 2 + 0.42 * row.scale;
      const place = (n: number, sign: -1 | 1) => {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0 : i / (n - 1);
          xs.push(sign * (inner + t * Math.max(0, half - inner)));
          sides.push(sign);
        }
      };
      place(left, -1);
      place(right, 1);
    } else {
      // Tuğla düzeni: tek sıralar yarım adım kaydırılır.
      const step = row.width / row.count;
      const brick = row.count > 2 ? step * (r % 2 === 1 ? 0.25 : -0.25) : 0;
      for (let i = 0; i < row.count; i++) {
        xs.push(-row.width / 2 + step * (i + 0.5) + brick);
        sides.push(0);
      }
    }

    xs.forEach((x, i) => {
      const scale = row.scale * range(0.92, 1.06);
      const headY = row.headY + range(-0.08, 0.08);
      // Boyun noktası: kafa merkezinin 0.36·s altında.
      const neckY = headY - 0.36 * scale;
      out.push({
        id: out.length,
        row: r,
        position: [x + range(-0.18, 0.18) * (r === 0 ? 0.4 : 1), neckY, row.z + range(-0.15, 0.15)],
        scale,
        color: "",
        squash: range(0.9, 1.0),
        eyes: pick(EYES),
        brows: pick(BROWS),
        accessory: null,
        accessoryColor: "",
        stiffness: range(3.5, 8),
        maxYaw: (range(32, 42) * Math.PI) / 180,
        blinkOffset: range(0, 6),
        blinkInterval: range(2.5, 6),
        phase: range(0, Math.PI * 2),
        hero: false,
        side: sides[i],
      });
    });
  });

  // Kahraman: ön sırada laptopa en yakın sağdaki karakter, lime kafalı.
  const hero = out
    .filter((c) => c.row === 0 && c.side === 1)
    .sort((a, b) => a.position[0] - b.position[0])[0];

  // Renkler: karıştırılmış desteden dağıt, aynı sırada yan yana aynı renk olmasın.
  let deck: string[] = [];
  const draw = (avoid: string) => {
    if (deck.length === 0) {
      deck = [...HEAD_COLORS];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    let idx = deck.findIndex((c) => c !== avoid);
    if (idx < 0) idx = 0;
    return deck.splice(idx, 1)[0];
  };

  let prevRow = -1;
  let prevColor = "";
  let prevAccessory: AccessoryKind | null = null;
  const byRowThenX = [...out].sort((a, b) => a.row - b.row || a.position[0] - b.position[0]);
  for (const c of byRowThenX) {
    if (c.row !== prevRow) {
      prevRow = c.row;
      prevColor = "";
      prevAccessory = null;
    }
    if (c === hero) {
      c.hero = true;
      c.color = LIME;
      c.eyes = "big";
      c.brows = "curious";
      c.accessory = "glasses";
      c.accessoryColor = "#0A0A0A";
      c.stiffness = 7.5;
    } else {
      c.color = draw(prevColor);
      // Karakterlerin ~%45'inde aksesuar; yan yana aynı aksesuar yok.
      if (rand() < 0.45) {
        let kind = pick(ACCESSORIES);
        if (kind === prevAccessory) kind = ACCESSORIES[(ACCESSORIES.indexOf(kind) + 1) % ACCESSORIES.length];
        c.accessory = kind;
        c.accessoryColor = pick(ACCESSORY_COLORS[kind]);
      }
    }
    prevColor = c.color;
    prevAccessory = c.accessory;
  }

  return out;
}
