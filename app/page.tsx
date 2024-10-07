"use client";
import Languages from "@/components/BentoElements/Languages";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, useScroll } from "framer-motion";
import WordRotate from "@/components/ui/word-rotate";
import EditorBento from "@/components/Editor";
import ProfileCard from "@/components/LinkedInProfile";
import { projects, work } from "@/data";
import Card from "./sections/Card";
import Lenis from "@studio-freight/lenis";
import TextReveal from "@/components/TextReveal";
import Work from "./sections/Work";
import { VelocityScroll } from "@/components/ScrollText";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import Footer from "@/components/Footer";

const gridSize = { rows: 5, cols: 11 }; // Grid boyutu 11x5
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
  const [grid, setGrid] = useState(getRandomGrid());
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
          <motion.div
            key={`${rowIndex}-${cellIndex}`}
            className="cell"
            animate={{
              backgroundColor: cell ? "#4caf50" : "#444",
            }}
            transition={{ duration: 0.5 }}
          />
        ))
      )}
    </div>
  );
};

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <Header />
      <main className="w-full max-w-screen">
        <div className="max-h-[100dvh]">
          <div className="mx-auto max-w-7xl">
            <div className="flex lg:flex-row flex-col gap-4">
              <div className="w-full lg:w-8/12 max-h-[500px] overflow-y-auto">
                <Languages />
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
                {/* editable code editor here */}
                <div className="bg-[#1D1D1D] my-5 mb-0 md:mb-10 p-8 rounded-xl w-full overflow-hidden">
                  <h4 className="mb-8 font-light text-2xl text-white">
                    The adventure always{" "}
                    <span className="font-light text-[#dfff1f] text-2xl">
                      follows the rules
                    </span>
                  </h4>
                  <Suspense fallback={<div>Loading...</div>}>
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
          <div className="top-0 sticky flex flex-col justify-center items-center bg-black w-full h-screen text-white">
            <VelocityScroll
              text="Work Experience"
              default_velocity={1}
              className="drop-shadow-sm font-bold font-display text-4xl text-center text-white/20 md:text-7xl dark:text-white md:leading-[5rem] tracking-[-0.02em]"
            />
            <div className="flex flex-col p-8 w-full min-w-screen max-w-6xl">
              {work.map((work, i) => {
                return <Work key={i} {...work} />;
              })}
            </div>
          </div>
        </main>
      </main>

      <Footer />
    </>
  );
}
