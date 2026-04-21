"use client";

import { FC, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

const ACCENT_WORDS = ["Projects", "action."];

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
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
        <p className="flex flex-wrap justify-center text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.3] md:leading-[1.2] tracking-tight">
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
        </p>
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
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [16, 0]);

  return (
    <span className="relative mt-1 mb-1 md:mt-2 md:mb-2 mx-[0.2em] lg:mx-[0.25em] inline-block">
      <span
        className={cn(
          "select-none",
          isAccent ? "text-[#dfff1f]/[0.08]" : "text-white/[0.06]",
        )}
      >
        {children}
      </span>
      <motion.span
        style={{ opacity, y }}
        className={cn(
          "absolute inset-0",
          isAccent
            ? "text-[#dfff1f] drop-shadow-[0_0_20px_rgba(223,255,31,0.15)]"
            : "text-white",
        )}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextRevealByWord;
