// `as const` bilinçli olarak YOK: aksi halde her metin literal tip olur ve
// tr.ts'in "aynı metni" içermesi beklenirdi. Böyle olunca tip, yapıyı
// (anahtarlar + string/array/nesne şekli) zorunlu kılar, değerleri değil.
const en = {
  meta: {
    siteTitleDefault: "Hüsnü Lübnan | Frontend & Javascript Developer",
    siteTitleTemplate: "%s | Hüsnü Lübnan",
    ogTitle: "Hüsnü Lübnan | Frontend Developer",
    description:
      "Hüsnü Lübnan engineers high-performance web applications with React, Next.js, and TypeScript, delivering robust solutions and interactive user experiences.",
    keywords: [
      "Hüsnü Lübnan",
      "Senior Frontend Developer Turkey",
      "Frontend Developer",
      "Javascript Developer",
      "React Developer",
      "Next.js Developer",
      "Typescript Developer",
      "Tailwind CSS Developer",
    ],
  },

  layout: {
    skipToContent: "Skip to content",
    noScript:
      "This site works best with JavaScript enabled. Please enable it in your browser.",
  },

  header: {
    role: "Senior Frontend Developer",
    liked: "Liked",
    likedAria: "View liked items",
    freelanceStatus: "Freelance Status",
    cv: "CV",
    cvAria: "Download resume (CV)",
    nav: "Main",
    languageSwitcher: "Language",
    localeNames: { en: "English", tr: "Turkish" },
    switchToTurkish: "Switch to Turkish",
    switchToEnglish: "Switch to English",
  },

  home: {
    h1: "Hüsnü Lübnan — Senior Frontend Developer building high-performance React, Next.js and TypeScript applications",
    featuredWork: "Featured Work",
    projectsReveal: "Projects I took part in action.",
    scrollToExplore: "Scroll to explore",
    careerPath: "Career Path",
    workExperience: "Work Experience",
    projectsAria: "Projects",
    workAria: "Work Experience",
    adventureTitle: "follow the",
    adventureAccent: "adventure",
    adventureSubtitle: "Find me on the platforms I actually use.",
  },

  stack: {
    role: "Senior Frontend Developer",
    headlineLead: "I build interfaces",
    headlineAccent: "people remember.",
    metrics: {
      years: "Years",
      shipped: "Shipped",
      perf: "Perf",
    },
    categories: {
      "Core Stack": "Core Stack",
      "UI Layer": "UI Layer",
      Motion: "Motion",
      "State & API": "State & API",
      Backend: "Backend",
      Testing: "Testing",
      "DevOps & Git": "DevOps & Git",
    },
    footnote:
      "Also strong on performance, a11y, responsive systems & maintainable architecture.",
  },

  focus: {
    eyebrow: "What I optimize for",
    headline: ["People remember", "how an interface", "made them feel:"],
    rotatingWords: ["clear", "fast", "human"],
    paragraph:
      "Most users are not looking for novelty. They want to understand what happens next, move with confidence, and never feel lost.",
    notes: [
      {
        title: "For users",
        detail: "Clear next steps, calm feedback, and fewer moments of hesitation.",
      },
      {
        title: "For teams",
        detail: "Reusable patterns, safer iteration, and less visual noise to manage.",
      },
    ],
  },

  // Simüle terminal widget'ı için dürüst açıklama.
  terminal: {
    heading: "Build pipeline animation",
    description:
      "A decorative animation of a CI/CD terminal. The pipeline numbers, check results and deploy timestamps are illustrative sample data, not a live feed from a real build system.",
  },

  schema: {
    jobTitle: "Senior Frontend Developer",
    personDescription:
      "Senior Frontend Developer based in Turkey, specializing in Next.js, React, TypeScript and high-performance web architecture.",
    serviceName: "Hüsnü Lübnan — Frontend Consultancy",
    serviceDescription:
      "Professional frontend development and consultancy services for enterprise-grade React and Next.js applications.",
    projectsListName: "Projects by Hüsnü Lübnan",
    workListName: "Work experience — Hüsnü Lübnan",
  },

  project: {
    view: "View",
    viewProject: "View Project",
    caseStudy: "Case Study",
    techStack: "Tech Stack",
    explore: "Explore",
    visitAria: "Visit {title} project",
    linkUnavailable: " (link not available)",
    screenshotAlt: "Screenshot of {title} project",
    logoAlt: "{title} logo",
  },

  contact: {
    badge: "Contact Me",
    heading: "Get in Touch with Me",
    paragraph:
      "You can contact me with your problems, bugs, new developments or projects.",
    emailLabel: "Email",
    meetLabel: "Or give us a meet",
    meetValue: "Book a meeting",
    phoneLabel: "Phone",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send Message",
      sending: "Sending...",
      sent: "Message sent successfully!",
      failed: "Failed to send message.",
      error: "An error occurred while sending the message.",
      required: "{field} is required.",
      invalidEmail: "Please enter a valid email address.",
      nameTooShort: "Name must be at least 3 characters.",
      messageTooShort: "Message must be at least 10 characters.",
    },
  },

  liked: {
    title: "Liked",
    heading: "Components I Liked",
    headingAria: "Components I Liked — {count} components",
    description:
      "A curated collection of my favorite React and Tailwind CSS implementations that I've discovered and saved for inspiration.",
    intro:
      "These components were coded using React, Framer-Motion and Tailwind to learn how to make components that I like and see on sites like",
    introPlatforms: "Twitter(X), Behance, Dribbble, Figma.",
    introOutro: "Source codes are not shared out of",
    introRespect: "respect for designers.",
  },

  ses: {
    title: "Ses",
    h1: "Ses — an interactive iOS-inspired vertical volume control built with Framer Motion and Tailwind CSS",
    description:
      "An interactive iOS-inspired vertical volume control built with Framer Motion and Tailwind CSS.",
  },

  yearProgress: {
    title: "Year Progress",
    description:
      "Generate a minimal, self-updating wallpaper that shows the progress of the day, week, month, year, or any date — and set it on iOS via Shortcuts.",
  },

  social: {
    linkedin: {
      role: "Senior Frontend Developer",
      metaLabel: "Ege University",
      location: "Izmir, Turkey",
      footer: "500+ connections",
      actionLabel: "Connect",
    },
    x: {
      role: "Senior Frontend Developer",
      metaLabel: "build notes",
      footer: "UI experiments + product thoughts",
      actionLabel: "Follow",
    },
    instagram: {
      role: "Senior Frontend Developer",
      metaLabel: "visual diary",
      footer: "Frames, process, and daily captures",
      actionLabel: "Open profile",
    },
    github: {
      role: "Senior Frontend Developer",
      metaLabel: "open source",
      footer: "Experiments, and shipped work",
      actionLabel: "View projects",
    },
  },
};

export default en;
