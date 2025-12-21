import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { HeroCinematic } from "@/components/HeroCinematic";
import { HommiesAuthModal } from "@/components/HommiesAuthModal";
import { GlassNav } from "@/components/GlassNav";
import { PreviewStudio } from "@/components/PreviewStudio";
import { AtomicStudio } from "@/components/AtomicStudio";
import { TimelineHome } from "@/components/TimelineHome";
import { useAdvancedFingerprint } from "@/hooks/useAdvancedFingerprint";

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
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userTransformations, setUserTransformations] = useState<any[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);

  const { 
    hasUsedFreeTransform, 
    remainingTransforms,
    recordTransformation, 
    isLoading: previewLoading, 
    isBlocked 
  } = useAdvancedFingerprint();

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
        setDisplayName("");
        setUserTransformations([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, display_name')
      .eq('user_id', userId)
      .single();
    
    if (profile) {
      setCredits(profile.credits);
      setDisplayName(profile.display_name || "");
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
    setUploadedPhoto(photo);
    setSelectedScene({
      ...scene,
      gradient: 'from-primary/20 to-accent/20',
      accent: 'text-primary'
    } as any);
  };

  const handleBack = () => {
    setSelectedScene(null);
    setUploadedPhoto(null);
    if (user) fetchUserData(user.id);
  };

  const handlePreviewClick = () => {
    setShowTimeline(true);
  };

  const handlePreviewTransformComplete = () => {
    recordTransformation();
  };

  if (loading || previewLoading) {
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
            className="w-12 h-12 rounded-full border-2 border-muted border-t-primary mx-auto mb-4"
          />
          <h1 className="font-display text-3xl font-bold gradient-text-gold tracking-wider">
            REWIND
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnimatePresence mode="wait">
        {selectedScene ? (
          user ? (
            <AtomicStudio
              key="studio"
              scenario={selectedScene as any}
              onBack={handleBack}
              userId={user.id}
              preUploadedPhoto={uploadedPhoto}
            />
          ) : (
            <PreviewStudio
              key="preview-studio"
              scenario={selectedScene as any}
              onBack={handleBack}
              preUploadedPhoto={uploadedPhoto}
              onTransformComplete={handlePreviewTransformComplete}
              hasUsedFreeTransform={hasUsedFreeTransform}
              remainingTransforms={remainingTransforms}
              onShowLogin={() => setShowAuthModal(true)}
            />
          )
        ) : showTimeline || user ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <GlassNav 
              user={user}
              credits={credits}
              displayName={displayName}
              onAuthClick={() => setShowAuthModal(true)}
            />

            <div className="pt-20">
              <TimelineHome
                onSelectScene={handleSceneSelect}
                userTransformations={userTransformations}
              />
            </div>

            <footer className="py-6 text-center border-t border-border/20">
              <p className="text-xs text-muted-foreground/60">
                © 2024 Rewind · Powered by Truth, Love & Connection
              </p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroCinematic
              onPreviewClick={handlePreviewClick}
              onLoginClick={() => setShowAuthModal(true)}
              hasUsedFreeTransform={hasUsedFreeTransform || isBlocked}
              remainingTransforms={remainingTransforms}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HommiesAuthModal
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
