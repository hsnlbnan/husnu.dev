"use client";

// "Seyirciler" hero'su: pin + scrub'lı tek timeline + DOM katmanı.
//
// Yapı:
//   [pinlenen blok]
//     stage   (absolute, 100svh) : canvas + başlık katmanı
//     content (akışta)           : gerçek Header + üst bento (children)
//   [spacer] (320–400svh)        : pin mesafesi, SSR'da render edilir
//
// Gerçek içerik pinlenen bloğun içinde, canvas'ın altında durur. Sekans
// sonunda canvas söndüğünde görünen şey zaten yerinde duran gerçek DOM'dur;
// pin bitince blok normal akışla kaymaya devam eder. `pinSpacing: false` +
// ayrı spacer, bento'lar yüklenip blok yüksekliği değiştiğinde bayat
// pin-spacer dolgusu oluşmasını önler.
import { useGSAP } from "@gsap/react";
import { track } from "@vercel/analytics";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { PHASES } from "./constants";
import { REDUCED_MOTION_RIG, resetRig, rig, screenSource } from "./rig";
import { supportsWebGL } from "./quality";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const PHASE_NAMES = ["A", "B", "C", "D", "E"] as const;
const PHASE_STARTS = [PHASES.A, PHASES.B, PHASES.C, PHASES.D, PHASES.E];

type Props = {
  dict: Dictionary;
  children: ReactNode;
};

export default function HeroSection({ dict, children }: Props) {
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneLayerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => setWebgl(supportsWebGL()), []);

  useEffect(() => {
    screenSource.el = contentRef.current;
    return () => {
      screenSource.el = null;
    };
  }, []);

  // Render döngüsü: hero görünmüyorsa, sekme gizliyse ya da devir bittiyse durur.
  useEffect(() => {
    const stage = pinRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(stage);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useGSAP(
    () => {
      if (reduced === null) return;
      if (reduced) {
        resetRig(REDUCED_MOTION_RIG);
        return;
      }
      resetRig();

      const reached = new Set<string>();
      // Varış sinyali (üst bölüm canlanır): sona gelince bir kez; kullanıcı
      // 0.999 civarında ileri-geri oynadıkça tekrar etmesin diye yalnızca
      // 0.9'un altına inince yeniden kurulur.
      let armed = true;
      const arrive = () => {
        armed = false;
        // Bayrak: sayfa hero'nun altında açılırsa (yenileme, geri gelme) üst
        // bölüm mount olurken de varışı bilsin; olay kaçırılmış olabilir.
        document.documentElement.dataset.heroArrived = "1";
        window.dispatchEvent(new Event("hero:arrived"));
      };
      const tl = gsap.timeline({
        defaults: { ease: "none", immediateRender: false },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${spacerRef.current?.offsetHeight ?? window.innerHeight * 4}`,
          pin: true,
          pinSpacing: false,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Sayfa doğrudan pin'in ötesinde açılırsa onUpdate hiç tetiklenmeyebilir.
          onRefresh: (self) => {
            if (armed && self.progress >= 0.999) arrive();
          },
          onUpdate: (self) => {
            setFinished(self.progress >= 0.999);
            if (armed && self.progress >= 0.999) {
              arrive();
            } else if (!armed && self.progress < 0.9) {
              armed = true;
            }
            for (let i = 0; i < PHASE_STARTS.length; i++) {
              const name = PHASE_NAMES[i];
              if (self.progress >= PHASE_STARTS[i] && !reached.has(name)) {
                reached.add(name);
                track("hero_phase_reached", { phase: name });
              }
            }
          },
        },
      });

      // Timeline süresi 1 birim; konumlar doğrudan p değeridir (DESIGN.md §7).
      // Ham ilerleme de scrub'lı olarak rig'e akar.
      tl.fromTo(rig, { progress: 0 }, { progress: 1, duration: 1 }, 0);
      tl.fromTo(titleRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: -40, ease: "power2.in", duration: 0.1 }, 0);
      tl.fromTo(hintRef.current, { opacity: 1 }, { opacity: 0, duration: 0.03 }, 0);
      tl.fromTo(rig, { focusMix: 0 }, { focusMix: 1, ease: "power2.out", duration: 0.12 }, 0.1);
      tl.fromTo(rig, { laptopRotY: 0 }, { laptopRotY: Math.PI, ease: "power2.inOut", duration: 0.33 }, 0.12);
      tl.fromTo(rig, { laptopLift: 0 }, { laptopLift: 0.22, ease: "sine.out", duration: 0.16 }, 0.12);
      tl.fromTo(rig, { laptopLift: 0.22 }, { laptopLift: 0, ease: "sine.in", duration: 0.17 }, 0.28);
      tl.fromTo(rig, { crowdSpread: 0 }, { crowdSpread: 1, ease: "power1.inOut", duration: 0.3 }, 0.15);
      tl.fromTo(rig, { screenOn: 0 }, { screenOn: 1, ease: "power1.out", duration: 0.18 }, 0.3);
      tl.fromTo(rig, { camT: 0 }, { camT: 1, ease: "power3.inOut", duration: 0.3 }, 0.6);
      tl.fromTo(rig, { lidAngle: 105 }, { lidAngle: 90, ease: "power2.inOut", duration: 0.2 }, 0.6);
      tl.fromTo(rig, { crowdDim: 0 }, { crowdDim: 1, ease: "power1.in", duration: 0.23 }, 0.62);
      tl.fromTo(rig, { handoff: 0 }, { handoff: 1, ease: "power1.inOut", duration: 0.1 }, 0.9);
      tl.fromTo(sceneLayerRef.current, { opacity: 1 }, { opacity: 0, ease: "power1.inOut", duration: 0.1 }, 0.9);

      triggerRef.current = tl.scrollTrigger ?? null;

      // Geliştirme: ?heroP=0.5 sekansın o noktasına atlar (ekran görüntüsü /
      // poster üretimi için).
      if (process.env.NODE_ENV !== "production") {
        const p = Number(new URLSearchParams(window.location.search).get("heroP"));
        const st = tl.scrollTrigger;
        if (p > 0 && st) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "instant" as ScrollBehavior });
            ScrollTrigger.update();
            st.getTween()?.progress(1);
          });
        }
      }

      // Bento'lar yüklenip blok yüksekliği değişince pin ölçüleri tazelenir.
      // Yalnızca yükseklik gerçekten değişince; sürekli reflow eden bir
      // bento pin sırasında her 150 ms'de refresh tetiklemesin.
      let timer = 0;
      let lastHeight = contentRef.current?.offsetHeight ?? 0;
      const ro = new ResizeObserver(([entry]) => {
        const h = entry.contentRect.height;
        if (Math.abs(h - lastHeight) < 1) return;
        lastHeight = h;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      if (contentRef.current) ro.observe(contentRef.current);

      return () => {
        ro.disconnect();
        window.clearTimeout(timer);
        triggerRef.current = null;
        resetRig();
      };
    },
    { scope: pinRef, dependencies: [reduced] }
  );

  // Sekansı atlayıp içeriğe iner (skip link ve klavye odağı için).
  const jumpToContent = useCallback(() => {
    const st = triggerRef.current;
    if (!st || st.progress >= 0.999) return false;
    window.scrollTo({ top: st.end, behavior: "instant" as ScrollBehavior });
    ScrollTrigger.update();
    st.getTween()?.progress(1);
    return true;
  }, []);

  useEffect(() => {
    // Layout'taki "skip to content" bağlantısı #main-content'e gider; o
    // eleman pin'in başında olduğundan sekansı atlayıp içeriğe indiririz.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href="#main-content"]');
      if (!link || !jumpToContent()) return;
      e.preventDefault();
      contentRef.current?.focus({ preventScroll: true });
    };
    // Klavyeyle canvas altındaki bir bağlantıya gelinirse içerik açığa çıkar.
    const content = contentRef.current;
    const onFocusIn = () => {
      const st = triggerRef.current;
      if (st && st.progress < 0.9) jumpToContent();
    };
    document.addEventListener("click", onClick);
    content?.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("click", onClick);
      content?.removeEventListener("focusin", onFocusIn);
    };
  }, [jumpToContent]);

  const still = reduced === true;
  const showCanvas = webgl === true && !failed && reduced !== null;
  const canvasActive = inView && tabVisible && !finished;

  return (
    <>
      {/* flow-root: Header'ın üst margin'i bloğun dışına taşmasın; aksi halde
          pin başladığında (position: fixed) içerik 16px sıçrardı. */}
      <div ref={pinRef} className="relative flow-root">
        <div
          data-hero-stage=""
          className={`absolute inset-x-0 top-0 z-20 h-[100svh] overflow-hidden isolate motion-reduce:relative ${
            finished ? "invisible" : ""
          }`}
        >
          <div ref={sceneLayerRef} className="absolute inset-0 bg-[#050505]" aria-hidden="true">
            {/* Poster: canvas hazır olana kadar ve WebGL yoksa görünür. */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/hero/poster.webp)" }}
            />
            {showCanvas && (
              <div
                className="absolute inset-0 transition-opacity ease-out"
                style={{ opacity: ready ? 1 : 0, transitionDuration: "400ms" }}
              >
                <HeroCanvas
                  active={canvasActive}
                  still={still}
                  onReady={() => setReady(true)}
                  onFail={() => setFailed(true)}
                />
              </div>
            )}
            {/* Vinyet + başlığın okunması için alttan koyulaşma */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%), linear-gradient(to top, rgba(0,0,0,0.75), transparent 38%)",
              }}
            />
          </div>

          <div className="relative flex h-full flex-col justify-start px-5 pt-24 md:px-12 xl:justify-end xl:pb-14 xl:pt-0">
            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div ref={titleRef} className="max-w-xl">
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  {dict.hero.name}
                  <span className="sr-only">{dict.hero.h1Suffix}</span>
                </h1>
                <motion.p
                  className="mt-2 text-lg font-light text-white/80 md:mt-3 md:text-2xl"
                  initial={{ y: 16, opacity: 0.4 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {dict.stack.headlineLead} <span className="text-[#DFFF1F]">{dict.stack.headlineAccent}</span>
                </motion.p>
              </div>
            </motion.div>
          </div>

          <div
            ref={hintRef}
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-white/70 motion-reduce:hidden md:bottom-8"
            aria-hidden="true"
          >
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-[#DFFF1F]"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {dict.hero.scrollHint}
          </div>
        </div>

        <div ref={contentRef} tabIndex={-1} className="outline-none">
          {children}
        </div>
      </div>

      <div
        ref={spacerRef}
        data-hero-spacer=""
        aria-hidden="true"
        className="h-[320svh] md:h-[400svh] motion-reduce:hidden"
      />
      <noscript>
        <style>{`[data-hero-spacer]{display:none}[data-hero-stage]{position:relative}`}</style>
      </noscript>
    </>
  );
}
