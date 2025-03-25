'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Transition bağlamı için tipler
type TransitionContextType = {
  isTransitioning: boolean;
  transitionName: string | null;
  startTransition: (name?: string) => void;
  completeTransition: () => void;
  previousPath: string | null;
  currentPath: string;
};

// Varsayılan context değerleri
const defaultContext: TransitionContextType = {
  isTransitioning: false,
  transitionName: null,
  startTransition: () => {},
  completeTransition: () => {},
  previousPath: null,
  currentPath: '/',
};

// Context oluşturma
const TransitionContext = createContext<TransitionContextType>(defaultContext);

// Hook kullanımı için
export const useTransition = () => useContext(TransitionContext);

interface TransitionProviderProps {
  children: ReactNode;
  transitionTime?: number; // milisaniye cinsinden geçiş süresi
}

export const TransitionProvider = ({
  children,
  transitionTime = 800,
}: TransitionProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Geçiş durumunu yönetme
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionName, setTransitionName] = useState<string | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(pathname);

  // Sayfa değişikliği olduğunda izleme
  useEffect(() => {
    // İlk yükleme ise, geçiş durumunu atlama
    if (currentPath !== pathname) {
      setPreviousPath(currentPath);
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

  // Geçiş başlatma işlevi
  const startTransition = (name: string = 'default') => {
    setIsTransitioning(true);
    setTransitionName(name);

    // Geçiş tamamlandığında temizleme
    setTimeout(() => {
      completeTransition();
    }, transitionTime);
  };

  // Geçişi tamamlama
  const completeTransition = () => {
    setIsTransitioning(false);
    setTransitionName(null);
  };

  // Context değerleri
  const contextValue: TransitionContextType = {
    isTransitioning,
    transitionName,
    startTransition,
    completeTransition,
    previousPath,
    currentPath,
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;