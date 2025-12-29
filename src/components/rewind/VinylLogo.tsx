import { motion } from 'framer-motion';

interface VinylLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VinylLogo = ({ size = 'md', className = '' }: VinylLogoProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
  };

  const labelSize = {
    sm: 'text-[4px]',
    md: 'text-[6px]',
    lg: 'text-[10px]',
  };

  return (
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} relative ${className}`}
    >
      {/* Outer vinyl edge */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(230,12%,8%)] via-[hsl(230,12%,4%)] to-[hsl(230,12%,2%)] shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_1px_0_hsla(var(--silver),0.2)]" />
      
      {/* Vinyl grooves - multiple rings */}
      <div className="absolute inset-[4%] rounded-full border border-[hsla(var(--silver),0.08)]" />
      <div className="absolute inset-[8%] rounded-full border border-[hsla(var(--silver),0.06)]" />
      <div className="absolute inset-[12%] rounded-full border border-[hsla(var(--silver),0.08)]" />
      <div className="absolute inset-[16%] rounded-full border border-[hsla(var(--silver),0.05)]" />
      <div className="absolute inset-[20%] rounded-full border border-[hsla(var(--silver),0.07)]" />
      <div className="absolute inset-[24%] rounded-full border border-[hsla(var(--silver),0.06)]" />
      <div className="absolute inset-[28%] rounded-full border border-[hsla(var(--silver),0.08)]" />
      
      {/* Label area */}
      <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-[hsl(38,35%,45%)] via-[hsl(38,35%,35%)] to-[hsl(38,25%,25%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_0_hsla(var(--platinum),0.3)]">
        {/* Label inner ring */}
        <div className="absolute inset-[8%] rounded-full border border-[hsla(var(--gold),0.4)]" />
        
        {/* REWIND text - curved around label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display ${labelSize[size]} text-[hsl(230,15%,5%)] font-bold tracking-widest uppercase`}>
            REWIND
          </span>
        </div>
        
        {/* TLC Studios text at bottom */}
        <div className="absolute bottom-[15%] left-0 right-0 flex justify-center">
          <span className={`${size === 'lg' ? 'text-[6px]' : 'text-[3px]'} text-[hsl(230,15%,15%)] tracking-wider opacity-80`}>
            TLC STUDIOS
          </span>
        </div>
        
        {/* Center spindle hole */}
        <div className="absolute inset-[40%] rounded-full bg-[hsl(230,15%,5%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      </div>
      
      {/* Vinyl shine/reflection */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[hsla(var(--silver),0.03)] to-transparent pointer-events-none" />
    </motion.div>
  );
};