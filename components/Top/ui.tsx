"use client";

// Üst bölümün ortak parçaları: eğri/yay sabitleri, kart, odometre, varış
// sinyali, Inspect modu ve yerel saat.
import { motion, useReducedMotion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;
/** animate() salt-okunur tuple kabul etmiyor. */
export const BEZIER = [...EASE] as [number, number, number, number];
export const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
export const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#dfff1f]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f10]";

/**
 * Varış: hero devri bitince HeroSection `hero:arrived` yayınlar.
 *
 * `play` her varışta artar (rakam yuvarlama, kılavuz gibi tek seferlik
 * animasyonları tetikler). `arrived`, kendi kendine dönen animasyonların
 * (kelime döngüsü, "Sahnede" döngüsü) başlayıp başlayamayacağını söyler:
 * devirden önce bölüm DURAĞAN kalmalı, çünkü laptop ekranındaki klon tek bir
 * karedir ve altındaki gerçek DOM hareket ederse piksel hizası bozulur.
 * Hero yoksa (başka sayfa) ya da azaltılmış hareket açıksa hemen `true`.
 */
export function useArrival() {
  const [play, setPlay] = useState(0);
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStandalone(reduced || !document.querySelector("[data-hero-stage]"));
    // Olay bu bileşen dinlemeye başlamadan önce yayınlandıysa (ör. sayfa
    // hero'nun altında açıldı) bayraktan yakala.
    if (document.documentElement.dataset.heroArrived === "1") setPlay((x) => x || 1);
    const on = () => setPlay((x) => x + 1);
    window.addEventListener("hero:arrived", on);
    return () => window.removeEventListener("hero:arrived", on);
  }, []);
  return { play, arrived: play > 0 || standalone };
}

export function Tile({ children, className = "", tint }: { children: ReactNode; className?: string; tint?: string }) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f10] ${className}`}
      style={tint ? { backgroundImage: `radial-gradient(90% 70% at 0% 0%, ${tint}12 0%, transparent 60%)` } : undefined}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">{children}</span>;
}

/** Odometre: varışta her hane bir tur atıp değerine oturur. */
export function RollingNumber({ value, suffix = "", play }: { value: number; suffix?: string; play: number }) {
  const reduced = useReducedMotion();
  const digits = String(value).split("");
  return (
    <span className="inline-flex tabular-nums" aria-label={`${value}${suffix}`}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden leading-none">
          <motion.span
            key={play}
            className="flex flex-col"
            initial={reduced || play === 0 ? false : { y: `-${Number(d)}em` }}
            animate={{ y: `-${10 + Number(d)}em` }}
            transition={{ duration: 1.1, delay: 0.08 * i, ease: EASE }}
          >
            {Array.from({ length: 20 }, (_, k) => (
              <span key={k} className="h-[1em] leading-none">
                {k % 10}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
      <span aria-hidden="true" className="leading-none text-[#dfff1f]">
        {suffix}
      </span>
    </span>
  );
}

/** İzmir'in canlı saati (hydration uyumsuzluğu olmasın diye mount sonrası). */
export function LocalTime({ en }: { en: boolean }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat(en ? "en-GB" : "tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date());
    setNow(fmt());
    const t = window.setInterval(() => setNow(fmt()), 30_000);
    return () => window.clearInterval(t);
  }, [en]);
  return (
    <span className="font-mono text-xs text-white/55">
      İzmir · <span className="tabular-nums text-white/80">{now ?? "--:--"}</span> <span className="text-white/35">GMT+3</span>
    </span>
  );
}

/**
 * Inspect modu: sayfa genelinde TEK anahtar (künyede, klavyede `I`).
 * Açıkken kartlar "nasıl yapıldı" katmanlarını gösterir (kılavuzlar, taslak,
 * eğri, durumlar). Asıl deneyim buna bağlı değildir — zanaat varsayılan olarak
 * kaydırma ve imleçle zaten görünür; bu, meraklı geliştirici için.
 */
const InspectContext = createContext<{ on: boolean; toggle: () => void }>({ on: false, toggle: () => {} });
export const useInspect = () => useContext(InspectContext);

export function InspectProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn((o) => !o), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key.toLowerCase() === "i") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
  return <InspectContext.Provider value={{ on, toggle }}>{children}</InspectContext.Provider>;
}

export function InspectSwitch({ label }: { label: string }) {
  const { on, toggle } = useInspect();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-keyshortcuts="I"
      onClick={toggle}
      className={`${FOCUS} flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
        on ? "border-[#dfff1f]/60 text-[#dfff1f]" : "border-white/15 text-white/55 hover:border-white/35 hover:text-white"
      }`}
    >
      <span className={`relative h-4 w-7 rounded-full transition-colors ${on ? "bg-[#dfff1f]" : "bg-white/15"}`}>
        <motion.span
          className="absolute top-0.5 block h-3 w-3 rounded-full"
          animate={{ left: on ? 14 : 2, backgroundColor: on ? "#000" : "#fff" }}
          transition={SPRING}
        />
      </span>
      {label} ⌗ ◫ ∿ ◧
      <kbd className="rounded border border-current/30 px-1 text-[9px] opacity-60">I</kbd>
    </button>
  );
}
