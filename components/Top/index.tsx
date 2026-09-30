"use client";

// Üst bölüm: hero devrinden sonra görünen ilk ekran.
//
// Her kart iddiasını kendisi kanıtlar ve bunu tıklama gerektirmeden,
// ziyaretçinin zaten yaptığı şeylerle (kaydırma, imleç) gösterir:
//   başlık  → kelimeler kaymış başlar, tipografi kılavuzlarıyla hizaya oturur
//   sahnede → ekran mavi kopyadan pişmiş hâle geçer; imleç ısı çizgisini sürer
//   his     → clear / fast / human kelimeleri anlamlarını oynar
//   iletişim→ portre çizimden fotoğrafa dönüşür
// Tek bir "Inspect" anahtarı (künyede, klavyede `I`) nasıl yapıldığını açar.
//
// Zanaat kuralları: tek eğri, etkileşimde yay (400/30), tabular-nums,
// text-wrap: balance, her etkileşimli öğede hover + focus-visible + active.
// Varıştan önce bölüm durağandır (bkz. useArrival).
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Contact from "./Contact";
import Feel from "./Feel";
import NowShowing from "./NowShowing";
import StackIndex from "./StackIndex";
import { StatementTile } from "./Statement";
import { InspectProvider, InspectSwitch, useArrival } from "./ui";

function Colophon({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 font-mono md:gap-x-5 text-[10px] uppercase tracking-[0.18em] text-white/30">
      <InspectSwitch label={dict.top.inspect} />
      {dict.top.colophon.map((f) => (
        <span key={f} className="flex items-center gap-5">
          <span className="hidden h-px w-3 bg-white/15 md:block" />
          {f}
        </span>
      ))}
    </div>
  );
}

export default function TopSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const en = locale === defaultLocale;
  const { play, arrived } = useArrival();
  return (
    <InspectProvider>
      <div className="flex flex-col gap-4">
        {/* lg+: ilk ekran tam iki sıra; hiçbir kart ortadan kesilmez. */}
        <div className="grid gap-4 lg:h-[calc(100svh-112px)] lg:min-h-[700px] lg:grid-cols-12 lg:grid-rows-[1.25fr_1fr]">
          <StatementTile dict={dict} play={play} />
          <NowShowing en={en} dict={dict} arrived={arrived} />
          <Feel dict={dict} arrived={arrived} />
          <Contact en={en} dict={dict} />
        </div>
        <StackIndex dict={dict} />
        <Colophon dict={dict} />
      </div>
    </InspectProvider>
  );
}
