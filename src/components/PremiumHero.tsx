import { motion } from "framer-motion";

export function PremiumHero() {
  return (
    <div className="relative pt-8 pb-4 text-center">
      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-display text-7xl md:text-9xl lg:text-[12rem] text-film-white tracking-tight text-shadow-lg"
      >
        REWIND
      </motion.h1>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex items-center justify-center gap-4 mt-2"
      >
        <div className="h-px w-16 md:w-24 bg-film-white/40" />
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-film-white/80 uppercase">
          Powered by Truth, Love & Connection
        </p>
        <div className="h-px w-16 md:w-24 bg-film-white/40" />
      </motion.div>
    </div>
  );
}
