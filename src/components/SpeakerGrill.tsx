import { motion } from "framer-motion";

export function SpeakerGrill() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="h-full"
    >
      <div className="speaker-mesh rounded-2xl h-full min-h-[300px] border border-border/50 relative overflow-hidden">
        {/* Outer ring */}
        <div className="absolute inset-4 rounded-full border-4 border-muted" />
        
        {/* Inner speaker cone */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-muted/80 to-background border-2 border-border" />
        
        {/* Dust cap */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-background border border-border shadow-inner-dark" />
        </div>
        
        {/* Subtle glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-led-amber/5 to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
