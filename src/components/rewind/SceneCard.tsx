import { motion } from 'framer-motion';

interface SceneCardProps {
  id: string;
  title: string;
  era: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}

export const SceneCard = ({ 
  title, 
  era, 
  description, 
  onClick, 
  isSelected = false 
}: SceneCardProps) => {
  const getEraBadgeClass = (era: string) => {
    const year = parseInt(era);
    if (year >= 1900 && year < 1950) return 'era-badge-1900s';
    if (year >= 1950 && year < 1960) return 'era-badge-1950s';
    if (year >= 1960 && year < 1970) return 'era-badge-1960s';
    if (year >= 1970 && year < 1980) return 'era-badge-1970s';
    if (year >= 1980 && year < 1990) return 'era-badge-1980s';
    if (year >= 1990 && year < 2000) return 'era-badge-1990s';
    if (year >= 2000) return 'era-badge-2000s';
    return 'era-badge-1960s';
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full p-4 md:p-5 rounded-xl text-left transition-all duration-300
        surface-metal border-metallic
        ${isSelected 
          ? 'ring-2 ring-primary shadow-[0_0_30px_hsla(var(--gold),0.3)]' 
          : 'hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
        }
      `}
    >
      {/* Era Badge */}
      <span className={`era-badge ${getEraBadgeClass(era)} mb-3`}>
        {era}
      </span>
      
      {/* Title */}
      <h3 className="font-display text-lg md:text-xl text-foreground mb-2 leading-tight">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};