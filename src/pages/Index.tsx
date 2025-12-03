import { BoomboxHero } from "@/components/BoomboxHero";
import { LegendaryScenarios } from "@/components/LegendaryScenarios";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <BoomboxHero />
      <LegendaryScenarios />
      <FeaturesSection />
      <Footer />
    </main>
  );
};

export default Index;
