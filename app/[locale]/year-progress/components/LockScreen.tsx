"use client";

import type { Lang } from "../lib/progress";
import { luminance, type Hex } from "../lib/hex";
import { zonedClock } from "../lib/clock";

const DAYS: Record<Lang, string[]> = {
  // index by JS getDay(): 0 = Sunday
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
};
const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
};

function contrastColor(bg: Hex): string {
  return luminance(bg) > 0.6 ? "#0a0a0a" : "#ffffff";
}

export default function LockScreen({
  lang,
  now,
  bg,
  tz,
}: {
  lang: Lang;
  now: Date;
  bg: Hex;
  tz: string;
}) {
  const c = contrastColor(bg);
  const dim = c === "#ffffff" ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const soft = c === "#ffffff" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const chip = c === "#ffffff" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";
  const shadow =
    c === "#ffffff" ? "0 1px 12px rgba(0,0,0,0.35)" : "0 1px 12px rgba(255,255,255,0.25)";

  // Read the clock in the same timezone the wallpaper progress uses, so the two
  // never disagree (e.g. device in UTC+3 but tracking a UTC year).
  const { hour: hh, minute: mm, weekday, day, month } = zonedClock(now, tz);
  const time =
    lang === "tr"
      ? `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
      : `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")}`;
  const dateStr = `${DAYS[lang][weekday]}, ${day} ${MONTHS[lang][month - 1]}`;

  const overlay: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    color: c,
    pointerEvents: "none",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  };

  return (
    <div style={overlay}>
      {/* Status bar (right cluster — the left/time is replaced by the big clock) */}
      <div
        style={{
          position: "absolute",
          top: 17,
          right: 22,
          display: "flex",
          alignItems: "center",
          gap: 6,
          textShadow: shadow,
        }}
      >
        {/* cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}>
          <path d="M8 11.2l2.1-2.6a3 3 0 00-4.2 0L8 11.2z" />
          <path d="M3.4 6.1l1.4 1.7a5 5 0 016.4 0l1.4-1.7a7.3 7.3 0 00-9.2 0z" opacity="0.95" />
          <path d="M1 3.3l1.4 1.7a9.2 9.2 0 0111.2 0L15 3.3a11.5 11.5 0 00-14 0z" opacity="0.95" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13">
          <rect x="0.5" y="1" width="21" height="11" rx="3" fill="none" stroke={c} strokeOpacity="0.45" />
          <rect x="2" y="2.5" width="16" height="8" rx="1.6" fill={c} />
          <rect x="23" y="4.5" width="1.6" height="4" rx="0.8" fill={c} fillOpacity="0.5" />
        </svg>
      </div>

      {/* Lock icon */}
      <div style={{ position: "absolute", top: 52, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <svg width="15" height="18" viewBox="0 0 15 18" fill={c} style={{ filter: `drop-shadow(${shadow})` }}>
          <path d="M3 7V5a4.5 4.5 0 019 0v2h.5A1.5 1.5 0 0114 8.5v7A1.5 1.5 0 0112.5 17h-10A1.5 1.5 0 011 15.5v-7A1.5 1.5 0 012.5 7H3zm1.8 0h5.4V5a2.7 2.7 0 00-5.4 0v2z" />
        </svg>
      </div>

      {/* Focus pill */}
      <div style={{ position: "absolute", top: 78, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: chip,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: dim,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill={dim}>
            <path d="M5.5 0a5.5 5.5 0 100 11 4.6 4.6 0 01-1.7-8.9A5.5 5.5 0 005.5 0z" />
          </svg>
          {lang === "tr" ? "Uyku" : "Sleep"}
        </div>
      </div>

      {/* Date */}
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 600,
          color: dim,
          textShadow: shadow,
        }}
      >
        {dateStr}
      </div>

      {/* Big clock */}
      <div
        style={{
          position: "absolute",
          top: 122,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: -1,
          lineHeight: 1.1,
          textShadow: shadow,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time}
      </div>

      {/* Bottom buttons */}
      {[{ side: "left", icon: "flash" }, { side: "right", icon: "cam" }].map((b) => (
        <div
          key={b.side}
          style={{
            position: "absolute",
            bottom: 50,
            [b.side]: 26,
            width: 42,
            height: 42,
            borderRadius: 21,
            background: chip,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          } as React.CSSProperties}
        >
          {b.icon === "flash" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill={dim}>
              <path d="M9 1L4 9h3l-1 6 6-9H9l1-5z" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 17 17" fill={dim}>
              <path d="M5.5 2l-1 1.5H2A1.5 1.5 0 00.5 5v8A1.5 1.5 0 002 14.5h13A1.5 1.5 0 0016.5 13V5A1.5 1.5 0 0015 3.5h-2.5L11.5 2h-6zm3 3.2A3.3 3.3 0 115.2 8.5 3.3 3.3 0 018.5 5.2z" />
            </svg>
          )}
        </div>
      ))}

      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 9,
          left: "50%",
          transform: "translateX(-50%)",
          width: 108,
          height: 5,
          borderRadius: 3,
          background: c,
          opacity: 0.85,
        }}
      />
    </div>
  );
}
