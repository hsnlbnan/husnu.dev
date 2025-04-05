"use client"

import React, { useState } from 'react'
import { ChevronDownIcon, MessageCirclePlus, User2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AccordionItem({
  name,
  role,
  index,
  isOpen,
  visibleCount = 3,
}: {
  name: string;
  role: string;
  index: number;
  isOpen: boolean;
  visibleCount?: number;
}) {
  // Calculate whether this item is visible in collapsed state
  const isVisibleWhenCollapsed = index < visibleCount;

  // Determine the visual state based on index and accordion state
  const getItemState = () => {
    if (isOpen) {
      return "expanded";
    }

    if (isVisibleWhenCollapsed) {
      return "visible";
    }

    return "hidden";
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      zIndex: 10 - index,
      height: 0,
      margin: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      }
    },
    visible: {
      opacity: 1 - (index * 0.2),
      y: index * 10,
      scale: 1 - (index * 0.05),
      zIndex: 3 - index,
      height: "auto",
      margin: "0 0 8px 0",
      transition: {
        duration: 0.25,
        ease: "easeOut",
      }
    },
    expanded: {
      opacity: 1,
      y: [10 * Math.min(index, visibleCount - 1), index * 56],
      scale: [1 - (Math.min(index, visibleCount - 1) * 0.05), 1],
      zIndex: 10 - index,
      height: "auto",
      margin: "0 0 8px 0",
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 1],
        delay: index * 0.03,
      }
    }
  };

  return (
    <motion.div
      initial={isVisibleWhenCollapsed ? "visible" : "hidden"}
      animate={getItemState()}
      variants={itemVariants}
      className="flex flex-col w-full max-w-[400px] rounded-lg border border-gray-200 p-3 shadow-sm bg-white"
      style={{
        position: 'absolute',
        width: '100%',
        transformOrigin: 'center top',
        pointerEvents: isOpen || index < visibleCount ? 'auto' : 'none',
      }}
    >
      <div className='flex items-center justify-between min-h-[24px]'>
        <div className='flex items-center gap-2'>
          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
          <h3 className='text-sm font-medium text-gray-900'>
            {name}
          </h3>
          <p className='text-xs text-gray-500'>
            {role}
          </p>
        </div>
        <div className='flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full p-1'>
          <MessageCirclePlus className='w-4 h-4 text-gray-900' />
        </div>
      </div>
    </motion.div>
  )
}

function AccordionHeader({
  title,
  count,
  isOpen,
  onToggle,
}: {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="flex items-center justify-between w-full max-w-[400px] rounded-lg p-2 cursor-pointer"
      onClick={onToggle}
      initial={{ backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: isOpen ? 'rgb(243, 244, 246)' : 'transparent'
      }}
      whileHover={{
        backgroundColor: isOpen ? 'rgb(243, 244, 246)' : 'rgb(249, 250, 251)'
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center">
          <User2 className="w-4 h-4 text-gray-900" />
        </div>
        <div className='flex items-center gap-2 select-none'>
          <h4 className="text-sm font-medium text-gray-900">
            {title}
          </h4>
          <motion.span
            className="rounded-full bg-gray-200 w-4 h-4 flex items-center justify-center text-xs text-gray-500"
            animate={{
              scale: isOpen ? 1.1 : 1,
              backgroundColor: isOpen ? 'rgb(209, 213, 219)' : 'rgb(229, 231, 235)'
            }}
            transition={{ duration: 0.15 }}
          >
            {count}
          </motion.span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-1 pr-2 text-xs font-medium select-none text-gray-500">
          <motion.span
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            {isOpen ? 'Collapse' : 'Show All'}
          </motion.span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export const PeopleAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const visibleCount = 3; // Number of items visible when collapsed

  const items = [
    { name: "Tim Cook", role: "CEO" },
    { name: "Steve Jobs", role: "CEO" },
    { name: "John Doe", role: "CEO" },
  ];

  // Calculate container height based on number of items
  const getContainerHeight = () => {
    if (isOpen) {
      // When expanded, show all items
      return `${items.length * 56 + (items.length - 1) * 8}px`;
    } else {
      // When collapsed, only show first few items with stacked appearance
      const baseHeight = visibleCount > 0 ? 56 : 0; // Height of first card
      const stackingOffset = visibleCount > 1 ? (visibleCount - 1) * 10 + 8 : 0; // Offset for stacked cards plus margin
      return `${baseHeight + stackingOffset}px`;
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center p-4 mt-64">
      <div className="w-full max-w-[400px] mt-[30vh]">
        {/* Header */}
        <AccordionHeader
          title="People"
          count={items.length}
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        {/* Content container with dynamic height */}
        <motion.div
          className="relative mt-2 overflow-hidden"
          animate={{
            height: getContainerHeight(),
            transition: {
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1] // Custom spring-like curve for container
            }
          }}
        >
          {/* Items */}
          {items.map((item, index) => (
            <AccordionItem
              key={item.name}
              name={item.name}
              role={item.role}
              index={index}
              isOpen={isOpen}
              visibleCount={visibleCount}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default PeopleAccordion;