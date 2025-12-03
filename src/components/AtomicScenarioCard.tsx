import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowRight } from "lucide-react";

interface AtomicScenarioCardProps {
  id: string;
  era: string;
  title: string;
  description: string;
  imageUrl?: string;
  index: number;
  onClick: () => void;
}

export function AtomicScenarioCard({ 
  era, 
  title, 
  description, 
  imageUrl, 
  index, 
  onClick 
}: AtomicScenarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="card-atomic p-1">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-deep via-midnight to-void flex items-center justify-center">
              <div className="text-center p-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-primary/30 flex items-center justify-center"
                >
                  <Clock className="w-10 h-10 text-primary/60" />
                </motion.div>
                <span className="font-display text-3xl text-film-white/20">
                  {era}
                </span>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent opacity-80" />

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Scan line on hover */}
          <motion.div
            initial={{ y: "-100%" }}
            whileHover={{ y: "200%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none"
          />

          {/* Era Badge */}
          <div className="absolute top-4 left-4">
            <div className="era-badge flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-primary">ERA</span>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <h3 className="font-display text-4xl md:text-5xl text-film-white mb-1 leading-none">
                {era}
              </h3>
              <p className="font-tech text-xs tracking-wider text-primary/80 uppercase mb-2">
                {title}
              </p>
              <p className="text-xs text-film-white/50 line-clamp-2 mb-4">
                {description}
              </p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span>Transform Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}