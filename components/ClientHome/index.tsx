"use client";
import { useState, useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import dynamic from 'next/dynamic';
import { projects, work } from "@/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextReveal from "@/components/TextReveal";
import Card from "@/app/sections/Card";
import Work from "@/app/sections/Work";
import { applyCoreWebVitalsOptimizations, preconnectToOrigins, preloadResources } from "@/utils/performanceUtils";
import { getCriticalResourcesForPath } from "@/config/performance";
import { LoadingFallback } from "@/components/LoadingFallback";


const Languages = dynamic(() => import("../BentoElements/Languages"), {
  loading: () => <LoadingFallback />,
  ssr: false,
});

const AdventureWidget = dynamic(() => import("@/components/BentoElements/AdventureWidget"), {
  loading: () => <LoadingFallback />,
  ssr: false,
});

const EditorBento = dynamic(() => import("@/components/Editor"), {
  loading: () => <LoadingFallback />,
  ssr: false,
});

const ProfileCard = dynamic(() => import("@/components/LinkedInProfile"), {
  loading: () => <LoadingFallback />,
  ssr: false,
});

const VelocityScroll = dynamic(
  () => import("@/components/ScrollText").then(mod => ({ default: mod.VelocityScroll })),
  {
    loading: () => <h2 className="text-4xl md:text-7xl text-white/20">Work Experience</h2>,
    ssr: false,
  }
);

// Simplified grid size
const gridSize = { rows: 5, cols: 11 };
const heartPattern = [
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

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
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.vercel-insights.com'
    ]);
    
    // Preload critical resources for homepage
    preloadResources(getCriticalResourcesForPath('/'));

    // Görüntüler yüklendiğinde LCP iyileştirmesi
    const onContentLoaded = () => {
      const lcpElements = document.querySelectorAll('[data-lcp="true"]');
      lcpElements.forEach(element => {
        if (element instanceof HTMLImageElement) {
          element.setAttribute('fetchpriority', 'high');
          element.setAttribute('loading', 'eager');
        }
      });
    };

    // sayfa yüklendiğinde çalıştır
    if (document.readyState === 'complete') {
      onContentLoaded();
    } else {
      window.addEventListener('load', onContentLoaded);
    }

    return () => {
      window.removeEventListener('load', onContentLoaded);
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
                <div className="flex lg:flex-row flex-col gap-4">
                  <div className="w-full lg:w-9/12 max-h-[500px] overflow-y-auto">
                    <Languages />
                  </div>

                  <div className="w-full lg:w-3/12 h-full">
                    <AdventureWidget />
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col gap-4">
                  <div className="w-full lg:w-9/12">
                    <div className="bg-[#1D1D1D] my-5 mb-0 md:mb-10 p-4 md:p-8 rounded-xl w-full overflow-hidden">
                      <h4 className="mb-3 md:mb-8 font-light text-2xl text-white">
                        The adventure always <br className="visible md:hidden" />
                        <span className="font-light text-[#dfff1f] text-2xl">
                          follows the rules
                        </span>
                      </h4>
                      <EditorBento />
                    </div>
                  </div>

                  <div className="w-full lg:w-3/12">
                    <div className="bg-[#1D1D1D] my-5 mb-10 p-8 rounded-xl w-full overflow-hidden">
                      <h4 className="mb-8 font-light text-2xl text-white">
                        follow the{" "}
                        <span className="font-light text-[#dfff1f] text-2xl">
                          adventure
                        </span>
                        <p className="text-sm text-gray-400">
                          Can you contact actor?
                        </p>
                      </h4>

                      <div className="flex flex-col gap-4">
                        <ProfileCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 flex justify-center items-center bg-black rounded-lg min-h-64">
              <TextReveal text="Projects I took part in action." />
            </div>

            <section ref={container} className="relative mt-10" aria-label="Projects">
              {projects.map((project, i) => {
                const targetScale = 1 - (projects.length - i) * 0.05;
                return (
                  <Card
                    key={`p_${i}`}
                    i={i}
                    {...project}
                    company={project.company || ""}
                    progress={scrollYProgress}
                    range={[i * 0.25, 1]}
                    targetScale={targetScale}
                    link={project.link || ""}
                  />
                );
              })}
            </section>
            
            <section className="relative mt-[10vh] w-full" aria-label="Work Experience">
              <div className="top-0 sticky flex flex-col justify-center items-center bg-black w-full h-screen text-white pb-12">
                <VelocityScroll
                  text="Work Experience"
                  default_velocity={1}
                  className="drop-shadow-sm font-bold font-display text-4xl text-center text-white/20 md:text-7xl dark:text-white md:leading-[5rem] tracking-[-0.02em]"
                />
                <div className="flex flex-col px-0 md:p-8 w-full min-w-screen max-w-6xl mt-12 pb-12 mb-4">
                  {work.map((work, i) => {
                    return <Work key={i} {...work} />;
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