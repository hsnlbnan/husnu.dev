// Motion-variant factories. Centralising them keeps the view declarative and
// makes "respect reduced motion" a single, testable decision rather than a
// conditional sprinkled through the JSX.

import type { MotionProps } from "framer-motion";

const EASE: number[] = [0.23, 1, 0.32, 1];

// Exactly the subset of motion props these factories produce, so the returned
// object spreads cleanly onto any `motion.*` element.
export type Motion = Pick<MotionProps, "initial" | "animate" | "exit" | "transition">;

export function enterMotion(reduce: boolean): Motion {
  if (reduce) return { initial: { opacity: 1 }, animate: { opacity: 1 } };
  return {
    initial: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  };
}

export function staggerMotion(reduce: boolean, index: number): Motion {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, delay: 0.06 * index, ease: EASE },
  };
}

export function collapseMotion(reduce: boolean): Motion {
  if (reduce) return {};
  return {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.22, ease: EASE },
  };
}
