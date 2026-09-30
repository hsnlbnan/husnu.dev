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
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// NOT: Bu bileşenler bilinçli olarak server-render edilir (ssr: false YOK).
// Aksi halde ana sayfanın metin içeriğinin yarısı server HTML'ine hiç girmez ve
// JS çalıştırmayan crawler'lar (Googlebot ilk geçiş, GPTBot, ClaudeBot,
// PerplexityBot) sayfayı yarım görür. Tarayıcı API'leri yalnızca useEffect ve
// event handler'lar içinde kullanıldığı için SSR güvenlidir.
const Languages = dynamic(() => import("../BentoElements/Languages"), {
  loading: () => (
    <LoadingFallback variant="bento" height="min-h-[420px] lg:h-full" />
  ),
});

const AdventureWidget = dynamic(
  () => import("@/components/BentoElements/AdventureWidget"),
  {
    loading: () => (
      <LoadingFallback variant="terminal" height="min-h-[420px] lg:h-full" />
    ),
  },
);

const CurrentFocusBento = dynamic(
  () => import("@/components/BentoElements/CurrentFocusBento"),
  {
    loading: () => (
      <LoadingFallback variant="focus" height="min-h-[340px] h-full" />
    ),
  },
);

const ProfileCard = dynamic(() => import("@/components/LinkedInProfile"), {
  loading: () => (
    <LoadingFallback variant="profile" height="h-full min-h-[360px]" />
  ),
});

// Main component - optimized performance
export default function ClientHome({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
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
      {/* Footer sticky olarak altta bekler; bu katman onun üzerinden kayar.
          Opak arka plan + z-10 olmadan footer içerikten görünürdü. */}
      <div className="relative z-10 bg-[#1D1D1D]">
        <Header locale={locale} dict={dict} />
        <main id="main-content" className="px-4 md:px-0">
        <div className="md:p-0">
          {/* Sayfanın tek h1'i. Bento tasarımında görünür bir başlık alanı
              olmadığı için görsel olarak gizli, ancak meta description ve
              llms.txt ile birebir tutarlı. */}
          <h1 className="sr-only">{dict.home.h1}</h1>
          <div className="w-full max-w-screen">
            <div>
              <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
                <div className="flex lg:flex-row flex-col items-stretch gap-4">
                  <div className="flex w-full lg:w-8/12">
                    <div className="h-full w-full flex-1">
                      <Languages dict={dict} />
                    </div>
                  </div>

                  <div className="flex w-full lg:w-4/12">
                    <div className="h-full w-full flex-1">
                      <AdventureWidget dict={dict} />
                    </div>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col items-stretch gap-4">
                  <div className="flex flex-col w-full lg:w-9/12">
                    <div className="my-5 mb-0 md:mb-10 w-full h-full flex-1 overflow-hidden">
                      <CurrentFocusBento dict={dict} />
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
                        <div className="mb-8">
                          <h2 className="font-light text-2xl text-white">
                            {dict.home.adventureTitle}{" "}
                            <span className="font-light text-[#dfff1f] text-2xl">
                              {dict.home.adventureAccent}
                            </span>
                          </h2>
                          <p className="mt-1 text-sm text-gray-400">
                            {dict.home.adventureSubtitle}
                          </p>
                        </div>

                        <div className="flex flex-1 flex-col justify-end gap-4">
                          <ProfileCard dict={dict} />
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
              <span className="relative text-[10px] font-mono uppercase tracking-[0.3em] text-[#dfff1f]/80 mb-6">
                {dict.home.featuredWork}
              </span>

              {/* Main reveal text */}
              <TextReveal text={dict.home.projectsReveal} />

              {/* Bottom indicator */}
              <div className="relative flex items-center gap-3 mt-8">
                <span className="w-8 h-[1px] bg-white/10" />
                <span className="text-[10px] font-mono text-white/70 tracking-wider">
                  {dict.home.scrollToExplore}
                </span>
                <span className="w-8 h-[1px] bg-white/10" />
              </div>
            </div>

            <section
              ref={container}
              className="relative mt-10"
              aria-label={dict.home.projectsAria}
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
                    dict={dict}
                    locale={locale}
                  />
                );
              })}
            </section>

            <section
              className="relative mt-[10vh] w-full"
              aria-label={dict.home.workAria}
            >
              <div className="top-0 sticky flex flex-col justify-center items-center bg-black w-full min-h-screen text-white pb-12">
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
