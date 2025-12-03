import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Music, Crown, Sparkles, Star, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = {
  trophy: Trophy,
  music: Music,
  crown: Crown,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
};

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
  icon: string;
  gradient: string;
  accent: string;
}

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setScenarios(data || []);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b9d]" />
      </div>
    );
  }

  return (
    <section id="scenarios" className="relative py-24 px-4">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 mb-6">
            <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">LEGENDARY SCENARIOS</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            Choose Your{' '}
            <span 
              style={{
                background: 'linear-gradient(180deg, #ffbe76 0%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Destiny
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a legendary moment in history and upload your photo. 
            Our AI preserves your identity while transforming everything else.
          </p>
        </motion.div>
        
        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => {
            const IconComponent = iconMap[scenario.icon] || Star;
            
            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                onClick={() => onSelect(scenario)}
                className="group cursor-pointer relative rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 107, 157, 0.1) 0%, rgba(26, 0, 51, 0.8) 100%)',
                  border: '1px solid rgba(255, 107, 157, 0.2)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b9d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6">
                  {/* Era Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-digital text-[10px] tracking-widest text-[#ff6b9d]/70 border border-[#ff6b9d]/30 px-2 py-1 rounded">
                      {scenario.era}
                    </span>
                    <IconComponent className="w-5 h-5 text-[#ff6b9d] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Content */}
                  <h3 
                    className="font-display text-2xl mb-2 transition-all duration-300"
                    style={{
                      color: 'white',
                    }}
                  >
                    <span className="group-hover:text-[#ff6b9d] transition-colors">
                      {scenario.title}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {scenario.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#ff6b9d] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-digital tracking-wider">ENTER ERA</span>
                    <motion.span 
                      className="w-8 h-px bg-[#ff6b9d]"
                      initial={{ width: 0 }}
                      whileInView={{ width: 32 }}
                    />
                  </div>
                </div>

                {/* Bottom glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b9d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
