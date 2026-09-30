"use client";

// Başlık kartı: iddiasını kendisi kanıtlar.
//
// "Ancak eksik olduğunda fark edilen detaylar" — varışta kelimeler milimetrik
// kaymış başlar, tipografi kılavuzları (büyük harf / x-yüksekliği / taban
// çizgisi) belirir ve kelimeler yaylanarak kusursuz hizaya oturur; ardından
// kılavuzlar söner. Başlığın üstüne gelince ya da Inspect modunda da görünür.
// Kılavuzlar fontun gerçek metriklerinden (canvas measureText) hesaplanır.
//
// Stack bir cümledir: teknolojinin üstüne gelince kullanıldığı projeler
// alt satırda belirir; katmanlar etiket yerine cümlenin akışından okunur.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { ON_THIS_SITE, projectsUsing, yearsOfExperience } from "./data";
import { EASE, FOCUS, RollingNumber, Tile, useInspect } from "./ui";

type Guide = { baseline: number; x: number; cap: number; left: number };

// Her kelimeye sabit (deterministik) bir "hata": varışta buradan hizaya oturur.
const offset = (i: number) => ({ y: `${(((i * 37) % 7) - 3) * 0.022}em`, rotate: (((i * 53) % 5) - 2) * 0.35 });

function useGuides(headRef: React.RefObject<HTMLElement>, deps: unknown[]) {
  const [lines, setLines] = useState<Guide[]>([]);
  const measure = useCallback(() => {
    const head = headRef.current;
    if (!head) return;
    const cs = getComputedStyle(head);
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText("Hxg");
    const asc = m.fontBoundingBoxAscent;
    const desc = m.fontBoundingBoxDescent;
    const xh = ctx.measureText("x").actualBoundingBoxAscent;
    const capH = ctx.measureText("H").actualBoundingBoxAscent;
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.06;
    // inline-block kelime kutusu = satır yüksekliği; taban çizgisi yarım
    // aralık + yükseliş kadar aşağıda. offsetTop transform'u yok sayar, yani
    // kayma animasyonu sürerken de doğru hizayı ölçeriz.
    const halfLeading = (lh - (asc + desc)) / 2;
    const byLine = new Map<number, Guide>();
    head.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => {
      const top = head.offsetTop + w.offsetTop;
      const key = Math.round(top / 4);
      if (byLine.has(key)) return;
      const baseline = top + halfLeading + asc;
      byLine.set(key, { baseline, x: baseline - xh, cap: baseline - capH, left: head.offsetLeft + w.offsetLeft });
    });
    setLines(Array.from(byLine.values()).sort((a, c) => a.baseline - c.baseline));
  }, [headRef]);

  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);
  return lines;
}

type Seg = string | { skill: string };

/** "Every day I write {Next.js}, …" → metin ve etkileşimli teknoloji parçaları. */
function parseSentence(sentence: string): Seg[] {
  return sentence.split(/(\{[^}]+\})/).filter(Boolean).map((part) => (part.startsWith("{") ? { skill: part.slice(1, -1) } : part));
}

export function StatementTile({ dict, play }: { dict: Dictionary; play: number }) {
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const { on: pinned } = useInspect();
  const [hoverHead, setHoverHead] = useState(false);
  const [arriving, setArriving] = useState(false);
  const [skill, setSkill] = useState<string | null>(null);

  const t = dict.top;
  const parts = [
    { t: t.headlineLead, accent: false },
    { t: t.headlineAccent, accent: true },
  ];
  const words = parts.flatMap((p) => p.t.split(" ").map((w) => ({ w, accent: p.accent })));
  const lines = useGuides(headRef, [t.headlineLead]);

  // Varış: kılavuzlar belirir → kelimeler hizaya oturur → kılavuzlar söner.
  useEffect(() => {
    if (!play || reduced) return;
    setArriving(true);
    const t = window.setTimeout(() => setArriving(false), 1900);
    return () => window.clearTimeout(t);
  }, [play, reduced]);

  const showGuides = pinned || hoverHead || arriving;
  const used = skill ? projectsUsing(skill) : [];
  const onSite = skill ? ON_THIS_SITE.has(skill) : false;

  return (
    <Tile className="lg:col-span-8" tint="#dfff1f">
      <div ref={boxRef} className="relative flex h-full flex-col gap-8 p-6 md:p-10">
        {/* Kılavuz katmanı */}
        <AnimatePresence>
          {showGuides && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.25 }}
            >
              {lines.map((l, i) => (
                <Fragment key={i}>
                  <GuideLine y={l.cap} label="cap" tone="rgba(255,255,255,0.24)" />
                  <GuideLine y={l.x} label="x" tone="rgba(255,255,255,0.24)" />
                  <GuideLine y={l.baseline} label="base" tone="rgba(223,255,31,0.45)" />
                </Fragment>
              ))}
              {lines[0] && (
                <span className="absolute bottom-0 top-0 w-px bg-[#dfff1f]/30" style={{ left: lines[0].left }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>


        <h2
          ref={headRef}
          onMouseEnter={() => setHoverHead(true)}
          onMouseLeave={() => setHoverHead(false)}
          className="relative max-w-[19ch] text-[clamp(34px,3.6vw,58px)] font-medium leading-[1.06] tracking-[-0.032em] text-white [text-wrap:balance]"
        >
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span
                key={`${i}-${play}`}
                data-word=""
                className={`inline-block ${w.accent ? "text-[#dfff1f]" : ""}`}
                initial={play && !reduced ? offset(i) : false}
                animate={{ y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.35 + i * 0.03 }}
              >
                {w.w}
              </motion.span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h2>

        <p className="mt-auto max-w-[60ch] text-[16px] leading-[1.7] text-white/50 [text-wrap:pretty]">
          {parseSentence(t.stackSentence).map((seg, i) =>
            typeof seg === "string" ? (
              <Fragment key={i}>{seg}</Fragment>
            ) : (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setSkill(seg.skill)}
                onMouseLeave={() => setSkill(null)}
                onFocus={() => setSkill(seg.skill)}
                onBlur={() => setSkill(null)}
                className={`${FOCUS} rounded-sm text-white/85 underline decoration-white/15 decoration-dotted underline-offset-[5px] transition-colors hover:text-[#dfff1f] hover:decoration-[#dfff1f]/60`}
              >
                {seg.skill}
              </button>
            )
          )}
        </p>

        <div className="flex h-7 items-center border-t border-white/[0.06] pt-4 text-[13px] text-white/40" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={skill ?? "stats"}
              className="flex flex-wrap items-center gap-x-2 gap-y-1"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              {skill ? (
                <>
                  {used.map((p) => (
                    <span key={p.n} className="tabular-nums" style={{ color: p.accent }}>
                      {String(p.n).padStart(2, "0")} {p.title}
                    </span>
                  ))}
                  {onSite && <span className="text-[#dfff1f]">↺ {t.thisPage}</span>}
                </>
              ) : (
                <>
                  <span className="text-white/80">
                    <RollingNumber value={yearsOfExperience()} suffix="+" play={play} />
                  </span>
                  <span>{t.years}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/80">
                    <RollingNumber value={20} suffix="+" play={play} />
                  </span>
                  <span>{t.shipped}</span>
                  <span className="text-white/20">·</span>
                  <span>{dict.header.role}</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Tile>
  );
}

function GuideLine({ y, label, tone }: { y: number; label: string; tone: string }) {
  return (
    <div className="absolute inset-x-0" style={{ top: y }}>
      <div className="h-px w-full" style={{ backgroundColor: tone }} />
      <span className="absolute -top-2.5 right-14 font-mono text-[9px] uppercase tracking-wider" style={{ color: tone }}>
        {label}
      </span>
    </div>
  );
}
