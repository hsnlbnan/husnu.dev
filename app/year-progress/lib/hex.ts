// Color value object. A `Hex` is a validated, lowercase `#rrggbb` string.
// This is the single source of truth for hex parsing, normalisation and alpha
// blending — logic that previously lived (byte-for-byte identical) in spec.ts,
// render.tsx, LockScreen.tsx and ColorPicker.tsx.

declare const HEX_BRAND: unique symbol;

/** A validated `#rrggbb` color. Construct via {@link hex} or {@link toHex}. */
export type Hex = string & { readonly [HEX_BRAND]: true };

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const SHORT = /^[0-9a-fA-F]{3}$/;
const FULL = /^[0-9a-fA-F]{6}$/;

// Returns a bare 6-digit lowercase body (no `#`), or null when invalid.
function normalize(raw: string): string | null {
  const body = raw.replace("#", "").trim();
  if (SHORT.test(body)) {
    return body
      .split("")
      .map((c) => c + c)
      .join("")
      .toLowerCase();
  }
  if (FULL.test(body)) return body.toLowerCase();
  return null;
}

/** Trusted constructor for color literals known at author time. Throws on garbage. */
export function hex(literal: string): Hex {
  const body = normalize(literal);
  if (!body) throw new Error(`Invalid hex color: ${literal}`);
  return `#${body}` as Hex;
}

/** Parse untrusted input (URL params, text fields) into a Hex, or fall back. */
export function toHex(input: string | undefined, fallback: Hex): Hex {
  if (!input) return fallback;
  const body = normalize(input);
  return body ? (`#${body}` as Hex) : fallback;
}

export function toRgb(color: Hex): Rgb {
  const body = color.slice(1);
  return {
    r: parseInt(body.slice(0, 2), 16),
    g: parseInt(body.slice(2, 4), 16),
    b: parseInt(body.slice(4, 6), 16),
  };
}

/** A semi-transparent CSS `rgba()` derived from this color. */
export function withAlpha(color: Hex, alpha: number): string {
  const { r, g, b } = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Perceived luminance in 0..1 (ITU-R BT.601 weights). */
export function luminance(color: Hex): number {
  const { r, g, b } = toRgb(color);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
