import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtomicAuthModal } from "@/components/AtomicAuthModal";
import { AtomicStudio } from "@/components/AtomicStudio";
import { TimelineHome } from "@/components/TimelineHome";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, LogOut, Coins } from "lucide-react";

interface Scene {
  id: string;
  title: string;
  description: string;
  era: string;
  celebs?: string[];
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
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
      .select('id, transformed_image_url, scenario_id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    
    if (transformations) {
      setUserTransformations(transformations);
    }
  };

  const handleSceneSelect = (scene: Scene, photo: string) => {
    if (!user) {
      setShowAuthModal(true);
      toast.info('Sign in to travel back in time!');
      return;
    }
    setUploadedPhoto(photo);
    setSelectedScene({
      ...scene,
      gradient: 'from-primary/20 to-accent/20',
      accent: 'text-primary'
    } as any);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
  };

  const handleBack = () => {
    setSelectedScene(null);
    setUploadedPhoto(null);
    if (user) fetchUserData(user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-muted border-t-primary mx-auto mb-6"
          />
          <h1 className="font-display text-3xl font-bold text-foreground">
            Rewind
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Subtle grain overlay */}
      <div className="fixed inset-0 pointer-events-none grain" />
      
      <AnimatePresence mode="wait">
        {selectedScene ? (
          <AtomicStudio
            key="studio"
            scenario={selectedScene as any}
            onBack={handleBack}
            userId={user?.id}
            preUploadedPhoto={uploadedPhoto}
          />
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Minimal Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
              <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-bold text-foreground">
                    Rewind
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                        <Coins className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-foreground">{credits}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </nav>

            {/* Timeline Content */}
            <div className="pt-16">
              <TimelineHome
                onSelectScene={handleSceneSelect}
                userTransformations={userTransformations}
              />
            </div>

            {/* Simple Footer */}
            <footer className="py-8 text-center border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                © 2024 Rewind · Powered by Truth, Love & Connection
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AtomicAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
              fetchUserData(session.user.id);
            }
          });
        }}
      />
    </div>
  );
};

export default Index;