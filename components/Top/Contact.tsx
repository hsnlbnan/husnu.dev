"use client";

// İletişim kartı — iOS "Contact Poster" dilinde.
//
// Kesit fotoğraf (macOS Vision ile yerelde arka planı ayrıldı) büyük adın
// ÖNÜNDE durur: ad başın arkasından geçer (iOS 17 poster derinlik efekti).
// Üstüne gelince renklenir ve imleçle hafifçe kayar. Tek aksiyon: görüşme.
// ◧ inspector'ı butonu tasarım sistemi dokümanı gibi durumlarına ayırır;
// gerçek butonun gerçek bir yükleme durumu var (Cal.com ilk tıklamada yüklenir).
import Image from "next/image";
import { animate, AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import type { Dictionary } from "@/i18n/dictionaries";
import { openCalBooking } from "@/lib/cal";
import { FOCUS, LocalTime, Tile, useInspect } from "./ui";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/husnulubnan/", Icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com/hsnlbnan", Icon: FaGithub },
  { label: "X", href: "https://x.com/hsnlbnan", Icon: FaXTwitter },
  { label: "Instagram", href: "https://www.instagram.com/hsnlbnan/", Icon: FaInstagram },
];

type State = "default" | "hover" | "pressed" | "focus" | "loading" | "disabled";

function Spinner() {
  return <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black" />;
}

function CallFace({ state, label }: { state: State; label: ReactNode }) {
  const bg = state === "hover" ? "bg-[#e8ff5c]" : state === "disabled" ? "bg-white/10" : "bg-[#dfff1f]";
  return (
    <span
      className={`flex h-9 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-medium transition-[background-color,transform] duration-200 ${bg} ${
        state === "disabled" ? "text-white/35" : "text-black"
      } ${state === "pressed" ? "scale-[0.97]" : ""} ${state === "focus" ? "ring-2 ring-[#dfff1f]/70 ring-offset-2 ring-offset-black" : ""}`}
    >
      {state === "loading" ? <Spinner /> : label}
    </span>
  );
}

export default function Contact({ en, dict }: { en: boolean; dict: Dictionary }) {
  const reduced = useReducedMotion();
  const { on: spec } = useInspect();
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const label = dict.top.bookCall;

  // İmleçle hafif paralaks: portre ve ad zıt yönlere kayar → derinlik.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const px = useTransform(sx, (v) => v * 8);
  const py = useTransform(sy, (v) => v * 6);
  const nx = useTransform(sx, (v) => v * -5);

  // Çizimden fotoğrafa: 0 = çizim, 1 = fotoğraf.
  const reveal = useMotionValue(0);
  const photoClip = useMotionTemplate`inset(${useTransform(reveal, (r) => (1 - r) * 100)}% 0% 0% 0%)`;
  const heatBottom = useTransform(reveal, (r) => `${r * 100}%`);
  const heatOpacity = useTransform(reveal, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  useEffect(() => {
    if (reduced) {
      reveal.set(hover ? 1 : 0);
      return;
    }
    const c = animate(reveal, hover ? 1 : 0, { duration: hover ? 0.9 : 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [hover, reduced, reveal]);

  const book = async () => {
    setLoading(true);
    try {
      await openCalBooking();
    } finally {
      setLoading(false);
    }
  };

  const states: State[] = ["default", "hover", "pressed", "focus", "loading", "disabled"];

  return (
    <Tile className="lg:col-span-4">
      <div
        className="relative h-full min-h-[340px] overflow-hidden"
        onMouseMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          mx.set(0);
          my.set(0);
        }}
      >
        {/* Başın arkasındaki hale */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(55% 45% at 62% 45%, rgba(223,255,31,0.16) 0%, transparent 70%)" }}
        />

        {/* Ad: portrenin ARKASINDA (poster derinliği) */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-5 top-[3.4rem] select-none text-[clamp(64px,7vw,112px)] font-semibold leading-[0.85] tracking-[-0.05em] text-white/90"
          style={{ x: nx }}
        >
          Hüsnü
        </motion.div>

        {/* Portre: adın önünde. Varsayılan hâli çizim (lime, "mavi kopya");
            üstüne gelince ısı çizgisi alttan yukarı geçer ve gerçek fotoğraf açılır. */}
        <motion.div className="absolute -bottom-2 right-[-6%] h-[88%] w-[82%]" style={{ x: px, y: py }}>
          {/* Silüet dolgusu: çizim modunda da ad başın ARKASINDA kalsın. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0f0f10]"
            style={{
              WebkitMaskImage: "url(/me-cutout.webp)",
              maskImage: "url(/me-cutout.webp)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "bottom",
              maskPosition: "bottom",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
          <Image src="/me-sketch.webp" alt="" fill sizes="360px" className="object-contain object-bottom" />
          <motion.div className="absolute inset-0" style={{ clipPath: photoClip }}>
            <Image src="/me-cutout.webp" alt="Hüsnü Lübnan" fill sizes="360px" className="object-contain object-bottom" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              opacity: heatOpacity,
              WebkitMaskImage: "url(/me-cutout.webp)",
              maskImage: "url(/me-cutout.webp)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "bottom",
              maskPosition: "bottom",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <motion.div
              className="absolute inset-x-0 h-16 translate-y-1/2"
              style={{
                bottom: heatBottom,
                background:
                  "linear-gradient(to top, transparent, rgba(255,138,61,0.5) 46%, rgba(255,210,140,0.95) 50%, rgba(255,138,61,0.5) 54%, transparent)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Üst: saat (cam) + inspector */}
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
          <LocalTime en={en} />
        </div>

        {/* Alt: aksiyonlar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f0f10] via-[#0f0f10]/85 to-transparent px-4 pb-4 pt-16">
          <AnimatePresence mode="wait" initial={false}>
            {spec ? (
              <motion.div
                key="spec"
                aria-hidden="true"
                className="grid grid-cols-3 gap-x-2 gap-y-2.5 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {states.map((s, i) => (
                  <motion.div
                    key={s}
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <CallFace state={s} label={dict.top.bookShort} />
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/40">{s}</span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <motion.button
                  type="button"
                  onClick={book}
                  disabled={loading}
                  aria-busy={loading}
                  whileTap={{ scale: 0.97 }}
                  className={`${FOCUS} group rounded-full`}
                >
                  <span className="block [&>span]:group-hover:bg-[#e8ff5c]">
                    <CallFace state={loading ? "loading" : "default"} label={label} />
                  </span>
                </motion.button>
                <a
                  href="/Husnu-Lubnan-CV.pdf"
                  target="_blank"
                  className={`${FOCUS} flex h-9 items-center rounded-full border border-white/15 bg-black/30 px-3.5 text-[13px] text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white`}
                >
                  {dict.header.cv}
                </a>
                <ul className="ml-auto flex">
                  {SOCIALS.map(({ label: l, href, Icon }) => (
                    <li key={l}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l}
                        className={`${FOCUS} flex h-9 w-8 items-center justify-center rounded-lg text-white/55 transition-[color,transform] duration-200 hover:text-white active:scale-90`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Tile>
  );
}
