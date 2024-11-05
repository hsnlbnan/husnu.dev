"use client";

import React, { useState, useEffect } from "react";
import AnimatedShinyText from "../ui/animated-shiny-text";
import Tooltip from "../Tooltip";
import { motion } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import { ResumeIcon } from "@/icons";

const Header = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleToggleBox = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: { brandColor: "#000000" },
        },
      });
    })();
  }, []);

  function handleDownloadResume() {
    window.open("/Husnu-Lubnan-CV.pdf");
  }

  return (
    <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 md:gap-0 md:mx-auto my-4 p-4 rounded-lg w-full lg:container">
      <div className="flex flex-col -gap-1">
        <h1 className="font-light text-2xl text-white">
          Hüsnü <span className="font-medium text-[#dfff1f]">Lübnan</span>
        </h1>
        <div className="flex flex-row gap-4">
          <p className="text-gray-400 text-sm">Frontend Developer</p>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.div
          className="relative group"
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleDownloadResume}
        >
          <div className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer">
            <div className="flex flex-row items-center gap-4">
              {/*  <span className="bg-[#dfff1f] rounded-full w-2 h-2 animate-pulse"></span> */}
              <ResumeIcon className="h-4 group-hover:animate-draw" />
              <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
                <p className="text-[#fff] text-sm">Download my resume</p>
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex group-hover:border-pulse bg-[#2d2d2d] px-3 py-1.5 rounded-lg cursor-pointer"
            onClick={handleToggleBox}
          >
            <div className="flex flex-row items-center gap-4">
              <span className="bg-[#dfff1f] rounded-full w-2 h-2 animate-pulse"></span>
              <button data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
                <p className="text-[#fff] text-sm">Available for freelance</p>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
