"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown } from 'lucide-react';
import { AnalogClock } from './AnalogClock';
import { TimeList } from './TimeList';
import { FiExternalLink } from 'react-icons/fi';

interface Time {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export const TimeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Time>(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const roundedMinute = Math.floor(minute / 15) * 15;

    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return {
      hour: hour12,
      minute: roundedMinute,
      period: period
    };
  });

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleTimeChange = (newTime: Time) => {
    setSelectedTime(newTime);
  };

  const formattedTime = `${selectedTime.hour}:${selectedTime.minute === 0 ? '00' : selectedTime.minute} ${selectedTime.period.toLowerCase()}`;

  return (
    <div className="w-full max-w-md border-0  rounded-lg overflow-hidden bg-[#242424]">
      <button
        className="w-full flex items-center justify-between p-4 bg-[#242424] text-gray-200 hover:bg-[#242424] transition-colors text-sm"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-controls="time-selector-content"
      >
        <div className="flex items-center gap-3 text-[#969696]">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Time</span>

        </div>
        <motion.div

        >
          <span className="text-white">{formattedTime}</span>

        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="time-selector-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden p-2 rounded-lg"
          >
            <div className="p-4 bg-[#1b1b1b] flex gap-4 rounded-lg">
              <div className="w-1/2 flex items-center justify-center">
                <AnalogClock selectedTime={selectedTime} />
              </div>
              <div className="w-1/2">
                <TimeList selectedTime={selectedTime} onTimeChange={handleTimeChange} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
