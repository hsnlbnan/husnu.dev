"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

type Work = {
  title: string;
  subtitle: string;
  description: string;
  src: string;
  accent?: string;
};

const WorkCard = ({
  title,
  subtitle,
  description,
  src,
  accent = "#dfff1f",
}: Work) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect following cursor */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accent}08, transparent 40%)`,
        }}
      />

      {/* Main card */}
      <div className="relative flex flex-row items-center gap-4 md:gap-6 px-4 md:px-8 py-5 md:py-6 rounded-2xl transition-all duration-300 group-hover:bg-white/[0.02]">
        {/* Timeline dot + line */}
        <div className="relative flex flex-col items-center self-stretch">
          <div
            className="relative z-10 w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isHovered ? accent : "rgba(255,255,255,0.15)",
              boxShadow: isHovered ? `0 0 12px ${accent}60` : "none",
            }}
          />
          <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 to-transparent" />
        </div>

        {/* Company logo */}
        <div
          className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border transition-all duration-300"
          style={{
            borderColor: isHovered ? `${accent}40` : "rgba(255,255,255,0.06)",
            boxShadow: isHovered ? `0 0 20px ${accent}10` : "none",
          }}
        >
          <Image
            src={src}
            alt={`${title} logo`}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row md:items-center flex-1 gap-1 md:gap-0 min-w-0">
          {/* Company + Role */}
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-white text-base md:text-lg font-medium tracking-tight truncate">
              {title}
            </h3>
            <span
              className="text-[11px] md:text-[12px] font-mono uppercase tracking-[0.12em] transition-colors duration-300"
              style={{ color: isHovered ? accent : "rgba(255,255,255,0.3)" }}
            >
              {subtitle}
            </span>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 flex-shrink-0 mt-1 md:mt-0">
            <span className="hidden md:block w-6 h-[1px] bg-white/10" />
            <span className="text-[11px] md:text-[12px] font-mono text-white/25 tracking-wider whitespace-nowrap">
              {description}
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <motion.div
          className="flex-shrink-0 text-white/10 group-hover:text-white/30 transition-colors duration-300"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkCard;
