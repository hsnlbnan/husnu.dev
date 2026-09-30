export const projects = [
  {
    title: "Otokoç 2. El",
    // Kimin için yapıldı: üst bölümdeki "Sahnede" kartı ve proje künyeleri.
    audience: "people buying used cars",
    audienceTr: "ikinci el araç arayanlar",
    // Üst bölümdeki "Sahnede" kartında gösterilir; `order` sahneye çıkış sırası.
    showcase: { order: 1, status: "Live · Nuevo", statusTr: "Yayında · Nuevo", color: "#2FBF71" },
    description:
      "Next.js 16, TypeScript, Turbopack, OIDC Authentication, Axios, Zustand, TailwindCSS, HeadlessUI, Cypress",
    subtitle:
      "Developed the used car sales platform for Koç Holding, Turkey's largest conglomerate. Built with micro frontend architecture serving 100K+ monthly users, implementing OIDC authentication, advanced SEO strategies, and security vulnerability mitigations across the platform. Migrated the platform from Next.js 14 to 16, grew the test suite to 3,400+ unit tests and 100 Cypress E2E tests, and raised Lighthouse scores into the 98–100 range.",
    subtitleTr:
      "Türkiye'nin en büyük holdinglerinden Koç Holding için ikinci el araç satış platformunu geliştirdim. Aylık 100.000+ kullanıcıya hizmet veren mikro frontend mimarisiyle kuruldu; OIDC kimlik doğrulama, ileri seviye SEO stratejileri ve platform genelinde güvenlik açığı önlemleri hayata geçirildi. Platformu Next.js 14'ten 16'ya taşıdım, test altyapısını 3.400+ unit ve 100 Cypress E2E testine çıkardım, Lighthouse skorlarını 98–100 bandına yükselttim.",
    src: "/projects/otokoc.png",
    link: "https://www.otokocikinciel.com/",
    color: "#1e1e1e",
    accent: "#dfff1f",
    company: "Nuevo Software House",
  },
  {
    title: "bi el at",
    audience: "households arguing about chores",
    audienceTr: "ev işi yüzünden tartışan evler",
    showcase: { order: 3, status: "Live · 1,500+ users", statusTr: "Yayında · 1.500+ kullanıcı", color: "#2FBF71" },
    subtitle:
      "My own iOS app that settles the \"who does more at home?\" argument with data and a laugh, used by 1,500+ people. Every chore scores points on a shared house map, overdue chores send a playful nudge to the right person, and a champion is crowned every month. Native SwiftUI + SpriteKit client with a Bun/ElysiaJS backend, real-time WebSocket sync and APNs push.",
    subtitleTr:
      "\"Evde kim daha çok iş yapıyor?\" tartışmasını veriyle ve kahkahayla bitiren, 1.500+ kişinin kullandığı kendi iOS uygulamam. Her iş ortak ev haritasında puan kazandırıyor, günü geçen işler doğru kişiye esprili bir dırdır bildirimi gönderiyor, ay sonunda şampiyon ilan ediliyor. SwiftUI + SpriteKit ile native istemci, Bun/ElysiaJS backend, WebSocket ile gerçek zamanlı senkron ve APNs bildirimleri.",
    description: "SwiftUI, SpriteKit, Bun, ElysiaJS, PostgreSQL, WebSocket, APNs, Docker",
    src: "/projects/bi-el-at.webp",
    phone: "/projects/phone/bi-el-at.webp",
    link: "https://www.bielat.site/",
    color: "#1e1e1e",
    accent: "#FF8A3D",
    company: "Indie iOS App",
  },
  // status: "cooking" → henüz yayınlanmadı; kartta "Fırında" rozeti çıkar.
  {
    title: "Kılıbık",
    audience: "couples",
    audienceTr: "çiftler",
    showcase: { order: 4, status: "In the oven", statusTr: "Fırında", color: "#FF8A3D" },
    subtitle:
      "A task + location app for couples. Write a task once and the app remembers where it belongs: your partner gets nudged when they're near the right store, red zones drawn on a shared live map raise an alert, and finished tasks hang on a clothesline. Press-and-hold calls and a weekly Wrapped, in Turkish, English and German.",
    subtitleTr:
      "Çiftler için görev + konum uygulaması. Görevi bir kez yaz, nereye ait olduğunu uygulama hatırlasın: partnerin doğru markete yaklaşınca dürtülüyor, ortak canlı haritada çizilen kırmızı bölgeler uyarı veriyor, biten görevler çamaşır ipine asılıyor. Basılı tutunca çalan arama ve haftalık Wrapped; Türkçe, İngilizce ve Almanca.",
    description: "SwiftUI, Bun, ElysiaJS, PostgreSQL, PostGIS, LiveKit, APNs",
    src: "/projects/kilibik.webp",
    phone: "/projects/phone/kilibik.webp",
    link: "",
    color: "#1e1e1e",
    accent: "#E8375A",
    company: "Indie iOS App",
    status: "cooking",
  },
  {
    title: "Quillwood",
    audience: "people planning their lives",
    audienceTr: "hayatını planlayanlar",
    showcase: { order: 5, status: "In the oven", statusTr: "Fırında", color: "#FF8A3D" },
    subtitle:
      "A hand-drawn, cinematic, gamified life planner. Every plan you keep grows a living world drawn entirely in code: 6 regions, 19 scenes, 3 themes. Voice task entry parsed in 8 languages, Apple Health integration, widgets and Shortcuts, and a Pro progress journal.",
    subtitleTr:
      "El çizimi, sinematik ve oyunlaştırılmış bir yaşam planlayıcısı. Tuttuğun her plan, tamamen kodla çizilmiş yaşayan bir dünyayı büyütüyor: 6 bölge, 19 sahne, 3 tema. 8 dilde sesle görev ekleme, Apple Health entegrasyonu, widget'lar ve Kestirmeler, Pro ilerleme günlüğü.",
    description: "SwiftUI, SwiftData, StoreKit 2, HealthKit, WidgetKit, App Intents",
    src: "/projects/quillwood.webp",
    phone: "/projects/phone/quillwood.webp",
    link: "",
    color: "#1e1e1e",
    accent: "#7FA35B",
    company: "Indie iOS App",
    status: "cooking",
  },
  {
    title: "Fizbot",
    audience: "real-estate agents",
    audienceTr: "emlak danışmanları",
    showcase: { order: 2, status: "Shipped · SHFT", statusTr: "Teslim edildi · SHFT", color: "#9CA3AF" },
    description:
      "React, TypeScript, TailwindCSS, styled-components, Redux Toolkit, Apollo Client, Sentry",
    subtitle:
      "Frontend lead at one of Turkey's leading PropTech startups. Built real-time map-based opportunity matching platform connecting real estate agents with buyers/sellers. Implemented complex geolocation features, real-time data visualization, and error monitoring with Sentry.",
    subtitleTr:
      "Türkiye'nin önde gelen PropTech girişimlerinden birinde frontend lideri olarak çalıştım. Emlak danışmanlarını alıcı ve satıcılarla eşleştiren, harita tabanlı gerçek zamanlı fırsat platformunu geliştirdim. Karmaşık konum özellikleri, gerçek zamanlı veri görselleştirme ve Sentry ile hata izleme kurdum.",
    src: "/projects/fizbot.png",
    link: "",
    color: "#1e1e1e",
    accent: "#6366F1",
    company: "SHFT",
  },
  {
    title: "Elasticsearch vs Zvec vs LanceDB",
    audience: "engineers picking a search engine",
    audienceTr: "arama motoru seçen mühendisler",
    // Proje listesinde tek satıra sığan kısa ad; tam başlık detayda.
    shortTitle: "Search Benchmark",
    subtitle:
      "A reproducible search benchmark over 426K real Craigslist vehicle listings, comparing Elasticsearch 8.x against two in-process vector engines. Separates engine-internal query time from HTTP transport overhead, aligns ranking models so result quality stays constant, and reports p50/p95/p99 latency with engine agreement scores.",
    subtitleTr:
      "426.000 gerçek Craigslist araç ilanı üzerinde, Elasticsearch 8.x'i iki in-process vektör motoruyla karşılaştıran, tekrarlanabilir bir arama benchmark'ı. Motor içi sorgu süresini HTTP taşıma maliyetinden ayırıyor, sıralama modellerini hizalayarak sonuç kalitesini sabit tutuyor ve p50/p95/p99 gecikmelerini motor uyum skorlarıyla birlikte raporluyor.",
    description:
      "TypeScript, Elasticsearch 8.x, Alibaba Zvec, LanceDB, MiniLM embeddings, Node.js",
    src: "/projects/search-benchmark.png",
    link: "https://github.com/hsnlbnan/Elasticsearch-vs-Zvec-vs-LanceDB-search-benchmark",
    color: "#1e1e1e",
    accent: "#22d3ee",
    company: "Research",
  },
  {
    title: "Todo App with AI Assistant FastAPI in Nextjs",
    audience: "people with too many to-dos",
    audienceTr: "yapılacakları birikenler",
    shortTitle: "AI Todo",
    subtitle: "Full-stack AI-powered task management application combining Next.js with FastAPI backend. Features real-time task summarization using Ollama LLM, MongoDB integration for persistent storage, and a responsive interface with AI-driven productivity insights.",
    subtitleTr:
      "Next.js ile FastAPI backend'ini birleştiren, yapay zekâ destekli tam yığın görev yönetimi uygulaması. Ollama LLM ile gerçek zamanlı görev özetleme, kalıcı depolama için MongoDB entegrasyonu ve yapay zekâ destekli üretkenlik içgörüleri sunan responsive bir arayüz içeriyor.",
    description:
      "Next.js, TypeScript, TailwindCSS, FastAPI, MongoDB, Python, Ollama",
    src: "/projects/nextjs-fast-api.png",
    link: "https://github.com/hsnlbnan/next-js-fast-api-mongodb-ollama-todo",
    color: "#1e1e1e",
    accent: "#10B981",
    company: "Hobby Project",
  },
  {
    title: "hayal.in",
    audience: "dreamers",
    audienceTr: "rüyalarını paylaşanlar",
    subtitle:
      "Full-stack anonymous social platform where users share and explore dreams. Built with edge-first architecture using Vercel Edge Functions, real-time data handling with Redis, and optimized performance through serverless Postgres integration.",
    subtitleTr:
      "Kullanıcıların rüyalarını anonim olarak paylaşıp keşfettiği tam yığın sosyal platform. Vercel Edge Functions ile edge-first mimari, Redis ile gerçek zamanlı veri işleme ve serverless Postgres entegrasyonu üzerinden optimize edilmiş performans.",
    description:
      "Next.JS, TypeScript, Vercel Postgres, Vercel Redis, Vercel Edge Functions, Tailwind, Redux Toolkit",
    src: "/projects/hayalin.png",
    link: "https://hayal.in",
    color: "#1e1e1e",
    accent: "#8B5CF6",
  },

  {
    title: "Alterego CMS",
    audience: "tourism companies",
    audienceTr: "turizm şirketleri",
    subtitle:
      "Enterprise multi-tenant CMS powering multiple tourism companies under one group. Implemented role-based access control with CASL, multi-site management on shared domains, and complex permission hierarchies for diverse organizational structures.",
    subtitleTr:
      "Tek bir grup çatısı altındaki birden fazla turizm şirketine hizmet veren, kurumsal çok kiracılı CMS. CASL ile rol tabanlı erişim kontrolü, ortak alan adları üzerinde çoklu site yönetimi ve farklı organizasyon yapıları için karmaşık yetki hiyerarşileri kurdum.",
    description:
      "Next.JS, Redux Toolkit, Redux Toolkit Query, MUI, @casl",
    src: "/projects/alterego.png",
    link: "",
    color: "#1e1e1e",
    accent: "#F59E0B",
    company: "NoNoCompany",
  },
  {
    title: "Yeditepe GO",
    audience: "logistics teams",
    audienceTr: "lojistik ekipleri",
    subtitle:
      "Logistics management CMS for one of Turkey's leading transportation companies. Built real-time shipment tracking dashboard, optimized state management with Redux Toolkit Query for live data feeds, and streamlined operations across regional branches.",
    subtitleTr:
      "Türkiye'nin önde gelen nakliye şirketlerinden biri için lojistik yönetim CMS'i. Gerçek zamanlı sevkiyat takip panosu geliştirdim, canlı veri akışları için Redux Toolkit Query ile state yönetimini optimize ettim ve bölge şubeleri arasındaki operasyonları sadeleştirdim.",
    description: "React, Sass, Redux Toolkit, Redux Toolkit Query, Bootstrap",
    src: "/projects/yeditepe.png",
    color: "#1e1e1e",
    accent: "#EF4444",
    company: "NoNoCompany",
  },
];

// İş geçmişi. `subtitle`/`description` İngilizce; Türkçe karşılıkları
// `subtitleTr`/`descriptionTr` alanlarında. Card/Work bileşenleri locale'e
// göre doğru alanı seçer.
export const work = [
  {
    title: "Nuevo Softwarehouse",
    summary: "Building enterprise platforms with Next.js micro frontend architecture for Koç Holding.",
    summaryTr: "Koç Holding için Next.js mikro frontend mimarisiyle kurumsal platformlar geliştiriyorum.",
    subtitle: "Frontend Developer",
    subtitleTr: "Frontend Geliştirici",
    description: "June 2024 - Present",
    descriptionTr: "Haziran 2024 - Halen",
    src: "/logos/nuevo.jpeg",
    color: "#1e1e1e",
    accent: "#dfff1f",
  },
  {
    title: "SHFT",
    summary: "PropTech platform with real-time map-based features, GraphQL and Sentry monitoring.",
    summaryTr: "Gerçek zamanlı harita tabanlı özellikler, GraphQL ve Sentry izleme ile PropTech platformu.",
    subtitle: "Frontend Developer",
    subtitleTr: "Frontend Geliştirici",
    description: "October 2023 - June 2024",
    descriptionTr: "Ekim 2023 - Haziran 2024",
    src: "/logos/shftco.jpeg",
    color: "#1e1e1e",
    accent: "#6366F1",
  },
  {
    title: "Nono Company",
    summary: "Multi-tenant CMS solutions for tourism and logistics with complex role-based access control.",
    summaryTr: "Turizm ve lojistik için karmaşık rol tabanlı yetkilendirmeye sahip çok kiracılı CMS çözümleri.",
    subtitle: "Frontend Developer",
    subtitleTr: "Frontend Geliştirici",
    description: "September 2022 - October 2023",
    descriptionTr: "Eylül 2022 - Ekim 2023",
    src: "/logos/nonoco.jpeg",
    color: "#1e1e1e",
    accent: "#F59E0B",
  },
  {
    title: "Appricot Software Agency",
    summary: "Agency work building responsive web applications for a range of clients.",
    summaryTr: "Farklı müşteriler için responsive web uygulamaları geliştirdiğim ajans dönemi.",
    subtitle: "Frontend Developer",
    subtitleTr: "Frontend Geliştirici",
    description: "March 2022 - September 2022",
    descriptionTr: "Mart 2022 - Eylül 2022",
    src: "/logos/appricot.jpeg",
    color: "#1e1e1e",
    accent: "#10B981",
  },
  {
    title: "Age Dijital Ajans",
    summary: "Started professional career building client websites and CMS platforms.",
    summaryTr: "Profesyonel kariyerime müşteri siteleri ve CMS platformları geliştirerek başladım.",
    subtitle: "Frontend Developer",
    subtitleTr: "Frontend Geliştirici",
    description: "March 2021 - March 2022",
    descriptionTr: "Mart 2021 - Mart 2022",
    src: "/logos/age.jpeg",
    color: "#1e1e1e",
    accent: "#EF4444",
  },
];
