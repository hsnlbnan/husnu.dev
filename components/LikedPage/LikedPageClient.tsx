"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiEye, FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { likedComponents, type LikedComponent } from "@/data/likedComponents";

type ComponentCardProps = LikedComponent & {
  className?: string;
  index: number;
};

const LikedPageClient = () => {
  const reduce = useReducedMotion();
  // Decorative particles use random positions; render them only after mount so the
  // static (SSR) markup matches the first client render — no hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Title reveal: a soft blur-rise staggered per letter — smoother and more
  // cohesive than per-letter hand-tuned delays. Honors reduced motion.
  const titleContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
  };
  const titleItem = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { y: 28, opacity: 0, filter: "blur(8px)" },
        show: {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-hidden w-full">
      <div className="relative mb-4 md:mb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -top-0 -left-0 w-32 h-32 bg-[#dfff1f]/20 rounded-full blur-3xl"
        />

        <div className="relative flex flex-col items-start">
          <motion.div
            className="flex flex-wrap items-center overflow-hidden"
            variants={titleContainer}
            initial="hidden"
            animate="show"
          >
            {"Components".split("").map((letter, index) => (
              <motion.span
                key={`c-${index}`}
                variants={titleItem}
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white"
              >
                {letter}
              </motion.span>
            ))}

            <motion.span
              variants={titleItem}
              className="ml-3 md:ml-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#dfff1f]"
            >
              I
            </motion.span>

            {"Liked".split("").map((letter, index) => (
              <motion.span
                key={`l-${index}`}
                variants={titleItem}
                className={`${index === 0 ? "ml-4 md:ml-6 lg:ml-8" : ""} text-3xl md:text-4xl lg:text-5xl font-medium text-[#dfff1f]`}
              >
                {letter}
              </motion.span>
            ))}

            <motion.span
              variants={titleItem}
              className="ml-3 md:ml-4 flex items-center justify-center text-xs font-medium tabular-nums bg-[#dfff1f] text-black px-2 py-1 rounded-full"
            >
              {likedComponents.length}
            </motion.span>
          </motion.div>

          <motion.div
            className="h-[2px] w-full origin-left bg-gradient-to-r from-[#dfff1f]/20 via-[#dfff1f] to-[#dfff1f]/20 mt-2 md:mt-3"
            initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {mounted && !reduce && (
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-[#dfff1f]"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: Math.random() * 2 + 1, delay: Math.random() * 2, repeat: Infinity, repeatType: "loop" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-white text-xs md:text-sm mb-6 sm:mb-8 md:mb-12 max-w-full md:max-w-[600px] [text-wrap:pretty]"
      >
        These components were coded using React, Framer-Motion and Tailwind to learn how to make components that I like
        and see on sites like <span className="text-[#dfff1f]">Twitter(X), Behance, Dribbble, Figma.</span> Source
        codes are not shared out of <span className="text-[#dfff1f]">respect for designers.</span>
      </motion.p>

      <div className="grid grid-cols-1 xs:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-3 xs:gap-4 md:gap-6">
        <div className="col-span-full md:col-span-8 lg:col-span-8">
          <ComponentCard
            key={likedComponents[0].id}
            {...likedComponents[0]}
            index={0}
            className="col-span-10 xs:col-span-12 md:col-span-8 lg:col-span-8"
          />
        </div>
        <div className="col-span-full md:col-span-4 lg:col-span-4">
          <ComponentCard
            key={likedComponents[1].id}
            {...likedComponents[1]}
            index={1}
            className="col-span-10 xs:col-span-12 md:col-span-4 lg:col-span-4"
          />
        </div>

        {likedComponents.slice(2).map((component, index) => (
          <div key={component.id} className="col-span-full md:col-span-6 lg:col-span-6">
            <ComponentCard
              {...component}
              index={index + 2}
              className="col-span-10 xs:col-span-12 md:col-span-6 lg:col-span-6"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ComponentCard = ({
  id,
  title,
  description,
  tags = [],
  preview: PreviewComponent,
  inspired,
  className = "",
  index,
  isNew,
}: ComponentCardProps) => {
  const router = useRouter();

  const openPreview = () => {
    router.push(`/liked/preview/${id}#modal`, { scroll: false });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index, 6) * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover="hover"
        className={`group relative bg-[#2d2d2d] rounded-xl p-3 xs:p-4 md:p-5 box-border w-full ${className || ""}`}
      >
        <div
          className="relative h-36 xs:h-40 md:h-48 bg-[#1d1d1d] rounded-lg mb-3 xs:mb-4 md:mb-5 overflow-hidden"
          style={{ touchAction: "pan-y" }}
        >
          {/* On touch devices the on-card demo is a thumbnail only — interaction
              happens in the Preview modal (mobile has its own Preview button).
              Without pointer-events:none, draggable demos (Volume, Time Selector…)
              swallow the touch gesture and the page won't scroll past the card. */}
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none md:pointer-events-auto">
            {PreviewComponent && (
              <div className="w-full h-full flex items-center justify-center">
                <PreviewComponent />
              </div>
            )}
          </motion.div>

          <div className="hidden md:block">
            <motion.div
              className="z-10 absolute inset-0 -bottom-[1px] bg-gradient-to-b from-transparent to-[#1d1d1d]/80 pointer-events-none"
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
            />

            <motion.div
              className="z-20 absolute inset-0 flex items-center justify-center gap-3 xs:gap-4 md:gap-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
              variants={{ hover: { y: 0, opacity: 1 } }}
              initial={{ y: 20, opacity: 0 }}
            >
              <ActionButton icon={<FiEye />} label="Preview" onClick={openPreview} />

              {inspired && <ActionButton onClick={() => window.open(inspired, "_blank")} icon={<FiExternalLink />} label="Inspired" />}
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={{ hover: { y: -5 } }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-medium text-sm xs:text-base md:text-lg mb-1 md:mb-2 flex items-center gap-2">
            {title}
            {isNew && (
              <motion.div className="h-1 w-1 rounded-full bg-[#dfff1f]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            )}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mb-2 xs:mb-3 md:mb-4">{description}</p>

          <div className="flex md:hidden">
            <div className="z-20 flex items-center justify-center gap-3 xs:gap-4">
              <ActionButton icon={<FiEye />} label="" onClick={openPreview} animation={false} />

              {inspired && <ActionButton onClick={() => window.open(inspired, "_blank")} icon={<FiExternalLink />} label="" animation={false} />}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs px-2 py-0.5 md:px-3 md:py-1 bg-[#1d1d1d] text-gray-400 rounded-full hover:bg-[#dfff1f] hover:text-black transition-colors"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

const ActionButton = ({
  icon,
  label,
  onClick,
  animation = true,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  animation?: boolean;
}) => (
  <motion.button
    whileHover={animation ? { scale: 1.1 } : undefined}
    whileTap={animation ? { scale: 0.96 } : undefined}
    onClick={onClick}
    className="p-1.5 md:p-2 min-w-[40px] min-h-[40px] justify-center bg-[#dfff1f] rounded-lg text-black hover:bg-white transition-colors relative group flex items-center gap-2"
    aria-label={label}
    tabIndex={0}
  >
    {icon}
    <span
      className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-0.5 rounded text-white ${
        animation ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"
      } whitespace-nowrap`}
    >
      {label}
    </span>
  </motion.button>
);

export default LikedPageClient;
