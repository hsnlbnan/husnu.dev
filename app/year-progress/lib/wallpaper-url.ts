// Pure URL construction for the wallpaper PNG endpoint and the iOS shortcut
// download. Lifted out of the page component so it can be unit-tested in
// isolation and reused by both the preview and any future entry point.

import { activeDateFor, type WallpaperConfig } from "./config";

const FALLBACK_ORIGIN = "https://your-app.vercel.app";

export interface UrlEnv {
  readonly origin: string;
  readonly tz: string;
}

export function buildWallpaperUrl(config: WallpaperConfig, env: UrlEnv): string {
  const p = new URLSearchParams();
  p.set("mode", config.mode);
  if (config.mode === "period") p.set("unit", config.unit);

  const date = activeDateFor(config);
  if (date) p.set("date", date);

  p.set("style", config.style);
  if (config.style === "grid") {
    p.set("shape", config.shape);
    p.set("cols", String(config.cols));
    p.set("rows", String(config.rows));
  }
  if (config.style === "life") {
    p.set("birth", config.birthDate);
    p.set("lifespan", String(config.lifespan));
  }
  if (config.style === "months" && config.headline.trim()) {
    p.set("headline", config.headline.trim());
  }

  p.set("fg", config.fg.replace("#", ""));
  p.set("bg", config.bg.replace("#", ""));
  p.set("tz", env.tz);
  p.set("lang", config.lang);

  return `${env.origin || FALLBACK_ORIGIN}/year-progress/wallpaper?${p.toString()}`;
}

export function buildShortcutUrl(origin: string, name: string, wallpaperUrl: string): string {
  const params = new URLSearchParams({ name, url: wallpaperUrl });
  return `${origin}/year-progress/shortcut?${params.toString()}`;
}
