import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  color: string;
  bgTint: string;
  scenes: Scene[];
}

interface TimelineHomeProps {
  onSelectScene: (scene: Scene) => void;
  userTransformations?: { id: string; transformed_image_url: string; scenario_id: string }[];
}

const DECADES: Omit<Decade, 'scenes'>[] = [
  { id: '1950s', name: "Rock 'n' Roll Era", year: '1950s', color: 'from-amber-500 to-orange-600', bgTint: 'sepia' },
  { id: '1960s', name: "Soul & Peace", year: '1960s', color: 'from-emerald-500 to-teal-600', bgTint: 'emerald' },
  { id: '1970s', name: "Disco & Funk", year: '1970s', color: 'from-orange-500 to-pink-500', bgTint: 'orange' },
  { id: '1980s', name: "Neon Pop", year: '1980s', color: 'from-fuchsia-500 to-purple-600', bgTint: 'fuchsia' },
  { id: '1990s', name: "Hip-Hop Golden Age", year: '1990s', color: 'from-cyan-500 to-blue-600', bgTint: 'cyan' },
  { id: '2000s', name: "R&B & Bling", year: '2000s', color: 'from-yellow-500 to-amber-600', bgTint: 'yellow' },
  { id: '2010s', name: "Social Era", year: '2010s', color: 'from-violet-500 to-indigo-600', bgTint: 'violet' },
];

export const TimelineHome = ({ onSelectScene, userTransformations = [] }: TimelineHomeProps) => {
  const [selectedDecade, setSelectedDecade] = useState(DECADES[4]); // Default to 90s
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    const { data, error } = await supabase
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
        celebs: extractCelebs(s.description)
      })));
    }
    setLoading(false);
  };

  const extractCelebs = (description: string): string[] => {
    // Extract celebrity names from description
    const celebMatches = description.match(/with ([^,]+(?:,\s*[^,]+)*)/i);
    if (celebMatches) {
      return celebMatches[1].split(/[,&]/).map(c => c.trim()).filter(Boolean);
    }
    return [];
  };

  const filteredScenes = scenes.filter(s => {
    const eraMap: { [key: string]: string[] } = {
      '1950s': ['50s', '1950s'],
      '1960s': ['60s', '1960s'],
      '1970s': ['70s', '1970s'],
      '1980s': ['80s', '1980s'],
      '1990s': ['90s', '1990s'],
      '2000s': ['00s', '2000s'],
      '2010s': ['10s', '2010s'],
    };
    const matchingEras = eraMap[selectedDecade.id] || [];
    return matchingEras.some(e => s.era.toLowerCase().includes(e.toLowerCase()));
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getTransformationImage = (sceneId: string) => {
    const transformation = userTransformations.find(t => t.scenario_id === sceneId);
    return transformation?.transformed_image_url;
  };

  const bgTintClasses: { [key: string]: string } = {
    sepia: 'bg-amber-950/20',
    emerald: 'bg-emerald-950/20',
    orange: 'bg-orange-950/20',
    fuchsia: 'bg-fuchsia-950/20',
    cyan: 'bg-cyan-950/20',
    yellow: 'bg-yellow-950/20',
    violet: 'bg-violet-950/20',
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${bgTintClasses[selectedDecade.bgTint]}`}>
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <span className="font-tech text-xs tracking-[0.5em] text-primary/80 uppercase">
            REWIND
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm"
        >
          Time-travel selfies with legends.
        </motion.p>
      </header>

      {/* Decade Carousel */}
      <section className="px-4 py-8">
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur border border-border hover:border-primary/50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DECADES.map((decade, index) => (
              <motion.button
                key={decade.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDecade(decade)}
                className={`
                  flex-shrink-0 w-72 h-44 rounded-2xl relative overflow-hidden snap-center
                  transition-all duration-500 group
                  ${selectedDecade.id === decade.id 
                    ? 'ring-2 ring-primary scale-105 shadow-lg shadow-primary/20' 
                    : 'hover:scale-102 opacity-70 hover:opacity-100'}
                `}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${decade.color} opacity-80`} />
                
                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5">
                  <div>
                    <span className="font-display text-5xl text-white drop-shadow-lg">
                      {decade.year}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium text-sm mb-1">{decade.name}</p>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{scenes.filter(s => {
                        const eraMap: { [key: string]: string[] } = {
                          '1950s': ['50s', '1950s'],
                          '1960s': ['60s', '1960s'],
                          '1970s': ['70s', '1970s'],
                          '1980s': ['80s', '1980s'],
                          '1990s': ['90s', '1990s'],
                          '2000s': ['00s', '2000s'],
                          '2010s': ['10s', '2010s'],
                        };
                        const matchingEras = eraMap[decade.id] || [];
                        return matchingEras.some(e => s.era.toLowerCase().includes(e.toLowerCase()));
                      }).length} scenes</span>
                    </div>
                  </div>
                </div>

                {/* Hover Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur border border-border hover:border-primary/50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </section>

      {/* Scene Strip */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            key={selectedDecade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-3xl text-foreground mb-6"
          >
            {selectedDecade.year} · <span className="text-primary">{selectedDecade.name}</span>
          </motion.h2>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-80 h-56 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredScenes.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              <AnimatePresence mode="popLayout">
                {filteredScenes.map((scene, index) => {
                  const transformedImage = getTransformationImage(scene.id);
                  return (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-shrink-0 w-80 snap-center"
                    >
                      <div
                        onClick={() => onSelectScene(scene)}
                        className="group cursor-pointer h-56 rounded-xl overflow-hidden relative card-atomic"
                      >
                        {/* Background */}
                        {transformedImage ? (
                          <img 
                            src={transformedImage} 
                            alt={scene.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${selectedDecade.color} opacity-30`} />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-5">
                          <span className="era-badge w-fit mb-2 text-[10px]">{scene.era}</span>
                          <h3 className="font-display text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                            {scene.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {scene.description}
                          </p>
                        </div>

                        {/* Hover CTA */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-sm">
                          <span className="btn-atomic text-xs px-6 py-3">
                            Open This Scene
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground mb-4">No scenes available for {selectedDecade.year} yet.</p>
              <p className="text-sm text-muted-foreground/60">More legendary moments coming soon!</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
