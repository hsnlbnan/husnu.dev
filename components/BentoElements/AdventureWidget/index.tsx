"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type LineKind = "command" | "trigger" | "meta" | "step" | "ok" | "deploy";

type PipelineLine = {
  t: number;
  text: string;
  kind: LineKind;
  bold?: boolean;
};

type PipelineRun = {
  id: string;
  tabTitle: string;
  branch: string;
  pipeline: string;
  target: string;
  ago: string;
  ghostWord: string;
  lines: PipelineLine[];
};

type VisibleLine = PipelineLine & { id: string };

const PIPELINE_RUNS: PipelineRun[] = [
  {
    id: "motion",
    tabTitle: "feat/motion-sys  ·  husnu.dev",
    branch: "feat/motion-sys",
    pipeline: "48",
    target: "husnu.dev",
    ago: "2 hours ago",
    ghostWord: "DEV",
    lines: [
      { t: 0, text: "$ git push origin feat/motion-sys", kind: "command" },
      { t: 520, text: "▶ Pipeline #48 triggered", kind: "trigger", bold: true },
      { t: 900, text: "  ↳ branch: feat/motion-sys", kind: "meta" },
      {
        t: 1280,
        text: "  ↳ feat(animation): gsap + terminal orchestration",
        kind: "meta",
      },
      { t: 1750, text: "● typecheck", kind: "step" },
      { t: 2420, text: "  ✓ typecheck     1.8s", kind: "ok" },
      { t: 2700, text: "● eslint", kind: "step" },
      { t: 3340, text: "  ✓ eslint        2.3s   0 warnings", kind: "ok" },
      { t: 3620, text: "● unit tests", kind: "step" },
      { t: 4740, text: "  ✓ unit tests    6.1s   coverage: 91%", kind: "ok" },
      { t: 5060, text: "● e2e  (Playwright)", kind: "step" },
      { t: 6740, text: "  ✓ e2e           14s    18 scenarios passed", kind: "ok" },
      { t: 7050, text: "● build", kind: "step" },
      { t: 8220, text: "  ✓ build         11.4s  142kb gzipped", kind: "ok" },
      {
        t: 8640,
        text: "  ✓ All checks passed · deploying to staging...",
        kind: "ok",
        bold: true,
      },
      {
        t: 9480,
        text: "  ✓ Deployed  →  husnu-staging.vercel.app",
        kind: "deploy",
        bold: true,
      },
    ],
  },
  {
    id: "accessibility",
    tabTitle: "fix/a11y-audit  ·  husnu.dev",
    branch: "fix/a11y-audit",
    pipeline: "49",
    target: "husnu.dev",
    ago: "54 minutes ago",
    ghostWord: "SHIP",
    lines: [
      { t: 0, text: "$ git push origin fix/a11y-audit", kind: "command" },
      { t: 520, text: "▶ Pipeline #49 triggered", kind: "trigger", bold: true },
      { t: 900, text: "  ↳ branch: fix/a11y-audit", kind: "meta" },
      {
        t: 1260,
        text: "  ↳ fix(a11y): reduce motion edge cases + labels",
        kind: "meta",
      },
      { t: 1710, text: "● typecheck", kind: "step" },
      { t: 2340, text: "  ✓ typecheck     2.0s", kind: "ok" },
      { t: 2580, text: "● eslint", kind: "step" },
      { t: 3200, text: "  ✓ eslint        2.1s   0 warnings", kind: "ok" },
      { t: 3460, text: "● unit tests", kind: "step" },
      { t: 4620, text: "  ✓ unit tests    5.9s   coverage: 92%", kind: "ok" },
      { t: 4890, text: "● visual review", kind: "step" },
      { t: 5980, text: "  ✓ visual review 3.4s   5 breakpoints checked", kind: "ok" },
      { t: 6280, text: "● build", kind: "step" },
      { t: 7440, text: "  ✓ build         10.8s  139kb gzipped", kind: "ok" },
      {
        t: 7860,
        text: "  ✓ All checks passed · deploying to production...",
        kind: "ok",
        bold: true,
      },
      {
        t: 8740,
        text: "  ✓ Deployed  →  husnu.dev",
        kind: "deploy",
        bold: true,
      },
    ],
  },
  {
    id: "systems",
    tabTitle: "feat/ui-systems  ·  husnu.dev",
    branch: "feat/ui-systems",
    pipeline: "50",
    target: "husnu.dev",
    ago: "11 minutes ago",
    ghostWord: "BUILD",
    lines: [
      { t: 0, text: "$ git push origin feat/ui-systems", kind: "command" },
      { t: 520, text: "▶ Pipeline #50 triggered", kind: "trigger", bold: true },
      { t: 900, text: "  ↳ branch: feat/ui-systems", kind: "meta" },
      {
        t: 1260,
        text: "  ↳ feat(ui): refine homepage capability blocks",
        kind: "meta",
      },
      { t: 1710, text: "● typecheck", kind: "step" },
      { t: 2380, text: "  ✓ typecheck     1.9s", kind: "ok" },
      { t: 2630, text: "● eslint", kind: "step" },
      { t: 3260, text: "  ✓ eslint        2.0s   0 warnings", kind: "ok" },
      { t: 3520, text: "● bundle analysis", kind: "step" },
      { t: 4540, text: "  ✓ bundle        141kb  main route stable", kind: "ok" },
      { t: 4820, text: "● lighthouse snapshot", kind: "step" },
      { t: 6140, text: "  ✓ perf          98     accessibility 100", kind: "ok" },
      { t: 6450, text: "● build", kind: "step" },
      { t: 7570, text: "  ✓ build         11.1s  static routes cached", kind: "ok" },
      {
        t: 8010,
        text: "  ✓ All checks passed · deploying preview...",
        kind: "ok",
        bold: true,
      },
      {
        t: 8860,
        text: "  ✓ Deployed  →  husnu-preview.vercel.app",
        kind: "deploy",
        bold: true,
      },
    ],
  },
];

const STATUS_STYLES = {
  RUNNING: {
    label: "RUNNING",
    background: "rgba(254,188,46,0.14)",
    color: "#febc2e",
    borderColor: "rgba(254,188,46,0.24)",
  },
  PASSED: {
    label: "PASSED",
    background: "rgba(40,200,64,0.15)",
    color: "#28c840",
    borderColor: "rgba(40,200,64,0.25)",
  },
} as const;

function lineColor(kind: LineKind) {
  switch (kind) {
    case "command":
      return "rgba(255,255,255,0.35)";
    case "trigger":
      return "#dfff1f";
    case "meta":
      return "rgba(255,255,255,0.28)";
    case "step":
      return "#f0bf57";
    case "ok":
      return "#28c840";
    case "deploy":
      return "#88f0ca";
    default:
      return "rgba(255,255,255,0.6)";
  }
}

const MAX_VISIBLE_LINES = 13;

export default function AdventureWidget() {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tabTitleRef = useRef<HTMLSpanElement>(null);
  const branchRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [runIndex, setRunIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<VisibleLine[]>([]);
  const [status, setStatus] = useState<keyof typeof STATUS_STYLES>("RUNNING");

  const currentRun = PIPELINE_RUNS[runIndex];
  const previousRun =
    PIPELINE_RUNS[(runIndex + PIPELINE_RUNS.length - 1) % PIPELINE_RUNS.length];

  const clearTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    clearTimers();
    setDisplayedLines([]);
    setStatus("RUNNING");

    currentRun.lines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [
            ...prev,
            {
              ...line,
              id: `${currentRun.id}-${index}`,
            },
          ];
          return next.slice(-MAX_VISIBLE_LINES);
        });
      }, line.t);

      timersRef.current.push(timer);
    });

    const lastLineAt = currentRun.lines[currentRun.lines.length - 1]?.t ?? 0;

    timersRef.current.push(
      setTimeout(() => {
        setStatus("PASSED");
      }, lastLineAt - 140)
    );

    timersRef.current.push(
      setTimeout(() => {
        setRunIndex((prev) => (prev + 1) % PIPELINE_RUNS.length);
      }, lastLineAt + 3200)
    );

    return () => {
      clearTimers();
    };
  }, [currentRun]);

  useGSAP(
    () => {
      gsap.from("[data-shell-chrome]", {
        y: -10,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      });

      gsap.from("[data-shell-body]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        delay: 0.16,
        ease: "power2.out",
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!rootRef.current) {
        return;
      }

      const freshLines = gsap
        .utils.toArray<HTMLElement>("[data-term-line]", rootRef.current)
        .filter((node) => node.dataset.animated !== "true");

      freshLines.forEach((node) => {
        node.dataset.animated = "true";
        gsap.fromTo(
          node,
          { autoAlpha: 0, x: -8, y: 3 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
          }
        );
      });
    },
    { scope: rootRef, dependencies: [displayedLines.length], revertOnUpdate: false }
  );

  useGSAP(
    () => {
      if (!badgeRef.current || !tabTitleRef.current || !branchRef.current) {
        return;
      }

      const badgeTween = gsap.fromTo(
        badgeRef.current,
        { autoAlpha: 0.72, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        [tabTitleRef.current, branchRef.current],
        { autoAlpha: 0.45, y: 5 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.04,
          ease: "power2.out",
        }
      );

      let pulseTween: gsap.core.Tween | undefined;
      if (status === "RUNNING") {
        pulseTween = gsap.to(badgeRef.current, {
          opacity: 0.62,
          duration: 0.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      return () => {
        badgeTween.kill();
        pulseTween?.kill();
      };
    },
    { scope: rootRef, dependencies: [runIndex, status] }
  );

  const statusStyle = STATUS_STYLES[status];

  return (
    <div
      ref={rootRef}
      className="relative flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:min-h-0"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(255,255,255,0.04), transparent 26%), radial-gradient(circle at bottom right, rgba(223,255,31,0.05), transparent 22%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-1 right-3 hidden select-none text-[6rem] font-light leading-none tracking-[-0.08em] text-white/[0.04] md:block"
        aria-hidden="true"
      >
        {currentRun.ghostWord}
      </div>

      <div
        data-shell-chrome
        className="relative flex h-10 flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#161616] px-4"
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_1px_rgba(0,0,0,0.28)]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[0_0_0_1px_rgba(0,0,0,0.28)]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_0_1px_rgba(0,0,0,0.28)]" />
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#4caf50" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="rgba(255,255,255,0.28)" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="rgba(255,255,255,0.28)" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="rgba(255,255,255,0.28)" />
          </svg>
          <span
            ref={tabTitleRef}
            className="text-[10px] tracking-[0.02em] text-white/60"
          >
            {currentRun.tabTitle}
          </span>
        </div>

        <div
          ref={badgeRef}
          className="rounded-[4px] border px-2 py-[2px] text-[9px] font-semibold tracking-[0.08em]"
          style={{
            background: statusStyle.background,
            color: statusStyle.color,
            borderColor: statusStyle.borderColor,
          }}
        >
          ● {statusStyle.label}
        </div>
      </div>

      <div
        data-shell-chrome
        className="flex flex-shrink-0 items-center gap-2 border-b border-white/5 bg-[#111] px-4 py-[7px]"
      >
        <span className="text-[10px] text-white/20">~/</span>
        <span className="text-[10px] text-white/35">projects</span>
        <span className="text-[10px] text-white/20">/</span>
        <span className="text-[10px] text-[#dfff1f]/80">husnu.dev</span>

        <span
          ref={branchRef}
          className="ml-auto flex items-center gap-1 text-[9px] text-white/30"
        >
          <span className="text-[#4caf50]">⎇</span>
          <span>{currentRun.branch}</span>
        </span>
      </div>

      <div
        data-shell-body
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0c0c0c] px-4 pb-3 pt-3 text-[10px] leading-[1.55]"
      >
        <div className="mb-3 flex-shrink-0 border-b border-white/5 pb-3">
          <div className="text-white/20">
            Last session · Pipeline #{previousRun.pipeline} · {previousRun.branch}
          </div>
          <div className="mt-1 text-[#4caf50]/70">
            ✓ All checks passed · Deployed → {previousRun.target} ·{" "}
            <span className="text-white/22">{previousRun.ago}</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex min-h-0 flex-col gap-[2px] overflow-hidden">
            {displayedLines.map((line) => (
              <div
                key={line.id}
                data-term-line
                className="truncate whitespace-nowrap"
                style={{
                  color: lineColor(line.kind),
                  fontWeight: line.bold ? 600 : 400,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-[#4caf50]">❯</span>
            <span className="text-white/18">_</span>
            <span className="term-cursor h-[14px] w-[7px] rounded-[1px] bg-[#dfff1f]/75" />
          </div>
        </div>
      </div>

      <style>{`
        .term-cursor {
          animation: adventure-term-cursor 1.1s step-end infinite;
        }

        @keyframes adventure-term-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
