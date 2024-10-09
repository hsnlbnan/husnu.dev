import * as React from "react";
import { SVGProps, memo } from "react";
const EmailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || "#333"}
      d="m26.727 20.05 9.227-8.073v16.056l-9.227-7.982zm-11.89 1.368 3.24 2.833a2.907 2.907 0 0 0 1.897.698h.045c.726 0 1.389-.265 1.903-.703l-.004.003 3.24-2.833 9.85 8.52H4.992l9.845-8.518zM4.98 10.062h30.046L20.593 22.687a.914.914 0 0 1-.57.2h-.04a.91.91 0 0 1-.572-.201l.002.001L4.979 10.062zm-.931 1.913 9.225 8.074-9.225 7.977v-16.05zm32.4-3.688A2.745 2.745 0 0 0 35.219 8H4.787a2.79 2.79 0 0 0-1.252.298l.017-.008A2.806 2.806 0 0 0 2 10.803v18.39A2.8 2.8 0 0 0 4.787 32h30.426A2.8 2.8 0 0 0 38 29.193v-18.39c0-1.099-.629-2.05-1.544-2.508l-.016-.008h.009z"
    />
  </svg>
);
const Email = memo(EmailIcon);
export default Email;
