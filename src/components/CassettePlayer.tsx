import { motion } from "framer-motion";

export function CassettePlayer() {
  return (
    <div className="cassette-window rounded-xl p-4">
      {/* Cassette Body */}
      <div className="relative bg-cassette rounded-lg p-4 border border-border/30">
        {/* Label Area */}
        <div className="bg-gradient-to-b from-primary/20 to-primary/5 rounded-md p-3 mb-4 border border-primary/20">
          <p className="font-digital text-[10px] text-primary text-center tracking-widest">
            ATOMIC IDENTITY TRANSFORMATION
          </p>
          <p className="font-display text-lg text-foreground text-center mt-1">
            ERA SHIFT • VOL.1
          </p>
        </div>
        
        {/* Tape Reels */}
        <div className="flex items-center justify-around">
          {/* Left Reel */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-background border-4 border-border flex items-center justify-center"
            >
              <div className="w-6 h-6 rounded-full bg-background border-2 border-border" />
              {/* Spokes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-0.5 h-6 bg-border origin-bottom"
                  style={{ transform: `rotate(${deg}deg) translateY(-12px)` }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Tape Window */}
          <div className="w-20 h-8 bg-background/50 rounded border border-border/50" />
          
          {/* Right Reel */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-background border-4 border-border flex items-center justify-center"
            >
              <div className="w-6 h-6 rounded-full bg-background border-2 border-border" />
              {/* Spokes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-0.5 h-6 bg-border origin-bottom"
                  style={{ transform: `rotate(${deg}deg) translateY(-12px)` }}
                />
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Bottom holes */}
        <div className="flex justify-center gap-20 mt-4">
          <div className="w-3 h-3 rounded-full bg-background border border-border" />
          <div className="w-3 h-3 rounded-full bg-background border border-border" />
        </div>
      </div>
    </div>
  );
}
