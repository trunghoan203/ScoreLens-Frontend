'use client';
import { useState, useEffect } from 'react';
import { HeroSection } from "@/components/landing/HeroSection";
import { ScoringSystemSection } from "@/components/landing/ScoringSystemSection";
import { FeatureCardsSection } from "@/components/landing/FeatureCardsSection";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { Footer } from "@/components/landing/Footer";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useI18n } from '@/lib/i18n/provider';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && mounted && <ScoreLensLoading text={t('common.loading')} />}
      <HeaderHome />
      <div className="bg-black text-white min-h-screen">
        <HeroSection />
        <ScoringSystemSection />
        <FeatureCardsSection />
        <ValuesSection />
        <Footer />
      </div>
    </>
  );
}
