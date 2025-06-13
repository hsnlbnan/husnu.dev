// components/DynamicIsland/LookingForCabPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CloseButton } from '@/components/DynamicIsland/CloseButton';

export const LookingForCabPanel: React.FC<{ onClose?: () => void; onStartSearch?: () => void }> = ({ onClose, onStartSearch }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between h-full px-6"
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">🚕</div>
        <div>
          <div className="text-gray-400 text-sm">Currently</div>
          <div className="text-white font-medium">Looking for cab</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <CloseButton onClick={onClose} />
        <button className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center focus:outline-none"
          onClick={onStartSearch}
          aria-label="Start searching"
        >
          <span className="text-black text-lg">🖐</span>
        </button>
      </div>
    </motion.div>
  );
};
