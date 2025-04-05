"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WordRotate from '@/components/ui/word-rotate';

// Simplified grid size
const gridSize = { rows: 5, cols: 11 };
const heartPattern = [
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

const AdventureWidget = () => {
  const [grid, setGrid] = useState(() => getRandomGrid());
  const [hovered, setHovered] = useState(false);

  // Daha verimli random grid oluşturma
  function getRandomGrid() {
    return Array.from({ length: gridSize.rows }, () =>
      Array.from({ length: gridSize.cols }, () => (Math.random() < 0.3 ? 1 : 0))
    );
  }

  // Grid değişimi için useEffect
  useEffect(() => {
    if (hovered) {
      setGrid(heartPattern as (0 | 1)[][]);
    } else {
      setGrid(getRandomGrid());
    }
  }, [hovered]);

  return (
    <div className="bg-[#1D1D1D] p-4 md:p-5 rounded-xl w-full h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h3 className="flex flex-wrap items-center gap-2 font-light text-white text-xl">
          Adventure is live on{" "}
          <span className="flex text-[#dfff1f]">
            <WordRotate words={["Github", "Azure DevOps", "Gitlab"]} />
          </span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          The places change, the adventure does not.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-grow flex items-start justify-start"
      >
        <div
          className="grid w-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Interactive grid heart pattern"
          role="button"
          tabIndex={0}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gap: '4px',
            width: '100%',
            maxWidth: '300px',
            margin: '0 '
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <motion.div
                key={`${rowIndex}-${cellIndex}`}
                className="cell aspect-square rounded-sm"
                initial={{ scale: 0.6 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: cell ? "#4caf50" : "#444" 
                }}
                transition={{ 
                  duration: 0.3,
                  delay: (rowIndex * gridSize.cols + cellIndex) * 0.005
                }}
                whileHover={{ scale: 1.2 }}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdventureWidget;