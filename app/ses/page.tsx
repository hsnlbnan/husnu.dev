import { createMetadata } from "@/config/seo";
import VolumePage from "@/components/Volume";

export const metadata = createMetadata({
  title: "Ses",
  description: "An interactive iOS-inspired vertical volume control built with Framer Motion and Tailwind CSS.",
  path: "/ses",
});

function SesPage() {
  return <VolumePage />
}

export default SesPage;