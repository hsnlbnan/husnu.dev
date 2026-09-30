import type en from "./en";

// Yapısal olarak en.ts ile birebir aynı olmak zorunda; tip kontrolü bunu
// derleme zamanında garantiliyor (bkz. i18n/dictionaries/index.ts).
const tr: typeof en = {
  meta: {
    siteTitleDefault: "Hüsnü Lübnan | Frontend & Javascript Geliştirici",
    siteTitleTemplate: "%s | Hüsnü Lübnan",
    ogTitle: "Hüsnü Lübnan | Frontend Geliştirici",
    description:
      "Hüsnü Lübnan; React, Next.js ve TypeScript ile yüksek performanslı web uygulamaları geliştiriyor. Sağlam çözümler ve etkileşimli kullanıcı deneyimleri.",
    keywords: [
      "Hüsnü Lübnan",
      "Senior Frontend Developer Türkiye",
      "Frontend Geliştirici",
      "Javascript Geliştirici",
      "React Geliştirici",
      "Next.js Geliştirici",
      "Typescript Geliştirici",
      "Tailwind CSS Geliştirici",
    ],
  },

  layout: {
    skipToContent: "İçeriğe geç",
    noScript:
      "Bu site JavaScript etkinken en iyi şekilde çalışır. Lütfen tarayıcınızda JavaScript'i etkinleştirin.",
  },

  header: {
    role: "Senior Frontend Geliştirici",
    liked: "Beğendiklerim",
    likedAria: "Beğendiklerim sayfasına git",
    freelanceStatus: "Freelance Durumu",
    cv: "CV",
    cvAria: "Özgeçmişi indir (CV)",
    nav: "Ana",
    languageSwitcher: "Dil",
    localeNames: { en: "İngilizce", tr: "Türkçe" },
    switchToTurkish: "Türkçe'ye geç",
    switchToEnglish: "İngilizce'ye geç",
  },

  hero: {
    name: "Hüsnü Lübnan",
    h1Suffix:
      " — React, Next.js ve TypeScript ile yüksek performanslı uygulamalar geliştiren Senior Frontend Geliştirici",
    scrollHint: "kaydır",
  },

  home: {
    featuredWork: "Öne Çıkan İşler",
    projectsReveal: "Rol aldığım projeler, iş başında.",
    scrollToExplore: "Keşfetmek için kaydır",
    careerPath: "Kariyer Yolu",
    workExperience: "İş Deneyimi",
    projectsAria: "Projeler",
    workAria: "İş Deneyimi",
    cookingStatus: "Fırında",
  },

  stack: {
    headlineLead: "Akılda kalan",
    headlineAccent: "arayüzler kuruyorum.",
  },

  top: {
    headlineLead: "Ancak eksik olduğunda fark edilen",
    headlineAccent: "detayların peşindeyim.",
    stackSentence:
      "Her gün {Next.js}, {React}, {TypeScript} ve {Tailwind CSS} yazıyorum. {Framer Motion} ve {GSAP} ile hareket veriyorum, sayfa bir sahne istediğinde {Three.js}'e uzanıyorum, {Cypress} ile test ediyor, {Node.js} ve {PostgreSQL} ile full-stack'e geçiyorum. Son zamanlarda: {SwiftUI} ve {Bun}.",
    years: "yıl",
    shipped: "yayında",
    thisPage: "bu sayfa",
    nowShowing: "Sahnede",
    audienceFor: "{audience} için",
    curveNote: "tek eğri, bütün bölüm",
    contactLine: "İlk dokunuştan itibaren doğru hissettirmesi gereken bir ürün mü yapıyorsun? Konuşalım.",
    bookCall: "Görüşme ayarla",
    bookShort: "Ayarla",
    stackIndex: "Stack dizini",
    recruiterNote: "İK için: hepsi düz metin — ⌘F ile arayın",
    hoverHint: "Nerede kullanıldığını görmek için bir teknolojinin üstüne gel.",
    tapHint: "Nerede kullanıldığını görmek için bir teknolojiye dokun.",
    inspect: "İncele",
    colophon: [
      "3D hero ayrı yüklenir",
      "Tüm karakterler instanced",
      "Piksel hizalı DOM devri",
      "Azaltılmış hareketi gözetir",
      "EN / TR",
    ],
  },

  focus: {
    eyebrow: "Neyi önemsiyorum",
    headline: ["İnsanlar bir arayüzün", "kendilerine ne", "hissettirdiğini hatırlar:"],
    rotatingWords: ["anlaşılır", "hızlı", "insani"],
    paragraph:
      "Kullanıcıların çoğu yenilik aramıyor. Sırada ne olduğunu anlamak, kendinden emin ilerlemek ve hiçbir noktada kaybolmamak istiyorlar.",
  },


  schema: {
    jobTitle: "Senior Frontend Geliştirici",
    personDescription:
      "Türkiye'de yaşayan; Next.js, React, TypeScript ve yüksek performanslı web mimarisi üzerine uzmanlaşmış Senior Frontend Geliştirici.",
    serviceName: "Hüsnü Lübnan — Frontend Danışmanlığı",
    serviceDescription:
      "Kurumsal ölçekli React ve Next.js uygulamaları için profesyonel frontend geliştirme ve danışmanlık hizmetleri.",
    projectsListName: "Hüsnü Lübnan'ın projeleri",
    workListName: "İş deneyimi — Hüsnü Lübnan",
  },

  project: {
    view: "Gör",
    viewProject: "Projeyi Gör",
    caseStudy: "Vaka Analizi",
    techStack: "Teknolojiler",
    explore: "Keşfet",
    visitAria: "{title} projesini ziyaret et",
    linkUnavailable: " (bağlantı mevcut değil)",
    screenshotAlt: "{title} projesinin ekran görüntüsü",
    logoAlt: "{title} logosu",
  },

  contact: {
    badge: "İletişim",
    heading: "Benimle İletişime Geç",
    paragraph:
      "Sorunlarınız, hatalarınız, yeni geliştirmeleriniz veya projeleriniz için bana ulaşabilirsiniz.",
    emailLabel: "E-posta",
    meetLabel: "Ya da görüşelim",
    meetValue: "Görüşme ayarla",
    phoneLabel: "Telefon",
    form: {
      name: "Ad Soyad",
      email: "E-posta",
      message: "Mesaj",
      submit: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      sent: "Mesaj başarıyla gönderildi!",
      failed: "Mesaj gönderilemedi.",
      error: "Mesaj gönderilirken bir hata oluştu.",
      required: "{field} alanı zorunludur.",
      invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
      nameTooShort: "Ad Soyad en az 3 karakter olmalıdır.",
      messageTooShort: "Mesaj en az 10 karakter olmalıdır.",
    },
  },

  liked: {
    title: "Beğendiklerim",
    heading: "Beğendiğim Bileşenler",
    headingAria: "Beğendiğim Bileşenler — {count} bileşen",
    description:
      "İlham almak için keşfedip kaydettiğim, en sevdiğim React ve Tailwind CSS uygulamalarından oluşan seçki.",
    intro:
      "Bu bileşenler; beğendiğim ve şu sitelerde gördüğüm bileşenleri nasıl yapabileceğimi öğrenmek için React, Framer-Motion ve Tailwind ile kodlandı:",
    introPlatforms: "Twitter(X), Behance, Dribbble, Figma.",
    introOutro: "Kaynak kodlar",
    introRespect: "tasarımcılara saygıdan paylaşılmıyor.",
  },

  ses: {
    title: "Ses",
    h1: "Ses — Framer Motion ve Tailwind CSS ile geliştirilmiş, iOS'tan ilham alan etkileşimli dikey ses kontrolü",
    description:
      "Framer Motion ve Tailwind CSS ile geliştirilmiş, iOS'tan ilham alan etkileşimli dikey ses kontrolü.",
  },

  yearProgress: {
    title: "Yıl İlerlemesi",
    description:
      "Günün, haftanın, ayın, yılın veya seçtiğiniz herhangi bir tarihin ilerlemesini gösteren, kendini güncelleyen sade bir duvar kağıdı oluşturun — ve iOS'ta Kısayollar ile ayarlayın.",
  },

  social: {
    linkedin: {
      role: "Senior Frontend Geliştirici",
      metaLabel: "Ege Üniversitesi",
      location: "İzmir, Türkiye",
      footer: "500+ bağlantı",
      actionLabel: "Bağlantı kur",
    },
    x: {
      role: "Senior Frontend Geliştirici",
      metaLabel: "geliştirme notları",
      footer: "Arayüz denemeleri + ürün düşünceleri",
      actionLabel: "Takip et",
    },
    instagram: {
      role: "Senior Frontend Geliştirici",
      metaLabel: "görsel günlük",
      footer: "Kareler, süreç ve günlük kayıtlar",
      actionLabel: "Profili aç",
    },
    github: {
      role: "Senior Frontend Geliştirici",
      metaLabel: "açık kaynak",
      footer: "Denemeler ve yayına alınan işler",
      actionLabel: "Projeleri gör",
    },
  },
};

export default tr;
