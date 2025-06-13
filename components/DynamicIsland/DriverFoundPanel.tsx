// components/DynamicIsland/DriverFoundPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CabDriver, CabLocation } from '@/app/types/cab.types';
import { MapView } from '@/components/DynamicIsland/MapView';
import { CloseButton } from '@/components/DynamicIsland/CloseButton';

interface DriverFoundPanelProps {
  driver: CabDriver;
  cabs: CabLocation[];
  onClose?: () => void;
}

export const DriverFoundPanel: React.FC<DriverFoundPanelProps> = ({ 
  driver, 
  cabs,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="h-full relative"
    >
      <div className="absolute top-0 left-0 w-full bg-black rounded-t-2xl flex items-center justify-between px-6 py-4 z-20">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-yellow-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{driver.name.charAt(0).toUpperCase()}</span>
            </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-lg">{driver.name}</span>
              <span className="text-yellow-400 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {driver.rating}
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              {driver.plateNumber} • {driver.vehicleModel}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-white font-bold text-base">{driver.estimatedTime} min</div>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className="pt-20 pb-2 px-0">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-gray-900">
          <MapView cabs={cabs} showRoute={true} />
        </div>
      </div>
    </motion.div>
  );
};
