// Turns raw params into a concrete visual spec shared by the PNG renderer and
// the live web preview, so what you configure is exactly what gets generated.

import {
  computeProgress,
  computeYearGrid,
  computeLife,
  Mode,
  Unit,
  Lang,
  type YearGrid,
  type LifeGrid,
} from "./progress";
import { hex, toHex, withAlpha, type Hex } from "./hex";

export type Style = "grid" | "bar" | "number" | "months" | "life";
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
  birth?: string; // birth date for the "life" style (#yyyy-mm-dd)
  lifespan?: number; // life expectancy in years for the "life" style
  headline?: string; // custom header text for the "months" style
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
  headline?: string; // custom header for the "months" style
  yearGrid?: YearGrid; // present for style === "months"
  life?: LifeGrid; // present for style === "life"
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

  const style: Style = params.style ?? "grid";
  const lang: Lang = params.lang === "tr" ? "tr" : "en";
  const now = params.now ?? new Date();
  const tz = params.tz ?? "UTC";

  // The calendar and life layouts carry their own per-cell truth and caption;
  // everything else is driven by the single computeProgress percent above.
  let percent = prog.percent;
  let primary = prog.primary;
  let unitLabel = prog.unitLabel;
  let secondary = prog.secondary;
  let caption = prog.caption;
  let yearGrid: YearGrid | undefined;
  let life: LifeGrid | undefined;

  if (style === "months") {
    yearGrid = computeYearGrid(tz, now);
    percent = yearGrid.percent;
    const pct = Math.round(percent * 100);
    const left = yearGrid.totalDays - yearGrid.elapsedDays;
    primary = String(yearGrid.year);
    unitLabel = "";
    secondary = undefined;
    caption = lang === "tr" ? `${left} gün kaldı · %${pct}` : `${left}d left · ${pct}%`;
  } else if (style === "life") {
    life = computeLife(params.birth ?? "1995-06-15", params.lifespan ?? 90, tz, now);
    percent = life.percent;
    const pct = Math.round(percent * 100);
    primary = `${life.livedWeeks}`;
    unitLabel = lang === "tr" ? "hafta" : "weeks";
    secondary =
      lang === "tr"
        ? `${life.ageYears} yaşında · ${life.rows} yıllık ömür`
        : `age ${life.ageYears} · ${life.rows}-year life`;
    caption =
      lang === "tr"
        ? `${life.livedWeeks} / ${life.totalWeeks} hafta · %${pct}`
        : `${life.livedWeeks} / ${life.totalWeeks} weeks · ${pct}%`;
  }

  return {
    style,
    shape: params.shape ?? "circle",
    cols,
    rows,
    total,
    filled,
    percent,
    fg,
    bg,
    dim: withAlpha(fg, 0.16),
    primary,
    unitLabel,
    secondary,
    caption,
    headline: params.headline?.trim() || undefined,
    yearGrid,
    life,
    w: clampDim(params.w, 1290, 2000),
    h: clampDim(params.h, 2796, 4000),
  };
}
