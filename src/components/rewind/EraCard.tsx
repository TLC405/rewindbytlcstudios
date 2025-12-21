import { motion } from 'framer-motion';
import { EraConfig } from '@/lib/decadePrompts';

interface EraCardProps {
  era: EraConfig;
  index: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export const EraCard = ({ era, index, onClick, isSelected }: EraCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`
        album-tile relative flex-shrink-0 w-64 h-80 rounded-xl overflow-hidden cursor-pointer
        border transition-all duration-300
        ${isSelected 
          ? 'border-primary ring-2 ring-primary/50 scale-105' 
          : 'border-border hover:border-primary/50'
        }
      `}
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient based on era */}
      <div className="absolute inset-0 surface-metal" />
      
      {/* Era badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`era-badge ${era.badgeClass}`}>
          {era.year}
        </span>
      </div>

      {/* Icon */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30">
        {era.icon}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background/90 to-transparent">
        <h3 className="text-xl font-display text-gradient-gold mb-1">
          {era.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {era.shortTagline}
        </p>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};
