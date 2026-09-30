/**
 * Cal.com embed'ini yalnızca kullanıcı gerçekten rezervasyon açmak istediğinde
 * yükler.
 *
 * Önceden `getCalApi()` her sayfada bir `useEffect` içinde çağrılıyordu. Bu:
 *   - her ziyarette app.cal.com'dan embed.js indiriyordu,
 *   - Cloudflare'in `__cf_bm` üçüncü taraf çerezini kuruyordu
 *     (Lighthouse "Uses third-party cookies" + "Issues" hataları),
 *   - ana thread'i ziyaretçilerin büyük çoğunluğu için boşuna meşgul ediyordu.
 *
 * Artık script ilk tıklamada dinamik import ile geliyor ve modal programatik
 * olarak açılıyor; `data-cal-link` attribute'una gerek kalmıyor.
 */

import type { getCalApi } from "@calcom/embed-react";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

const CAL_LINK = "husnu";

let calApiPromise: Promise<CalApi> | null = null;

function loadCalApi(): Promise<CalApi> {
  if (!calApiPromise) {
    calApiPromise = import("@calcom/embed-react").then(async (mod) => {
      const cal = await mod.getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: { brandColor: "#000000" },
        },
      });
      return cal;
    });
  }
  return calApiPromise;
}

export async function openCalBooking() {
  try {
    const cal = await loadCalApi();
    cal("modal", { calLink: CAL_LINK });
  } catch {
    // Embed yüklenemezse (ağ hatası, script engelleyici) kullanıcıyı
    // Cal.com sayfasına düşür — sessizce başarısız olmaktansa.
    window.open(`https://cal.com/${CAL_LINK}`, "_blank", "noopener,noreferrer");
  }
}
