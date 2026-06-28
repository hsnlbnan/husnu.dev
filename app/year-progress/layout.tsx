import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Year Progress — husnu.dev",
  description:
    "Generate a minimal, self-updating wallpaper that shows the progress of the day, week, month, year, or any date — and set it on iOS via Shortcuts.",
};

export default function YearProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
