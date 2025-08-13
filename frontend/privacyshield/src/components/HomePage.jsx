import React from 'react'
import HeroSection from './ui/HeroSection'
import InfoCards from './ui/InfoCards'
import { Navbar } from './ui/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <InfoCards />
    </>
  )
}


