import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Time {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

interface TimeListProps {
  selectedTime: Time;
  onTimeChange: (newTime: Time) => void;
}

export const TimeList: React.FC<TimeListProps> = ({ selectedTime, onTimeChange }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'center',
        behavior: 'instant'
      });
      isFirstRender.current = false;
    }
  }, []);

  const generateTimeOptions = () => {
    const options: Time[] = [];

    for (let period of ['AM', 'PM'] as const) {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute of [0, 15, 30, 45]) {
          options.push({ hour, minute, period });
        }
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const isSelected = (time: Time) =>
    time.hour === selectedTime.hour &&
    time.minute === selectedTime.minute &&
    time.period === selectedTime.period;

  const formatTimeLabel = (time: Time) => {
    const hour = time.hour.toString().padStart(2, '0');
    const minute = time.minute === 0 ? '00' : time.minute.toString().padStart(2, '0');
    return `${hour}:${minute} ${time.period}`;
  };

  return (
    <div className="relative h-52">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1b1b1b] via-[#1b1b1b]/80 to-transparent z-20 pointer-events-none" />

      <div
        ref={listRef}
        className="h-full overflow-y-auto scrollbar-thin scrollbar-track-[#2a2a2a] scrollbar-thumb-[#404040] hover:scrollbar-thumb-[#505050]"
      >
        <div className="space-y-0.5 p-1">
          {timeOptions.map((time, index) => (
            <motion.button
              key={index}
              ref={isSelected(time) ? selectedItemRef : null}
              className={`
                w-full text-left px-4 py-2.5 rounded-md text-sm transition-all duration-200
                ${isSelected(time)
                  ? 'bg-[#323232] text-white font-medium scale-[1.02]'
                  : 'text-[#969696] hover:bg-[#2a2a2a] hover:text-white'
                }
                focus:outline-none focus:ring-2 focus:ring-[#404040] focus:ring-opacity-50
              `}
              onClick={() => onTimeChange(time)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-selected={isSelected(time)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTimeChange(time);
                  e.preventDefault();
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span>{formatTimeLabel(time)}</span>
                {isSelected(time) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/80 to-transparent z-20 pointer-events-none" />
    </div>
  );
};