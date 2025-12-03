import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SynthwaveBackground } from "@/components/SynthwaveBackground";
import { BoomboxHero } from "@/components/BoomboxHero";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { TransformationStudio } from "@/components/TransformationStudio";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { UserGallery } from "@/components/UserGallery";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
  gradient: string;
  accent: string;
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleScenarioSelect = (scenario: Scenario) => {
    if (!user) {
      setShowAuthModal(true);
      toast.info('Sign in to start transforming!');
      return;
    }
    setSelectedScenario(scenario);
  };

  const handleAuthChange = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-[#ff6b9d] border-t-transparent mx-auto mb-4"
          />
          <span className="font-digital text-lg tracking-widest text-[#ff6b9d]">
            LOADING...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden" style={{ background: '#0a0015' }}>
      {/* Synthwave Background */}
      <SynthwaveBackground />
      
      {/* Navigation */}
      <NavBar user={user} onAuthChange={handleAuthChange} />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {selectedScenario ? (
          <TransformationStudio
            key="studio"
            scenario={selectedScenario}
            onBack={() => setSelectedScenario(null)}
            userId={user?.id}
          />
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {/* Hero Section */}
            <div className="pt-16">
              <BoomboxHero />
            </div>
            
            {/* Scenario Selection */}
            <ScenarioSelector onSelect={handleScenarioSelect} />
            
            {/* User Gallery (if logged in) */}
            {user && <UserGallery userId={user.id} />}
            
            {/* Features */}
            <FeaturesSection />
            
            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player with autoplay */}
      <MusicPlayer autoPlay={true} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthChange}
      />
    </div>
  );
};

export default Index;
