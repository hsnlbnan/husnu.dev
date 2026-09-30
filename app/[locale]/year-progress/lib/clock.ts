// Timezone-aware wall-clock for the lock-screen overlay. Sharing progress.ts's
// zoning means the preview clock and the wallpaper's progress always read from
// the same instant in the same timezone.

import { zonedParts } from "./progress";

export interface Clock {
  readonly hour: number;
  readonly minute: number;
  readonly weekday: number; // 0 = Sunday, matching Date#getDay
  readonly day: number;
  readonly month: number; // 1..12
}

export function zonedClock(now: Date, tz: string): Clock {
  const p = zonedParts(tz, now);
  const weekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
  return { hour: p.hour, minute: p.minute, weekday, day: p.day, month: p.month };
}
