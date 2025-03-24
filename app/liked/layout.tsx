
import Header from '@/components/Header';
import React from 'react'

export default function LikedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}