"use client";
import React, { useState, useEffect } from "react";
import Content from "../Content";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    
    // İlk yükleme için
    setMatches(media.matches);

    // Değişiklikleri dinle
    media.addListener(listener);
    
    // Temizleme fonksiyonu
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}

export default function Footer() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <footer className="relative min-h-screen flex flex-col">
        <div className="flex-grow">
          <Content />
        </div>
        <div className="h-[env(safe-area-inset-bottom, 0px)]" />
      </footer>
    );
  } else {
    return (
      <div
        className="relative h-screen"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="bottom-0 fixed w-full h-[100vh]">
          <Content />
        </div>
      </div>
    );
  }
}
