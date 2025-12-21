import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowLeft, ArrowRight, Camera, Sparkles, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScenePreview } from "./ScenePreview";

interface Scene {
  id: string;
  title: string;
  description: string;
  era: string;
  celebs: string[];
}

interface Decade {
  id: string;
  name: string;
  year: string;
  vibe: string;
}

interface TimelineHomeProps {
  onSelectScene: (scene: Scene, uploadedPhoto: string) => void;
  userTransformations?: { id: string; transformed_image_url: string; scenario_id: string }[];
}

const DECADES: Decade[] = [
  { id: '1950s', name: "Rock & Roll", year: "'50s", vibe: "Diners, Jukeboxes & Leather" },
  { id: '1960s', name: "Soul & Peace", year: "'60s", vibe: "Revolution, Beatles & Dreams" },
  { id: '1970s', name: "Disco Era", year: "'70s", vibe: "Funk, Flares & Freedom" },
  { id: '1980s', name: "Neon Pop", year: "'80s", vibe: "Arcades, MTV & Synth" },
  { id: '1990s', name: "Golden Hip-Hop", year: "'90s", vibe: "Street Style & Legends" },
  { id: '2000s', name: "Y2K Glam", year: "'00s", vibe: "Bling, R&B & Icons" },
  { id: '2010s', name: "Modern Icons", year: "'10s", vibe: "Streaming & Stadium Tours" },
];

export const TimelineHome = ({ onSelectScene, userTransformations = [] }: TimelineHomeProps) => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<Decade | null>(null);
  const [previewScene, setPreviewScene] = useState<Scene | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const decadesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    const { data } = await supabase
      .from('scenarios')
      .select('*')
      .eq('is_active', true)
      .order('era');
    
    if (data) {
      setScenes(data.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        era: s.era,
        celebs: []
      })));
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredScenes = selectedDecade ? scenes.filter(s => {
    const eraMap: { [key: string]: string[] } = {
      '1950s': ['50s', '1950s'], '1960s': ['60s', '1960s'],
      '1970s': ['70s', '1970s'], '1980s': ['80s', '1980s'],
      '1990s': ['90s', '1990s'], '2000s': ['00s', '2000s'],
      '2010s': ['10s', '2010s'],
    };
    const matchingEras = eraMap[selectedDecade.id] || [];
    return matchingEras.some(e => s.era.toLowerCase().includes(e.toLowerCase()));
  }) : [];

  const scrollDecades = (direction: 'left' | 'right') => {
    if (decadesRef.current) {
      decadesRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  // STEP 1: Upload Photo
  if (!uploadedPhoto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              TLC Studios Presents
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mt-2 tracking-tight">
              Rewind
            </h1>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xs mx-auto">
              Putting TLC's hommies back in time with legends
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`
              upload-zone w-full aspect-[4/5] md:aspect-square max-w-sm mx-auto
              ${isDragging ? 'border-primary bg-primary/5' : ''}
            `}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className="flex flex-col items-center gap-4 p-8"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Camera className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Upload your photo</p>
                <p className="text-sm text-muted-foreground">
                  Tap or drag & drop
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Powered by Truth, Love & Connection
          </motion.p>
        </div>
      </div>
    );
  }

  // STEP 2: Select Decade (after photo uploaded)
  if (!selectedDecade) {
    return (
      <div className="min-h-screen flex flex-col px-4 py-6 md:py-12">
        {/* Header with photo preview */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 md:mb-12"
        >
          <button
            onClick={() => setUploadedPhoto(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:inline">Change photo</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <img src={uploadedPhoto} alt="Your photo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-muted-foreground hidden md:inline">Ready to travel</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Choose Your Era
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Pick a decade to meet the legends
          </p>
        </motion.div>

        {/* Decades Grid - Mobile optimized */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {DECADES.map((decade, index) => (
              <motion.button
                key={decade.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDecade(decade)}
                className="decade-card group aspect-[4/5] p-4 md:p-5 flex flex-col justify-between text-left"
              >
                <div>
                  <span className="font-display text-4xl md:text-5xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {decade.year}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm md:text-base mb-1">
                    {decade.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {decade.vibe}
                  </p>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Scroll indicator for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 md:hidden"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </motion.div>
      </div>
    );
  }

  // STEP 3.5: Preview Scene (new step!)
  if (previewScene && uploadedPhoto) {
    return (
      <ScenePreview
        scene={previewScene}
        uploadedPhoto={uploadedPhoto}
        onEnter={() => {
          onSelectScene(previewScene, uploadedPhoto);
          setPreviewScene(null);
        }}
        onBack={() => setPreviewScene(null)}
      />
    );
  }

  // STEP 3: Select Scene
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={() => setSelectedDecade(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <img src={uploadedPhoto} alt="Your photo" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setUploadedPhoto(null)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Selected Decade Header */}
      <motion.div
        key={selectedDecade.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-12"
      >
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-display text-5xl md:text-7xl font-bold text-foreground">
            {selectedDecade.year}
          </span>
          <span className="font-display text-2xl md:text-3xl text-muted-foreground">
            {selectedDecade.name}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{selectedDecade.vibe}</p>
      </motion.div>

      {/* Scenes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredScenes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredScenes.map((scene, index) => (
              <motion.button
                key={scene.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setPreviewScene(scene)}
                className="scene-card group text-left"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* Era-specific gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-card via-muted/50 to-card" />
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`
                  }} />
                  
                  {/* Content overlay with stronger gradient for text legibility */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    {/* Dark gradient for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    
                    <div className="relative z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 mb-3">
                        {scene.era}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors drop-shadow-lg">
                        {scene.title}
                      </h3>
                      <p className="text-sm text-foreground/70 line-clamp-2 drop-shadow-md">
                        {scene.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover state */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-semibold tracking-wide">Enter Scene</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No scenes for {selectedDecade.year} yet</p>
          <p className="text-sm text-muted-foreground/60">More legendary moments coming soon</p>
        </motion.div>
      )}

      {/* Quick decade switcher at bottom for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent md:hidden">
        <div className="relative">
          <button
            onClick={() => scrollDecades('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/90 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div
            ref={decadesRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-10"
          >
            {DECADES.map((decade) => (
              <button
                key={decade.id}
                onClick={() => setSelectedDecade(decade)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedDecade.id === decade.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                `}
              >
                {decade.year}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollDecades('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/90 rounded-full"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};