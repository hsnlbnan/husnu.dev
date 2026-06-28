// Pure, timezone-aware, localized progress math. Runs identically on the server
// (PNG route) and in the browser (live preview), so the two always agree.

export type Mode = "period" | "since" | "until" | "age";
export type Unit = "day" | "week" | "month" | "year";
export type Lang = "tr" | "en";

export interface ProgressInput {
  mode: Mode;
  unit?: Unit;
  date?: string; // ISO yyyy-mm-dd  (since / until / age)
  start?: string; // ISO yyyy-mm-dd  (optional anchor for until)
  tz?: string; // IANA timezone
  lang?: Lang;
  now?: Date; // injectable for testing
}

export interface ProgressResult {
  percent: number; // 0..1
  primary: string; // big value
  unitLabel: string; // small label under/next to the big value
  secondary?: string; // optional second line (e.g. "5 ay 12 gün")
  caption: string; // descriptive line
}

const DAY_MS = 86_400_000;
const DAY_S = 86_400;

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
};

export interface Parts {
  year: number; month: number; day: number;
  hour: number; minute: number; second: number;
}

export function zonedParts(tz: string, now: Date): Parts {
  let fmt: Intl.DateTimeFormat;
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  };
  try {
    fmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz, ...opts });
  } catch {
    fmt = new Intl.DateTimeFormat("en-CA", opts);
  }
  const out: Record<string, number> = {};
  for (const p of fmt.formatToParts(now)) {
    if (p.type !== "literal") out[p.type] = parseInt(p.value, 10);
  }
  if (out.hour === 24) out.hour = 0;
  return out as unknown as Parts;
}

const utc = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysInYear = (y: number) => (isLeap(y) ? 366 : 365);
const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const dayOfYear = (y: number, m: number, d: number) =>
  Math.round((utc(y, m, d) - utc(y, 1, 1)) / DAY_MS) + 1;
const secondsToday = (p: Parts) => p.hour * 3600 + p.minute * 60 + p.second;
const pctInt = (x: number) => Math.round(x * 100);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function prettyDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

// Localized "n unit left" line.
function leftLine(amount: number, kind: "d" | "h", pct: number, lang: Lang) {
  if (lang === "tr") {
    const u = kind === "d" ? "gün" : "saat";
    return `${amount} ${u} kaldı · %${pct}`;
  }
  const u = kind === "d" ? "d" : "h";
  return `${amount}${u} left · ${pct}%`;
}

function periodResult(percent: number, daysLeft: number, lang: Lang): ProgressResult {
  const p = clamp01(percent);
  return {
    percent: p,
    primary: `${pctInt(p)}`,
    unitLabel: "%",
    caption: leftLine(daysLeft, "d", pctInt(p), lang),
  };
}

// Calendar Y/M/D difference between a past date and today's parts.
function ymdSince(iso: string, p: Parts) {
  const [sy, sm, sd] = iso.split("-").map(Number);
  let y = p.year - sy;
  let m = p.month - sm;
  let d = p.day - sd;
  if (d < 0) {
    m -= 1;
    const pm = p.month - 1 < 1 ? 12 : p.month - 1;
    const py = p.month - 1 < 1 ? p.year - 1 : p.year;
    d += daysInMonth(py, pm);
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  const totalDays = Math.max(0, Math.floor((utc(p.year, p.month, p.day) - utc(sy, sm, sd)) / DAY_MS));

  // progress toward next anniversary
  const annThisYear = utc(p.year, sm, sd);
  const todayMs = utc(p.year, p.month, p.day);
  const lastAnnMs = annThisYear <= todayMs ? annThisYear : utc(p.year - 1, sm, sd);
  const nextAnnMs = utc(new Date(lastAnnMs).getUTCFullYear() + 1, sm, sd);
  const cycle = (nextAnnMs - lastAnnMs) / DAY_MS;
  const into = (todayMs - lastAnnMs) / DAY_MS;
  const toNext = Math.round((nextAnnMs - todayMs) / DAY_MS);
  return {
    years: Math.max(0, y),
    months: Math.max(0, m),
    days: Math.max(0, d),
    totalDays,
    daysToNext: toNext,
    percent: cycle > 0 ? clamp01(into / cycle) : 0,
  };
}

function ymPhrase(months: number, days: number, lang: Lang) {
  if (lang === "tr") return `${months} ay ${days} gün`;
  const mo = months === 1 ? "month" : "months";
  const dd = days === 1 ? "day" : "days";
  return `${months} ${mo} ${days} ${dd}`;
}

export function computeProgress(input: ProgressInput): ProgressResult {
  const tz = input.tz || "UTC";
  const lang: Lang = input.lang === "tr" ? "tr" : "en";
  const now = input.now || new Date();
  const p = zonedParts(tz, now);
  const sod = secondsToday(p);

  if (input.mode === "period") {
    const unit = input.unit || "year";
    if (unit === "day") {
      const percent = sod / DAY_S;
      const hoursLeft = Math.floor((DAY_S - sod) / 3600);
      return {
        percent: clamp01(percent),
        primary: `${pctInt(percent)}`,
        unitLabel: "%",
        caption: leftLine(hoursLeft, "h", pctInt(percent), lang),
      };
    }
    if (unit === "week") {
      const dow = (new Date(utc(p.year, p.month, p.day)).getUTCDay() + 6) % 7;
      const elapsed = dow * DAY_S + sod;
      const total = 7 * DAY_S;
      return periodResult(elapsed / total, Math.ceil((total - elapsed) / DAY_S), lang);
    }
    if (unit === "month") {
      const dim = daysInMonth(p.year, p.month);
      const elapsed = (p.day - 1) * DAY_S + sod;
      const total = dim * DAY_S;
      return periodResult(elapsed / total, Math.ceil((total - elapsed) / DAY_S), lang);
    }
    const diy = daysInYear(p.year);
    const doy = dayOfYear(p.year, p.month, p.day);
    const elapsed = (doy - 1) * DAY_S + sod;
    const total = diy * DAY_S;
    return periodResult(elapsed / total, Math.ceil((total - elapsed) / DAY_S), lang);
  }

  if (input.mode === "since") {
    const iso = input.date || `${p.year}-01-01`;
    const e = ymdSince(iso, p);
    const dayWord = lang === "tr" ? "gün" : "days";
    if (e.years >= 1) {
      return {
        percent: e.percent,
        primary: `${e.years}`,
        unitLabel: lang === "tr" ? "yıl" : e.years === 1 ? "year" : "years",
        secondary: ymPhrase(e.months, e.days, lang),
        caption:
          lang === "tr"
            ? `${e.totalDays} gün · ${prettyDate(iso, lang)}'ten beri`
            : `${e.totalDays} days · since ${prettyDate(iso, lang)}`,
      };
    }
    return {
      percent: e.percent,
      primary: `${e.totalDays}`,
      unitLabel: dayWord,
      secondary: ymPhrase(e.months, e.days, lang),
      caption:
        lang === "tr"
          ? `${prettyDate(iso, lang)}'ten beri`
          : `since ${prettyDate(iso, lang)}`,
    };
  }

  if (input.mode === "age") {
    const iso = input.date || `${p.year - 30}-01-01`;
    const e = ymdSince(iso, p);
    return {
      percent: e.percent,
      primary: `${e.years}`,
      unitLabel: lang === "tr" ? "yaşında" : e.years === 1 ? "year" : "years",
      secondary: ymPhrase(e.months, e.days, lang),
      caption:
        lang === "tr"
          ? `doğum gününe ${e.daysToNext} gün`
          : `next birthday in ${e.daysToNext}d`,
    };
  }

  // until (countdown)
  const iso = input.date || `${p.year + 1}-01-01`;
  const [ty, tm, td] = iso.split("-").map(Number);
  const todayMs = utc(p.year, p.month, p.day);
  const targetMs = utc(ty, tm, td);
  const daysLeft = Math.round((targetMs - todayMs) / DAY_MS);
  const startMs = input.start
    ? utc(...(input.start.split("-").map(Number) as [number, number, number]))
    : targetMs - 365 * DAY_MS;
  const span = targetMs - startMs;
  const nowMs = todayMs + sod * 1000;
  const percent = span > 0 ? clamp01((nowMs - startMs) / span) : daysLeft <= 0 ? 1 : 0;
  const reached = daysLeft <= 0;
  return {
    percent,
    primary: `${Math.max(0, daysLeft)}`,
    unitLabel: lang === "tr" ? "gün kaldı" : daysLeft === 1 ? "day left" : "days left",
    caption: reached
      ? lang === "tr"
        ? `ulaşıldı · ${prettyDate(iso, lang)}`
        : `reached · ${prettyDate(iso, lang)}`
      : lang === "tr"
        ? `${prettyDate(iso, lang)}'e kadar`
        : `until ${prettyDate(iso, lang)}`,
  };
}
