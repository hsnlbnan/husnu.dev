"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Work = {
  title: string;
  subtitle: string;
  description: string;
  src: string;
};

const Card = ({ title, subtitle, description, src }: Work) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ left: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left } = e.currentTarget.getBoundingClientRect();
    const hoverLeft = e.clientX - left - 25;
    setHoverPosition({ left: hoverLeft });
  };

  return (
    <div className="flex md:flex-row flex-col border-gray-400 py-8 border-t border-b w-full">
      <div
        className="relative w-full md:w-1/2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <h2 className="font-bold text-2xl">{title}</h2>
        {isHovered && (
          <motion.div
            className="-top-16 absolute bg-white rounded-sm w-[50px] h-[50px]"
            style={hoverPosition}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image src={src} alt={title} width={50} height={50} />
          </motion.div>
        )}
      </div>
      <p className="w-full md:w-1/4 text-gray-400 text-sm">{subtitle}</p>
      <p className="w-full md:w-1/4 text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default Card;
