"use client";
import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import dynamic from "next/dynamic";
import { projects, work } from "@/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextReveal from "@/components/TextReveal";
import Card from "@/app/sections/Card";
import Work from "@/app/sections/Work";
import {
  applyCoreWebVitalsOptimizations,
  preconnectToOrigins,
  preloadResources,
} from "@/utils/performanceUtils";
import { getCriticalResourcesForPath } from "@/config/performance";
import { LoadingFallback } from "@/components/LoadingFallback";

const Languages = dynamic(() => import("../BentoElements/Languages"), {
  loading: () => (
    <LoadingFallback variant="bento" height="min-h-[420px] lg:h-full" />
  ),
  ssr: false,
});

const AdventureWidget = dynamic(
  () => import("@/components/BentoElements/AdventureWidget"),
  {
    loading: () => (
      <LoadingFallback variant="terminal" height="min-h-[420px] lg:h-full" />
    ),
    ssr: false,
  },
);

const CurrentFocusBento = dynamic(
  () => import("@/components/BentoElements/CurrentFocusBento"),
  {
    loading: () => (
      <LoadingFallback variant="focus" height="min-h-[340px] h-full" />
    ),
    ssr: false,
  },
);

const ProfileCard = dynamic(() => import("@/components/LinkedInProfile"), {
  loading: () => (
    <LoadingFallback variant="profile" height="h-full min-h-[360px]" />
  ),
  ssr: false,
});

// Main component - optimized performance
export default function ClientHome() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

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
      <main className="px-4 md:px-0">
        <div className="md:p-0">
          <Header />
          <div className="w-full max-w-screen">
            <div>
              <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
                <div className="flex lg:flex-row flex-col items-stretch gap-4">
                  <div className="flex w-full lg:w-8/12">
                    <div className="h-full w-full flex-1">
                      <Languages />
                    </div>
                  </div>

                  <div className="flex w-full lg:w-4/12">
                    <div className="h-full w-full flex-1">
                      <AdventureWidget />
                    </div>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col items-stretch gap-4">
                  <div className="flex flex-col w-full lg:w-9/12">
                    <div className="my-5 mb-0 md:mb-10 w-full h-full flex-1 overflow-hidden">
                      <CurrentFocusBento />
                    </div>
                  </div>

                  <div className="flex flex-col w-full lg:w-3/12">
                    <div className="relative my-5 mb-10 w-full h-full flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
                      <div
                        className="pointer-events-none absolute inset-0"
                        aria-hidden="true"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(223,255,31,0.12), transparent 34%), radial-gradient(circle at bottom right, rgba(223,255,31,0.07), transparent 30%)",
                        }}
                      />

                      <div className="relative flex h-full flex-col p-8">
                        <h4 className="mb-8 font-light text-2xl text-white">
                          follow the{" "}
                          <span className="font-light text-[#dfff1f] text-2xl">
                            adventure
                          </span>
                          <p className="text-sm text-gray-400">
                            Can you contact actor?
                          </p>
                        </h4>

                        <div className="flex flex-1 flex-col justify-end gap-4">
                          <ProfileCard />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-center items-center bg-black min-h-[60vh] md:min-h-[80vh] rounded-lg overflow-hidden">
              {/* Subtle background accents */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dfff1f]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dfff1f]/20 to-transparent" />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]"
                  style={{
                    background:
                      "radial-gradient(circle, #dfff1f 0%, transparent 70%)",
                  }}
                />
              </div>

              {/* Section label */}
              <span className="relative text-[10px] font-mono uppercase tracking-[0.3em] text-[#dfff1f]/40 mb-6">
                Featured Work
              </span>

              {/* Main reveal text */}
              <TextReveal text="Projects I took part in action." />

              {/* Bottom indicator */}
              <div className="relative flex items-center gap-3 mt-8">
                <span className="w-8 h-[1px] bg-white/10" />
                <span className="text-[10px] font-mono text-white/20 tracking-wider">
                  SCROLL TO EXPLORE
                </span>
                <span className="w-8 h-[1px] bg-white/10" />
              </div>
            </div>

            <section
              ref={container}
              className="relative mt-10"
              aria-label="Projects"
            >
              {projects.map((project, i) => {
                const targetScale = 1 - (projects.length - i) * 0.05;
                return (
                  <Card
                    key={`p_${i}`}
                    i={i}
                    {...project}
                    company={project.company || ""}
                    accent={project.accent || "#dfff1f"}
                    progress={scrollYProgress}
                    range={[i * 0.25, 1]}
                    targetScale={targetScale}
                    link={project.link || ""}
                  />
                );
              })}
            </section>

            <section
              className="relative mt-[10vh] w-full"
              aria-label="Work Experience"
            >
              <div className="top-0 sticky flex flex-col justify-center items-center bg-black w-full min-h-screen text-white pb-12">
                {/* Section header */}
                <div className="flex flex-col items-center mb-12 md:mb-16">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#dfff1f]/50 mb-4">
                    Career Path
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white/10">
                    Work Experience
                  </h2>
                </div>

                {/* Timeline */}
                <div className="flex flex-col w-full max-w-4xl px-4 md:px-8 pb-12">
                  {work.map((w, i) => {
                    return (
                      <Work key={i} {...w} accent={w.accent || "#dfff1f"} />
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
