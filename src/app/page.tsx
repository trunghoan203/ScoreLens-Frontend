'use client';
import { useState, useEffect } from 'react';
import { HeroSection } from "@/components/landing/HeroSection";
import { ScoringSystemSection } from "@/components/landing/ScoringSystemSection";
import { FeatureCardsSection } from "@/components/landing/FeatureCardsSection";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { Footer } from "@/components/landing/Footer";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <HeaderHome />
      <div className="bg-black text-white">
        <HeroSection />
        <ScoringSystemSection />
        <FeatureCardsSection />
        <ValuesSection />
        <Footer />
      </div>
    </>
  );
}
