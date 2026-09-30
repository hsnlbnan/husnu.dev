"use client";

// Projeler bölümü: sahne ışığı indeksi + cihaz sahnesi + seyirciler.
//
// Bölüm pinlenmez; `sticky` bir sahne, proje başına ~60vh scroll mesafesi
// tüketir. Solda tipografik indeks (uzun başlıklarda `shortTitle`), ortada
// projeye göre MacBook ya da iPhone, sağda künye; alt kenarda hero'nun
// seyircileri her yeni projede tepki verir.
//
// SEO/erişilebilirlik: tüm projelerin künyeleri DOM'da (aynı grid hücresinde
// üst üste); yalnızca aktif olan görünür ve erişilebilir ağaçtadır. İndeks
// düğmeleri klavyeyle her projeye götürür.
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Fragment, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/dictionaries";
import { defaultLocale, type Locale } from "@/i18n/config";
import Audience from "./Audience";
import TechStack from "./TechStack";

export type Project = {
  title: string;
  shortTitle?: string;
  subtitle: string;
  subtitleTr?: string;
  description: string;
  src: string;
  phone?: string;
  link?: string;
  accent?: string;
  company?: string;
  status?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "100K+", "3,400+", "98–100", "426K", "p50/p95/p99" gibi rakamları vurgular. */
function emphasizeNumbers(text: string): ReactNode[] {
  const re = /(\d[\d.,]*(?:\s?[–-]\s?\d[\d.,]*)?\s?[KkMm]?\+?(?:\s?(?:monthly users|users|kişi|kullanıcı))?)/g;
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-white">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/** İlk cümle giriş, geri kalanı gövde. */
function splitLead(text: string): [string, string] {
  const m = text.match(/^([\s\S]+?[.!?])\s+([\s\S]*)$/);
  return m ? [m[1], m[2]] : [text, ""];
}

export default function Projects({ projects, dict, locale }: { projects: Project[]; dict: Dictionary; locale: Locale }) {
  const n = projects.length;
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * travel, behavior: reduced ? "auto" : "smooth" });
  };

  const current = projects[active];
  const accent = current.accent ?? "#dfff1f";
  const isPhone = !!current.phone;

  return (
    <section
      ref={sectionRef}
      className="relative mt-10"
      style={{ height: `${n * 60 + 40}vh` }}
      aria-label={dict.home.projectsAria}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Aktif projenin renginde sahne ışığı */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ background: `radial-gradient(55% 50% at 55% 42%, ${accent}1f 0%, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative mx-auto grid h-full w-full grid-rows-[auto_30svh_auto] gap-4 px-4 pb-[96px] pt-[6vh] lg:container md:grid-rows-[auto_minmax(0,1fr)_auto] md:gap-5 md:px-0 md:pb-[150px] md:pt-[7vh] xl:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,4fr)] xl:grid-rows-1 xl:items-center xl:gap-10 xl:pb-[170px]">
          {/* 1) İndeks (xl) / sayaç (küçük ekranlar) */}
          <nav aria-label={dict.home.projectsAria} className="min-w-0">
            <ol className="hidden flex-col xl:flex">
              {projects.map((p, i) => {
                const on = i === active;
                const a = p.accent ?? "#dfff1f";
                return (
                  <li key={p.title}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={on ? "true" : undefined}
                      aria-label={p.title}
                      className="group flex w-full min-w-0 items-baseline gap-3 py-1 text-left"
                    >
                      <span
                        className="w-7 shrink-0 font-mono text-[11px] tracking-wider transition-colors duration-300"
                        style={{ color: on ? a : "rgba(255,255,255,0.25)" }}
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className={`min-w-0 truncate text-[1.7rem] font-semibold leading-[1.25] tracking-tight transition-all duration-500 ${
                          on ? "translate-x-1.5 text-white" : "text-white/20 group-hover:text-white/50"
                        }`}
                      >
                        {p.shortTitle ?? p.title}
                      </span>
                      {on && (
                        <motion.span
                          layoutId="project-dot"
                          className="h-2 w-2 shrink-0 self-center rounded-full"
                          style={{ backgroundColor: a }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Küçük ekranlarda: sayaç + ilerleme çizgileri */}
            <div className="flex items-center gap-3 xl:hidden">
              <span className="font-mono text-xs text-white/50">
                <span style={{ color: accent }}>{pad(active + 1)}</span> / {pad(n)}
              </span>
              <div className="flex flex-1 gap-1">
                {projects.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={p.title}
                    className="h-6 flex-1"
                  >
                    <span
                      className="block h-[3px] rounded-full transition-colors"
                      style={{ backgroundColor: i === active ? accent : "rgba(255,255,255,0.12)" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* 2) Cihaz: web → MacBook, iOS → iPhone; tip değişince döner */}
          <div className="relative flex min-h-0 items-center justify-center [perspective:1400px] xl:h-[62vh]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isPhone ? "phone" : "laptop"}
                className="flex h-full w-full items-center justify-center"
                initial={reduced ? false : { rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >
                {isPhone ? (
                  <Phone src={current.phone!} alt={interpolate(dict.project.screenshotAlt, { title: current.title })} />
                ) : (
                  <Laptop src={current.src} alt={interpolate(dict.project.screenshotAlt, { title: current.title })} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3) Künyeler: hepsi DOM'da, aktif olan görünür */}
          <div className="grid min-w-0 [&>*]:[grid-area:1/1]">
            {projects.map((p, i) => (
              <Details key={p.title} project={p} index={i} active={i === active} dict={dict} locale={locale} />
            ))}
          </div>
        </div>

        <Audience beat={active} />
      </div>
    </section>
  );
}

function Details({
  project: p,
  index,
  active,
  dict,
  locale,
}: {
  project: Project;
  index: number;
  active: boolean;
  dict: Dictionary;
  locale: Locale;
}) {
  const accent = p.accent ?? "#dfff1f";
  const text = locale === defaultLocale ? p.subtitle : p.subtitleTr ?? p.subtitle;
  const [lead, body] = splitLead(text);
  const techs = p.description.split(",").map((t) => t.trim());

  return (
    <motion.article
      aria-labelledby={`project-title-${index}`}
      aria-hidden={!active}
      className={`flex min-w-0 flex-col gap-3 self-start md:gap-4 xl:self-center ${active ? "" : "pointer-events-none"}`}
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
      // Hızlı kaydırmada künyeler üst üste binmesin: çıkan hızlı söner.
      transition={active ? { duration: 0.35, delay: 0.12 } : { duration: 0.12 }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          {p.company || dict.project.caseStudy}
        </span>
        {p.status === "cooking" && (
          <span
            className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]"
            style={{ borderColor: `${accent}55`, color: accent }}
          >
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full motion-reduce:animate-none" style={{ backgroundColor: accent }} />
              <span className="relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            </span>
            {dict.home.cookingStatus}
          </span>
        )}
      </div>

      <h3 id={`project-title-${index}`} className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={active ? 0 : -1}
            className="group inline-flex items-baseline gap-2 decoration-white/30 underline-offset-4 hover:underline"
            aria-label={interpolate(dict.project.visitAria, { title: p.title })}
          >
            <Title p={p} />
            <span aria-hidden="true" className="text-base text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗︎
            </span>
          </a>
        ) : (
          <Title p={p} />
        )}
      </h3>

      <p className="text-[15px] leading-[1.55] text-white/90 [text-wrap:pretty] md:text-lg">{emphasizeNumbers(lead)}</p>
      {/* Mobilde sahne tek ekrana sığmalı: gövde paragrafı yok (giriş cümlesi
          yeterli), yığın tek satırlık metin. Geniş ekranda tamamı. */}
      {body && <p className="hidden max-w-[62ch] text-base leading-[1.65] text-white/60 md:block">{emphasizeNumbers(body)}</p>}

      <div className="hidden md:block">
        <TechStack techs={techs} label={dict.project.techStack} accent={accent} />
      </div>
      <p className="font-mono text-[11px] leading-relaxed tracking-wide text-white/45 md:hidden">
        <span className="sr-only">{dict.project.techStack}: </span>
        {techs.join(" · ")}
      </p>
    </motion.article>
  );
}

/** Mobilde kısa ad (varsa), geniş ekranda tam başlık; ekran okuyucu hep tam başlığı duyar. */
function Title({ p }: { p: Project }) {
  if (!p.shortTitle) return <>{p.title}</>;
  return (
    <>
      <span className="md:hidden" aria-hidden="true">
        {p.shortTitle}
      </span>
      <span className="sr-only md:not-sr-only">{p.title}</span>
    </>
  );
}

function ScreenImage({ src, alt, sizes, fit = "object-top" }: { src: string; alt: string; sizes: string; fit?: string }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={src}
        className="absolute inset-0"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-25%", opacity: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${fit}`} />
      </motion.div>
    </AnimatePresence>
  );
}

function Laptop({ src, alt }: { src: string; alt: string }) {
  return (
    // Genişlik hem sütunla hem yükseklikle sınırlı ki kısa ekranlarda taşmasın.
    <div className="w-full max-w-[min(100%,calc(30svh*1.5))] md:max-w-[min(100%,calc((100svh-340px)*1.5))] xl:max-w-[min(100%,calc(62vh*1.5))]">
      <div className="rounded-[16px] bg-[#0b0b0c] p-[1.4%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[7px] bg-[#111]">
          <ScreenImage src={src} alt={alt} sizes="(min-width:1280px) 40vw, 90vw" fit="object-left-top" />
        </div>
      </div>
      <div className="relative mx-auto h-2.5 w-[112%] -translate-x-[5.4%] rounded-b-[12px] bg-gradient-to-b from-[#b9bcc1] to-[#6d7075]">
        <div className="absolute left-1/2 top-0 h-1 w-[14%] -translate-x-1/2 rounded-b-md bg-[#8a8d91]" />
      </div>
    </div>
  );
}

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    // Oran DIŞ kutuda: Safari, yüksekliği yüzdeyle verilmiş bir çocuğun
    // aspect-ratio'sundan ebeveyn genişliğini hesaplamıyor ve çerçeve ince
    // bir çubuğa çöküyordu. Ekran, çerçevenin içine mutlak konumlanır.
    // Köşe ve çerçeve boyuta oranlı (yüzde): sabit 42px, küçük telefonda
    // çerçeveyi bir kapsüle çeviriyordu. iPhone oranları: köşe ≈ genişliğin
    // %17'si, çerçeve ≈ %3.5'i.
    <div className="relative aspect-[9/19.5] h-full max-h-[min(62vh,640px)] rounded-[17%_/_7.8%] bg-[#0b0b0c] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
      <div className="absolute inset-x-[3.5%] inset-y-[1.6%] overflow-hidden rounded-[14%_/_6.5%] bg-white">
        <ScreenImage src={src} alt={alt} sizes="300px" />
      </div>
    </div>
  );
}
