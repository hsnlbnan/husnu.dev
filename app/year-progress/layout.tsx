import type { Metadata } from "next";
import "./styles.css";
import Header from "@/components/Header";

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
  return (
    <>
      {/* Site header so visitors landing here (e.g. from a shared link) can reach
          the portfolio. Sits on the tool's default dark bg so it reads as one
          surface; if the tool is themed light, this stays a dark nav strip. */}
      <div className="yp-header-shell">
        <div className="yp-header-inner">
          <Header />
        </div>
      </div>
      {children}
    </>
  );
}
