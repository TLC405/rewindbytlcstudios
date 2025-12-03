import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FilmStripCard } from "./FilmStripCard";
import { supabase } from "@/integrations/supabase/client";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
  gradient: string;
  accent: string;
}

interface FilmGalleryProps {
  onSelectScenario: (scenario: Scenario) => void;
  userTransformations?: Array<{
    id: string;
    transformed_image_url: string | null;
    scenario_id: string | null;
    scenarios?: {
      title: string;
      era: string;
    } | null;
  }>;
}

const SCENARIO_CODES: Record<string, string> = {
  "1950s": "RW-095",
  "1960s": "RW-031",
  "1970s": "RW-088",
  "1980s": "RW-017",
  "1990s": "RW-079",
  "2000s": "RW-012",
  "Ancient": "RW-092",
  "Medieval": "RW-045",
  "Victorian": "RW-067",
  "Wild West": "RW-023",
};

export function FilmGallery({ onSelectScenario, userTransformations = [] }: FilmGalleryProps) {
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

  const getRotation = (index: number) => {
    const rotations = [-4, -2, 2, 4, -3, 1, 3, -1];
    return rotations[index % rotations.length];
  };

  const getCode = (era: string) => {
    const key = Object.keys(SCENARIO_CODES).find(k => era.toLowerCase().includes(k.toLowerCase()));
    return SCENARIO_CODES[key || ""] || `RW-${String(Math.floor(Math.random() * 99)).padStart(3, '0')}`;
  };

  // Find user transformation for a scenario
  const getTransformationImage = (scenarioId: string) => {
    const transformation = userTransformations.find(t => t.scenario_id === scenarioId);
    return transformation?.transformed_image_url || undefined;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-film-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* Gallery Grid */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {scenarios.map((scenario, index) => (
          <FilmStripCard
            key={scenario.id}
            imageUrl={getTransformationImage(scenario.id)}
            era={scenario.era}
            title={scenario.title}
            code={getCode(scenario.era)}
            rotation={getRotation(index)}
            delay={index * 0.1}
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
          <p className="text-film-white/60 font-mono text-sm">No scenarios available</p>
        </motion.div>
      )}
    </div>
  );
}
