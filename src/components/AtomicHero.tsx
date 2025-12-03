import { motion } from "framer-motion";

export function AtomicHero() {
  return (
    <div className="relative pt-16 pb-8 text-center overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        {/* Ghost text behind */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 font-display text-[8rem] md:text-[14rem] lg:text-[18rem] leading-none select-none"
          style={{ 
            WebkitTextStroke: '1px hsl(185 100% 50%)',
            WebkitTextFillColor: 'transparent'
          }}
        >
          REWIND
        </motion.h1>

        {/* Main text */}
        <h1 className="relative font-display text-[5rem] md:text-[8rem] lg:text-[10rem] leading-none tracking-tight">
          <motion.span 
            className="text-neon inline-block"
            animate={{ 
              textShadow: [
                "0 0 20px hsl(185 100% 50% / 0.5)",
                "0 0 40px hsl(185 100% 50% / 0.8), 0 0 60px hsl(320 100% 60% / 0.4)",
                "0 0 20px hsl(185 100% 50% / 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            R
          </motion.span>
          <span className="text-film-white">EWIN</span>
          <motion.span 
            className="text-neon-pink inline-block"
            animate={{ 
              textShadow: [
                "0 0 20px hsl(320 100% 60% / 0.5)",
                "0 0 40px hsl(320 100% 60% / 0.8), 0 0 60px hsl(270 80% 60% / 0.4)",
                "0 0 20px hsl(320 100% 60% / 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            D
          </motion.span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative mt-6"
      >
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-px w-12 md:w-24 lg:w-32 bg-gradient-to-r from-transparent to-primary/60 origin-right"
          />
          <p className="font-tech text-xs md:text-sm tracking-[0.4em] text-film-white/70 uppercase">
            Time Travel Your Identity
          </p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-px w-12 md:w-24 lg:w-32 bg-gradient-to-l from-transparent to-accent/60 origin-left"
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto px-4"
        >
          Upload your photo. Choose an era. Watch AI transform you into a legend.
        </motion.p>
      </motion.div>

      {/* Floating badges */}
      <div className="absolute top-8 left-8 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="era-badge text-primary"
        >
          AI POWERED
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="era-badge text-accent"
        >
          NEXT GEN
        </motion.div>
      </div>
    </div>
  );
}