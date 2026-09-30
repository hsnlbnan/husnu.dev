import React from "react";
import Content from "../Content";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Scroll ile ortaya çıkan (parallax reveal) footer.
 *
 * `position: sticky` ile kuruldu, `fixed` ile DEĞİL. Önceki sürüm
 * `clipPath` + `position: fixed` numarası kullanıyordu ve sarı panel sayfanın
 * en başından itibaren tüm viewport'u kaplayan bir katman olarak duruyordu:
 * tarayıcıda ölçtüğümüzde rect'i `top: 0, height: 100vh` idi. Bu yüzden
 * axe/Lighthouse header'daki beyaz metni bu sarı katmana karşı ölçüp kontrast
 * hatası veriyor, tarayıcı da her scroll frame'inde viewport boyutunda fazladan
 * bir katman kompozit ediyordu.
 *
 * Sticky'de element akıştaki yerinde (dokümanın sonunda) durur; yalnızca
 * viewport ona ulaştığında yapışır. Görsel sonuç aynı — içerik footer'ın
 * üzerinden kayar — ama sayfa başındayken ortada viewport'u kaplayan bir
 * katman yok.
 *
 * Efektin çalışması için üstteki içeriğin opak bir arka planı ve daha yüksek
 * bir stacking seviyesi olmalı; bunu `<main>` üzerinde `relative z-10` +
 * `bg-[#1D1D1D]` sağlıyor (bkz. ClientHome ve liked layout).
 */
export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    // Arka plan rengi footer'ın KENDİSİNDE: Content'in kök div'i `h-full`
    // kullanıyor ve bu, yüksekliği belirsiz bir ebeveynde `auto`ya düşüyor.
    // Rengi burada vermek, içerik 100vh'den kısa kaldığında altta koyu bir
    // boşluk oluşmasını her viewport boyutunda engelliyor.
    <footer className="sticky bottom-0 z-0 flex min-h-screen flex-col bg-[#dfff1f]">
      <div className="flex flex-1 flex-col">
        <Content dict={dict} />
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </footer>
  );
}
