// components/DynamicIsland/DynamicIslandContainer.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CabBookingState, CabDriver, CabLocation } from '@/app/types/cab.types';
import { LookingForCabPanel } from '@/components/DynamicIsland/LookingForCabPanel';
import { SearchingPanel } from '@/components/DynamicIsland/SearchingPanel';
import { DriverFoundPanel } from '@/components/DynamicIsland/DriverFoundPanel';

interface DynamicIslandContainerProps {
  state: CabBookingState;
  driver: CabDriver | null;
  cabs: CabLocation[];
  reset: () => void;
  start: () => void;
}

export const DynamicIslandContainer: React.FC<DynamicIslandContainerProps> = ({
  state,
  driver,
  cabs,
  reset,
  start
}) => {
  const [panelState, setPanelState] = React.useState<CabBookingState>(state);

  useEffect(() => {
    setPanelState(state);
  }, [state]);

  const handleClose = () => {
    reset();
  };

  const handleStartSearch = () => {
    start();
  };

  const getContainerVariants = () => {
    switch (panelState) {
      case 'looking':
        return {
          width: 380,
          height: 60,
          borderRadius: 30
        };
      case 'searching':
        return {
          width: 400,
          height: 280,
          borderRadius: 40
        };
      case 'found':
        return {
          width: 400,
          height: 280,
          borderRadius: 40
        };
      default:
        return {
          width: 380,
          height: 60,
          borderRadius: 30
        };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        className="bg-black overflow-hidden relative"
        animate={getContainerVariants()}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }}
      >
        <AnimatePresence mode="wait">
          {panelState === 'looking' && (
            <LookingForCabPanel key="looking" onClose={handleClose} onStartSearch={handleStartSearch} />
          )}
          {panelState === 'searching' && (
            <SearchingPanel key="searching" cabs={cabs} onClose={handleClose} />
          )}
          {panelState === 'found' && driver && (
            <DriverFoundPanel key="found" driver={driver} cabs={cabs} onClose={handleClose} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
