import { motion } from "framer-motion";

interface FilmStripCardProps {
  imageUrl?: string;
  era: string;
  title: string;
  code: string;
  rotation?: number;
  delay?: number;
  onClick?: () => void;
}

export function FilmStripCard({ 
  imageUrl, 
  era, 
  title, 
  code, 
  rotation = 0,
  delay = 0,
  onClick 
}: FilmStripCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        y: -10,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Film Strip Container */}
      <div className="relative w-[200px] md:w-[240px] bg-film-white rounded-sm shadow-film overflow-hidden">
        
        {/* Top Film Perforations */}
        <div className="h-5 bg-film-black flex items-center justify-around px-2">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-3 bg-film-white/90 rounded-[1px]"
            />
          ))}
        </div>

        {/* Image Area */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-neutral-100 to-neutral-200">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-light/20 to-teal-dark/30">
              <span className="text-teal-dark/50 font-display text-lg">REWIND</span>
            </div>
          )}
          
          {/* Best Buy Tag */}
          <div className="absolute top-3 right-3 transform rotate-3">
            <div className="best-tag shadow-lg">
              BEST BUY
            </div>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-film-black/0 group-hover:bg-film-black/20 transition-colors duration-300" />
        </div>

        {/* Bottom Info Section */}
        <div className="bg-film-white p-3 border-t border-neutral-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-neutral-500 tracking-wider">TLC STUDIOS</span>
            </div>
            <span className="font-mono text-[10px] text-neutral-400">CAT. NO.</span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="font-display text-xl text-film-black tracking-wide">{era}</span>
            <span className="era-label">{code}</span>
          </div>
          
          <p className="text-[11px] text-neutral-600 mt-2 font-medium uppercase tracking-wide truncate">
            {title}
          </p>
        </div>

        {/* Bottom Film Perforations */}
        <div className="h-5 bg-film-black flex items-center justify-around px-2">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-3 bg-film-white/90 rounded-[1px]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
