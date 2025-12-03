import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumBackground } from "@/components/PremiumBackground";
import { PremiumHero } from "@/components/PremiumHero";
import { PremiumNavBar } from "@/components/PremiumNavBar";
import { FilmGallery } from "@/components/FilmGallery";
import { ActionButtons } from "@/components/ActionButtons";
import { PremiumAuthModal } from "@/components/PremiumAuthModal";
import { PremiumTransformationStudio } from "@/components/PremiumTransformationStudio";
import { PremiumMusicPlayer } from "@/components/PremiumMusicPlayer";
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
  const [credits, setCredits] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userTransformations, setUserTransformations] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setCredits(0);
        setUserTransformations([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    // Fetch credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (profile) {
      setCredits(profile.credits);
    }

    // Fetch transformations
    const { data: transformations } = await supabase
      .from('transformations')
      .select(`
        id,
        transformed_image_url,
        scenario_id,
        scenarios (title, era)
      `)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    
    if (transformations) {
      setUserTransformations(transformations);
    }
  };

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
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });
  };

  const handleNewTape = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Scroll to gallery or show scenario selector
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-film-white border-t-transparent mx-auto mb-4"
          />
          <span className="font-display text-2xl tracking-wider text-film-white">
            REWIND
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* Premium Background */}
      <PremiumBackground />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {selectedScenario ? (
          <PremiumTransformationStudio
            key="studio"
            scenario={selectedScenario}
            onBack={() => {
              setSelectedScenario(null);
              if (user) fetchUserData(user.id);
            }}
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
            {/* Navigation */}
            <PremiumNavBar 
              user={user} 
              credits={credits}
              onAuthClick={() => setShowAuthModal(true)} 
            />
            
            {/* Hero Section */}
            <PremiumHero />
            
            {/* Film Gallery */}
            <div id="gallery">
              <FilmGallery 
                onSelectScenario={handleScenarioSelect}
                userTransformations={userTransformations}
              />
            </div>
            
            {/* Action Buttons */}
            <ActionButtons 
              onNewTape={handleNewTape}
              hasTransformations={userTransformations.length > 0}
            />

            {/* Footer */}
            <footer className="py-12 text-center">
              <p className="font-mono text-xs text-film-white/40 tracking-wider">
                © 2024 REWIND · POWERED BY TRUTH, LOVE & CONNECTION
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player */}
      <PremiumMusicPlayer autoPlay={true} />

      {/* Auth Modal */}
      <PremiumAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthChange}
      />
    </div>
  );
};

export default Index;
