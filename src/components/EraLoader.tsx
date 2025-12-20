import { motion } from "framer-motion";
import { Disc3, Radio, Tv, Smartphone, Music, Zap } from "lucide-react";

interface EraLoaderProps {
  era: string;
  progress: number;
}

const ERA_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  '1950s': { icon: Radio, color: 'hsl(var(--sunset-orange))', label: 'Spinning the vinyl...' },
  '1960s': { icon: Disc3, color: 'hsl(var(--electric-purple))', label: 'Tuning in the vibes...' },
  '1970s': { icon: Disc3, color: 'hsl(var(--gold))', label: 'Disco ball spinning...' },
  '1980s': { icon: Tv, color: 'hsl(var(--hot-pink))', label: 'Loading VHS...' },
  '1990s': { icon: Music, color: 'hsl(var(--cyber-blue))', label: 'Dropping the beat...' },
  '2000s': { icon: Smartphone, color: 'hsl(var(--neon-green))', label: 'Buffering Y2K style...' },
  '2010s': { icon: Zap, color: 'hsl(var(--primary))', label: 'Going viral...' },
};

export function EraLoader({ era, progress }: EraLoaderProps) {
  const config = ERA_CONFIG[era] || ERA_CONFIG['1990s'];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-[-8px] rounded-full opacity-30"
          style={{ background: config.color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main spinning ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-muted"
          style={{ borderTopColor: config.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Center icon */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-8 h-8" style={{ color: config.color }} />
        </motion.div>
      </div>

      {/* Text */}
      <div className="text-center">
        <motion.p 
          className="font-display text-2xl text-foreground tracking-wide"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          REWINDING...
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">{config.label}</p>
        <p className="text-xs font-mono text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ 
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${config.color}, hsl(var(--primary)))`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
