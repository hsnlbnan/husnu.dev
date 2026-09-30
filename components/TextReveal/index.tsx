"use client";

import { FC, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
  /** Erişilebilir başlık seviyesi. Varsayılan h2. */
  as?: "h2" | "h3" | "p";
}

const ACCENT_WORDS = ["Projects", "action."];

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
  as: As = "h2",
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[50vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50vh] max-w-5xl items-center justify-center px-4">
        {/* Metnin DOM'daki TEK kopyası ve aynı zamanda bölümün başlığı.
            Eskiden her kelime iki kez basılıyordu (hayalet + parlak katman),
            bu da server HTML'inde "Projects Projects I I took took..." gibi
            bozuk metin üretiyor ve ekran okuyucuda her kelime iki kez
            okunuyordu. */}
        <As className="flex flex-wrap justify-center text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.3] md:leading-[1.2] tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            const isAccent = ACCENT_WORDS.includes(word);
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                isAccent={isAccent}
              >
                {word}
              </Word>
            );
          })}
        </As>
      </div>
    </div>
  );
};

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  isAccent: boolean;
}

const Word: FC<WordProps> = ({ children, progress, range, isAccent }) => {
  // Tek metin düğümü: eskiden "hayalet" ve "parlak" olmak üzere iki ayrı span
  // aynı kelimeyi basıyordu, bu da HTML'de "Projects Projects I I took took..."
  // şeklinde bozuk metin üretiyordu. Aynı reveal efekti tek span üzerinde
  // renk geçişiyle elde ediliyor.
  // Başlangıç ("hayalet") rengi bilinçli olarak 0.06 yerine 0.45 alfa:
  // 0.06'da kontrast 1.06:1 idi ve metin okunamıyordu. 0.45, siyah zeminde
  // büyük metin için gereken 3:1 eşiğini rahatça geçerken (≈4.3:1) sönük →
  // parlak reveal hissini koruyor.
  const ghost = isAccent ? "rgba(223,255,31,0.45)" : "rgba(255,255,255,0.45)";
  const solid = isAccent ? "rgb(223,255,31)" : "rgb(255,255,255)";

  const color = useTransform(progress, range, [ghost, solid]);
  const y = useTransform(progress, range, [16, 0]);

  return (
    <motion.span
      style={{ color, y }}
      className={cn(
        "mt-1 mb-1 md:mt-2 md:mb-2 mx-[0.2em] lg:mx-[0.25em] inline-block",
        isAccent && "drop-shadow-[0_0_20px_rgba(223,255,31,0.15)]",
      )}
    >
      {children}
    </motion.span>
  );
};

export default TextRevealByWord;
