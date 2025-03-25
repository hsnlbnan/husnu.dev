import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Geliştirilmiş HouseIcon bileşeni
const HouseIcon = ({ color, index, isHovered }: { color: string; index: number; isHovered: boolean }) => {
  // Her parça için animasyon varyantları
  const roofVariants = {
    hidden: { opacity: 0, y: -20, x: 60 },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  const houseBodyVariants = {
    hidden: { opacity: 0, scaleY: 0, x: 60 },
    visible: { opacity: 1, scaleY: 1, x: 0 }
  };

  const windowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const doorVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: { opacity: 1, scaleY: 1 }
  };

  // Renkten daha koyu ve daha açık tonlar türetme
  const darkerColor = adjustColorBrightness(color, -30);
  const lighterColor = adjustColorBrightness(color, 30);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.05,
      }}
      className="relative"
    >
      <svg width="20" height="24" viewBox="0 0 20 24" className="w-[20px] h-[24px]">
        {/* Gölge (Zemin) */}
        <motion.ellipse
          cx="10"
          cy="23"
          rx="9"
          ry="1"
          fill="rgba(0,0,0,0.1)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{
            delay: index * 0.05 + 0.2,
            duration: 0.3
          }}
        />

        {/* Ev Gövdesi */}
        <motion.rect
          x="2"
          y="10"
          width="16"
          height="12"
          fill={color}
          stroke={darkerColor}
          strokeWidth="0.2"
          variants={houseBodyVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
            delay: index * 0.05 + 0.05,
          }}
        />

        {/* Çatı */}
        <motion.polygon
          points="1,10 10,2 19,10"
          fill={darkerColor}
          stroke={darkerColor}
          strokeWidth="0.2"
          variants={roofVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: index * 0.05,
          }}
        />

        {/* Kapı */}
        <motion.rect
          x="8"
          y="15"
          width="4"
          height="7"
          fill={lighterColor}
          stroke={darkerColor}
          strokeWidth="0.2"
          variants={doorVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
            delay: index * 0.05 + 0.15,
          }}
          rx="0.5"
        />

        {/* Kapı Kolu */}
        <motion.circle
          cx="11"
          cy="19"
          r="0.4"
          fill={darkerColor}
          variants={windowVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            delay: index * 0.05 + 0.25,
            duration: 0.2
          }}
        />

        {/* Pencereler */}
        <motion.rect
          x="4"
          y="13"
          width="3"
          height="3"
          fill={lighterColor}
          stroke={darkerColor}
          strokeWidth="0.2"
          variants={windowVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            delay: index * 0.05 + 0.2,
            duration: 0.3
          }}
        />

        <motion.rect
          x="13"
          y="13"
          width="3"
          height="3"
          fill={lighterColor}
          stroke={darkerColor}
          strokeWidth="0.2"
          variants={windowVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{
            delay: index * 0.05 + 0.2,
            duration: 0.3
          }}
        />
      </svg>
    </motion.div>
  );
};

// Renk parlaklığını ayarlama yardımcı fonksiyonu
const adjustColorBrightness = (hex: string, percent: number): string => {
  // HEX'ten RGB'ye dönüştürme
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Parlaklığı ayarlama
  r = Math.min(255, Math.max(0, r + percent));
  g = Math.min(255, Math.max(0, g + percent));
  b = Math.min(255, Math.max(0, b + percent));

  // RGB'den HEX'e dönüştürme
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const AnimatedLetter = ({ letter, index, isHovered }: { letter: string; index: number; isHovered: boolean }) => {
  return (
    <motion.span
      className={`text-[#000000] text-[16px] font-extrabold inline-block ${letter === ' ' ? 'w-2' : ''}`}
      initial={{ opacity: 0, x: -40 }}
      animate={isHovered ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.04,
      }}
    >
      {letter}
    </motion.span>
  );
};

const Button = () => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = ['#CCCCCC', '#999999', '#666666', '#333333', '#000000']; // Açıktan koyuya doğru
  const text = "VIEW HOUSES";
  const letters = text.split('');

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonVariants = {
    initial: { scaleX: 1 },
    hover: { scaleX: 1.03 }
  };

  return (
    <motion.div
      className="relative inline-flex items-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label="View houses"
      onKeyDown={(e) => e.key === 'Enter' && setIsHovered(!isHovered)}
      variants={buttonVariants}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Split Letters Container */}
      <div className="absolute left-0 z-10 flex justify-center items-center w-[200px] h-[50px]">
        <div className="flex items-center justify-center">
          {letters.map((letter, index) => (
            <AnimatedLetter
              key={index}
              letter={letter}
              index={index}
              isHovered={isHovered}
            />
          ))}
        </div>
      </div>

      {/* Houses container */}
      <motion.div
        className="bg-[#d9d9d9] rounded-l-lg flex justify-center items-center w-[200px] h-[50px] gap-[10px] overflow-hidden"
      >
        {[...colors].reverse().map((color, index) => (
          <HouseIcon
            key={index}
            color={color}
            index={index}
            isHovered={isHovered}
          />
        ))}
      </motion.div>

      {/* Arrow SVG */}
      <motion.svg
        className='-ml-[7.2px]'
        width="35.46" height="50" viewBox="0 0 121 282" fill="none" xmlns="http://www.w3.org/2000/svg"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <path d="M117.5 151.5C121.028 142.518 121.295 137.482 117.5 128.5C114.391 121.141 10.5 4 10.5 4C10.5 4 5.5 0.5 0.5 0.5V281.5C3 281.5 7 280.5 8.32386 279.187C34.0472 250.171 114.537 159.043 117.5 151.5Z" fill="#D9D9D9" />
      </motion.svg>
    </motion.div>
  );
};

export default Button;