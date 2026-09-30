// Üst bölümün veri yardımcıları. Başlığa göre eşleşen tablo YOK: her şey
// data.js'teki alanlardan (audience/audienceTr, showcase, phone) okunur;
// böylece bir proje adı değişse bile hiçbir kart sessizce kaybolmaz.
import { projects } from "@/data";

type Showcase = { order: number; status: string; statusTr: string; color: string };
type RawProject = {
  title: string;
  shortTitle?: string;
  description: string;
  src: string;
  phone?: string;
  accent?: string;
  audience?: string;
  audienceTr?: string;
  showcase?: Showcase;
};
const all = projects as RawProject[];

// Languages bento'sundaki hesapla aynı: kariyer Mart 2021'de başladı.
const CAREER_START = new Date(2021, 2);
export function yearsOfExperience(now = new Date()) {
  const months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth());
  return Math.max(1, Math.floor(months / 12));
}

/** Proje açıklamalarındaki farklı yazımlarla eşleşme ("Next.JS", "Redux Toolkit"...). */
export function skillMatcher(skill: string): RegExp {
  const special: Record<string, RegExp> = {
    "Next.js": /next/i,
    React: /^react$/i,
    "Node.js": /node/i,
    "Elysia.js": /elysia/i,
    "Tailwind CSS": /tailwind/i,
    PostgreSQL: /postgre|postgis/i,
    Redux: /redux/i,
    GraphQL: /graphql|apollo/i,
    Bun: /^bun$|elysia/i,
    Git: /^git$/i,
  };
  return special[skill] ?? new RegExp(`^${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

/** Proje verisinde geçmese de bu sitede kullanılan teknolojiler. */
export const ON_THIS_SITE = new Set(["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "CSS Animations", "Three.js", "Design Systems"]);

/** Bir teknolojiyi kullanan projeler (proje bölümündeki numarasıyla). */
export function projectsUsing(skill: string) {
  const match = skillMatcher(skill);
  return all
    .map((p, i) => ({ n: i + 1, title: p.shortTitle ?? p.title, accent: p.accent ?? "#dfff1f", techs: p.description.split(",").map((t) => t.trim()) }))
    .filter((p) => p.techs.some((t) => match.test(t)));
}

/** "Sahnede" kartında sırayla gösterilen projeler. */
export function getShowcase(en: boolean) {
  return all
    .filter((p): p is RawProject & { showcase: Showcase } => !!p.showcase)
    .sort((a, b) => a.showcase.order - b.showcase.order)
    .map((p) => ({
      title: p.title,
      src: p.phone ?? p.src,
      phone: !!p.phone,
      accent: p.accent ?? "#dfff1f",
      techs: p.description.split(",").map((t) => t.trim()).slice(0, 3),
      audience: (en ? p.audience : p.audienceTr ?? p.audience) ?? "",
      status: { label: en ? p.showcase.status : p.showcase.statusTr, color: p.showcase.color },
    }));
}
