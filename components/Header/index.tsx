"use client";

import React, { useState, useEffect, useRef } from "react";
import AnimatedShinyText from "../ui/animated-shiny-text";
import Tooltip from "../Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import { ResumeIcon } from "@/icons";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Neon yeşil renk paleti
const neonGreen = "#dfff1f";
const neonGreenLight = "#e5ff4f";
const neonGreenDark = "#c5e500";


// Gelişmiş yüzen kalpler animasyonu
const floatingHeartsVariants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 0.5,
    x: 0,
    rotate: 0,
    filter: "drop-shadow(0 0 0px rgba(95, 108, 20, 0))"
  },
  animate: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [-2, -40 - (i % 3) * 15],
    scale: [0.5, 0.7 + (i % 5) * 0.1],
    x: [-5 + (i % 7) * 2, 5 - (i % 3) * 3],
    rotate: [-10 + (i % 5) * 5, 10 - (i % 7) * 3],
   /*  filter: [
      "drop-shadow(0 0 0px rgba(95, 108, 20, 0))",
      "drop-shadow(0 0 3px rgba(95, 108, 20, 0.7))",
      "drop-shadow(0 0 5px rgba(95, 108, 20, 0.5))",
      "drop-shadow(0 0 0px rgba(223, 255, 31, 0))"
    ], */
    transition: {
      duration: 2 + (i % 3) * 0.5,
      ease: "easeOut",
    }
  })
};

// Parıltı efekti
const glowVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: [0, 0.7, 0],
    scale: [0.5, 1.5, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

// Tıklama parıltı efekti
const clickGlowVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.5, 0],
    opacity: [0, 0.8, 0],
    transition: { duration: 0.8 }
  }
};

// Hareketli border animasyonu
const borderVariants = {
  initial: {
    pathLength: 0,
    pathOffset: 0,
    opacity: 0.8,
  },
  animate: {
    pathLength: 1,
    pathOffset: [0, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      pathOffset: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      },
   /*    opacity: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror"
      } */
    }
  }
};

const Header = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [hearts, setHearts] = useState<Array<{id: number, index: number}>>([]);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const heartButtonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lastClicked, setLastClicked] = useState(false);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 });

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

  // Buton boyutlarını ölç
  useEffect(() => {
    if (heartButtonRef.current) {
      const { width, height } = heartButtonRef.current.getBoundingClientRect();
      setButtonDimensions({ width, height });
    }
  }, []);

  // Sürekli kalp oluşturma efekti
  useEffect(() => {
    const interval = setInterval(() => {
      // Rastgele bir gecikme ekle
      const delay = Math.random() * 200;

      setTimeout(() => {
        setHearts(prev => {
          // En fazla 8 kalp göster, eskilerini kaldır
          if (prev.length >= 8) {
            const newHearts = [...prev];
            newHearts.shift(); // En eski kalbi çıkar
            return [...newHearts, {id: Date.now(), index: Date.now()}];
          }
          return [...prev, {id: Date.now(), index: Date.now()}];
        });
      }, delay);
    }, 500); // Daha sık kalp oluştur

    return () => clearInterval(interval);
  }, []);

  // Parıltı efekti oluştur
  const createSparkles = () => {
    if (!heartButtonRef.current) return;

    const buttonRect = heartButtonRef.current.getBoundingClientRect();
    const newSparkles = [];

    for (let i = 0; i < 12; i++) {
      newSparkles.push({
        id: Date.now() + i,
        x: Math.random() * buttonRect.width,
        y: Math.random() * buttonRect.height
      });
    }

    setSparkles(newSparkles);
    setLastClicked(true);

    // Parıltıları temizle
    setTimeout(() => {
      setSparkles([]);
      setLastClicked(false);
    }, 800);
  };

  function handleDownloadResume() {
    window.open("/Husnu-Lubnan-CV.pdf");
  }

  const { push } = useRouter();
  function handleLikeClick() {
    createSparkles();
    push("/liked");
  }

  return (
    <div className="flex flex-col w-full lg:container my-4 p-4 rounded-lg">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 md:gap-0 w-full">
        <Link href="/" className="flex flex-col -gap-1">
          <h1 className="font-light text-2xl text-white">
            Hüsnü <span className="font-medium text-[#dfff1f]">Lübnan</span>
          </h1>
          <div className="flex flex-row gap-4">
            <p className="text-gray-400 text-sm">Frontend Developer</p>
          </div>
        </Link>

        <div className="flex w-full md:w-auto gap-2 justify-between">
          <motion.button
            ref={heartButtonRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-4/12 md:w-auto flex flex-row items-center justify-center gap-2 group relative cursor-pointer bg-[#2d2d2d] border-none rounded-lg py-1.5 px-3 hover:bg-[#3d3d3d] overflow-hidden"
            onClick={handleLikeClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            type="button"
            aria-label="Liked"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Hareketli border animasyonu */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${buttonDimensions.width || 100} ${buttonDimensions.height || 40}`}
                className="absolute inset-0"
                style={{ overflow: 'visible' }}
              >
                <motion.rect
                  x="0"
                  y="0"
                  width={buttonDimensions.width || 100}
                  height={buttonDimensions.height || 40}
                  rx="8"
                  ry="8"
                  fill="none"
                  stroke={neonGreen}
                  strokeWidth="1.5"
                  variants={borderVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    filter: "drop-shadow(0 0 2px rgba(223, 255, 31, 0.8))"
                  }}
                />
              </svg>
            </div>

            {/* Sürekli parıltı efekti */}
            <motion.div
/*               variants={glowVariants}
 */              initial="initial"
              animate="animate"
              className="absolute inset-0 rounded-lg bg-[#dfff1f] opacity-0 pointer-events-none"
            />

            <div className="relative z-10">
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
                  className={`text-sm transition-all duration-300 ${lastClicked ? 'fill-[#dfff1f]' : ''} text-[#dfff1f]`}
                />
              </motion.div>

              <AnimatePresence>
                {hearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    custom={heart.index}
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
                      className="text-xs fill-[#dfff1f] text-[#dfff1f] opacity-80"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Tıklama efekti */}
            <AnimatePresence>
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0 }}
                  variants={clickGlowVariants}
                  className="absolute pointer-events-none rounded-full z-0"
                  style={{
                    left: `${sparkle.x}px`,
                    top: `${sparkle.y}px`,
                    width: `${2 + Math.random() * 3}px`,
                    height: `${2 + Math.random() * 3}px`,
/*                     background: `radial-gradient(circle, ${neonGreenLight} 0%, ${neonGreen} 70%, rgba(223, 255, 31, 0) 100%)`,
 */                    boxShadow: `0 0 8px ${neonGreen}`
                  }}
                />
              ))}
            </AnimatePresence>

            <span className="text-white text-sm z-10">
              Liked
            </span>
          </motion.button>

          <motion.div
            className="w-8/12 md:w-auto relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="flex w-full h-full group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer justify-center"
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

          {/* Desktop CV button - now in regular flow */}
          <motion.div
            className="hidden md:block relative group"
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleDownloadResume}
          >
            <div className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer">
              <div className="flex flex-row items-center gap-4">
                <ResumeIcon className="h-4 group-hover:animate-draw " />
                <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
                  <p className="text-[#fff] text-sm">CV</p>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CV button - full width on mobile, normal on web */}
      <motion.div
        className="relative group mt-4 md:hidden w-full"
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleDownloadResume}
      >
        <div className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-2 rounded-lg cursor-pointer w-full justify-center">
          <div className="flex flex-row items-center gap-4">
            <ResumeIcon className="h-4 group-hover:animate-draw" />
            <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}' className="w-full">
              <p className="text-[#fff] text-sm">CV</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
