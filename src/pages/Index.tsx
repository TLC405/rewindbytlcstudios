import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="cassette-window inline-block px-6 py-3 mb-4">
            <span className="font-digital text-lg tracking-widest led-text animate-pulse">
              LOADING...
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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

      {/* Music Player */}
      <MusicPlayer />

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
