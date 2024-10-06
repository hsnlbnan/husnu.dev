import * as React from "react"
import { SVGProps, memo } from "react"
const LinkedInConnectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    data-supported-dps="16x16"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M9 4a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM6.75 8h-1.5A2.25 2.25 0 0 0 3 10.25V15h6v-4.75A2.25 2.25 0 0 0 6.75 8zM13 8V6h-1v2h-2v1h2v2h1V9h2V8z" />
  </svg>
)
const LinkedInConnect = memo(LinkedInConnectIcon)
export default LinkedInConnect
