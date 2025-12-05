import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Clock, Zap, Star } from "lucide-react";
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
}

interface TimelineHomeProps {
  onSelectScene: (scene: Scene) => void;
  userTransformations?: { id: string; transformed_image_url: string; scenario_id: string }[];
}

const DECADES: Decade[] = [
  { id: '1950s', name: "Rock 'n' Roll Era", year: '1950s', color: 'from-amber-500 to-orange-600', bgTint: 'amber' },
  { id: '1960s', name: "Soul & Peace", year: '1960s', color: 'from-emerald-500 to-teal-600', bgTint: 'emerald' },
  { id: '1970s', name: "Disco & Funk", year: '1970s', color: 'from-orange-500 to-pink-500', bgTint: 'orange' },
  { id: '1980s', name: "Neon Pop", year: '1980s', color: 'from-fuchsia-500 to-purple-600', bgTint: 'fuchsia' },
  { id: '1990s', name: "Hip-Hop Golden Age", year: '1990s', color: 'from-cyan-500 to-blue-600', bgTint: 'cyan' },
  { id: '2000s', name: "R&B & Bling", year: '2000s', color: 'from-yellow-500 to-amber-600', bgTint: 'yellow' },
  { id: '2010s', name: "Social Era", year: '2010s', color: 'from-violet-500 to-indigo-600', bgTint: 'violet' },
];

export const TimelineHome = ({ onSelectScene, userTransformations = [] }: TimelineHomeProps) => {
  const [selectedDecade, setSelectedDecade] = useState(DECADES[4]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

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
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      });
    }
  };

  const getTransformationImage = (sceneId: string) => {
    return userTransformations.find(t => t.scenario_id === sceneId)?.transformed_image_url;
  };

  return (
    <div className="relative">
      {/* EPIC HERO SECTION */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent/15 via-accent/5 to-transparent blur-2xl animate-pulse" />

        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/60"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-tech text-xs tracking-[0.3em] text-primary uppercase">
              TLC Studios Presents
            </span>
            <Zap className="w-4 h-4 text-primary animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-7xl md:text-9xl tracking-wider mb-6"
          >
            <span className="text-neon">R</span>
            <span className="text-film-white">EWIN</span>
            <span className="text-neon-pink">D</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 font-light"
          >
            Time-travel selfies with <span className="text-primary font-medium">legends</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground/60 mb-12 max-w-md mx-auto"
          >
            Powered by Truth, Love & Connection
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 0.6, y: { duration: 2, repeat: Infinity } }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Choose Your Era</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </div>

        {/* Scanlines Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-50" />
      </section>

      {/* DECADE SELECTOR */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl text-foreground">Select Era</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur border border-border hover:border-primary/50 hover:bg-primary/10 transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide px-8 py-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none' }}
            >
              {DECADES.map((decade, index) => (
                <motion.button
                  key={decade.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => setSelectedDecade(decade)}
                  className={`
                    flex-shrink-0 w-64 h-40 rounded-2xl relative overflow-hidden snap-center
                    transition-all duration-500 group
                    ${selectedDecade.id === decade.id 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
                      : 'opacity-60 hover:opacity-100 hover:scale-102'}
                  `}
                >
                  {/* Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${decade.color}`} />
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:16px_16px]" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    <span className="font-display text-5xl text-white drop-shadow-2xl">
                      {decade.year}
                    </span>
                    <div>
                      <p className="text-white/90 font-medium text-sm mb-1">{decade.name}</p>
                      <div className="flex items-center gap-1.5 text-white/70 text-xs">
                        <Star className="w-3 h-3" />
                        <span>{scenes.filter(s => {
                          const eraMap: { [key: string]: string[] } = {
                            '1950s': ['50s', '1950s'], '1960s': ['60s', '1960s'],
                            '1970s': ['70s', '1970s'], '1980s': ['80s', '1980s'],
                            '1990s': ['90s', '1990s'], '2000s': ['00s', '2000s'],
                            '2010s': ['10s', '2010s'],
                          };
                          return (eraMap[decade.id] || []).some(e => s.era.toLowerCase().includes(e.toLowerCase()));
                        }).length} legendary scenes</span>
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => scrollCarousel('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur border border-border hover:border-primary/50 hover:bg-primary/10 transition-all shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* SCENE GRID */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Selected Era Header */}
          <motion.div
            key={selectedDecade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Sparkles className="w-6 h-6 text-accent" />
            <h2 className="font-display text-4xl">
              <span className="text-foreground">{selectedDecade.year}</span>
              <span className="text-primary mx-3">·</span>
              <span className="text-gradient">{selectedDecade.name}</span>
            </h2>
          </motion.div>

          {/* Scenes */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 rounded-2xl bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : filteredScenes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredScenes.map((scene, index) => {
                  const transformedImage = getTransformationImage(scene.id);
                  return (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => onSelectScene(scene)}
                      className="group cursor-pointer"
                    >
                      <div className="card-atomic h-72 relative">
                        {/* Background */}
                        {transformedImage ? (
                          <img 
                            src={transformedImage} 
                            alt={scene.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${selectedDecade.color} opacity-20`} />
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                        {/* Hover Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 via-transparent to-accent/10" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-6">
                          <span className="era-badge w-fit mb-3">{scene.era}</span>
                          <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-neon transition-all duration-300">
                            {scene.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {scene.description}
                          </p>
                          
                          {/* CTA */}
                          <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <Zap className="w-4 h-4" />
                            <span className="font-tech text-xs tracking-wider uppercase">Enter Scene</span>
                          </div>
                        </div>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
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
              className="text-center py-20 card-atomic"
            >
              <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No scenes available for {selectedDecade.year} yet.</p>
              <p className="text-sm text-muted-foreground/60">More legendary moments coming soon!</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
