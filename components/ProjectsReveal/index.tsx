"use client";

// "Projects I took part in action." — hero'daki seyircilerin devamı.
//
// Başlıktaki her "o" harfi imleci izleyen bir göze dönüşür; kelimeler scroll
// ile maskelerinin içinden yükselir, son kelimenin arkasından lime bir
// fosforlu kalem geçer. Bölüm geçildiğinde gözler aşağıya, proje kartlarına
// bakar.
//
// Metin DOM'da tek kopya ve gerçek bir h2: gözler "o" harfinin şeffaf
// yapılmış hâlinin üstüne çizilen aria-hidden süslerdir, bu yüzden
// textContent, crawler'lar ve ekran okuyucular için başlık değişmez.
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, type FC } from "react";

type Props = {
  eyebrow: string;
  text: string;
  hint: string;
};

const IDLE_AFTER = 3000; // ms; sonrasında gözler kendi kendine gezinir

export default function ProjectsReveal({ eyebrow, text, hint }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const eyesRef = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  // İlerleme başlığın kendisine bağlı: başlık ekranın altından girerken
  // başlar, üst üçte bire geldiğinde tüm kelimeler yerinde olur.
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.95", "start 0.38"],
  });

  const words = text.split(" ");
  const last = words.length - 1;
  // "o" harflerini sıralı indeksleyip her göze kendi kırpma ritmini ver.
  let eyeIndex = 0;

  // Göz bebekleri: tek rAF döngüsü, yalnızca bölüm görünürken çalışır.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const pointer = { x: 0, y: 0, last: -Infinity, touch: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.last = performance.now();
      pointer.touch = e.pointerType !== "mouse";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });

    let raf = 0;
    let visible = false;
    const current = new Map<HTMLSpanElement, { x: number; y: number }>();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const t = now / 1000;
      const active = now - pointer.last < (pointer.touch ? 2500 : IDLE_AFTER);
      // Başlık ekranın üstüne yaklaşınca gözler aşağıya, projelere bakar.
      const lookDown = (headingRef.current?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * 0.18;

      for (const eye of eyesRef.current) {
        if (!eye) continue;
        const pupil = eye.firstElementChild as HTMLElement | null;
        if (!pupil) continue;
        const r = eye.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const max = r.width * 0.26;

        let tx: number;
        let ty: number;
        if (lookDown) {
          tx = 0;
          ty = max;
        } else if (active) {
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 240) * max;
          tx = (dx / d) * k;
          ty = (dy / d) * k;
        } else {
          // Boştayken gözler birlikte, yavaşça etrafa bakınır.
          tx = Math.sin(t * 0.7) * max * 0.8;
          ty = Math.sin(t * 1.1) * max * 0.45;
        }

        const c = current.get(eye) ?? { x: 0, y: 0 };
        c.x += (tx - c.x) * 0.18;
        c.y += (ty - c.y) * 0.18;
        current.set(eye, c);
        pupil.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px)`;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [reduced]);

  return (
    <div
      ref={sectionRef}
      className="relative z-10 -mx-4 flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-black px-4 py-24 md:mx-0 md:min-h-[90vh] md:rounded-lg"
    >
      {/* Arka plan: ince lime çizgiler ve hafif hale */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfff1f]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#dfff1f]/20 to-transparent" />
        <div
          className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #dfff1f 0%, transparent 65%)" }}
        />
      </div>

      <span className="relative mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[#dfff1f]/80">
        {eyebrow}
      </span>

      <h2 ref={headingRef} className="relative mx-auto max-w-6xl text-center text-[13vw] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[8vw] xl:text-[7.25rem]">
        {words.map((word, i) => {
          const start = (i / words.length) * 0.7;
          const end = start + 0.3;
          const isLast = i === last;
          return (
            <span key={i}>
              <MaskedWord progress={scrollYProgress} range={[start, end]} still={!!reduced}>
                {isLast ? (
                  <Highlight progress={scrollYProgress} still={!!reduced}>
                    {renderLetters(word, eyesRef, () => eyeIndex++)}
                  </Highlight>
                ) : (
                  renderLetters(word, eyesRef, () => eyeIndex++)
                )}
              </MaskedWord>
              {i < last ? " " : null}
            </span>
          );
        })}
      </h2>

      <div className="relative mt-12 flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-8 bg-white/10" />
        <span className="font-mono text-[10px] tracking-wider text-white/70">{hint}</span>
        <span className="h-px w-8 bg-white/10" />
      </div>
    </div>
  );
}

function renderLetters(
  word: string,
  eyesRef: React.MutableRefObject<HTMLSpanElement[]>,
  nextIndex: () => number
) {
  const parts: React.ReactNode[] = [];
  let buffer = "";
  Array.from(word).forEach((ch, i) => {
    if (ch === "o") {
      if (buffer) parts.push(buffer);
      buffer = "";
      const index = nextIndex();
      parts.push(<Eye key={i} index={index} eyesRef={eyesRef} />);
    } else {
      buffer += ch;
    }
  });
  if (buffer) parts.push(buffer);
  return parts;
}

const Eye: FC<{ index: number; eyesRef: React.MutableRefObject<HTMLSpanElement[]> }> = ({ index, eyesRef }) => (
  <span className="relative inline-block">
    {/* Harf yerinde kalır (şeffaf), göz onun üstüne çizilir. */}
    <span className="text-transparent">o</span>
    <motion.span
      aria-hidden="true"
      // Framer inline transform yazdığı için merkezleme translate ile değil
      // inset + margin ile yapılır. Göz "o"nun x-yüksekliği ortasında durur.
      className="absolute inset-x-0 top-[calc(56%-0.25em)] mx-auto block h-[0.5em] w-[0.5em] rounded-full bg-white shadow-[inset_0_-0.05em_0_rgba(0,0,0,0.18)]"
      animate={{ scaleY: [1, 1, 0.08, 1] }}
      transition={{
        duration: 3.4 + (index % 3) * 1.3,
        times: [0, 0.94, 0.97, 1],
        repeat: Infinity,
        delay: index * 0.37,
        ease: "easeInOut",
      }}
    >
      <span
        ref={(el) => {
          if (el) eyesRef.current[index] = el;
        }}
        className="relative block h-full w-full"
      >
        <span className="absolute inset-0 m-auto block h-[46%] w-[46%] rounded-full bg-black">
          <span className="absolute right-[22%] top-[20%] block aspect-square w-[28%] rounded-full bg-white/90" />
        </span>
      </span>
    </motion.span>
  </span>
);

const MaskedWord: FC<{
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}> = ({ children, progress, range, still }) => {
  const y = useTransform(progress, range, ["110%", "0%"]);
  const rotate = useTransform(progress, range, [8, 0]);
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    // Maske: kelime kendi satır kutusunun altından yükselir.
    <span className="inline-block overflow-hidden px-[0.04em] pb-[0.1em] align-bottom -mb-[0.1em]">
      <motion.span
        className="inline-block origin-bottom-left"
        style={still ? undefined : { y, rotate, opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
};

const Highlight: FC<{ children: React.ReactNode; progress: MotionValue<number>; still: boolean }> = ({
  children,
  progress,
  still,
}) => {
  const scaleX = useTransform(progress, [0.72, 0.92], [0, 1]);
  const color = useTransform(progress, [0.8, 0.9], ["#dfff1f", "#0a0a0a"]);
  return (
    <span className="relative inline-block px-[0.08em]">
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.08em] top-[0.14em] -skew-x-6 rounded-[0.08em] bg-[#dfff1f]"
        style={{ scaleX: still ? 1 : scaleX, originX: 0 }}
      />
      <motion.span className="relative" style={{ color: still ? "#0a0a0a" : color }}>
        {children}
      </motion.span>
    </span>
  );
};
