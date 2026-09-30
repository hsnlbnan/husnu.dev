// Teknoloji yığını: tek kaynak. Stack bento'su, üst bölüm prototipi ve
// yapılandırılmış veri (JSON-LD knowsAbout) aynı listeyi kullanır; böylece
// sitede görünen ile arama motorlarına söylenen hiç ayrışmaz.
export const STACK_ITEMS = [
  {
    category: "Core Stack",
    skills: ["Next.js", "Svelte", "React", "TypeScript", "JavaScript"],
    color: "#dfff1f",
    icon: "⬡",
  },
  {
    category: "UI Layer",
    skills: ["Tailwind CSS", "Sass", "Design Systems", "Shadcn UI"],
    color: "#a8ff78",
    icon: "◈",
  },
  {
    category: "Motion",
    skills: ["Framer Motion", "GSAP", "CSS Animations", "Three.js"],
    color: "#78ffd6",
    icon: "◎",
  },
  {
    category: "State & API",
    skills: ["Redux", "Zustand", "GraphQL", "REST"],
    color: "#b8b8ff",
    icon: "◇",
  },

  {
    category: "Backend",
    skills: ["Node.js", "NestJS", "Elysia.js", "Bun", "PostgreSQL", "MongoDB"],
    color: "#ffb3c1",
    icon: "◈",
  },
  {
    category: "Testing",
    skills: ["Playwright", "Cypress", "Vitest", "Jest"],
    color: "#ff9f9f",
    icon: "◎",
    wide: true,
  },
  {
    category: "DevOps & Git",
    skills: ["Git", "GitHub", "GitLab", "Azure DevOps"],
    color: "#ffd6a5",
    icon: "◉",
  },
] as const;

/** Tüm teknolojiler, düz liste. */
export const ALL_SKILLS: string[] = STACK_ITEMS.flatMap((item) => [...item.skills]);
