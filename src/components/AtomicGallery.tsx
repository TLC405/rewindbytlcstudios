import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AtomicScenarioCard } from "./AtomicScenarioCard";
import { supabase } from "@/integrations/supabase/client";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
  gradient: string;
  accent: string;
}

interface AtomicGalleryProps {
  onSelectScenario: (scenario: Scenario) => void;
  userTransformations?: Array<{
    id: string;
    transformed_image_url: string | null;
    scenario_id: string | null;
  }>;
}

export function AtomicGallery({ onSelectScenario, userTransformations = [] }: AtomicGalleryProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('is_active', true)
      .order('era', { ascending: true });

    if (error) {
      console.error('Error fetching scenarios:', error);
    } else {
      setScenarios(data || []);
    }
    setLoading(false);
  };

  const getTransformationImage = (scenarioId: string) => {
    const transformation = userTransformations.find(t => t.scenario_id === scenarioId);
    return transformation?.transformed_image_url || undefined;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-accent/30 border-b-accent"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
          <span className="font-tech text-xs tracking-[0.3em] text-primary uppercase">
            Choose Your Era
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-film-white">
          Legendary <span className="text-gradient">Transformations</span>
        </h2>
      </motion.div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {scenarios.map((scenario, index) => (
          <AtomicScenarioCard
            key={scenario.id}
            id={scenario.id}
            era={scenario.era}
            title={scenario.title}
            description={scenario.description}
            imageUrl={getTransformationImage(scenario.id)}
            index={index}
            onClick={() => onSelectScenario(scenario)}
          />
        ))}
      </div>

      {/* Empty State */}
      {scenarios.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground font-mono text-sm">No scenarios available</p>
        </motion.div>
      )}
    </div>
  );
}