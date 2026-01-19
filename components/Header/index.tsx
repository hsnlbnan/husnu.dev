"use client";

import React, { useState, useEffect, useRef } from "react";
import AnimatedShinyText from "../ui/animated-shiny-text";
import Tooltip from "../Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import { ResumeIcon } from "@/icons";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import AnimatedLink from "../AnimatedLink";
import usePageTransition from "@/hooks/usePageTransition";
import { usePathname } from "next/navigation";

// Neon yeşil renk paleti
const neonGreen = "#dfff1f";
const neonGreenLight = "#e5ff4f";
const neonGreenDark = "#c5e500";

// Gelişmiş yüzen kalpler animasyonu - daha minimal versiyonu
const floatingHeartsVariants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 0.5,
    rotate: 0,
  },
  animate: (i: number) => ({
    opacity: [0, 1, 0],
    y: [-2, -30 - (i % 3) * 10],
    scale: [0.5, 0.6 + (i % 5) * 0.05],
    rotate: [-5 + (i % 5) * 3, 5 - (i % 7) * 2],
    transition: {
      duration: 1.5 + (i % 3) * 0.3,
      ease: "easeOut",
    }
  })
};

// Zarif border animasyonu
const borderVariants = {
  initial: {
    pathLength: 0,
    pathOffset: 0,
  },
  animate: {
    pathLength: 1,
    pathOffset: [0, 1],
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      pathOffset: {
        duration: 2.5,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      }
    }
  }
};

const Header = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number, index: number }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number, x: number, y: number }>>([]);
  const heartButtonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lastClicked, setLastClicked] = useState(false);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 });
  const { navigateTo } = usePageTransition();
  const pathname = usePathname();
  const isLikedPage = pathname === '/liked';

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

  // Daha minimal kalp oluşturma efekti
  useEffect(() => {
    const interval = setInterval(() => {
      const delay = Math.random() * 150;

      setTimeout(() => {
        setHearts(prev => {
          // En fazla 5 kalp göster, eskilerini kaldır
          if (prev.length >= 5) {
            const newHearts = [...prev];
            newHearts.shift(); // En eski kalbi çıkar
            return [...newHearts, { id: Date.now(), index: Date.now() }];
          }
          return [...prev, { id: Date.now(), index: Date.now() }];
        });
      }, delay);
    }, 700); // Daha yavaş oluştur

    return () => clearInterval(interval);
  }, []);

  // Minimal parıltı efekti
  const createSparkles = () => {
    if (!heartButtonRef.current) return;

    const buttonRect = heartButtonRef.current.getBoundingClientRect();
    const newSparkles = [];

    // Daha az parıltı
    for (let i = 0; i < 6; i++) {
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
    }, 600);
  };

  function handleDownloadResume() {
    window.open("/Husnu-Lubnan-CV.pdf");
  }

  function handleLikeClick() {
    createSparkles();

    // Doğrudan yönlendirme yap, gecikme olmadan
    navigateTo("/liked");
  }

  // Handle optimized home navigation
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo("/");
  };

  return (
    <header className="w-full max-w-screen">
      <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
        <div className="flex flex-col w-full lg:container my-4 rounded-lg">
          <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 md:gap-0 w-full">
            <a
              href="/"
              onClick={handleHomeClick}
              className="flex flex-col -gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff1f] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              aria-label="Go to homepage"
            >
              <h1 className="font-light text-2xl text-white">
                Hüsnü <span className="font-medium text-[#dfff1f]">Lübnan</span>
              </h1>
              <div className="flex flex-row gap-4">
                <p className="text-gray-400 text-sm">Senior Frontend Developer</p>
              </div>
            </a>

            <div className="flex w-full md:w-auto gap-2 justify-between" role="navigation" aria-label="Main navigation">
              <motion.button
                ref={heartButtonRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-4/12 md:w-auto flex flex-row items-center justify-center gap-2 group relative cursor-pointer bg-[#111] border-none rounded-lg py-1.5 px-3 hover:bg-[#3d3d3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff1f] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                onClick={handleLikeClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLikeClick();
                  }
                }}
                type="button"
                aria-label="View liked items"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Minimal border animasyonu */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-lg" aria-hidden="true">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${buttonDimensions.width || 100} ${buttonDimensions.height || 40}`}
                    className="absolute inset-0"
                    style={{ overflow: 'visible' }}
                  >
                    <motion.rect
                      x="0.5"
                      y="0.5"
                      width={(buttonDimensions.width || 100) - 1}
                      height={(buttonDimensions.height || 40) - 1}
                      rx="8"
                      ry="8"
                      fill="none"
                      stroke={neonGreen}
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      variants={borderVariants}
                      initial="initial"
                      animate="animate"
                      style={{
                        opacity: 0.6,
                        filter: "drop-shadow(0 0 1px rgba(223, 255, 31, 0.5))"
                      }}
                    />
                  </svg>
                </div>

                <div className="relative z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiHeart
                      className={`text-sm transition-all duration-300 ${isLikedPage || lastClicked ? 'fill-[#dfff1f]' : ''} text-[#dfff1f]`}
                      aria-hidden="true"
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
                        aria-hidden="true"
                      >
                        <FiHeart
                          className="text-xs fill-transparent text-[#dfff1f] opacity-60"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <span className="text-white font-medium text-sm z-10">
                  Liked
                </span>
              </motion.button>

              <motion.div
                className="w-8/12 md:w-auto relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="flex w-full h-full group-hover:border-pulse bg-[#111] px-3 py-1.5 rounded-lg cursor-pointer justify-center focus-within:ring-2 focus-within:ring-[#dfff1f] focus-within:ring-offset-2 focus-within:ring-offset-black"
                  onClick={handleToggleBox}
                >
                  <div className="flex flex-row items-center gap-4">
                    <span className="bg-[#dfff1f] rounded-full w-2 h-2 animate-pulse opacity-100" aria-hidden="true"></span>
                    <button
                      data-cal-link="husnu"
                      data-cal-config='{"theme":"dark"}'
                      aria-label="Check freelance availability status"
                      className="focus:outline-none"
                    >
                      <p className="text-[#fff] font-medium text-sm">Freelance Status</p>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Desktop CV button - now in regular flow */}
              <motion.div
                className="hidden md:block relative group"
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                <div
                  className="flex group-hover:border-pulse bg-[#111] px-3 py-1.5 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-[#dfff1f] focus-within:ring-offset-2 focus-within:ring-offset-black"
                >
                  <div className="flex flex-row items-center gap-4">
                    <ResumeIcon className="h-4 w-4 group-hover:animate-draw opacity-80" aria-hidden="true" />
                    <button
                      onClick={handleDownloadResume}
                      className="focus:outline-none"
                      aria-label="Download resume (CV)"
                    >
                      <p className="text-[#fff] font-medium text-sm">CV</p>
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
          >
            <div
              className="flex group-hover:border-pulse bg-[#111] px-3 py-2 rounded-lg cursor-pointer w-full justify-center focus-within:ring-2 focus-within:ring-[#dfff1f] focus-within:ring-offset-2 focus-within:ring-offset-black"
            >
              <div className="flex flex-row items-center gap-4">
                <ResumeIcon className="h-6 w-6 group-hover:animate-draw" aria-hidden="true" />
                <button
                  onClick={handleDownloadResume}
                  className="w-full focus:outline-none"
                  aria-label="Download resume (CV)"
                >
                  <p className="text-[#fff] font-medium text-sm">CV</p>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
