"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Seperator } from "@/icons";

type CodeType<T, D> = {
  component: string;
  props: T;
  effect: string;
  render: string;
  dataType: D;
};

const style = {
  "hljs-comment": {
    color: "#B6B18B",
  },
  "hljs-quote": {
    color: "#B6B18B",
  },
  "hljs-variable": {
    color: "#a1a1a1",
  },
  "hljs-template-variable": {
    color: "#a1a1a1",
  },
  "hljs-tag": {
    color: "#a1a1a1",
  },
  "hljs-name": {
    color: "#a1a1a1",
  },
  "hljs-selector-id": {
    color: "#a1a1a1",
  },
  "hljs-selector-class": {
    color: "#a1a1a1",
  },
  "hljs-regexp": {
    color: "#a1a1a1",
  },
  "hljs-deletion": {
    color: "#a1a1a1",
  },
  "hljs-number": {
    color: "#dfff1f",
  },
  "hljs-built_in": {
    color: "#dfff1f",
  },
  "hljs-builtin-name": {
    color: "#dfff1f",
  },
  "hljs-literal": {
    color: "#dfff1f",
  },
  "hljs-type": {
    color: "#dfff1f",
  },
  "hljs-params": {
    color: "#dfff1f",
  },
  "hljs-meta": {
    color: "#dfff1f",
  },
  "hljs-link": {
    color: "#dfff1f",
  },
  "hljs-attribute": {
    color: "#EE7C2B",
  },
  "hljs-string": {
    color: "#dfff1f",
  },
  "hljs-symbol": {
    color: "#dfff1f",
  },
  "hljs-bullet": {
    color: "#dfff1f",
  },
  "hljs-addition": {
    color: "#dfff1f",
  },
  "hljs-title": {
    color: "#dfff1f",
  },
  "hljs-section": {
    color: "#dfff1f",
  },
  "hljs-keyword": {
    color: "#4c4c4c",
  },
  "hljs-selector-tag": {
    color: "#4c4c4c",
  },
  hljs: {
    display: "block",
    overflowX: "hidden" as "hidden",
    background: "black",
    color: "#a1a1a1",
    padding: "0.5em",
    fontFamily: "inherit",
  },
  "hljs-emphasis": {
    fontStyle: "normal",
  },
  "hljs-strong": {
    fontWeight: "bold",
  },
};

const EditorBento = () => {
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [blurredSide, setBlurredSide] = useState<"left" | "right" | null>(null);
  const [lastSplitPos, setLastSplitPos] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  // Define spring-based easing for more natural animations
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.5
  };

  const badCode: CodeType<{ count: number; data: string[] }, string> = {
    component: "BadComponent",
    props: { count: 0, data: [] },
    dataType: "string",
    effect: `
  // Multiple problems in this effect:
  // 1. Dependency on count causes infinite loop
  // 2. No error handling
  // 3. No loading state
  // 4. Direct state mutation in dependency
  useEffect(() => {
    console.log("Fetching data...")
    setCount(count + 1) // This causes infinite re-renders!
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data))
      // Missing error handling completely
  }, [count]) // Incorrect dependency causes infinite loop`,
    render: `
  // Multiple problems in rendering:
  // 1. Missing key or using random keys
  // 2. No loading or error states
  // 3. Inefficient event handler
  return (
    <div>
      {/* Random keys cause full re-renders and break component state */}
      {data.map(item => <div key={Math.random()}>{item}</div>)}
      
      {/* Inline function creates new function each render */}
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )`,
  };

  const goodCode: CodeType<{ count: number; data: string[] }, string> = {
    component: "GoodComponent",
    props: { count: 0, data: [] },
    dataType: "string",
    effect: `
  // Good practices:
  // 1. Using an empty dependency array to run once
  // 2. Proper async/await with error handling
  // 3. Using loading state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('https://api.example.com/data')
        if (!response.ok) {
          throw new Error(\`HTTP error! Status: \${response.status}\`)
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, []) // Empty dependency array runs once on mount`,
    render: `
  // Good practices:
  // 1. Handling loading and error states
  // 2. Stable key prop using index
  // 3. Function updater pattern for state
  // 4. Memoization opportunities
  if (isLoading) return <div>Loading data...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.length === 0 ? (
        <div>No data available</div>
      ) : (
        // Using index as key is OK when list is static
        data.map((item, index) => <div key={index}>{item}</div>)
      )}
      
      {/* Using function updater form prevents stale closures */}
      <button onClick={() => setCount(prev => prev + 1)}>
        Count: {count}
      </button>
    </div>
  )`,
  };

  const generateCode = <T, D>(code: CodeType<T, D>): string =>
    `
function ${code.component}() {
  const [count, setCount] = useState<number>(${(code.props as any).count})
  const [data, setData] = useState<${code.dataType}[]>(${JSON.stringify(
      (code.props as any).data
    )})
${code.effect}
${code.render}
}
  `.trim();

  const handleMouseDown = () => {
    setIsDragging(true);
    setIsBlurred(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setBlurredSide(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const container = e.currentTarget.getBoundingClientRect();
      const newSplitPos =
        ((e.clientX - container.left) / container.width) * 100;
      if (newSplitPos > 0 && newSplitPos < 100) {
        setSplitPos(newSplitPos);
        if (newSplitPos > lastSplitPos) {
          setBlurredSide("right");
        } else if (newSplitPos < lastSplitPos) {
          setBlurredSide("left");
        }
        setLastSplitPos(newSplitPos);
      }
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging]);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={springTransition}
          className="relative bg-black shadow-lg rounded-xl w-full h-[380px] overflow-hidden border border-[#1d1d1d]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseEnter={() => setIsHovered(true)}
        >
          {/* Background glow effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              boxShadow: isHovered 
                ? "inset 0 0 15px rgba(223, 255, 31, 0.1)" 
                : "inset 0 0 0px rgba(223, 255, 31, 0)"
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Editor panels container */}
          <div className="flex h-full">
            <motion.div
              className="h-full overflow-hidden"
              style={{ width: `${splitPos}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              animate={{ width: `${splitPos}%` }}
            >
              <motion.div
                className="p-4 h-full font-mono text-sm text-white whitespace-pre-wrap"
                animate={{
                  filter: blurredSide === "left" ? "blur(2px)" : "blur(0px)",
                  opacity: blurredSide === "left" ? 0.7 : 1,
                  transition: { duration: 0.3 },
                }}
              >
                <SyntaxHighlighter language="javascript" style={style}>
                  {generateCode(badCode)}
                </SyntaxHighlighter>
              </motion.div>
            </motion.div>

            {/* Separator with enhanced styling and animation */}
            <motion.div
              className="relative bg-[#111] w-1 cursor-ew-resize flex items-center justify-center"
              onMouseDown={handleMouseDown}
              whileHover={{ scale: [1, 1.8, 1.5], backgroundColor: "#222" }}
              whileTap={{ scale: 0.9 }}
              animate={isDragging ? { 
                backgroundColor: "#dfff1f",
                boxShadow: "0 0 8px rgba(223, 255, 31, 0.5)"
              } : {}}
              transition={springTransition}
            >
              {/* Separator icon with animation */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={isDragging ? { 
                  rotate: [0, 90, 180, 270, 360],
                  transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                } : {}}
              >
                <Seperator className="text-[#dfff1f] opacity-80" />
              </motion.div>
              
              {/* Glowing dots on the divider */}
              {isDragging && (
                <>
                  <motion.div 
                    className="absolute w-1 h-1 rounded-full bg-[#dfff1f]"
                    style={{ top: '20%' }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      boxShadow: ["0 0 2px #dfff1f", "0 0 5px #dfff1f", "0 0 2px #dfff1f"]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute w-1 h-1 rounded-full bg-[#dfff1f]"
                    style={{ top: '80%' }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      boxShadow: ["0 0 2px #dfff1f", "0 0 5px #dfff1f", "0 0 2px #dfff1f"]
                    }}
                    transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
                  />
                </>
              )}
            </motion.div>

            {/* Right (Good Code) */}
            <motion.div
              className="bg-black h-full overflow-hidden"
              style={{ width: `${100 - splitPos}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              animate={{ width: `${100 - splitPos}%` }}
            >
              <motion.div
                className="p-4 h-full font-mono text-sm text-white whitespace-pre-wrap"
                animate={{
                  filter: blurredSide === "right" ? "blur(2px)" : "blur(0px)",
                  opacity: blurredSide === "right" ? 0.7 : 1,
                  transition: { duration: 0.3 },
                }}
              >
                <SyntaxHighlighter language="javascript" style={style}>
                  {generateCode(goodCode)}
                </SyntaxHighlighter>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Labels */}
          <motion.div 
            className="absolute top-3 left-3 text-xs text-[#dfff1f]/60 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Bad Practice
          </motion.div>
          <motion.div 
            className="absolute top-3 right-3 text-xs text-[#dfff1f]/60 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Good Practice
          </motion.div>
          
          {/* Interactive drag hint - shows only initially */}
          <AnimatePresence>
            {!isDragging && splitPos === 50 && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#111]/80 px-3 py-1.5 rounded-full text-xs text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                Drag to compare
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorBento;
