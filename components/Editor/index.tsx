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

  const badCode: CodeType<{ count: number; data: string[] }, string> = {
    component: "BadComponent",
    props: { count: 0, data: [] },
    dataType: "string",
    effect: `
  useEffect(() => {
    setCount(count + 1)
    fetch('https://api.example.com/data')
      .then(data => setData(data))
  }, [count])`,
    render: `
  return (
    <div>
      {data.map(item => <div key={Math.random()}>{item}</div>)}
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  )`,
  };

  const goodCode: CodeType<{ count: number; data: string[] }, string> = {
    component: "GoodComponent",
    props: { count: 0, data: [] },
    dataType: "string",
    effect: `
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('https://api.example.com/data')
      setData(await result.json())
    }
    fetchData()
  }, [])`,
    render: `
  return (
    <div>
      {data.map((item, index) => <div key={index}>{item}</div>)}
      <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative bg-black shadow-lg rounded-lg w-full h-[380px] overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex h-full">
            <motion.div
              className="h-full overflow-hidden"
              style={{ width: `${splitPos}%` }}
              transition={{ duration: 0.1 }}
              animate={{ width: `${splitPos}%` }}
            >
              <motion.div
                className="p-4 h-full font-mono text-sm text-white whitespace-pre-wrap"
                animate={{
                  filter: blurredSide === "left" ? "blur(2px)" : "blur(0px)",
                  transition: { duration: 0.2 },
                }}
              >
                <SyntaxHighlighter language="javascript" style={style}>
                  {generateCode(badCode)}
                </SyntaxHighlighter>
              </motion.div>
            </motion.div>

            {/* Ayırıcı */}
            <motion.div
              className="relative bg-[#111] w-1 cursor-ew-resize"
              onMouseDown={handleMouseDown}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* seperator icon */}
              <Seperator className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2" />
            </motion.div>

            {/* Sağ (İyi Kod) */}
            <motion.div
              className="bg-black h-full overflow-hidden"
              style={{ width: `${100 - splitPos}%` }}
              transition={{ duration: 0.1 }}
              animate={{ width: `${100 - splitPos}%` }}
            >
              <motion.div
                className="p-4 h-full font-mono text-sm text-white whitespace-pre-wrap"
                animate={{
                  filter: blurredSide === "right" ? "blur(2px)" : "blur(0px)",
                  transition: { duration: 0.2 },
                }}
              >
                <SyntaxHighlighter language="javascript" style={style}>
                  {generateCode(goodCode)}
                </SyntaxHighlighter>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorBento;
