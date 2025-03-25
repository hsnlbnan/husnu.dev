'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, cubicBezier } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTransition } from './TransitionProvider';

// Özel bezier eğrileri
const springEase = [0.22, 1, 0.36, 1];
const sharpEase = cubicBezier(0.25, 0.0, 0.3, 1);

// Ana Geçiş Efekti - Slick ve Minimal
const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { isTransitioning, transitionName } = useTransition();
  const [mode, setMode] = useState<'slice' | 'fade' | 'reveal' | 'morph'>('slice');
  const controls = useAnimation();

  // Geçiş modunu rastgele belirle veya belirtilen moda ayarla
  useEffect(() => {
    if (isTransitioning) {
      if (transitionName === 'slice' || transitionName === 'fade' ||
          transitionName === 'reveal' || transitionName === 'morph') {
        setMode(transitionName as any);
      } else {
        // Rastgele mod seç
        const modes: Array<'slice' | 'fade' | 'reveal' | 'morph'> = ['slice', 'fade', 'reveal', 'morph'];
        setMode(modes[Math.floor(Math.random() * modes.length)]);
      }
    }
  }, [isTransitioning, transitionName]);

  // Her geçiş animasyonu modu için ana içerik varyantları
  const contentVariants = {
    initial: {
      opacity: 0,
      y: mode === 'fade' ? 10 : 0,
      scale: mode === 'morph' ? 0.98 : 1,
      filter: mode === 'morph' ? 'blur(5px)' : 'blur(0px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: springEase
      }
    },
    exit: {
      opacity: 0,
      y: mode === 'fade' ? -10 : 0,
      scale: mode === 'morph' ? 0.98 : 1,
      filter: mode === 'morph' ? 'blur(5px)' : 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: springEase
      }
    }
  };

  return (
    <div className="page-transition relative w-full overflow-hidden">
      {/* Slice Mode - İnce çizgi dilimleriyle geçiş */}
      {isTransitioning && mode === 'slice' && <SliceTransition />}

      {/* Reveal Mode - Kademeli açığa çıkarma */}
      {isTransitioning && mode === 'reveal' && <RevealTransition />}

      {/* Ana içerik animasyonu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={contentVariants}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Dilimli Geçiş: Ekranı dikey dilimlerle böler ve onları kademeli olarak hareket ettirir
const SliceTransition = () => {
  // Dilim sayısı (tek sayılar daha estetik görünüyor)
  const sliceCount = 5;

  // Patika ID'si (benzersizlik için)
  const pathId = useMemo(() => `slice-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg
        className="w-full h-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <linearGradient id={`gradient-${pathId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dfff1f', stopOpacity: 0.7 }} />
            <stop offset="100%" style={{ stopColor: '#dfff1f', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Dilimler */}
        {Array.from({ length: sliceCount }).map((_, i) => {
          const offsetX = i % 2 === 0 ? -100 : 100;
          const width = 100 / sliceCount;
          const delay = i * 0.04;

          return (
            <motion.rect
              key={`slice-${i}`}
              x={`${i * width}%`}
              y="0"
              width={`${width + 0.5}%`} // Kenarları biraz üst üste bindirerek boşlukları önle
              height="100%"
              fill="black"
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: [0, offsetX, offsetX * 2],
                transition: {
                  duration: 0.6,
                  delay,
                  ease: sharpEase,
                }
              }}
            />
          );
        })}

        {/* İnce parlak çizgi efekti */}
        <motion.line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke={`url(#gradient-${pathId})`}
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0],
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(223, 255, 31, 0.6))"
          }}
        />
      </svg>
    </div>
  );
};

// Açığa Çıkarma Geçişi: İçeriği kademeli olarak açığa çıkaran şık bir perde efekti
const RevealTransition = () => {
  const pathId = useMemo(() => `reveal-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Üst kaplama - kaybolan perde */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.1, 0],
          transition: { duration: 0.7, ease: springEase }
        }}
      />

      {/* İnce yatay çizgiler animasyonu */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`h-gradient-${pathId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dfff1f', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#dfff1f', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#dfff1f', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {Array.from({ length: 3 }).map((_, i) => {
          const yPosition = 25 + i * 25; // Eşit aralıklı çizgiler

          return (
            <motion.line
              key={`h-line-${i}`}
              x1="0%"
              y1={`${yPosition}%`}
              x2="100%"
              y2={`${yPosition}%`}
              stroke={`url(#h-gradient-${pathId})`}
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 0.6, 0],
                transition: {
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: "easeOut"
                }
              }}
              style={{
                filter: "drop-shadow(0 0 3px rgba(223, 255, 31, 0.5))",
                strokeDasharray: "4 2"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PageTransition;