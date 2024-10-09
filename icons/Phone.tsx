import * as React from "react";
import { SVGProps, memo } from "react";

const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={19}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke || "#333"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.667 8.228a4.901 4.901 0 0 0-.093-1.912 4.853 4.853 0 0 0-1.281-2.257 4.853 4.853 0 0 0-2.257-1.281 4.9 4.9 0 0 0-1.913-.094m2.697 5.242c.102-.68-.11-1.4-.634-1.924a2.247 2.247 0 0 0-1.924-.635"
    />
    <path
      stroke={props.stroke || "#333"}
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.392 3.798a.75.75 0 0 1 .656.386l.917 1.652a.75.75 0 0 1 .015.7l-.884 1.767s.257 1.317 1.328 2.39a5.098 5.098 0 0 0 2.385 1.323l1.767-.884a.75.75 0 0 1 .7.015l1.657.922a.75.75 0 0 1 .386.655v1.903c0 .969-.9 1.668-1.818 1.359-1.886-.636-4.812-1.848-6.668-3.703-1.855-1.855-3.066-4.782-3.702-6.667-.31-.918.39-1.818 1.359-1.818h1.902z"
    />
  </svg>
);
const Phone = memo(PhoneIcon);
export default Phone;
