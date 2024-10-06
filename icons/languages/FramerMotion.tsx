import * as React from "react"
import { SVGProps, memo } from "react"
const FramerMotionLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="3.7 3.7 43.6 43.6"
    {...props}
  >
    <path
      fill="#fff"
      d="M47.3 3.7v21.8L36.4 36.4 25.5 47.3 14.6 36.4l10.9-10.9v.1-.1z"
    />
    <path fill="#fff" d="M47.3 25.5v21.8L36.4 36.4z" />
    <path fill="#fff" d="M25.5 25.5 14.6 36.4 3.7 47.3V3.7l10.9 10.9z" />
  </svg>
)
const FramerMotion = memo(FramerMotionLogo)
export default FramerMotion
