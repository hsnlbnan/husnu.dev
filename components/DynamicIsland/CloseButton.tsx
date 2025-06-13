import React from 'react';
import { motion } from 'framer-motion';

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      className={`w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center focus:outline-none ${className || ''}`}
      onClick={onClick}
      aria-label="Close"
      type="button"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="4.35355" y1="4.64645" x2="13.3536" y2="13.6464" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13.3536" y1="4.64645" x2="4.35355" y2="13.6464" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </motion.button>
  );
}; 