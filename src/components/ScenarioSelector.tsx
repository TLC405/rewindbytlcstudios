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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <span className="font-digital text-xs tracking-widest text-primary">SELECT YOUR ERA</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            Choose Your <span className="led-text">Destiny</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a legendary scenario and upload your photo. Our AI will transform you 
            into that moment in history while preserving your identity perfectly.
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
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => onSelect(scenario)}
                className="scenario-card group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative p-6">
                  {/* Era Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-digital text-[10px] tracking-widest text-muted-foreground border border-border px-2 py-1 rounded">
                      {scenario.era}
                    </span>
                    <IconComponent className={`w-5 h-5 ${scenario.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
