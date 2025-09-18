import React from 'react'
import HeroSection from './ui/HeroSection'
import InfoCards from './ui/InfoCards'
import { Navbar } from './ui/Navbar'
import TrendingArticles from './ui/TrendingArticles';

 // HomePage component: Combines the main sections of the landing page: Navbar, HeroSection, InfoCards, and TrendingArticles

export default function HomePage() {
  return (
    <>
      {/* Site-wide navigation bar */}
      <Navbar />
      {/* Hero section with animated shield background */}
      <HeroSection />
      {/* Info cards explaining how the assessment works */}
      <InfoCards />
      {/* Section showcasing trending articles on digital privacy and security */}
      <TrendingArticles />
    </>
  )
}


