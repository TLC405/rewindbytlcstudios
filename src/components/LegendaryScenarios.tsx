import { motion } from "framer-motion";
import { Sparkles, Crown, Star, Music, Film, Trophy } from "lucide-react";

const scenarios = [
  {
    icon: Trophy,
    era: "90s",
    title: "Oscar Night, 1994",
    description: "Accept the Academy Award on the legendary Shrine Auditorium stage",
    gradient: "from-amber-500/20 to-amber-900/20",
    accent: "text-amber-400",
  },
  {
    icon: Music,
    era: "80s",
    title: "Backstage with Legends",
    description: "Studio session at Death Row Records with Dr. Dre & Snoop",
    gradient: "from-purple-500/20 to-purple-900/20",
    accent: "text-purple-400",
  },
  {
    icon: Crown,
    era: "Ancient",
    title: "Roman Colosseum",
    description: "Stand victorious in the arena as a legendary gladiator",
    gradient: "from-red-500/20 to-red-900/20",
    accent: "text-red-400",
  },
  {
    icon: Film,
    era: "70s",
    title: "Disco Inferno",
    description: "Own the dance floor at Studio 54 in its golden era",
    gradient: "from-pink-500/20 to-pink-900/20",
    accent: "text-pink-400",
  },
  {
    icon: Star,
    era: "60s",
    title: "Moon Landing",
    description: "Take one small step for mankind on the lunar surface",
    gradient: "from-blue-500/20 to-blue-900/20",
    accent: "text-blue-400",
  },
  {
    icon: Sparkles,
    era: "Future",
    title: "Cyberpunk 2077",
    description: "Navigate the neon-lit streets of Night City",
    gradient: "from-cyan-500/20 to-cyan-900/20",
    accent: "text-cyan-400",
  },
];

export function LegendaryScenarios() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="font-digital text-xs tracking-widest text-primary">LEGENDARY SCENARIOS</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            Step Into <span className="led-text">History</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI places you in iconic moments throughout time. Your face, preserved perfectly. 
            Everything else, transformed to legendary status.
          </p>
        </motion.div>
        
        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="scenario-card group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative p-6">
                {/* Era Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-digital text-[10px] tracking-widest text-muted-foreground border border-border px-2 py-1 rounded">
                    {scenario.era}
                  </span>
                  <scenario.icon className={`w-5 h-5 ${scenario.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-2xl text-foreground mb-2 group-hover:led-text transition-all duration-300">
                  {scenario.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 flex items-center gap-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-digital tracking-wider">ENTER ERA</span>
                  <span className="w-4 h-px bg-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
