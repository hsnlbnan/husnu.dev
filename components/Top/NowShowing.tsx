"use client";

// "Now showing / Sahnede": seçili projeler sırayla sahneye çıkar.
//
// Çerçeve projeye göre dönüşür: web → tarayıcı penceresi, iOS → iPhone
// (genişlik/yükseklik/köşe yayla). Her ekran önce mavi kopya (blueprint)
// olarak belirir: gerçek ekran görüntüsü SVG kenar algılama filtresiyle lime
// çizgilere dönüşür; ardından alttan yukarı bir ısı çizgisi geçer ve
// arkasında gerçek ekran açılır: tasarımdan koda.
//
// Tıklama gerektirmez: imleç ekranın üstündeyken döngü durur ve ısı çizgisi
// imleci izler — iskelet ile bitmiş hâl yan yana. Inspect modu ortada tutar.
import Image from "next/image";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { getShowcase } from "./data";
import { BEZIER, EASE, Eyebrow, FOCUS, Tile, useInspect } from "./ui";

const CYCLE = 6.5; // sn / proje
const BAKE_DELAY = 0.6;
const BAKE = 1.8;
const STAGE_H = 212;

export default function NowShowing({
  en,
  dict,
  arrived,
}: {
  en: boolean;
  dict: Dictionary;
  /** Devir bitmeden döngü başlamaz: ekran Otokoç'un mavi kopyasında donuk bekler. */
  arrived: boolean;
}) {
  const reduced = useReducedMotion();
  const items = useMemo(() => getShowcase(en), [en]);
  const tileRef = useRef<HTMLDivElement>(null);
  const inView = useInView(tileRef, { margin: "-10% 0px" });
  const [i, setI] = useState(0);
  // Tıklama yok: imleç ekrandayken (scrubbing) döngü durur ve ısı çizgisi
  // imleci izler. Inspect modunda iskelet/bitmiş hâl ortadan bölünmüş durur.
  const [scrubbing, setScrubbing] = useState(false);
  const { on: inspect } = useInspect();
  const blueprint = scrubbing || inspect;
  const filterId = `bp-${useId().replace(/:/g, "")}`;
  const it = items[i];

  const reveal = useMotionValue(reduced ? 1 : 0);
  const progress = useMotionValue(0);
  const clip = useMotionTemplate`inset(${useTransform(reveal, (r) => (1 - r) * 100)}% 0% 0% 0%)`;
  const heatBottom = useTransform(reveal, (r) => `${r * 100}%`);
  const heatOpacity = useTransform(reveal, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  // Döngü yalnızca varıştan sonra ve kart görünürken çalışır (FR-9).
  const running = arrived && inView && !reduced && !blueprint;
  useEffect(() => {
    if (!running) return;
    reveal.set(0);
    progress.set(0);
    const bake = animate(reveal, 1, { delay: BAKE_DELAY, duration: BAKE, ease: BEZIER });
    const bar = animate(progress, 1, { duration: CYCLE, ease: "linear" });
    const next = window.setTimeout(() => setI((x) => (x + 1) % items.length), CYCLE * 1000);
    return () => {
      bake.stop();
      bar.stop();
      window.clearTimeout(next);
    };
  }, [i, running, reveal, progress, items.length]);

  const screenRef = useRef<HTMLDivElement>(null);
  const onScrub = (e: React.PointerEvent) => {
    if (reduced) return;
    if (!scrubbing) setScrubbing(true);
    const r = screenRef.current?.getBoundingClientRect();
    if (!r) return;
    reveal.set(Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height)));
  };
  useEffect(() => {
    if (inspect && !scrubbing) animate(reveal, 0.5, { duration: 0.6, ease: BEZIER });
  }, [inspect, scrubbing, reveal]);

  // Hafif 3D eğim
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotY = useSpring(useTransform(tx, (v) => v * 10), { stiffness: 200, damping: 20 });
  const rotX = useSpring(useTransform(ty, (v) => v * -8), { stiffness: 200, damping: 20 });

  const phoneW = Math.round((STAGE_H * 9) / 19.5);
  const frame = it.phone
    ? { width: phoneW + 8, height: STAGE_H, borderRadius: 24 }
    : { width: 336, height: STAGE_H, borderRadius: 12 };

  return (
    <Tile className="lg:col-span-4">
      <div ref={tileRef} className="flex h-full flex-col p-6 md:p-8">
      <Eyebrow>{dict.top.nowShowing}</Eyebrow>

      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {/* Optimize edilmiş WebP/AVIF'in sıkıştırma gürültüsü düz beyaz
              alanlarda kenar sanılmasın: önce hafif bulanıklık, sonra eşik. */}
          <feColorMatrix type="saturate" values="0" />
          <feGaussianBlur stdDeviation="0.6" />
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="5" intercept="-0.18" />
            <feFuncG type="linear" slope="5" intercept="-0.18" />
            <feFuncB type="linear" slope="5" intercept="-0.18" />
          </feComponentTransfer>
          <feColorMatrix type="matrix" values="0.87 0 0 0 0  1 0 0 0 0  0.12 0 0 0 0  0 0 0 1 0" />
        </filter>
      </svg>

      {/* Sahne */}
      <div
        className="mt-4 flex flex-1 items-center justify-center [perspective:1000px]"
        style={{ minHeight: STAGE_H + 16 }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          tx.set((e.clientX - r.left) / r.width - 0.5);
          ty.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          tx.set(0);
          ty.set(0);
        }}
      >
        <motion.div
          className="relative max-w-full overflow-hidden bg-[#0b0b0c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
          initial={false}
          animate={frame}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          // Taslak modunda düz durur: elle sürme sırasında eğim dikkat dağıtır ve
          // Chrome SVG filtresini 3D dönüşümlü katmanda farklı rasterize ediyor.
          style={{ rotateY: reduced || blueprint ? 0 : rotY, rotateX: reduced || blueprint ? 0 : rotX }}
        >
          {/* Tarayıcı çubuğu (web) */}
          <motion.div
            className="flex items-center gap-1 px-2"
            initial={false}
            animate={{ height: it.phone ? 0 : 16, opacity: it.phone ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: c }} />
            ))}
          </motion.div>

          <div
            ref={screenRef}
            onPointerMove={onScrub}
            onPointerLeave={() => setScrubbing(false)}
            className="absolute inset-x-[4px] bottom-[4px] cursor-ns-resize overflow-hidden bg-[#06080a]"
            style={{ top: it.phone ? 4 : 16, borderRadius: it.phone ? 20 : 6 }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={it.title}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(223,255,31,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(223,255,31,0.06) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                />
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover object-left-top opacity-90"
                  style={{ filter: `url(#${filterId})` }}
                />
                <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
                  <Image src={it.src} alt="" fill sizes="340px" className="object-cover object-left-top" />
                </motion.div>
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 h-10 translate-y-1/2"
                  style={{
                    bottom: heatBottom,
                    opacity: heatOpacity,
                    background:
                      "linear-gradient(to top, transparent, rgba(255,138,61,0.55) 48%, rgba(255,200,120,0.9) 50%, rgba(255,138,61,0.55) 52%, transparent)",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* iPhone adası */}
            <AnimatePresence>
              {it.phone && (
                <motion.div
                  className="absolute left-1/2 top-[5px] h-[13px] w-[44%] -translate-x-1/2 rounded-full bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Künye */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="relative h-[3.9rem] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={it.title}
              className="absolute inset-x-0 top-0"
              initial={{ y: "50%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-50%", opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-xl font-medium tracking-[-0.02em] text-white">{it.title}</span>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: it.status.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: it.status.color }} />
                  {it.status.label}
                </span>
              </div>
              <div className="mt-1 truncate text-[13px] text-white/45">
                {dict.top.audienceFor.replace("{audience}", it.audience)}
                <span className="text-white/20"> · </span>
                <span className="font-mono text-[11px] text-white/30">{it.techs.join(" · ")}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hikâye çubuğu */}
        <div className="flex items-center gap-1.5">
          {items.map((a, k) => (
            <button
              key={a.title}
              type="button"
              onClick={() => {
                setI(k);
              }}
              aria-label={a.title}
              aria-current={k === i ? "true" : undefined}
              className={`${FOCUS} flex-1 rounded-full py-2`}
            >
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/10">
                {k === i ? (
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full"
                    style={{ scaleX: blueprint || reduced ? 1 : progress, backgroundColor: a.accent }}
                  />
                ) : k < i ? (
                  <span className="absolute inset-0 rounded-full bg-white/30" />
                ) : null}
              </span>
            </button>
          ))}
          <span className="ml-1 font-mono text-[10px] tabular-nums text-white/35">
            {String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      </div>
    </Tile>
  );
}
