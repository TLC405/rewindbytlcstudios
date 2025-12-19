import { motion } from "framer-motion";
import { Sparkles, Crown, Users, ArrowDown } from "lucide-react";

interface LandingHeroProps {
  onPreviewClick: () => void;
  onLoginClick: () => void;
  hasUsedFreeTransform: boolean;
}

export function LandingHero({ onPreviewClick, onLoginClick, hasUsedFreeTransform }: LandingHeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated Orbs */}
      <div className="orb orb-gold w-96 h-96 -top-48 -left-48" />
      <div className="orb orb-purple w-80 h-80 top-1/4 -right-40" style={{ animationDelay: '-5s' }} />
      <div className="orb orb-pink w-64 h-64 bottom-20 left-1/4" style={{ animationDelay: '-10s' }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Time Travel Photography
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.85] mb-6 tracking-wide"
        >
          <span className="gradient-text-gold text-glow">REWIND</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 font-light"
        >
          Putting <span className="text-primary font-semibold">Trevels Hommies</span> back in time with legends
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground/60 mb-12 max-w-md mx-auto"
        >
          Step into iconic moments. Meet legends. Create memories that never happened.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {!hasUsedFreeTransform ? (
            <button
              onClick={onPreviewClick}
              className="group relative btn-secondary flex items-center gap-3 min-w-[260px] justify-center"
            >
              <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Try Free Preview</span>
              <span className="ml-2 text-xs text-muted-foreground">(1 transform)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 text-muted-foreground text-sm">
              <span>✓ Free preview used</span>
            </div>
          )}

          <button
            onClick={onLoginClick}
            className="btn-primary flex items-center gap-3 min-w-[260px] justify-center"
          >
            <Crown className="w-5 h-5" />
            <span>Trevels Hommies</span>
            <Users className="w-4 h-4 opacity-60" />
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { label: "7 Decades", sublabel: "1950s - 2010s" },
            { label: "26+ Scenes", sublabel: "Legendary Moments" },
            { label: "AI Magic", sublabel: "Face-Lock Tech" },
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-2xl md:text-3xl text-foreground mb-1">
                {feature.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {feature.sublabel}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </div>
  );
}