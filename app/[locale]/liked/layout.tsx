import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react'
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';

export default function LikedLayout({
  children,
  modal,
  params
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      {/* Header ve Footer <main>'in DIŞINDA: banner ve contentinfo
          landmark'ları main içine yerleştirilemez. Footer artık server-render
          edilir (eskiden ssr:false idi), böylece iletişim bilgileri
          server HTML'inde yer alır. */}
      {/* Footer sticky; bu katman onun üzerinden kayar. */}
      <div className="relative z-10 bg-[#1D1D1D]">
        <Header locale={locale} dict={dict} />
        <main id="main-content" className="px-4 md:px-0">
        <div className="w-full max-w-screen">
          <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
            {children}
          </div>
          {/* Modal slotu - intercept routes için gerekli */}
          {modal}
        </div>
        </main>
      </div>
      <Footer dict={dict} />
    </>
  )
}
