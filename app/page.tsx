"use client";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useScroll } from "framer-motion";
import WordRotate from "@/components/ui/word-rotate";
import { projects, work } from "@/data";
import Card from "./sections/Card";
import TextReveal from "@/components/TextReveal";
import Work from "./sections/Work";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = 'force-static'

// Lazy load non-critical components
const Languages = lazy(() => import("@/components/BentoElements/Languages"));
const EditorBento = lazy(() => import("@/components/Editor"));
const ProfileCard = lazy(() => import("@/components/LinkedInProfile"));
const VelocityScroll = lazy(() => import("@/components/ScrollText").then(mod => ({ default: mod.VelocityScroll })));

// Simplified grid size
const gridSize = { rows: 5, cols: 11 };
const heartPattern = [
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

const getRandomGrid = () => {
  return Array.from({ length: gridSize.rows }, () =>
    Array.from({ length: gridSize.cols }, () => (Math.random() < 0.3 ? 1 : 0))
  );
};

const GridHeart = () => {
  const [grid, setGrid] = useState(() => getRandomGrid());
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      setGrid(heartPattern as (0 | 1)[][]);
    } else {
      setGrid(getRandomGrid());
    }
  }, [hovered]);

  return (
    <div
      className="grid"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className="cell transition-colors duration-300"
            style={{
              backgroundColor: cell ? "#4caf50" : "#444",
            }}
          />
        ))
      )}
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="p-4 animate-pulse bg-[#222] rounded-xl h-full w-full">
    <div className="h-6 bg-[#333] rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-[#333] rounded w-1/2"></div>
  </div>
);

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Remove Lenis smooth scrolling for maximum performance
  // We're prioritizing instant page transitions over smooth scrolling


  return (
    <>
      <div className="md:p-0">
        <Header />
        <main className="w-full max-w-screen">
          <div>
            <div className="md:mx-auto my-4 p-4 rounded-lg w-full lg:container">
              <div className="flex lg:flex-row flex-col gap-4">
                <div className="w-full lg:w-8/12 max-h-[500px] overflow-y-auto">
                  <Suspense fallback={<LoadingFallback />}>
                    <Languages />
                  </Suspense>
                </div>

                <div className="w-full lg:w-4/12">
                  <div className="bg-[#1D1D1D] p-4 rounded-xl w-full h-full max-h-[500px] overflow-y-auto">
                    <h3 className="flex items-center gap-2 font-light text-white text-xl">
                      Adventure is live on{" "}
                      <span className="flex text-[#dfff1f]">
                        <WordRotate
                          words={["Github", "Azure DevOps", "Gitlab"]}
                        />
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm">
                      The places change, the adventure does not.
                    </p>
                    <GridHeart />
                  </div>
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
                    <Suspense fallback={<LoadingFallback />}>
                      <EditorBento />
                    </Suspense>
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
                      <Suspense fallback={<LoadingFallback />}>
                        <ProfileCard />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 flex justify-center items-center bg-black rounded-lg min-h-64">
            <TextReveal text="Projects I took part in action." />
          </div>

          <main ref={container} className="relative mt-10">
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
          </main>
          <main className="relative mt-[10vh] w-full">
            <div className="top-0 sticky flex flex-col justify-center items-center bg-black w-full h-screen text-white pb-12">
              <Suspense fallback={<h2 className="text-4xl md:text-7xl text-white/20">Work Experience</h2>}>
                <VelocityScroll
                  text="Work Experience"
                  default_velocity={1}
                  className="drop-shadow-sm font-bold font-display text-4xl text-center text-white/20 md:text-7xl dark:text-white md:leading-[5rem] tracking-[-0.02em]"
                />
              </Suspense>
              <div className="flex flex-col px-0 md:p-8 w-full min-w-screen max-w-6xl mt-12">
                {work.map((work, i) => {
                  return <Work key={i} {...work} />;
                })}
              </div>
            </div>
          </main>
        </main>
      </div>
      <Footer />
    </>
  );
}
