import { HeroSection } from "@/components/landing/HeroSection";
import { ScoringSystemSection } from "@/components/landing/ScoringSystemSection";
import { FeatureCardsSection } from "@/components/landing/FeatureCardsSection";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { Footer } from "@/components/landing/Footer";
import { HeaderHome } from '@/components/shared/HeaderHome';

export default function Home() {
  return (
    <>
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
