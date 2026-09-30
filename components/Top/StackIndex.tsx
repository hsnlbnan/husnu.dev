"use client";

// Stack index: yığının TAMAMI, düz metin. İK ekipleri ⌘F ile arar, arama
// motorları görünür metni okur; üstteki cümle insan için, bu dizin tarama için.
// Bir teknolojinin üstüne gelince kullanıldığı projeler çıkar.
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { STACK_ITEMS } from "@/data/stack";
import { ON_THIS_SITE, projectsUsing } from "./data";
import { EASE, FOCUS, Tile } from "./ui";

export default function StackIndex({ dict }: { dict: Dictionary }) {
  const t = dict.top;
  const [hover, setHover] = useState<string | null>(null);
  const used = hover ? projectsUsing(hover) : [];
  const total = STACK_ITEMS.reduce((n, c) => n + c.skills.length, 0);

  return (
    <Tile className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-white">
          {t.stackIndex} <span className="text-white/35 tabular-nums">· {total}</span>
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {t.recruiterNote}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-7">
        {STACK_ITEMS.map((c) => (
          <div key={c.category}>
            <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{c.category}</h4>
            <ul className="flex flex-col gap-1">
              {c.skills.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s)}
                    onBlur={() => setHover(null)}
                    className={`${FOCUS} rounded-sm text-left text-[14px] transition-colors duration-150 ${
                      hover === s ? "text-[#dfff1f]" : hover ? "text-white/35" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex h-6 items-center border-t border-white/[0.06] pt-4 text-[13px] text-white/40" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={hover ?? "idle"}
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            {hover ? (
              <>
                <span className="text-white/60">{hover}</span>
                {used.map((p) => (
                  <span key={p.n} className="tabular-nums" style={{ color: p.accent }}>
                    {String(p.n).padStart(2, "0")} {p.title}
                  </span>
                ))}
                {ON_THIS_SITE.has(hover) && <span className="text-[#dfff1f]">↺ {t.thisPage}</span>}
              </>
            ) : (
              <>
                {/* Dokunmatik cihazda "üstüne gel" değil "dokun". */}
                <span className="hidden [@media(hover:hover)]:inline">{t.hoverHint}</span>
                <span className="[@media(hover:hover)]:hidden">{t.tapHint}</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tile>
  );
}
