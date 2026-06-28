// The user's wallpaper configuration as a single, immutable domain object.
// Keeping it here (framework-free) lets the reducer, the URL builder and the
// spec builder all share one shape without depending on React.

import { hex, type Hex } from "./hex";
import type { Lang, Mode, Unit } from "./progress";
import type { Shape, Style, WallpaperParams } from "./spec";

export interface WallpaperConfig {
  readonly lang: Lang;
  readonly mode: Mode;
  readonly unit: Unit;
  readonly style: Style;
  readonly shape: Shape;
  readonly fg: Hex;
  readonly bg: Hex;
  readonly cols: number;
  readonly rows: number;
  readonly sinceDate: string;
  readonly untilDate: string;
  readonly birthDate: string;
  readonly showLock: boolean;
}

export interface Viewport {
  readonly w: number;
  readonly h: number;
}

export function createInitialConfig(): WallpaperConfig {
  return {
    lang: "tr",
    mode: "period",
    unit: "year",
    style: "grid",
    shape: "circle",
    fg: hex("#ffffff"),
    bg: hex("#0a0a0a"),
    cols: 14,
    rows: 24,
    sinceDate: "2024-01-01",
    untilDate: `${new Date().getFullYear() + 1}-01-01`,
    birthDate: "1995-06-15",
    showLock: true,
  };
}

/** The date that drives the current mode, or undefined for the periodic modes. */
export function activeDateFor(config: WallpaperConfig): string | undefined {
  switch (config.mode) {
    case "since":
      return config.sinceDate;
    case "until":
      return config.untilDate;
    case "age":
      return config.birthDate;
    default:
      return undefined;
  }
}

/** Bridge the UI config to the renderer's params (used by the live preview). */
export function toWallpaperParams(
  config: WallpaperConfig,
  runtime: Viewport & { readonly tz: string; readonly now: Date }
): WallpaperParams {
  return {
    mode: config.mode,
    unit: config.unit,
    date: activeDateFor(config),
    tz: runtime.tz,
    lang: config.lang,
    style: config.style,
    shape: config.shape,
    fg: config.fg,
    bg: config.bg,
    cols: config.cols,
    rows: config.rows,
    w: runtime.w,
    h: runtime.h,
    now: runtime.now,
  };
}
