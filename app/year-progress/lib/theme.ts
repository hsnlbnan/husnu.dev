import { hex, mix, contrast, withAlpha, type Hex } from "./hex";
import type { CSSProperties } from "react";

export interface ThemePreset {
  readonly fg: Hex;
  readonly bg: Hex;
}

// Derive the whole control-panel palette from the user's chosen filled (fg /
// accent) and background (bg) colors, so the page reskins itself to match the
// wallpaper. Returned as CSS custom properties to set inline on `.yp-scope`.
export function pageTheme(fg: Hex, bg: Hex): CSSProperties {
  const text = contrast(bg); // readable foreground for the surface
  return {
    "--bg": bg,
    "--panel": mix(bg, text, 0.05),
    "--panel-2": mix(bg, text, 0.09),
    "--line": withAlpha(text, 0.08),
    "--line-strong": withAlpha(text, 0.16),
    "--text": text,
    "--muted": withAlpha(text, 0.5),
    "--muted-2": withAlpha(text, 0.35),
    "--accent": fg,
    "--on-accent": contrast(fg), // text/icon color on top of an accent fill
    "--ind": withAlpha(text, 0.1), // segmented active-pill fill
  } as CSSProperties;
}

export const THEMES: readonly ThemePreset[] = [
  { fg: hex("#ffffff"), bg: hex("#0a0a0a") },
  { fg: hex("#0a0a0a"), bg: hex("#f4f4f5") },
  { fg: hex("#34d399"), bg: hex("#0b1410") },
  { fg: hex("#f59e0b"), bg: hex("#161009") },
  { fg: hex("#60a5fa"), bg: hex("#0a0f1a") },
  { fg: hex("#f472b6"), bg: hex("#170a12") },
];
