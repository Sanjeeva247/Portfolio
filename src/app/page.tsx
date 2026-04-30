"use client";

import { useEffect } from "react";
import { Navigation } from "../components/navigation";
import { ScrollProgress } from "../components/scroll-progress";
import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { SkillsSection } from "../components/skills-section";
import { ProjectsSection } from "../components/projects-section";
import { ArchitectureSection } from "../components/architecture-section";
import { CaseStudySection } from "../components/case-study-section";
import { ContactSection } from "../components/contact-section";
import { Footer } from "../components/footer";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <ScrollProgress />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ArchitectureSection />
        <CaseStudySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}