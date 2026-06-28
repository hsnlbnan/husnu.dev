import { ImageResponse } from "next/og";
import { buildSpec, WallpaperParams } from "../lib/spec";
import { renderWallpaper } from "../lib/render";
import type { Mode, Unit, Lang } from "../lib/progress";
import type { Style, Shape } from "../lib/spec";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const g = (k: string) => sp.get(k) ?? undefined;
  const num = (k: string, d: number) => {
    const v = parseInt(sp.get(k) ?? "", 10);
    return Number.isFinite(v) ? v : d;
  };

  const params: WallpaperParams = {
    mode: (g("mode") as Mode) || "period",
    unit: (g("unit") as Unit) || "year",
    date: g("date"),
    start: g("start"),
    tz: g("tz") || "UTC",
    lang: (g("lang") as Lang) || "en",
    style: (g("style") as Style) || "grid",
    shape: (g("shape") as Shape) || "circle",
    fg: g("fg"),
    bg: g("bg"),
    cols: num("cols", 14),
    rows: num("rows", 24),
    w: num("w", 1290),
    h: num("h", 2796),
  };

  const spec = buildSpec(params);

  return new ImageResponse(renderWallpaper(spec), {
    width: spec.w,
    height: spec.h,
    headers: {
      // Browser always revalidates (max-age=0) so the device sees "today", but a
      // shared CDN may serve an identical render for up to 60s. Same params ->
      // same wallpaper, so this is safe and caps render-abuse of this route.
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
