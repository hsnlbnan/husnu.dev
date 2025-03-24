
import Header from '@/components/Header';
import React from 'react'

export const LikedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default LikedLayout;