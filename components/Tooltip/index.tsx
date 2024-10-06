// Create a animted tooltip component with Framer Motion and Tailwind CSS

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

const Tooltip = ({ children, text }: TooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  return (
    <div
      className="inline-block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="top-full left-[-60%] absolute bg-black shadow-lg mt-2 p-3 rounded-md w-auto font-light text-gray-200 text-sm"
        >
          <div className="-top-2 left-1/2 absolute border-transparent border-r-8 border-b-8 border-b-black border-l-8 w-0 h-0 transform -translate-x-1/2"></div>
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="inline-block mr-1 text-nowrap"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;
