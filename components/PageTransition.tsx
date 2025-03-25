'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Ana sayfa geçiş varyantları
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Overlay geçiş varyantları
const overlayVariants = {
  initial: {
    scaleX: 0,
    originX: 0
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    scaleX: 0,
    originX: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Üst üste binen parçacıklar animasyonu
const particleCount = 20;
const generateParticles = () => {
  return Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 10,
    duration: 0.8 + Math.random() * 1.2
  }));
};

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const [particles, setParticles] = useState(generateParticles());
  const [isMounting, setIsMounting] = useState(true);

  // Sayfa değiştiğinde parçacıkları yeniden oluştur
  useEffect(() => {
    if (!isMounting) {
      setParticles(generateParticles());
    }
    setIsMounting(false);
  }, [pathname, isMounting]);

  return (
    <div className="page-transition-container relative">
      {/* Parçacıklar için mutlak konumlu bir konteyner */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {/* Sayfa değiştiğinde görünen neon yeşil overlay */}
          <motion.div
            key={`overlay-${pathname}`}
            className="fixed inset-0  opacity-30 z-50"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={overlayVariants}
          />

          {/* Neon parçacıklar */}
          {particles.map((particle) => (
            <motion.div
              key={`particle-${pathname}-${particle.id}`}
              className="absolute rounded-full bg-[#dfff1f]"
              style={{
                left: `${particle.x}vw`,
                top: `${particle.y}vh`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                boxShadow: '0 0 10px 2px rgba(223, 255, 31, 0.7)',
                zIndex: 51
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                transition: {
                  duration: particle.duration,
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Ana içerik animasyonu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;