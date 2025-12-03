import { motion } from "framer-motion";
import { Sparkles, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoomboxHero() {
  const scrollToScenarios = () => {
    document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-[#ff6b9d]" />
            <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">
              POWERED BY TRUTH, LOVE & CONNECTION
            </span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-7xl md:text-9xl mb-4 tracking-wider"
        >
          <span className="relative inline-block">
            <span 
              className="relative z-10"
              style={{
                background: 'linear-gradient(180deg, #ffbe76 0%, #ff7979 50%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(255, 107, 157, 0.5))',
              }}
            >
              REWIND
            </span>
            {/* Glow effect */}
            <span 
              className="absolute inset-0 blur-2xl opacity-50"
              style={{
                background: 'linear-gradient(180deg, #ffbe76 0%, #ff7979 50%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              REWIND
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-2xl md:text-4xl text-foreground/80 mb-4"
        >
          Time Travel Through <span className="text-[#ff6b9d]">AI</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          Upload your photo and reimagine yourself in legendary moments throughout history. 
          Your face, perfectly preserved. Everything else, transformed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={scrollToScenarios}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-[#ff6b9d] to-[#c44569] hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-[#ff6b9d]/30"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#ffbe76] to-[#ff6b9d] opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="relative flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Transforming
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToScenarios}
            className="border-[#ff6b9d]/30 text-foreground hover:bg-[#ff6b9d]/10 hover:border-[#ff6b9d]/50 px-8 py-6 text-lg rounded-full"
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose Your Era
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { value: '50+', label: 'Legendary Eras' },
            { value: '100K+', label: 'Transformations' },
            { value: '4.9★', label: 'User Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-[#ff6b9d] mb-1">
                {stat.value}
              </div>
              <div className="font-digital text-[10px] tracking-widest text-muted-foreground">
                {stat.label}
              </div>
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
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="font-digital text-[10px] tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#ff6b9d] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
