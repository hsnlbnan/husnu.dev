"use client";

import * as React from "react";
import { SVGProps, memo } from "react";
import { motion } from "framer-motion";

const Link = (props: SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fillRule="evenodd"
    clipRule="evenodd"
    {...props}
  >
    <motion.path
      d="M14.851 11.923a4 4 0 0 0-6.682-1.749l-4.998 4.998a4 4 0 1 0 5.656 5.657l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656A4.981 4.981 0 0 1 5.999 23a5.001 5.001 0 0 1-3.535-8.535l4.998-4.998a4.983 4.983 0 0 1 3.536-1.464c1.279 0 2.56.488 3.535 1.464a4.978 4.978 0 0 1 1.105 1.672l-.787.784zm-5.703.147a4 4 0 0 0 6.682 1.756l4.999-4.998a3.999 3.999 0 0 0 0-5.657 4 4 0 0 0-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656A4.983 4.983 0 0 1 18.001 1c1.279 0 2.56.488 3.535 1.464a5.003 5.003 0 0 1 0 7.071l-4.999 4.998a4.981 4.981 0 0 1-3.535 1.464c-1.28 0-2.56-.488-3.535-1.464a4.992 4.992 0 0 1-1.107-1.678l.788-.785z"
      initial={{ pathLength: 1, pathOffset: 0 }}
      animate={{ pathLength: 1, pathOffset: 1 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 2,
      }}
    />
  </svg>
);

const LinkIcon = memo(Link);
export default LinkIcon;
