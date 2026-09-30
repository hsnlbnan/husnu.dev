"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hex, toHex, toRgb, type Hex } from "../lib/hex";

/* ---------- color math ---------- */

const WHITE = hex("#ffffff");

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function rgbToHex(r: number, g: number, b: number): Hex {
  const to = (v: number) =>
    Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}` as Hex;
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

const PRESETS: Hex[] = [
  "#ffffff", "#0a0a0a", "#f4f4f5", "#000000",
  "#34d399", "#10b981", "#60a5fa", "#3b82f6",
  "#f59e0b", "#f97316", "#f472b6", "#ec4899",
  "#a78bfa", "#8b5cf6", "#f87171", "#94a3b8",
].map((c) => hex(c));

/* ---------- component ---------- */

export default function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: Hex;
  onChange: (hex: Hex) => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [hexText, setHexText] = useState<string>(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);

  // Keep the local hex text in sync when the value changes from outside.
  useEffect(() => setHexText(value), [value]);

  const { r, g, b } = toRgb(value);
  const { h, s, v } = rgbToHsv(r, g, b);
  const hueColor = rgbToHex(...(Object.values(hsvToRgb(h, 1, 1)) as [number, number, number]));

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const commit = useCallback(
    (nh: number, ns: number, nv: number) => {
      const c = hsvToRgb((nh + 360) % 360, clamp(ns), clamp(nv));
      onChange(rgbToHex(c.r, c.g, c.b));
    },
    [onChange]
  );

  const handleSV = useCallback(
    (e: ReactPointerEvent) => {
      const el = svRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ns = clamp((e.clientX - rect.left) / rect.width);
      const nv = clamp(1 - (e.clientY - rect.top) / rect.height);
      commit(h, ns, nv);
    },
    [commit, h]
  );

  const startSV = (e: ReactPointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handleSV(e);
  };
  const moveSV = (e: ReactPointerEvent) => {
    if (e.buttons === 1) handleSV(e);
  };

  const onHue = (e: ReactPointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const nh = clamp((e.clientX - rect.left) / rect.width) * 360;
    commit(nh, s, v);
  };

  function applyHexText(text: string) {
    setHexText(text);
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text.trim())) {
      onChange(toHex(text, value));
    }
  }

  return (
    <div className="cp" ref={rootRef}>
      <button
        type="button"
        className="cp-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
      >
        <span className="cp-swatch" style={{ background: value }} />
        <span className="cp-hex mono">{value.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cp-pop"
            id={id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top left" }}
          >
            <div
              ref={svRef}
              className="cp-sv"
              onPointerDown={startSV}
              onPointerMove={moveSV}
              style={{ background: hueColor }}
            >
              <div className="cp-sv-white" />
              <div className="cp-sv-black" />
              <div
                className="cp-sv-knob"
                style={{
                  left: `${s * 100}%`,
                  top: `${(1 - v) * 100}%`,
                  background: value,
                }}
              />
            </div>

            <div className="cp-hue" onPointerDown={onHue} onPointerMove={(e) => e.buttons === 1 && onHue(e)}>
              <div className="cp-hue-knob" style={{ left: `${(h / 360) * 100}%` }} />
            </div>

            <div className="cp-hex-row">
              <span className="cp-swatch sm" style={{ background: value }} />
              <input
                className="cp-input mono"
                value={hexText}
                spellCheck={false}
                onChange={(e) => applyHexText(e.target.value)}
                maxLength={7}
              />
            </div>

            <div className="cp-presets">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="cp-preset"
                  style={{ background: p }}
                  data-active={p.toLowerCase() === value.toLowerCase()}
                  onClick={() => onChange(p)}
                  aria-label={p}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
