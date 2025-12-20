import { motion } from "framer-motion";
import { Sparkles, ChevronDown, Play, Star } from "lucide-react";
import { FilmStrip } from "./FilmStrip";

interface HeroCinematicProps {
  onPreviewClick: () => void;
  onLoginClick: () => void;
  hasUsedFreeTransform: boolean;
}

export function HeroCinematic({ onPreviewClick, onLoginClick, hasUsedFreeTransform }: HeroCinematicProps) {
  // Typewriter effect for title
  const titleLetters = "REWIND".split("");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-gold w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-purple w-80 h-80 bottom-20 -left-40" />
        <div className="orb orb-pink w-64 h-64 top-1/2 right-1/4 opacity-50" />
      </div>

      {/* Film strip borders */}
      <FilmStrip position="top" />
      <FilmStrip position="bottom" />

      {/* Floating decade badges */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute left-8 top-1/3 hidden lg:block"
      >
        <div className="flex flex-col gap-3">
          {["'50s", "'70s", "'90s"].map((decade, i) => (
            <motion.div
              key={decade}
              className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground backdrop-blur-sm"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
            >
              {decade}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute right-8 top-1/3 hidden lg:block"
      >
        <div className="flex flex-col gap-3">
          {["'60s", "'80s", "'00s"].map((decade, i) => (
            <motion.div
              key={decade}
              className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground backdrop-blur-sm"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, delay: i * 0.3 + 0.5, repeat: Infinity }}
            >
              {decade}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
        >
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium text-primary">TLC Studios Presents</span>
        </motion.div>

        {/* Typewriter Title */}
        <div className="relative mb-6">
          {/* Ghost title for layout */}
          <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] font-bold text-foreground/5 tracking-tight leading-none select-none">
            REWIND
          </h1>

          {/* Animated title overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tight leading-none">
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block gradient-text-gold"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    textShadow: '0 0 60px hsl(var(--primary) / 0.5)',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 font-light"
        >
          Time Travel Your Identity
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-sm md:text-base text-muted-foreground/70 mb-12 max-w-lg mx-auto"
        >
          Upload your photo. Choose an era. Watch AI transform you into a legend.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {!hasUsedFreeTransform ? (
            <motion.button
              onClick={onPreviewClick}
              className="btn-primary flex items-center gap-3 text-lg px-10 py-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              <span>Try Free Preview</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={onLoginClick}
              className="btn-primary flex items-center gap-3 text-lg px-10 py-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Join Trevels Hommies</span>
            </motion.button>
          )}

          <motion.button
            onClick={onLoginClick}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>Already a member? Sign In</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex items-center justify-center gap-8 md:gap-12 mt-16"
        >
          {[
            { value: "7+", label: "Decades" },
            { value: "15+", label: "Legendary Scenes" },
            { value: "∞", label: "Memories" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-foreground">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </div>
  );
}
