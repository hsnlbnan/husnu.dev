import React from "react";
import Content from "../Content";

export default function Footer() {
  return (
    <div
      className="relative h-[800px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="bottom-0 fixed w-full h-[800px]">
        <Content />
      </div>
    </div>
  );
}
