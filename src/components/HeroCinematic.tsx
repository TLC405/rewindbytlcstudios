import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Crown, ArrowRight, Sparkles, Heart } from "lucide-react";
import { ExampleGallery } from "./ExampleGallery";

interface HeroCinematicProps {
  onPreviewClick: () => void;
  onLoginClick: () => void;
  hasUsedFreeTransform: boolean;
  remainingTransforms: number;
}

const TLC_ACCESS_CODE = "1309";

export function HeroCinematic({ 
  onPreviewClick, 
  onLoginClick, 
  hasUsedFreeTransform,
  remainingTransforms 
}: HeroCinematicProps) {
  const [accessCode, setAccessCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [showCodeError, setShowCodeError] = useState(false);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === TLC_ACCESS_CODE) {
      setCodeValid(true);
      setShowCodeError(false);
      setTimeout(() => onLoginClick(), 300);
    } else {
      setShowCodeError(true);
      setAccessCode("");
    }
  };

  const titleLetters = "REWIND".split("");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-gold w-96 h-96 -top-48 -right-48 opacity-60" />
        <div className="orb orb-purple w-80 h-80 bottom-20 -left-40 opacity-40" />
      </div>

      {/* Main content - two column layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left side - Text content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Heart className="w-3 h-3 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary/90">TLC Studios</span>
          </motion.div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block gradient-text-gold"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.06,
                    duration: 0.4,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0"
          >
            Time Travel Your Identity. Upload your photo, choose a legendary moment, watch the magic happen.
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-5"
          >
            {/* Free Preview Button */}
            {remainingTransforms > 0 ? (
              <motion.button
                onClick={onPreviewClick}
                className="btn-primary flex items-center gap-3 text-base px-8 py-4 mx-auto lg:mx-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                <span>Try Free Preview</span>
              </motion.button>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 text-muted-foreground text-sm mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
                <span>Free preview used</span>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 max-w-sm mx-auto lg:mx-0">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Access Code Form */}
            <div className="max-w-sm mx-auto lg:mx-0">
              <form onSubmit={handleCodeSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter TLC's Hommies Code"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setShowCodeError(false);
                    }}
                    className="w-full px-5 py-3.5 rounded-xl bg-muted/50 border border-border text-center text-lg tracking-[0.2em] font-mono uppercase placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    maxLength={4}
                  />
                  {codeValid && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                    >
                      <Crown className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {showCodeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-destructive text-center"
                    >
                      Invalid code. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={accessCode.length !== 4}
                  className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Crown className="w-4 h-4" />
                  <span>Unlock Full Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-xs text-muted-foreground/60 text-center mt-4">
                Trevels Hommies get unlimited access
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right side - Example Gallery */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <ExampleGallery />
        </motion.div>
      </div>
    </div>
  );
}
