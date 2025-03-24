import React from 'react';
import { motion } from 'framer-motion';

interface Time {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

interface AnalogClockProps {
  selectedTime: Time;
}

const RADIUS = 60;
const HAND_WIDTH = 3;
const HAND_HEIGHT = 2;
const CENTER_DOT_SIZE = 6;
const MARK_HEIGHT = 5;
const MARK_WIDTH = 1;
const MARK_COLOR = '#9CA3AF';
const MARK_COLOR_ACTIVE = '#4B5563';
const NUMBER_COLOR = '#fdfdfd';
const NUMBER_FONT_SIZE = 10;

export const AnalogClock: React.FC<AnalogClockProps> = ({ selectedTime }) => {
  const get24Hour = () => {
    if (selectedTime.period === 'AM' && selectedTime.hour === 12) return 0;
    if (selectedTime.period === 'PM' && selectedTime.hour !== 12) return selectedTime.hour + 12;
    return selectedTime.hour;
  };

  const hour24 = get24Hour();
  const hour12 = hour24 % 12;
  const hourAngle = (hour12 * 30 + selectedTime.minute * 0.5) - 90;
  const minuteAngle = (selectedTime.minute * 6) - 90;

  return (
    <div
      className="relative w-40 h-40 rounded-full bg-[#242424] shadow-md flex items-center justify-center"
      role="img"
      aria-label={`Analog clock showing ${selectedTime.hour}:${selectedTime.minute === 0 ? '00' : selectedTime.minute} ${selectedTime.period}`}
    >
      {/* Clock face */}
      <div className="relative w-36 h-36 rounded-full bg-[#242424] border-2 border-[#111]">
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, index) => {
          const rotation = index * 30;
          const isQuarterHour = index % 3 === 0;
          const radians = (rotation - 90) * (Math.PI / 180);
          const x = Math.cos(radians) * RADIUS;
          const y = Math.sin(radians) * RADIUS;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                height: isQuarterHour ? MARK_HEIGHT * 1.6 : MARK_HEIGHT,
                width: isQuarterHour ? MARK_WIDTH * 2 : MARK_WIDTH,
                backgroundColor: isQuarterHour ? MARK_COLOR_ACTIVE : MARK_COLOR,
                top: `calc(50% + ${y}px - ${MARK_HEIGHT}px)`,
                left: `calc(50% + ${x}px - ${MARK_WIDTH / 2}px)`,
                transformOrigin: 'bottom center',
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
        })}

        {/* Clock numbers */}
        {[12, 3, 6, 9].map((num, index) => {
          const rotation = index * 90;
          const radians = (rotation - 90) * (Math.PI / 180);
          const radius = RADIUS - 12; // Biraz içeride olması için
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius;

          return (
            <div
              key={num}
              className="absolute font-semibold"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: 'translate(-50%, -50%)',
                color: NUMBER_COLOR,
                fontSize: `${NUMBER_FONT_SIZE}px`,
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Hands container */}
        <div className="absolute inset-0">
          {/* Hour hand */}
          <motion.div
            className={`absolute rounded-full`}
            style={{
              height: HAND_WIDTH,
              width: '25%',
              top: `calc(50% - ${HAND_WIDTH / 2}px)`,
              left: '50%',
              transformOrigin: 'left center',
              backgroundColor: NUMBER_COLOR
            }}
            animate={{ rotate: hourAngle }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
          />

          {/* Minute hand */}
          <motion.div
            className={`absolute rounded-full`}
            style={{
              height: HAND_HEIGHT,
              width: '35%',
              top: `calc(50% - ${HAND_HEIGHT / 2}px)`,
              left: '50%',
              transformOrigin: 'left center',
              backgroundColor: NUMBER_COLOR
            }}
            animate={{ rotate: minuteAngle }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
          />

          {/* Center dot */}
          <div
            className={`absolute rounded-full z-10`}
            style={{
              height: CENTER_DOT_SIZE,
              width: CENTER_DOT_SIZE,
              top: `calc(50% - ${CENTER_DOT_SIZE / 2}px)`,
              left: `calc(50% - ${CENTER_DOT_SIZE / 2}px)`,
              backgroundColor: NUMBER_COLOR
            }}
          />
        </div>
      </div>
    </div>
  );
};