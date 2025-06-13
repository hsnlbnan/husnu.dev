// hooks/useCabBooking.ts
import { useState, useCallback, useRef } from 'react';
import { CabBookingState, CabDriver, CabLocation } from '@/app/types/cab.types';

export const useCabBooking = () => {
  const [state, setState] = useState<CabBookingState>('looking');
  const [driver, setDriver] = useState<CabDriver | null>(null);
  const [cabs, setCabs] = useState<CabLocation[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dummy data
  const dummyDriver: CabDriver = {
    id: '1',
    name: 'Bryan',
    rating: 4.9,
    plateNumber: 'KA15AK00',
    vehicleModel: 'Yellow Toyota RAV4',
    estimatedTime: 2,
  };

  const generateRandomCabs = useCallback(() => {
    const positions = new Set<string>();
    const cabs: CabLocation[] = [];
    
    while (cabs.length < 4) {
      const x = Math.floor(Math.random() * 7) * 50 + 50;
      const y = Math.floor(Math.random() * 7) * 50 + 50;
      const posKey = `${x},${y}`;
      
      if (!positions.has(posKey)) {
        positions.add(posKey);
        cabs.push({
          id: (cabs.length + 1).toString(),
          x,
          y
        });
      }
    }

    return cabs;
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    clearTimers();
    setState('looking');
    setDriver(null);
    setCabs(generateRandomCabs());
  }, [clearTimers, generateRandomCabs]);

  const startBookingProcess = useCallback(() => {
    // Önce mevcut state'i temizle
    clearTimers();
    setState('searching');
    setDriver(null);
    setCabs(generateRandomCabs());

    // Found state'ine geç
    timerRef.current = setTimeout(() => {
      setState('found');
      setDriver(dummyDriver);
    }, 3000);
  }, [clearTimers, generateRandomCabs]);

  return {
    state,
    driver,
    cabs,
    reset: resetState,
    start: startBookingProcess,
  };
};
