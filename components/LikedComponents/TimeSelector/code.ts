export const timeSelectorCode = {
  main: `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { AnalogClock } from './AnalogClock';
import { TimeList } from './TimeList';
import { Time } from './types';

export const TimeSelector = () => {
  // ... TimeSelector component code
}`,

  analogClock: `import React from 'react';
import { motion } from 'framer-motion';
import { Time } from './types';

interface AnalogClockProps {
  selectedTime: Time;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ selectedTime }) => {
  // ... AnalogClock component code
}`,

  timeList: `import React from 'react';
import { motion } from 'framer-motion';
import { Time } from './types';

interface TimeListProps {
  selectedTime: Time;
  onTimeChange: (time: Time) => void;
}

export const TimeList: React.FC<TimeListProps> = ({ selectedTime, onTimeChange }) => {
  // ... TimeList component code
}`,

  types: `export interface Time {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}`
};