"use client";

// "What I optimize for": her kelime anlamını oynar.
//   clear / anlaşılır → bulanıktan netleşir (kamera odak çekişi)
//   fast  / hızlı     → animasyonsuz, tek karede gelir; o güncellemenin bu
//                        tarayıcıda ölçülen süresi yanında yazar
//   human / insani    → insan gibi yazılır: bir harf hatası yapıp düzeltir
// ∿ inspector'ı kullanılan eğriyi çizer; nokta her geçişte eğri üzerinde kayar.
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Eyebrow, Tile, useInspect } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;
const CYCLE = 2800;

/** "insani" → i, in, ins, insa, insi (hata), insa, insan, insani */
function typoSteps(word: string) {
  const steps: string[] = [];
  const p = Math.max(1, word.length - 2);
  for (let i = 1; i <= p; i++) steps.push(word.slice(0, i));
  steps.push(word.slice(0, p) + word[p + 1]); // bir harf atlandı
  steps.push(word.slice(0, p)); // sil
  for (let i = p + 1; i <= word.length; i++) steps.push(word.slice(0, i));
  return steps;
}
// İnsan ritmi: sabit ama düzensiz aralıklar; silmeden önce kısa duraksama.
const RHYTHM = [90, 130, 70, 150, 110, 260, 120, 90, 140, 80];

function HumanWord({ word }: { word: string }) {
  const steps = typoSteps(word);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= steps.length - 1) return;
    const t = window.setTimeout(() => setN((x) => x + 1), RHYTHM[n % RHYTHM.length]);
    return () => window.clearTimeout(t);
  }, [n, steps.length]);
  return (
    <span>
      {steps[n]}
      <span aria-hidden="true" className={`ml-[0.04em] inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] bg-[#dfff1f] ${n >= steps.length - 1 ? "animate-pulse" : ""}`} />
    </span>
  );
}

function FastWord({ word, t0 }: { word: string; t0: number }) {
  const [ms, setMs] = useState<number | null>(null);
  // Durum değişiminden ekrana boyanan kareye kadar geçen gerçek süre.
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setMs(performance.now() - t0));
    return () => cancelAnimationFrame(raf);
  }, [t0]);
  return (
    <span>
      {word}
      <sup className="ml-1 font-mono text-[0.22em] font-normal tracking-normal text-white/45 tabular-nums">
        {ms === null ? "" : `${Math.max(1, Math.round(ms))}ms`}
      </sup>
    </span>
  );
}

// cubic-bezier(.22,1,.36,1) — u parametresiyle eğri üzerinde nokta.
const bez = (u: number, a: number, b: number) => 3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u ** 2 * b + u ** 3;

function CurvePanel({ note, run }: { note: string; run: number }) {
  const [u, setU] = useState(1);
  useEffect(() => {
    const c = animate(0, 1, { duration: 0.8, ease: "linear", onUpdate: setU });
    return () => c.stop();
  }, [run]);
  const W = 150;
  const H = 84;
  const x = bez(u, EASE[0], EASE[2]) * W;
  const y = H - bez(u, EASE[1], EASE[3]) * H;
  return (
    <motion.div
      className="absolute right-4 top-14 z-20 w-[196px] rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur"
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.12)" />
        <line x1={0} y1={0} x2={0} y2={H} stroke="rgba(255,255,255,0.12)" />
        <path
          d={`M0 ${H} C ${EASE[0] * W} ${H - EASE[1] * H}, ${EASE[2] * W} ${H - EASE[3] * H}, ${W} 0`}
          fill="none"
          stroke="#dfff1f"
          strokeOpacity={0.7}
          strokeWidth={1.5}
        />
        <circle cx={x} cy={y} r={3.5} fill="#dfff1f" />
      </svg>
      <div className="mt-2 font-mono text-[10px] leading-relaxed text-white/50">
        cubic-bezier(.22, 1, .36, 1)
        <div className="text-white/30">{note}</div>
      </div>
    </motion.div>
  );
}

export default function Feel({ dict, arrived }: { dict: Dictionary; arrived: boolean }) {
  const reduced = useReducedMotion();
  const words = dict.focus.rotatingWords; // [clear, fast, human]
  const [i, setI] = useState(0);
  const [ticks, setTicks] = useState(0);
  const { on: curve } = useInspect();
  const t0 = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });

  // Döngü varıştan sonra ve kart görünürken çalışır. Öncesinde ilk kelime
  // durağan durur: devirdeki klon ile gerçek DOM aynı kareyi göstermeli.
  const running = arrived && inView && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      t0.current = performance.now();
      setI((x) => (x + 1) % words.length);
      setTicks((n) => n + 1);
    }, CYCLE);
    return () => window.clearInterval(t);
  }, [running, words.length]);

  const word = words[i];
  const mode = i % 3; // 0 clear, 1 fast, 2 human

  return (
    <Tile className="lg:col-span-8" tint="#dfff1f">
      <div ref={ref} className="flex h-full flex-col justify-between gap-6 p-6 md:p-8">
      <Eyebrow>{dict.focus.eyebrow}</Eyebrow>
      {curve && <CurvePanel note={dict.top.curveNote} run={i} />}

      <div className="flex flex-col gap-1">
        <p className="max-w-[26ch] text-[clamp(24px,2.3vw,36px)] font-medium leading-[1.12] tracking-[-0.025em] text-white/85 [text-wrap:balance]">
          {dict.focus.headline.join(" ")}
        </p>
        {/* Kelimenin kendi sahnesi: satır değişmez, başlık yeniden akmaz. */}
        {/* Ekran okuyucu için tek, durağan satır; dönen kelime görsel. */}
        <span className="sr-only">{words.join(", ")}.</span>
        <p aria-hidden="true" className="h-[1.1em] text-[clamp(44px,4.6vw,76px)] font-medium leading-none tracking-[-0.035em] text-[#dfff1f]">
          {reduced || ticks === 0 ? (
            <span>{word}.</span>
          ) : mode === 0 ? (
            <motion.span
              key={`c-${i}`}
              className="inline-block"
              initial={{ filter: "blur(14px)", opacity: 0.25, scale: 1.06 }}
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {word}.
            </motion.span>
          ) : mode === 1 ? (
            <FastWord key={`f-${i}`} word={`${word}.`} t0={t0.current} />
          ) : (
            <HumanWord key={`h-${i}`} word={`${word}.`} />
          )}
        </p>
      </div>

      <p className="max-w-[58ch] text-[15px] leading-relaxed text-white/50 [text-wrap:pretty]">{dict.focus.paragraph}</p>
      </div>
    </Tile>
  );
}
