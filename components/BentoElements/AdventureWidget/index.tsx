"use client";

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import WordRotate from '@/components/ui/word-rotate';

// Base grid size - will be responsive
const baseGridSize = { rows: 5, cols: 11 };

// Heart patterns for different sizes
const heartPatternBase = [
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

// Larger heart pattern for wider screens - still 5 rows
const heartPatternLarge = [
  [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

// Extra large heart pattern for desktop screens
const heartPatternExtraLarge = [
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const AdventureWidget = () => {
  const [gridSize, setGridSize] = useState(baseGridSize);
  const [grid, setGrid] = useState(() => getRandomGrid());
  const [hovered, setHovered] = useState(false);
  const [heartPattern, setHeartPattern] = useState(heartPatternBase);
  const prefersReducedMotion = useReducedMotion();

  // Ekran boyutuna göre grid boyutunu ayarla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= 1024) { // lg ve üstü ekranlar
        setGridSize({ rows: heartPatternExtraLarge.length, cols: heartPatternExtraLarge[0].length });
        setHeartPattern(heartPatternExtraLarge);
      } else if (width >= 768) { // md ve üstü ekranlar
        setGridSize({ rows: heartPatternLarge.length, cols: heartPatternLarge[0].length });
        setHeartPattern(heartPatternLarge);
      } else { // küçük ekranlar
        setGridSize({ rows: heartPatternBase.length, cols: heartPatternBase[0].length });
        setHeartPattern(heartPatternBase);
      }
    };
    
    // İlk yüklemede ve ekran boyutu değiştiğinde çalıştır
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Daha verimli random grid oluşturma
  function getRandomGrid() {
    return Array.from({ length: gridSize.rows }, () =>
      Array.from({ length: gridSize.cols }, () => (Math.random() < 0.3 ? 1 : 0))
    );
  }

  // Ekran boyutu değiştiğinde veya ilk yüklemede grid'i güncelle
  useEffect(() => {
    setGrid(hovered ? heartPattern as (0 | 1)[][] : getRandomGrid());
  }, [gridSize, hovered, heartPattern]);

  return (
    <div className="bg-[#1D1D1D] p-4 md:p-5 rounded-xl w-full h-full flex flex-col overflow-hidden">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h3 className="flex flex-wrap items-center gap-2 font-light text-white text-xl">
          Adventure is live on{" "}
          <span className="flex text-[#dfff1f] min-w-[12ch]">
            <WordRotate words={["Github", "Azure DevOps", "Gitlab"]} />
          </span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          The places change, the adventure does not.
        </p>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.4 }}
        className="flex-grow flex items-start justify-start"
      >
        <div
          className="grid w-full overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Interactive grid heart pattern"
          role="button"
          tabIndex={0}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gap: '3px',
            width: '100%',
            maxWidth: gridSize.cols >= 16 ? '500px' : gridSize.cols >= 13 ? '400px' : '300px',
            margin: '0 auto'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <motion.div
                key={`${rowIndex}-${cellIndex}`}
                className="cell aspect-square rounded-sm"
                initial={prefersReducedMotion ? undefined : { scale: 0.6 }}
                animate={{ 
                  scale: prefersReducedMotion ? 1 : 1,
                  backgroundColor: cell ? "#4caf50" : "#444" 
                }}
                transition={prefersReducedMotion ? undefined : { 
                  duration: 0.3,
                  delay: (rowIndex * gridSize.cols + cellIndex) * 0.005
                }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdventureWidget;
