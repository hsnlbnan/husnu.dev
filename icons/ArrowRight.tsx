import * as React from "react";
import { SVGProps, memo } from "react";
const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || "#262626"}
      d="M4.23 12.713a.75.75 0 1 0 1.06 1.06l-1.06-1.06zm9.015-7.955h.75a.75.75 0 0 0-.75-.75v.75zm-6.364-.75a.75.75 0 1 0 0 1.5v-1.5zm5.614 7.114a.75.75 0 0 0 1.5 0h-1.5zM5.29 13.774l8.486-8.485-1.06-1.061-8.486 8.485 1.06 1.06zm7.955-9.766H6.881v1.5h6.364v-1.5zm-.75.75v6.364h1.5V4.758h-1.5z"
    />
  </svg>
);
const ArrowRight = memo(ArrowRightIcon);
export default ArrowRight;
