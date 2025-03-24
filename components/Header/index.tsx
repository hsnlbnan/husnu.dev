"use client";

import React, { useState, useEffect } from "react";
import AnimatedShinyText from "../ui/animated-shiny-text";
import Tooltip from "../Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import { ResumeIcon } from "@/icons";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Add the keyframes style at the top of the file
const heartbeatKeyframes = {
  "0%": { transform: "scale(1)" },
  "25%": { transform: "scale(1.1)" },
  "40%": { transform: "scale(1)" },
  "60%": { transform: "scale(1.1)" },
  "100%": { transform: "scale(1)" }
};

// Keyframes tanımlaması
const floatingHeartsVariants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 0.5,
    x: 0
  },
  animate: {
    opacity: [0, 1, 0],
    y: [-2, -30],  // Biraz daha yükseğe çıksın
    scale: [0.5, 0.8, 0.5],
    x: [-5, 5, -2],
    transition: {
      duration: 1.5,  // Biraz daha hızlı
      ease: [0.76, 0, 0.24, 1],
    }
  }
};

const Header = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);

  const handleToggleBox = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: { brandColor: "#000000" },
        },
      });
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const delay = Math.random() * 100;

      setTimeout(() => {
        setHearts(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, Date.now()];
        });
      }, delay);

    }, 800);

    return () => clearInterval(interval);
  }, []);

  function handleDownloadResume() {
    window.open("/Husnu-Lubnan-CV.pdf");
  }

  const { push } = useRouter();
  function handleLikeClick() {
    push("/liked");
  }

  return (
    <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 md:gap-0 md:mx-auto my-4 p-4 rounded-lg w-full lg:container">
      <div className="flex flex-col -gap-1">
        <h1 className="font-light text-2xl text-white">
          Hüsnü <span className="font-medium text-[#dfff1f]">Lübnan</span>
        </h1>
        <div className="flex flex-row gap-4">
          <p className="text-gray-400 text-sm">Frontend Developer</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between md:justify-start">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-row items-center gap-2 group relative cursor-pointer bg-[#2d2d2d] border-none rounded-lg py-1.5 px-3 hover:bg-[#3d3d3d]"
          onClick={handleLikeClick}
          type="button"
          aria-label={"Liked"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiHeart
                className="text-sm transition-all duration-300 text-[#dfff1f]"
              />
            </motion.div>

            <AnimatePresence>
              {hearts.map((id) => (
                <motion.div
                  key={id}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  variants={floatingHeartsVariants}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${Math.random() * 30 - 15}px`,
                    top: 0
                  }}
                >
                  <FiHeart
                    className="text-xs fill-[#dfff1f] text-[#dfff1f] opacity-70"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <span className="text-white text-sm">
            Liked
          </span>
        </motion.button>
        <motion.div
          className="relative group"
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleDownloadResume}
        >
          <div className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer">
            <div className="flex flex-row items-center gap-4">
              {/*  <span className="bg-[#dfff1f] rounded-full w-2 h-2 animate-pulse"></span> */}
              <ResumeIcon className="h-4 group-hover:animate-draw" />
              <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
                <p className="text-[#fff] text-sm">CV</p>
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer"
            onClick={handleToggleBox}
          >
            <div className="flex flex-row items-center gap-4">
              <span className="bg-[#dfff1f] rounded-full w-2 h-2 animate-pulse"></span>
              <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
                <p className="text-[#fff] text-sm">Freelance Status</p>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
