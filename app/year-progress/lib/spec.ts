// Turns raw params into a concrete visual spec shared by the PNG renderer and
// the live web preview, so what you configure is exactly what gets generated.

import { computeProgress, Mode, Unit, Lang } from "./progress";
import { hex, toHex, withAlpha, type Hex } from "./hex";

export type Style = "grid" | "bar" | "number";
export type Shape = "circle" | "square";

export interface WallpaperParams {
  mode: Mode;
  unit?: Unit;
  date?: string;
  start?: string;
  tz?: string;
  lang?: Lang;
  style?: Style;
  shape?: Shape;
  fg?: string; // filled / accent color  (#rrggbb)
  bg?: string; // background color       (#rrggbb)
  cols?: number;
  rows?: number;
  w?: number;
  h?: number;
  now?: Date;
}

export interface WallpaperSpec {
  style: Style;
  shape: Shape;
  cols: number;
  rows: number;
  total: number;
  filled: number;
  percent: number;
  fg: Hex;
  bg: Hex;
  dim: string; // faint version of fg for empty cells / track
  primary: string;
  unitLabel: string;
  secondary?: string;
  caption: string;
  w: number;
  h: number;
}

const DEFAULT_FG = hex("#ffffff");
const DEFAULT_BG = hex("#0a0a0a");

// Bound the output dimensions. Without this an attacker can request an
// arbitrarily large image (e.g. ?w=99999&h=99999) and exhaust server memory.
function clampDim(value: number | undefined, fallback: number, max: number): number {
  const v = value ?? fallback;
  if (!Number.isFinite(v)) return fallback;
  return Math.max(160, Math.min(max, Math.round(v)));
}

export function buildSpec(params: WallpaperParams): WallpaperSpec {
  const prog = computeProgress({
    mode: params.mode,
    unit: params.unit,
    date: params.date,
    start: params.start,
    tz: params.tz,
    lang: params.lang,
    now: params.now,
  });

  const cols = Math.max(1, Math.min(40, params.cols ?? 14));
  const rows = Math.max(1, Math.min(60, params.rows ?? 24));
  const total = cols * rows;
  const filled = Math.round(prog.percent * total);

  const fg = toHex(params.fg, DEFAULT_FG);
  const bg = toHex(params.bg, DEFAULT_BG);

  return {
    style: params.style ?? "grid",
    shape: params.shape ?? "circle",
    cols,
    rows,
    total,
    filled,
    percent: prog.percent,
    fg,
    bg,
    dim: withAlpha(fg, 0.16),
    primary: prog.primary,
    unitLabel: prog.unitLabel,
    secondary: prog.secondary,
    caption: prog.caption,
    w: clampDim(params.w, 1290, 2000),
    h: clampDim(params.h, 2796, 4000),
  };
}
