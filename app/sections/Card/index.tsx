"use client";

import Image from "next/image";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Link from "next/link";

type CardProps = {
  i: number;
  title: string;
  description: string;
  src: string;
  link: string;
  subtitle: string;
  color: string;
  accent: string;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
  company: string;
};

const TechPill = ({
  name,
  accent,
  index,
}: {
  name: string;
  accent: string;
  index: number;
}) => (
  <motion.span
    className="relative px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 transition-all duration-300 hover:border-white/20 hover:text-white/80 cursor-default select-none"
    style={{
      transitionDelay: `${index * 30}ms`,
    }}
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    onMouseEnter={(e) => {
      (e.target as HTMLElement).style.borderColor = `${accent}40`;
      (e.target as HTMLElement).style.color = accent;
      (e.target as HTMLElement).style.boxShadow = `0 0 20px ${accent}15`;
    }}
    onMouseLeave={(e) => {
      (e.target as HTMLElement).style.borderColor = "";
      (e.target as HTMLElement).style.color = "";
      (e.target as HTMLElement).style.boxShadow = "";
    }}
  >
    {name}
  </motion.span>
);

const ProjectNumber = ({ number }: { number: number }) => (
  <span className="font-mono text-[64px] md:text-[80px] font-extralight text-white/[0.04] leading-none select-none">
    {String(number).padStart(2, "0")}
  </span>
);

const Card = ({
  i,
  title,
  description,
  src,
  link,
  subtitle,
  color,
  accent = "#dfff1f",
  progress,
  range,
  targetScale,
  company,
}: CardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);
  const imageY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const techs = useMemo(
    () => description.split(",").map((t) => t.trim()),
    [description],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={container}
      className="top-0 sticky flex justify-center items-center h-screen"
    >
      <motion.article
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex flex-col mx-auto rounded-[32px] w-full lg:container h-[calc(100dvh-200px)] md:h-[580px] overflow-hidden origin-top"
        role="article"
        aria-labelledby={`project-title-${i}`}
        tabIndex={0}
      >
        {/* Background with accent gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}08 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 80%, ${accent}05 0%, transparent 50%),
              rgb(14, 14, 14)
            `,
          }}
        />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Accent top border line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}40 30%, ${accent}80 50%, ${accent}40 70%, transparent 100%)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-6 md:p-10">
          {/* Header row */}
          <div className="flex flex-row items-start justify-between mb-6 md:mb-8">
            <div className="flex flex-row items-center gap-4 md:gap-6">
              {/* Project number */}
              <ProjectNumber number={i + 1} />

              <div className="flex flex-col">
                {/* Title */}
                <h2
                  id={`project-title-${i}`}
                  className="m-0 text-white text-2xl md:text-4xl font-semibold tracking-tight leading-tight"
                >
                  {title}
                </h2>

                {/* Company badge */}
                {company && (
                  <motion.div
                    className="mt-2 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <span className="text-[11px] md:text-[13px] font-mono uppercase tracking-[0.15em] text-white/30">
                      {company}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* External link indicator */}
            {link && (
              <motion.div
                className="flex items-center gap-2 text-white/20 hover:text-white/60 transition-colors duration-300 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <span className="hidden md:block text-[11px] font-mono uppercase tracking-wider">
                  View
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </motion.div>
            )}
          </div>

          {/* Body: Image + Info */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 flex-1 min-h-0">
            {/* Screenshot */}
            <Link
              href={link || "#"}
              target="_blank"
              className="relative rounded-2xl w-full md:w-[60%] h-[200px] md:h-full overflow-hidden group"
              aria-label={`Visit ${title} project${
                link ? "" : " (link not available)"
              }`}
              rel="noopener noreferrer"
              tabIndex={0}
              onClick={(e) => {
                if (!link) e.preventDefault();
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Image container */}
              <motion.div className="absolute inset-0" style={{ y: imageY }}>
                <motion.div
                  className="w-full h-full"
                  style={{ scale: imageScale }}
                >
                  <Image
                    src={src}
                    alt={`Screenshot of ${title} project`}
                    fill
                    className="object-cover object-top transition-all duration-700"
                    style={{
                      filter: isHovered ? "grayscale(0%)" : "grayscale(30%)",
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </motion.div>
              </motion.div>

              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${accent}15 0%, transparent 70%)`,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Hover overlay with cursor-following effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: isHovered
                    ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, ${accent}15, transparent)`
                    : "transparent",
                  transition: "background 0.3s ease",
                }}
              >
                <motion.div
                  className="flex items-center gap-2 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[12px] font-mono uppercase tracking-wider">
                    {link ? "View Project" : "Case Study"}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0e0e0e] to-transparent pointer-events-none" />
            </Link>

            {/* Info panel */}
            <div className="flex flex-col justify-between w-full md:w-[40%] py-1">
              {/* Description */}
              <div className="flex flex-col gap-4">
                <p className="text-[13px] md:text-[15px] leading-[1.7] text-white/40 font-light">
                  {subtitle}
                </p>

                {/* Tech section */}
                <div className="flex flex-col gap-3 mt-2">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.2em]"
                    style={{ color: `${accent}60` }}
                  >
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech, techIndex) => (
                      <TechPill
                        key={tech}
                        name={tech}
                        accent={accent}
                        index={techIndex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Link */}
              {link && (
                <motion.div
                  className="mt-6 md:mt-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-[13px] font-mono uppercase tracking-wider text-white/30 hover:text-white transition-colors duration-300"
                  >
                    <span
                      className="w-8 h-[1px] transition-all duration-500 group-hover:w-12"
                      style={{ backgroundColor: `${accent}40` }}
                    />
                    <span className="transition-colors duration-300 group-hover:text-white">
                      Explore
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default Card;
