"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const rotatingWords = ["clear", "fast", "human"] as const;

const notes = [
  {
    title: "For users",
    detail: "Clear next steps, calm feedback, and fewer moments of hesitation.",
  },
  {
    title: "For teams",
    detail: "Reusable patterns, safer iteration, and less visual noise to manage.",
  },
] as const;

export default function CurrentFocusBento() {
  const prefersReducedMotion = useReducedMotion();
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveWord((current) => (current + 1) % rotatingWords.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.45 }}
      className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-xl bg-[#1D1D1D] px-5 py-5 md:px-8 md:py-8"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(223,255,31,0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(223,255,31,0.07), transparent 26%)",
        }}
      />

      <div
        className="pointer-events-none absolute -right-3 bottom-0 hidden select-none md:block"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`bg-${rotatingWords[activeWord]}`}
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 0.35, ease: "easeOut" }
            }
            className="block text-[8rem] font-light leading-none tracking-[-0.08em] text-white/[0.04]"
          >
            {rotatingWords[activeWord].toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dfff1f]/20 bg-[#dfff1f]/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#dfff1f]">
            <span className="h-2 w-2 rounded-full bg-[#dfff1f]" />
            What I optimize for
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mt-8 max-w-[40rem]">
          <h4 className="font-light text-3xl leading-tight text-white md:text-[3rem] md:leading-[1.02]">
            People remember
            <br />
            how an interface
            <br />
            made them feel:
            <span className="mt-2 flex min-h-[1.2em] items-center text-[#dfff1f]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[activeWord]}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 0.25, ease: "easeOut" }
                  }
                  className="inline-block"
                >
                  {rotatingWords[activeWord]}.
                </motion.span>
              </AnimatePresence>
            </span>
          </h4>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 md:text-[15px]">
            Most users are not looking for novelty. They want to understand
            what happens next, move with confidence, and never feel lost.
          </p>
        </div>

        <div className="mt-auto grid gap-4 pt-8 md:grid-cols-2">
          {notes.map((note, index) => (
            <motion.div
              key={note.title}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 0.35, delay: 0.08 * (index + 1) }
              }
              className="border-white/10 border-t pt-4"
            >
              <h5 className="text-xs font-medium uppercase tracking-[0.24em] text-[#dfff1f]">
                {note.title}
              </h5>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {note.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
          <span className="rounded-full border border-white/10 px-3 py-1">
            clarity
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            calm motion
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            better systems
          </span>
        </div>
      </div>
    </motion.div>
  );
}
