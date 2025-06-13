// components/DynamicIsland/SearchingPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CabLocation } from '@/app/types/cab.types';
import { MapView } from '@/components/DynamicIsland/MapView';
import { CloseButton } from '@/components/DynamicIsland/CloseButton';

interface SearchingPanelProps {
  cabs: CabLocation[];
  onClose?: () => void;
}

const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
      >
        .
      </motion.span>
    </span>
  );
};

export const SearchingPanel: React.FC<SearchingPanelProps> = ({ cabs, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="h-full relative"
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 w-full bg-black rounded-t-2xl flex items-center justify-between px-6 py-4 z-20">
        <div className="flex items-center space-x-3">
          <span className="text-white font-bold text-lg">Searching</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-white font-bold text-base flex items-center gap-1">🏠 </div>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      {/* Main Content */}
      <div className="pt-20 pb-2 flex flex-col items-center relative">
        <div className="mb-4 w-full flex justify-center absolute top-20 left-0 z-[99]">
          <span className="relative text-gray-100 text-base font-medium bg-white/10 backdrop-blur-xl rounded-full px-8 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:opacity-50">
            Searching for your cab<LoadingDots />
          </span>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-gray-900 w-full">
          <MapView cabs={cabs} showRoute={false} />
        </div>
      </div>
    </motion.div>
  );
};
