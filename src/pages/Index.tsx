import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MirrorSection from "@/components/MirrorSection";
import AnnihilationSection from "@/components/AnnihilationSection";
import AcceleratorRingSection from "@/components/AcceleratorRingSection";
import ApplicationsSection from "@/components/ApplicationsSection";
import BentoGridPhysicists from "@/components/BentoGridPhysicists";
import MysterySection from "@/components/MysterySection";
import LearnMoreSection from "@/components/LearnMoreSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-antimatter-bg text-antimatter-text">
      <Navigation />
      
      <main>
        <HeroSection />
        <MirrorSection />
        <AnnihilationSection />
        <AcceleratorRingSection />
        <ApplicationsSection />
        <BentoGridPhysicists />
        <MysterySection />
        <LearnMoreSection />
      </main>
    </div>
  );
};

export default Index;
