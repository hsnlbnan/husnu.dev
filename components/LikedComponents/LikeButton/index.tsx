"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Feather "heart" outline, 24×24 viewBox — clean and instantly readable.
const HEART =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

const LIKE = "#f43f5e";
const EASE = [0.22, 1, 0.36, 1] as const;
const LAUNCH = [0.16, 1, 0.3, 1] as const; // strong ease-out: quick launch, soft settle

/* ---------- heart burst ---------- */
// A fan of little hearts. On like they spray upward, fan out, arc, rotate and
// fade — varied per heart so it reads organic, not like a row of clones. On
// unlike a smaller, calmer fan drains downward (a reversal should feel softer).

interface Spark {
  dx: number;
  dy: number;
  size: number;
  rot: number;
  delay: number;
}

function makeSparks(up: boolean): Spark[] {
  const n = up ? 7 : 4;
  const centerDeg = up ? -90 : 90; // screen coords: up is negative
  const spreadDeg = up ? 62 : 42;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1); // 0..1 across the fan
    // even fan + a touch of deterministic jitter so it isn't mechanical
    const deg = centerDeg - spreadDeg + t * spreadDeg * 2 + (((i * 37) % 13) - 6);
    const a = (deg * Math.PI) / 180;
    const dist = (up ? 34 : 22) + ((i * 53) % (up ? 18 : 9));
    return {
      dx: Math.cos(a) * dist,
      dy: Math.sin(a) * dist,
      size: 9 + ((i * 71) % 5), // 9–13px
      rot: ((i * 89) % 36) - 18, // −18..18°
      delay: Math.abs(t - 0.5) * 0.05, // centre hearts lead
    };
  });
}

/* ---------- per-digit odometer ---------- */
// Only the digits that change roll; the rest stay put (true tabular feel).

function RollingDigit({ digit, reduce }: { digit: number; reduce: boolean | null }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: "1em" }}>
      <span className="invisible">0</span>
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `-${digit}em` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 30 }}
      >
        {Array.from({ length: 10 }).map((_, d) => (
          <span key={d} className="block text-center" style={{ height: "1em", lineHeight: 1 }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function RollingNumber({ value, reduce }: { value: number; reduce: boolean | null }) {
  const str = String(value);
  return (
    <span className="inline-flex tabular-nums" style={{ lineHeight: 1 }}>
      {str.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <RollingDigit key={`d${str.length - i}`} digit={Number(ch)} reduce={reduce} />
        ) : (
          <span key={`s${i}`}>{ch}</span>
        )
      )}
    </span>
  );
}

/* ---------- liquid-fill heart ---------- */
// Liquid rises inside the heart on like, drains on unlike; the surface drifts
// for a watery feel (only while filled, never on reduced motion).

function LiquidHeart({ liked, reduce }: { liked: boolean; reduce: boolean | null }) {
  const clip = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 overflow-visible">
      <defs>
        <clipPath id={clip}>
          <path d={HEART} />
        </clipPath>
      </defs>

      <path d={HEART} fill="rgba(255,255,255,0.06)" />

      <g clipPath={`url(#${clip})`}>
        {/* Liquid block with a static wavy surface. It rises on like and drains on
            unlike; the spring overshoot gives a gentle one-off slosh — no perpetual
            animation (that read as a freeze and burned a repaint every frame). */}
        <motion.g
          initial={false}
          animate={{ y: liked ? 0 : 24 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 20 }}
        >
          <path d="M 0 3 Q 6 1 12 3 T 24 3 L 24 28 L 0 28 Z" fill={LIKE} />
        </motion.g>
      </g>

      <motion.path
        d={HEART}
        fill="none"
        animate={{ stroke: liked ? LIKE : "rgba(255,255,255,0.55)" }}
        transition={{ duration: 0.2 }}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- button ---------- */

export default function LikeButton() {
  const reduce = useReducedMotion();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [bursts, setBursts] = useState<{ id: number; up: boolean; sparks: Spark[] }[]>([]);
  const burstId = useRef(0);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    if (!reduce) {
      const id = ++burstId.current;
      // Keep only the most recent burst alongside the new one, so spam-clicking
      // can't pile up dozens of animating nodes.
      setBursts((b) => [...b.slice(-1), { id, up: next, sparks: makeSparks(next) }]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1000);
    }
  };

  return (
    <div className="flex items-center justify-center select-none">
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.96 }}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className="relative flex items-center gap-2.5 rounded-full bg-white/5 px-5 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
      >
        <span className="relative inline-flex h-6 w-6 items-center justify-center">
          {/* heart burst */}
          {bursts.map((burst) => (
            <span key={burst.id} className="pointer-events-none absolute inset-0" aria-hidden="true">
              {burst.sparks.map((s, i) => (
                <motion.svg
                  key={i}
                  viewBox="0 0 24 24"
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: s.size,
                    height: s.size,
                    marginLeft: -s.size / 2,
                    marginTop: -s.size / 2,
                  }}
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0 }}
                  animate={{
                    x: [0, s.dx * 0.7, s.dx],
                    y: [0, s.dy * 0.7, s.dy + (burst.up ? 7 : 0)], // slight gravity droop on launch
                    scale: [0.2, 1, 0.82],
                    opacity: [0, 1, 1, 0],
                    rotate: s.rot,
                  }}
                  transition={{ duration: burst.up ? 0.85 : 0.7, ease: LAUNCH, delay: s.delay }}
                >
                  <path d={HEART} fill={LIKE} />
                </motion.svg>
              ))}
            </span>
          ))}

          {/* the heart itself, with a spring pop on like */}
          <motion.span
            className="inline-flex h-6 w-6"
            animate={reduce ? undefined : { scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.4, ease: EASE, times: [0, 0.4, 1] }}
          >
            <LiquidHeart liked={liked} reduce={reduce} />
          </motion.span>
        </span>

        {/* per-digit rolling count */}
        <span className="text-sm font-medium text-white">
          <RollingNumber value={count} reduce={reduce} />
        </span>
      </motion.button>
    </div>
  );
}
