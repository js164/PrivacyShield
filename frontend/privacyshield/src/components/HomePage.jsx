import React from "react";
import HeroSection from "./ui/HeroSection";
import InfoCards from "./ui/InfoCards";
import { Navbar } from "./ui/Navbar";
import TrendingArticles from "./ui/TrendingArticles";

/**
 * HomePage component:
 * Combines the main sections of the landing page:
 */
export default function HomePage() {
  return (
    <>
      {/* Site-wide navigation bar */}
      <Navbar />

      {/* Hero banner with main call-to-action */}
      <HeroSection />

      {/* Key features of the privacy assessment */}
      <InfoCards />

      {/* Latest privacy & security articles */}
      <TrendingArticles />
    </>
  );
}
