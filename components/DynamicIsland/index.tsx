"use client";

import React from 'react';
import { DynamicIslandContainer } from '@/components/DynamicIsland/DynamicIslandContainer';
import { useCabBooking } from '@/hooks/useCabBooking';

export const CabBookingApp: React.FC = () => {
  const { state, driver, cabs, reset, start } = useCabBooking();
  
  return (
    <DynamicIslandContainer 
      state={state}
      driver={driver}
      cabs={cabs}
      reset={reset}
      start={start}
    />
  );
};

export default function CarBookingComponent() {
  return <CabBookingApp />;
}
