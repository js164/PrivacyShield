import React from 'react'
import HeroSection from './ui/HeroSection'
import InfoCards from './ui/InfoCards'
import { Navbar } from './ui/Navbar'
import TrendingArticles from './ui/TrendingArticles';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <InfoCards />
      <TrendingArticles />
    </>
  )
}


