// "Seyirciler" hero'sunun sabitleri. Birimler yaklaşık metre, +Y yukarı,
// kamera +Z'den -Z'ye bakar (bkz. DESIGN.md §3).

export const LIME = "#DFFF1F";

export const PALETTE = {
  background: "#050505",
  body: "#0B0B0C",
  table: "#0A0A0A",
  laptop: "#1A1A1C",
  eyeWhite: "#F4F4F0",
  pupil: "#0A0A0A",
  screenOff: "#0A0A0A",
  aluminium: "#8A8D91", // space gray
  bezel: "#050506",
  keys: "#0E0E10",
  screenGlow: "#EFFFB0",
  key: "#FFF4E6",
  fill: "#7C5CFF",
  rim: LIME,
  hemiSky: "#1A1A22",
  hemiGround: "#000000",
} as const;

// Lime yalnızca "kahraman" karaktere verilir; bu listede bilinçli olarak yok.
export const HEAD_COLORS = [
  "#E8C9A9",
  "#C98F6B",
  "#8A5A44",
  "#F2A98F",
  "#7C5CFF",
  "#3D7BFF",
  "#FF5A4E",
  "#FF8A3D",
  "#2FBF71",
  "#F15BB5",
  "#D9D9D4",
  "#2B2B2E",
] as const;

// Laptop ölçüleri (yerel uzay; laptop +Z'ye bakacak şekilde modellenir).
export const LAPTOP = {
  position: [0, 0, 3.3] as const,
  baseW: 1.4,
  baseH: 0.034,
  baseD: 0.95,
  lidW: 1.4,
  lidH: 0.9,
  lidT: 0.014,
  screenW: 1.3,
  screenH: 0.8125, // 16:10
  screenCenterY: 0.46, // menteşeden ekran merkezine
  lidAngle: 105,
};

export const SCREEN_ASPECT = LAPTOP.screenW / LAPTOP.screenH;

// Scroll ilerlemesi p (0..1) üzerindeki faz sınırları (PRD §5).
export const PHASES = {
  A: 0,
  B: 0.12,
  C: 0.45,
  D: 0.6,
  E: 0.9,
} as const;

// Ekran önizlemesi p bu değeri geçince klonlanır (screenOn 0.30'da başlar).
export const CLONE_AT = 0.25;

export const SEED = 0x5e71c1;
