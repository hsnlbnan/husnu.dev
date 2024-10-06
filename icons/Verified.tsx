import * as React from "react";
import { SVGProps, memo } from "react";
const VerifiedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    data-supported-dps="24x24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M18.5 11c0 3.79-2.29 6.76-6.09 8.21l-.4.14-.38-.14C7.8 17.76 5.5 14.78 5.5 11V6.8L12 4.63l6.5 2.17V11zm-6.49-9L3 5v6c0 5 3.12 8.81 7.77 10.56L12 22l1.27-.44C17.9 19.81 21.01 16 21.01 11V5l-8.99-3zm-1.62 10.63L14.11 8h3.21l-5.85 7.28-.87 1.09-.99-.99-2.96-2.97 1.77-1.77 1.98 1.98z"
    />
  </svg>
);
const Verified = memo(VerifiedIcon);
export default Verified;
