import * as React from "react";
import { SVGProps, memo } from "react";
import { motion, useAnimation } from "framer-motion";

const ResumeIcon = (props: SVGProps<SVGSVGElement>) => {
  const controls = useAnimation();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      onMouseEnter={() => controls.start({ strokeDasharray: "100 0" })}
      onMouseLeave={() => controls.start({ strokeDasharray: "0 1" })}
      {...props}
    >
      <motion.path
        d="m55.707 11.293-10-10A1.115 1.115 0 0 0 45 1H9a1 1 0 0 0-1 1v60a1 1 0 0 0 1 1h46a1 1 0 0 0 1-1V12a1.092 1.092 0 0 0-.293-.707zM52.586 11H46V4.414zM10 61V3h34v9a1 1 0 0 0 1 1h9v48z"
        style={{
          fill: "#fff",
          stroke: "#000",
          strokeWidth: 2,
          strokeDasharray: "0 1",
        }}
        initial={{ strokeDasharray: "0 1" }}
        animate={controls}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M20 20h24v4H20zM20 28h24v4H20zM20 36h24v4H20z"
        style={{
          fill: "#fff",
          stroke: "#000",
          strokeWidth: 2,
          strokeDasharray: "0 1",
        }}
        initial={{ strokeDasharray: "0 1" }}
        animate={controls}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default memo(ResumeIcon);
