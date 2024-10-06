import * as React from "react";
import { SVGProps, memo } from "react";
const SeperatorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 4v16M8 8l-4 4 4 4M16 16l4-4-4-4" />
  </svg>
);
const Seperator = memo(SeperatorIcon);
export default Seperator;
