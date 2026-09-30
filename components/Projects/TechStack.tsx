// Projenin teknoloji yığını: logo + okunur isim. Logosu olmayan teknolojiler
// baş harfli bir rozetle gösterilir.
import type { IconType } from "react-icons";
import {
  SiAlibabacloud,
  SiApollographql,
  SiApple,
  SiAxios,
  SiBootstrap,
  SiBun,
  SiCypress,
  SiDocker,
  SiElasticsearch,
  SiFastapi,
  SiHeadlessui,
  SiMongodb,
  SiMui,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenid,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiSentry,
  SiStyledcomponents,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

// Sıra önemli: ilk eşleşen kazanır ("vercel redis" → Redis, "redux toolkit" → Redux).
const RULES: [RegExp, IconType][] = [
  [/next/i, SiNextdotjs],
  [/typescript/i, SiTypescript],
  [/styled-components/i, SiStyledcomponents],
  [/^react$/i, SiReact],
  [/tailwind/i, SiTailwindcss],
  [/swiftui|swiftdata/i, SiSwift],
  [/spritekit|storekit|healthkit|widgetkit|app intents|apns/i, SiApple],
  [/^bun$/i, SiBun],
  [/redis/i, SiRedis],
  [/postgre|postgis/i, SiPostgresql],
  [/vercel/i, SiVercel],
  [/docker/i, SiDocker],
  [/redux/i, SiRedux],
  [/apollo/i, SiApollographql],
  [/sentry/i, SiSentry],
  [/mongo/i, SiMongodb],
  [/python/i, SiPython],
  [/fastapi/i, SiFastapi],
  [/elasticsearch/i, SiElasticsearch],
  [/node/i, SiNodedotjs],
  [/zvec|alibaba/i, SiAlibabacloud],
  [/^mui$/i, SiMui],
  [/sass/i, SiSass],
  [/bootstrap/i, SiBootstrap],
  [/cypress/i, SiCypress],
  [/axios/i, SiAxios],
  [/headless/i, SiHeadlessui],
  [/oidc|openid/i, SiOpenid],
];

export function iconFor(tech: string): IconType | null {
  for (const [re, Icon] of RULES) if (re.test(tech)) return Icon;
  return null;
}

export default function TechStack({ techs, label, accent }: { techs: string[]; label: string; accent: string }) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
        {label}
      </span>
      <ul className="flex flex-wrap gap-2">
        {techs.map((tech) => {
          const Icon = iconFor(tech);
          return (
            <li
              key={tech}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] py-1 pl-2 pr-2.5 text-[12px] text-white/80 md:gap-2 md:py-1.5 md:pr-3 md:text-[13px]"
            >
              {Icon ? (
                <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/70" />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] bg-white/10 text-[9px] font-semibold text-white/70"
                >
                  {tech.replace(/^@/, "").charAt(0).toUpperCase()}
                </span>
              )}
              {tech}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
