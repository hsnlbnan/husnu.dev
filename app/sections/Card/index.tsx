"use client";

import Image from "next/image";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Safari from "@/components/ui/safari";
import { LinkIcon } from "@/icons";
import Link from "next/link";

type CardProps = {
  i: number;
  title: string;
  description: string;
  src: string;
  link: string;
  subtitle: string;
  color: string;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
  company: string;
};

const Card = ({
  i,
  title,
  description,
  src,
  link,
  subtitle,
  color,
  progress,
  range,
  targetScale,
  company,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={container}
      className="top-0 sticky flex justify-center items-center h-screen"
    >
      <motion.article
        style={{
          backgroundColor: 'rgb(20, 20, 20)',
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex flex-col mx-auto p-[50px] rounded-[25px] w-full lg:container h-[calc(100dvh-200px)] md:h-[500px] origin-top"
        role="article"
        aria-labelledby={`project-title-${i}`}
        tabIndex={0}
      >
        <div className="flex md:flex-row flex-col gap-[10px] md:gap-[50px] mt-[30px] h-full text-white">
          <div className="relative top-[0] w-full md:w-[40%]">
            <h2 
              id={`project-title-${i}`}
              className="m-0 text-[#dfff1f] text-[32px] text-start"
            >
              {title}
              {company && (
                <span className="text-light text-sm text-white my-1 md:mt-0 block md:inline">
                  @{company}
                </span>
              )}
            </h2>
            <h5 className="m-0 text-[#d2d2d2] text-[11px] text-start md:text-[14px]">
              {subtitle}
            </h5>
            <div className="text-[16px]">
              <span className="block my-1 md:my-3 text-gray-400 text-md">
                used techs
              </span>
            </div>
            <ul 
              className="flex flex-row md:flex-col flex-wrap gap-2 list-disc list-inside"
              aria-label="Technologies used"
            >
              {description.split(",").map((item, i) => (
                <li key={i} className="text-gray-100 text-xs md:text-sm">
                  {item.trim()}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={link || "#"}
            target="_blank"
            className="relative p-0 rounded-[25px] w-full md:w-[60%] h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#dfff1f] focus:ring-offset-2 focus:ring-offset-[#1e1e1e]"
            aria-label={`Visit ${title} project${link ? '' : ' (link not available)'}`}
            rel="noopener noreferrer"
            tabIndex={0}
            onClick={(e) => {
              if (!link) {
                e.preventDefault();
              }
            }}
          >
            <motion.div
              className="relative p-0 rounded-[25px] w-[100%] h-full overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ scale: imageScale }}
              >
                <Safari
                  url="husnu.dev"
                  className="object-cover size-full"
                  src={src}
                  alt={`Screenshot of ${title} project`}
                />
                <motion.div
                  className="top-0 left-0 absolute flex justify-center items-center bg-[#1e1e1e] w-full h-full filter filter-hue-rotate-180"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: isHovered ? 0.5 : 0,
                    y: isHovered ? 0 : -20,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : -10,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    aria-hidden="true"
                  >
                    <LinkIcon className="w-10 h-10 text-white fill-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </motion.article>
    </div>
  );
};

export default Card;
