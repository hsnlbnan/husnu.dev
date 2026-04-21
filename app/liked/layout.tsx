import Header from '@/components/Header';
import React from 'react'
import dynamic from 'next/dynamic';
/* import Footer from "@/components/Footer";
 */

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => <div className="w-full h-16 bg-gray-100 dark:bg-gray-800"></div>,
});

export default function LikedLayout({ 
  children,
  modal
}: { 
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <main className="px-4 md:px-0">
      <Header />
      <div className="w-full max-w-screen">
        <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
          {children}
        </div>
        {/* Modal slotu - intercept routes için gerekli */}
        {modal}
      </div>
      <Footer />
    </main>
  )
}
