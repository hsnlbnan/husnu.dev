"use client";

import { cn } from "@/lib/utilts";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

interface WavyTextProps {
  word: string;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
}

const WavyText = ({
  word,
  className,
  variant,
  duration = 0.5,
  delay = 0.05,
}: WavyTextProps) => {
  const defaultVariants = {
    hidden: { y: 10 },
    visible: { y: -10 },
  };
  const combinedVariants = variant || defaultVariants;
  const characters = useMemo(() => word.split(""), [word]);
  return (
    <div className="p-2 overflow-hidden">
      <div className="flex justify-center space-x-2">
        <AnimatePresence>
          {characters.map((char, i) => (
            <motion.h3
              key={i}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={combinedVariants}
              transition={{
                yoyo: Infinity,
                duration: duration,
                delay: i * delay,
              }}
              className={cn(
                className,
                (i === 0 || i === 1 || i === 2 || i === 3 || i === 4) &&
                  "!font-light",
                "font-display text-center text-xl font-bold tracking-[-0.3em] md:text-3xl"
              )}
            >
              {char}
            </motion.h3>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WavyText;
