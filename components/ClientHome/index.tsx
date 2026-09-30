"use client";
import { useEffect } from "react";
import { projects, work } from "@/data";
import Header from "@/components/Header";
import HeroSection from "@/components/hero/HeroSection";
import TopSection from "@/components/Top";
import Footer from "@/components/Footer";
import ProjectsReveal from "@/components/ProjectsReveal";
import Projects from "@/components/Projects";
import Work from "@/app/sections/Work";
import {
  applyCoreWebVitalsOptimizations,
  preconnectToOrigins,
  preloadResources,
} from "@/utils/performanceUtils";
import { getCriticalResourcesForPath } from "@/config/performance";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Main component - optimized performance
export default function ClientHome({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  // Performance optimizations
  useEffect(() => {
    // Core Web Vitals metriklerini iyileştir
    applyCoreWebVitalsOptimizations();

    // Preconnect to important origins
    preconnectToOrigins([
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdn.vercel-insights.com",
    ]);

    // Preload critical resources for homepage
    preloadResources(getCriticalResourcesForPath("/"));

    // Görüntüler yüklendiğinde LCP iyileştirmesi
    const onContentLoaded = () => {
      const lcpElements = document.querySelectorAll('[data-lcp="true"]');
      lcpElements.forEach((element) => {
        if (element instanceof HTMLImageElement) {
          element.setAttribute("fetchpriority", "high");
          element.setAttribute("loading", "eager");
        }
      });
    };

    // sayfa yüklendiğinde çalıştır
    if (document.readyState === "complete") {
      onContentLoaded();
    } else {
      window.addEventListener("load", onContentLoaded);
    }

    return () => {
      window.removeEventListener("load", onContentLoaded);
    };
  }, []);

  return (
    <>
      {/* Footer sticky olarak altta bekler; bu katman onun üzerinden kayar.
          Opak arka plan + z-10 olmadan footer içerikten görünürdü. */}
      <div className="relative z-10 bg-[#1D1D1D]">
        <main id="main-content">
        {/* Sayfanın tek h1'i HeroSection'da. Header ve üst bento hero'nun
            pinlenen bloğunun içinde, canvas'ın altında durur: sekans sonunda
            canvas söndüğünde görünen, yerinde duran bu gerçek içeriktir. */}
        <HeroSection dict={dict}>
          {/* Header ve üst bölüm aynı yatay boşlukta (mobilde Header kenara yapışıyordu). */}
          <div className="px-4 md:px-0">
            <Header locale={locale} dict={dict} />
            <div className="mx-auto my-4 w-full lg:container">
              <TopSection locale={locale} dict={dict} />
            </div>
          </div>
        </HeroSection>
        <div className="px-4 md:px-0">
          <div className="w-full max-w-screen">
            <ProjectsReveal
              eyebrow={dict.home.featuredWork}
              text={dict.home.projectsReveal}
              hint={dict.home.scrollToExplore}
            />

            <Projects projects={projects} dict={dict} locale={locale} />

            <section
              className="relative mt-[10vh] w-full"
              aria-label={dict.home.workAria}
            >
              {/* Mobilde kenardan kenara (ebeveynin px-4 boşluğunu taşar). */}
              <div className="top-0 sticky -mx-4 flex w-[calc(100%+2rem)] flex-col justify-center items-center bg-black min-h-screen text-white pb-12 md:mx-0 md:w-full">
                {/* Section header */}
                <div className="flex flex-col items-center mb-12 md:mb-16">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#dfff1f]/80 mb-4">
                    {dict.home.careerPath}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white/40">
                    {dict.home.workExperience}
                  </h2>
                </div>

                {/* Timeline */}
                <div className="flex flex-col w-full max-w-4xl px-4 md:px-8 pb-12">
                  {work.map((w, i) => {
                    return (
                      <Work key={i} {...w} accent={w.accent || "#dfff1f"} dict={dict} locale={locale} />
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
        </main>
      </div>
      <Footer dict={dict} />
    </>
  );
}
