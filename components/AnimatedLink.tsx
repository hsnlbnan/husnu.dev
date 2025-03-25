'use client';

import React, { ReactNode, AnchorHTMLAttributes, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTransition } from './TransitionProvider';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

interface AnimatedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  transitionName?: string;
  className?: string;
  textGlow?: boolean;
  variant?: 'minimal' | 'underline' | 'magnetic' | 'highlight';
}

const AnimatedLink = ({
  href,
  children,
  transitionName,
  className = '',
  textGlow = false,
  variant = 'minimal',
  ...props
}: AnimatedLinkProps) => {
  const { startTransition } = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef<HTMLAnchorElement>(null);
  const controls = useAnimationControls();

  // Harici link kontrolü
  const isExternalLink = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  useEffect(() => {
    if (isHovering && variant === 'magnetic') {
      const linkElement = linkRef.current;
      if (!linkElement) return;

      const rect = linkElement.getBoundingClientRect();
      const linkCenterX = rect.left + rect.width / 2;
      const linkCenterY = rect.top + rect.height / 2;
      const distanceX = mousePosition.x - linkCenterX;
      const distanceY = mousePosition.y - linkCenterY;

      // Manyetik çekme efekti - hareketin mesafeye bağlı olması
      // Mesafe arttıkça çekme etkisi azalır
      const maxDistance = Math.min(rect.width, rect.height) * 0.5;
      const normalizedX = (distanceX / maxDistance) * 6; // Çekim gücünü ayarla
      const normalizedY = (distanceY / maxDistance) * 3;

      controls.start({
        x: normalizedX,
        y: normalizedY,
        transition: { type: 'spring', stiffness: 150, damping: 15 }
      });
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } });
    }
  }, [isHovering, mousePosition, controls, variant]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === 'magnetic') {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd + tıklama veya orta tuşla tıklama ise yeni sekmede açılmasına izin ver
    if (e.ctrlKey || e.metaKey || e.button === 1 || isExternalLink) {
      return;
    }

    e.preventDefault();

    // Tıklama animasyonu - küçük bir pulsing efekti
    controls.start({
      scale: [0.98, 1.02, 1],
      transition: { duration: 0.3 }
    });

    // Geçiş animasyonunu başlat
    startTransition(transitionName);

    // Sayfa değişimini geciktir (animasyon süresi kadar)
    setTimeout(() => {
      window.location.href = href;
    }, 600);
  };

  // Varyanta göre stillendirme
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'underline':
        return 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#dfff1f] after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out';
      case 'highlight':
        return 'transition-colors duration-300 ease-in-out';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="inline-block relative"
      animate={controls}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
    >
      <Link
        ref={linkRef}
        href={href}
        className={`relative ${getVariantStyles()} ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        {/* Highlight varyantı için arka plan efekti */}
        {variant === 'highlight' && isHovering && (
          <motion.div
            className="absolute inset-0 bg-[#dfff1f] bg-opacity-10 rounded-sm z-[-1]"
            layoutId="highlightBg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Minimal varyantı için basit çizgi efekti */}
        {variant === 'minimal' && isHovering && !isExternalLink && (
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-[#dfff1f]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 0.7 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Text glow efekti - harfleri parlatma */}
        <motion.span
          animate={{
            textShadow: isHovering && textGlow
              ? '0 0 8px rgba(223, 255, 31, 0.5)'
              : '0 0 0px rgba(223, 255, 31, 0)',
            color: isHovering && variant === 'highlight'
              ? '#fff'
              : 'inherit',
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default AnimatedLink;