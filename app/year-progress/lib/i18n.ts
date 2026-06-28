export type Lang = "tr" | "en";

export interface Dict {
  title: string;
  tagline: string;
  track: string;
  period: string;
  since: string;
  until: string;
  age: string;
  unitDay: string;
  unitWeek: string;
  unitMonth: string;
  unitYear: string;
  periodLabel: string;
  startDate: string;
  targetDate: string;
  birthDate: string;
  style: string;
  styleGrid: string;
  styleBar: string;
  styleNumber: string;
  shape: string;
  circle: string;
  square: string;
  columns: string;
  rows: string;
  filledColor: string;
  background: string;
  linkLabel: string;
  copy: string;
  copied: string;
  openPng: string;
  linkHint: string;
  shortcutTitle: string;
  shortcutIntro: string;
  icloudInstall: string;
  icloudHint: string;
  steps: string[];
  shortcutNote: string;
  downloadShortcut: string;
  openShortcutsApp: string;
  shortcutAdvanced: string;
  signHint: string;
  tzDetected: string;
  freqGood: string;
  freqDay: string;
  lockOn: string;
  lockOff: string;
}

export const DICT: Record<Lang, Dict> = {
  tr: {
    title: "TimeGrid",
    tagline:
      "Günün, haftanın, ayın veya yılın ne kadarının geçtiğini gösteren, kendini güncelleyen bir duvar kağıdı. Ayarla, linki kopyala, iOS'te bir kısayolla bağla.",
    track: "Ne takip edilsin",
    period: "Periyot",
    since: "Geçmişten",
    until: "Geri sayım",
    age: "Yaş",
    unitDay: "Gün",
    unitWeek: "Hafta",
    unitMonth: "Ay",
    unitYear: "Yıl",
    periodLabel: "Periyot",
    startDate: "Başlangıç tarihi (bu tarihten beri)",
    targetDate: "Hedef tarih (bu tarihe kadar)",
    birthDate: "Doğum tarihi",
    style: "Stil",
    styleGrid: "Grid",
    styleBar: "Çubuk",
    styleNumber: "Sayı",
    shape: "Şekil",
    circle: "Daire",
    square: "Kare",
    columns: "Sütun",
    rows: "Satır",
    filledColor: "Dolu renk",
    background: "Arka plan",
    linkLabel: "Duvar kağıdı linkin",
    copy: "Linki kopyala",
    copied: "Kopyalandı ✓",
    openPng: "PNG'yi aç",
    linkHint:
      "Link telefonundan erişilebilir olmalı — bu uygulamayı yayına al (ör. Vercel) ve o adresi kullan. localhost telefonda çalışmaz.",
    shortcutTitle: "iOS'te otomatik güncellenen duvar kağıdı",
    shortcutIntro:
      "iOS uygulamaların duvar kağıdını doğrudan değiştirmesine izin vermez. Yöntem: bir Kısayol + günlük otomasyon. Bir kez kurarsın.",
    icloudInstall: "Hazır kısayolu yükle (iCloud)",
    icloudHint:
      "En kolay yol: bu hazır kısayolu yükle, içindeki “URL İçeriğini Al” adımına yukarıda kopyaladığın kendi linkini yapıştır. Ardından aşağıdaki 4–5. adımlarla günlük otomasyonu kur.",
    steps: [
      "Mevcut duvar kağıdın sabit bir Fotoğraf olmalı (Photo Shuffle değil): Ayarlar → Duvar Kağıdı.",
      "Kısayollar → + → Get Contents of URL (yukarıdaki linki yapıştır) ekle.",
      "Altına Set Wallpaper ekle. Girdi = URL içeriği. Kilit/Ana ekran seç, Show Preview'i kapat.",
      "Otomasyon sekmesi → + → Günün Saati → 06:00, Her Gün → kısayolu çalıştır.",
      "Ask Before Running'i kapat ki her sabah sessizce çalışsın.",
    ],
    shortcutNote:
      "Not: Set Wallpaper aksiyonu iOS sürümüne göre bazen sorun çıkarabilir. Bir gün atlanırsa kısayolu elle bir kez çalıştırmak düzeltir.",
    downloadShortcut: "Kısayol dosyasını indir",
    openShortcutsApp: "Kısayollar'ı aç",
    shortcutAdvanced: "Tek dokunuş kısayol (ileri düzey)",
    signHint:
      "iOS 15+ kısayolların imzalı olmasını ister. İndirdiğin dosyayı Mac'te şununla imzala, sonra telefonuna AirDrop'la:",
    tzDetected: "Algılanan saat dilimi",
    freqGood:
      "Bu seçim için günde bir çalıştırma (ör. 06:00) yeterli — değer günde bir değişir.",
    freqDay:
      "Gün modu gün içinde sürekli değişir; günde tek çalıştırma onu sabah donmuş gösterir. iOS saatlik tek bir otomasyona izin vermez, bu yüzden birkaç saat için ayrı otomasyonlar kur (ör. 08:00 / 12:00 / 16:00 / 20:00).",
    lockOn: "Kilit ekranı",
    lockOff: "Sade",
  },
  en: {
    title: "TimeGrid",
    tagline:
      "A self-updating wallpaper that shows how much of the day, week, month, or year has passed. Configure it, copy the link, connect it on iOS with one Shortcut.",
    track: "What to track",
    period: "Period",
    since: "Since",
    until: "Countdown",
    age: "Age",
    unitDay: "Day",
    unitWeek: "Week",
    unitMonth: "Month",
    unitYear: "Year",
    periodLabel: "Period",
    startDate: "Start date (count up from)",
    targetDate: "Target date (count down to)",
    birthDate: "Birth date",
    style: "Style",
    styleGrid: "Grid",
    styleBar: "Bar",
    styleNumber: "Number",
    shape: "Shape",
    circle: "Circle",
    square: "Square",
    columns: "Columns",
    rows: "Rows",
    filledColor: "Filled color",
    background: "Background",
    linkLabel: "Your wallpaper link",
    copy: "Copy link",
    copied: "Copied ✓",
    openPng: "Open PNG",
    linkHint:
      "The link must be reachable from your phone — deploy this app (e.g. Vercel) and use that URL. localhost won't work on the device.",
    shortcutTitle: "Auto-updating wallpaper on iOS",
    shortcutIntro:
      "iOS doesn't let apps change the wallpaper directly. The way to do it: a Shortcut + a daily automation. Set it up once.",
    icloudInstall: "Install ready-made shortcut (iCloud)",
    icloudHint:
      "Easiest path: install this ready-made shortcut, then paste your own copied link (above) into its “Get Contents of URL” step. Then set up the daily automation with steps 4–5 below.",
    steps: [
      "Your current wallpaper must be a static Photo (not Photo Shuffle): Settings → Wallpaper.",
      "Shortcuts → + → add Get Contents of URL (paste the link above).",
      "Add Set Wallpaper below it. Input = the URL contents. Pick Lock/Home, turn Show Preview off.",
      "Automation tab → + → Time of Day → 6:00 AM, Daily → run the shortcut.",
      "Turn Ask Before Running off so it runs silently each morning.",
    ],
    shortcutNote:
      "Note: the Set Wallpaper action can be flaky depending on your iOS version. If a day is missed, running the shortcut by hand once fixes it.",
    downloadShortcut: "Download shortcut file",
    openShortcutsApp: "Open Shortcuts",
    shortcutAdvanced: "One-tap shortcut (advanced)",
    signHint:
      "iOS 15+ requires shortcuts to be signed. Sign the downloaded file on your Mac with this, then AirDrop it to your phone:",
    tzDetected: "Detected timezone",
    freqGood:
      "For this selection, running once a day (e.g. 6:00 AM) is enough — the value changes once per day.",
    freqDay:
      "Day mode changes continuously; a once-a-day run shows it frozen at morning. iOS doesn't allow a single hourly automation, so create separate ones for a few times (e.g. 08:00 / 12:00 / 16:00 / 20:00).",
    lockOn: "Lock screen",
    lockOff: "Plain",
  },
};
