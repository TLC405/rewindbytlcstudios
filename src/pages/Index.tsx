import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtomicBackground } from "@/components/AtomicBackground";
import { AtomicHero } from "@/components/AtomicHero";
import { AtomicNavBar } from "@/components/AtomicNavBar";
import { AtomicGallery } from "@/components/AtomicGallery";
import { AtomicAuthModal } from "@/components/AtomicAuthModal";
import { AtomicStudio } from "@/components/AtomicStudio";
import { AtomicMusicPlayer } from "@/components/AtomicMusicPlayer";
import { AtomicControlPanel } from "@/components/AtomicControlPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap } from "lucide-react";

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (profile) {
      setCredits(profile.credits);
    }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary mx-auto"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-accent/30 border-b-accent"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          <h1 className="font-display text-4xl tracking-wide">
            <span className="text-neon">R</span>
            <span className="text-film-white">EWIN</span>
            <span className="text-neon-pink">D</span>
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* Background */}
      <AtomicBackground />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {selectedScenario ? (
          <AtomicStudio
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
            <AtomicNavBar 
              user={user} 
              credits={credits}
              onAuthClick={() => setShowAuthModal(true)} 
            />
            
            {/* Hero Section */}
            <AtomicHero />

            {/* Control Panel (Desktop) */}
            <AtomicControlPanel isProcessing={false} />
            
            {/* Gallery */}
            <AtomicGallery
              onSelectScenario={handleScenarioSelect}
              userTransformations={userTransformations}
            />

            {/* Footer - extra padding for bottom music bar */}
            <footer className="pt-16 pb-28 text-center relative">
              <div className="max-w-2xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
                    <span className="font-tech text-xs tracking-[0.3em] text-muted-foreground uppercase">
                      Powered by AI
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/40" />
                  </div>
                  <p className="font-display text-lg text-film-white/60 mb-2">
                    REWIND
                  </p>
                  <p className="text-xs text-muted-foreground">
                    © 2024 · Truth, Love & Connection
                  </p>
                </motion.div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player */}
      <AtomicMusicPlayer autoPlay={true} />

      {/* Auth Modal */}
      <AtomicAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthChange}
      />
    </div>
  );
};

export default Index;