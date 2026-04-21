"use client";

import { motion, useReducedMotion, animate } from "framer-motion";
import { useEffect, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STACK_ITEMS = [
  {
    category: "Core Stack",
    skills: ["Next.js", "Svelte", "React", "TypeScript", "JavaScript"],
    color: "#dfff1f",
    icon: "⬡",
  },
  {
    category: "UI Layer",
    skills: ["Tailwind CSS", "Sass", "Design Systems", "Shadcn UI"],
    color: "#a8ff78",
    icon: "◈",
  },
  {
    category: "Motion",
    skills: ["Framer Motion", "GSAP", "CSS Animations", "Three.js"],
    color: "#78ffd6",
    icon: "◎",
  },
  {
    category: "State & API",
    skills: ["Redux", "Zustand", "GraphQL", "REST"],
    color: "#b8b8ff",
    icon: "◇",
  },

  {
    category: "Backend",
    skills: ["Node.js", "NestJS", "Elysia.js", "Bun", "PostgreSQL", "MongoDB"],
    color: "#ffb3c1",
    icon: "◈",
  },
  {
    category: "Testing",
    skills: ["Playwright", "Cypress", "Vitest", "Jest"],
    color: "#ff9f9f",
    icon: "◎",
    wide: true,
  },
  {
    category: "DevOps & Git",
    skills: ["Git", "GitHub", "GitLab", "Azure DevOps"],
    color: "#ffd6a5",
    icon: "◉",
  },
] as const;

const METRICS = [
  { value: 4, suffix: "+", label: "Years" },
  { value: 20, suffix: "+", label: "Shipped" },
  { value: 98, suffix: "", label: "Perf" },
];

// ─── Counter ──────────────────────────────────────────────────────────────────

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return controls.stop;
  }, [value, prefersReducedMotion]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// ─── Skill Pill ───────────────────────────────────────────────────────────────

function SkillPill({ skill }: { skill: string }) {
  return (
    <span
      className="inline-flex cursor-default items-center rounded-[4px] px-[10px] py-[3px] transition-all duration-150"
      style={{
        fontFamily: "ui-monospace,'SF Mono',monospace",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.03em",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.5)",
        background: "rgba(255,255,255,0.03)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.2)";
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.03)";
      }}
    >
      {skill}
    </span>
  );
}

// ─── Stack Group ──────────────────────────────────────────────────────────────

function StackGroup({
  category,
  skills,
  color,
  icon,
  wide,
  groupIndex,
}: {
  category: string;
  skills: readonly string[];
  color: string;
  icon: string;
  wide?: boolean;
  groupIndex: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`flex h-full flex-col ${wide ? "xl:col-span-2" : ""}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 0.4,
              delay: 0.15 + groupIndex * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      <div className="mb-[7px] flex items-center gap-[6px]">
        <span style={{ fontSize: 11, color, lineHeight: 1 }}>{icon}</span>
        <span
          style={{
            fontFamily: "ui-monospace,monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: color + "88",
          }}
        >
          {category}
        </span>
        <div
          style={{
            height: 1,
            flex: 1,
            background: `linear-gradient(to right, ${color}22, transparent)`,
          }}
        />
      </div>
      <div className="flex flex-wrap gap-[5px]">
        {skills.map((s) => (
          <SkillPill key={s} skill={s} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Scan Line ────────────────────────────────────────────────────────────────

function ScanLine() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(223,255,31,0.4), rgba(223,255,31,0.8), rgba(223,255,31,0.4), transparent)",
        animation: "scanDown 6s linear infinite",
        animationDelay: "1.5s",
        opacity: 0,
      }}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const Languages = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <style>{`
        @keyframes scanDown {
          0%   { top: -2%; opacity: 0; }
          5%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }
      `}</style>

      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
        className="relative h-full overflow-hidden rounded-xl px-5 py-6 md:px-7 md:py-7"
        style={{
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-16 w-16"
          style={{
            background:
              "radial-gradient(circle at 0 0, rgba(223,255,31,0.07), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-24 w-24"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, rgba(223,255,31,0.03), transparent 70%)",
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 bottom-0 select-none text-[7rem] font-light leading-none tracking-[-0.08em]"
          style={{ color: "rgba(255,255,255,0.022)" }}
        >
          DEV
        </span>

        <div className="relative flex h-full flex-col gap-[1.4rem]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                transition={
                  prefersReducedMotion ? undefined : { duration: 0.4 }
                }
                style={{
                  fontFamily: "ui-monospace,monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.28)",
                  margin: "0 0 6px",
                }}
              >
                Frontend Developer
              </motion.p>
              <motion.h3
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, y: 10 }
                }
                animate={
                  prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }
                }
                style={{
                  margin: 0,
                  fontSize: "clamp(1.6rem,2.8vw,2.6rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: "#fff",
                }}
              >
                I build interfaces
                <br />
                <span style={{ color: "#dfff1f" }}>people remember.</span>
              </motion.h3>
            </div>

            <div className="hidden shrink-0 items-start gap-5 pt-0.5 md:flex">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -8 }
                  }
                  animate={
                    prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 0.4, delay: 0.1 + i * 0.06 }
                  }
                  className="text-right"
                >
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 300,
                      letterSpacing: "-0.03em",
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    <Counter value={m.value} suffix={m.suffix} />
                  </p>
                  <p
                    style={{
                      fontFamily: "ui-monospace,monospace",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.25)",
                      margin: "2px 0 0",
                    }}
                  >
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
            animate={prefersReducedMotion ? undefined : { scaleX: 1 }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            className="h-px origin-left flex-shrink-0"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.07), rgba(255,255,255,0.03), transparent)",
            }}
          />

          <div className="grid min-h-0 flex-1 content-start gap-x-[1.2rem] gap-y-[0.9rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STACK_ITEMS.map((item, i) => (
              <StackGroup key={item.category} {...item} groupIndex={i} />
            ))}
          </div>

          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={
              prefersReducedMotion ? undefined : { duration: 0.4, delay: 0.6 }
            }
            className="flex-shrink-0 border-t pt-[0.85rem]"
            style={{
              borderColor: "rgba(255,255,255,0.05)",
              fontSize: 11,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.25)",
              margin: 0,
            }}
          >
            Also strong on performance, a11y, responsive systems &amp;
            maintainable architecture.
          </motion.p>
        </div>
      </motion.div>
    </>
  );
};

export default Languages;
