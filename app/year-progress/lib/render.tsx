// Single source of truth for the visual. Returns plain inline-styled JSX that is
// valid both for Satori (the PNG route) and the DOM (the live preview), so the
// preview is pixel-faithful to the generated wallpaper.

import type { CSSProperties } from "react";
import { WallpaperSpec } from "./spec";
import { withAlpha } from "./hex";

const flex = (extra: CSSProperties = {}): CSSProperties => ({
  display: "flex",
  ...extra,
});

export function renderWallpaper(spec: WallpaperSpec) {
  const { w, h, fg, bg, dim } = spec;

  const root: CSSProperties = {
    width: w,
    height: h,
    backgroundColor: bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // Reserve the top third for the lock-screen clock/date so content sits below it.
    paddingTop: Math.round(h * 0.2),
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  };

  const caption = (
    <div
      style={flex({
        marginTop: h * 0.035,
        color: withAlpha(fg,0.5),
        fontSize: Math.round(w * 0.032),
        letterSpacing: 1,
      })}
    >
      {spec.caption}
    </div>
  );

  if (spec.style === "number") {
    const big = Math.round(w * (spec.primary.length > 3 ? 0.2 : 0.26));
    return (
      <div style={root}>
        <div style={flex({ alignItems: "flex-end" })}>
          <div
            style={flex({
              color: fg,
              fontSize: big,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2,
              fontVariantNumeric: "tabular-nums",
            })}
          >
            {spec.primary}
          </div>
          <div
            style={flex({
              color: withAlpha(fg,0.6),
              fontSize: Math.round(w * 0.055),
              fontWeight: 600,
              marginLeft: w * 0.018,
              marginBottom: w * 0.028,
            })}
          >
            {spec.unitLabel}
          </div>
        </div>
        {spec.secondary && (
          <div
            style={flex({
              marginTop: h * 0.018,
              color: withAlpha(fg,0.78),
              fontSize: Math.round(w * 0.044),
              fontWeight: 500,
              letterSpacing: 0.5,
            })}
          >
            {spec.secondary}
          </div>
        )}
        {caption}
      </div>
    );
  }

  if (spec.style === "bar") {
    const trackW = Math.round(w * 0.66);
    const trackH = Math.round(w * 0.03);
    const fillW = Math.round(trackW * spec.percent);
    const tickW = Math.max(2, Math.round(w * 0.006));
    const tickColor = withAlpha(bg, 0.55);
    const scaleStyle: CSSProperties = {
      color: withAlpha(fg, 0.38),
      fontSize: Math.round(w * 0.027),
      fontWeight: 500,
      letterSpacing: 1,
    };

    return (
      <div style={root}>
        {/* Value + unit, optically baseline-aligned. */}
        <div style={flex({ alignItems: "flex-end" })}>
          <div
            style={flex({
              color: fg,
              fontSize: Math.round(w * (spec.primary.length > 3 ? 0.14 : 0.17)),
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: -2,
              fontVariantNumeric: "tabular-nums",
            })}
          >
            {spec.primary}
          </div>
          <div
            style={flex({
              color: withAlpha(fg, 0.55),
              fontSize: Math.round(w * 0.052),
              fontWeight: 500,
              marginLeft: w * 0.02,
              marginBottom: w * 0.022,
            })}
          >
            {spec.unitLabel}
          </div>
        </div>

        {spec.secondary && (
          <div
            style={flex({
              marginTop: h * 0.014,
              color: withAlpha(fg, 0.7),
              fontSize: Math.round(w * 0.04),
              fontWeight: 500,
              letterSpacing: 0.4,
            })}
          >
            {spec.secondary}
          </div>
        )}

        {/* Gauge: faint track, crisp fill, quartile notches. */}
        <div
          style={flex({
            position: "relative",
            width: trackW,
            height: trackH,
            marginTop: h * 0.045,
            backgroundColor: withAlpha(fg, 0.14),
            borderRadius: trackH,
          })}
        >
          <div
            style={{
              width: fillW,
              height: trackH,
              backgroundColor: fg,
              borderRadius: trackH,
            }}
          />
          {[0.25, 0.5, 0.75].map((p) => (
            <div
              key={p}
              style={{
                position: "absolute",
                top: 0,
                left: Math.round(trackW * p),
                width: tickW,
                height: trackH,
                backgroundColor: tickColor,
                borderRadius: tickW,
              }}
            />
          ))}
        </div>

        {/* Scale ends — communicates a 0–100% gauge without shouting. */}
        <div
          style={flex({
            width: trackW,
            marginTop: h * 0.013,
            justifyContent: "space-between",
          })}
        >
          <div style={flex(scaleStyle)}>0</div>
          <div style={flex(scaleStyle)}>100</div>
        </div>

        {caption}
      </div>
    );
  }

  // grid (default)
  const gridW = Math.round(w * 0.62);
  const cell = gridW / spec.cols;
  const dot = Math.round(cell * 0.56);
  const m = (cell - dot) / 2;
  const radius = spec.shape === "circle" ? dot / 2 : Math.round(dot * 0.22);

  const dots = [];
  for (let i = 0; i < spec.total; i++) {
    dots.push(
      <div
        key={i}
        style={{
          width: dot,
          height: dot,
          margin: m,
          borderRadius: radius,
          backgroundColor: i < spec.filled ? fg : dim,
        }}
      />
    );
  }

  return (
    <div style={root}>
      <div
        style={flex({
          width: gridW + m * 2,
          flexWrap: "wrap",
          alignContent: "flex-start",
        })}
      >
        {dots}
      </div>
      {caption}
    </div>
  );
}
