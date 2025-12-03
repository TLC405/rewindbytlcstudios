import { motion } from "framer-motion";
import { Play, Square, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CassettePlayer } from "./CassettePlayer";
import { VUMeter } from "./VUMeter";
import { SpeakerGrill } from "./SpeakerGrill";

export function BoomboxHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-led-amber/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* TLC Studios Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-led-red animate-pulse" />
            <span className="font-digital text-xs tracking-widest text-muted-foreground">TLC STUDIOS</span>
          </div>
        </motion.div>

        {/* Main Boombox */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="boombox-body rounded-3xl p-6 md:p-10"
        >
          {/* Top Chrome Strip */}
          <div className="chrome-surface h-3 rounded-t-xl mb-6" />
          
          {/* Main Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6">
            {/* Left Speaker */}
            <div className="hidden md:block">
              <SpeakerGrill />
            </div>
            
            {/* Center - Cassette & Display */}
            <div className="space-y-6">
              {/* LED Display */}
              <div className="relative bg-black rounded-xl p-8 border-2 border-border overflow-hidden">
                {/* Scanlines overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] pointer-events-none" />
                {/* Glow effect behind text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 bg-led-amber/20 blur-3xl rounded-full" />
                </div>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative font-display text-6xl md:text-8xl text-center text-led-amber animate-pulse-glow"
                  style={{ 
                    textShadow: '0 0 30px hsl(35 100% 50% / 0.8), 0 0 60px hsl(35 100% 50% / 0.5), 0 0 90px hsl(35 100% 50% / 0.3)' 
                  }}
                >
                  REWIND
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="relative font-digital text-xs md:text-sm text-center text-led-amber/80 mt-3 tracking-[0.3em]"
                >
                  TRUTH • LOVE • CONNECTION
                </motion.p>
              </div>
              
              {/* Cassette Player */}
              <CassettePlayer />
              
              {/* VU Meters */}
              <div className="grid grid-cols-2 gap-4">
                <VUMeter label="L" />
                <VUMeter label="R" />
              </div>
              
              {/* Transport Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button variant="boombox" size="icon" className="rounded-full w-12 h-12">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button variant="play" size="icon" className="rounded-full w-16 h-16">
                  <Play className="w-7 h-7 ml-1" />
                </Button>
                <Button variant="stop" size="icon" className="rounded-full w-12 h-12">
                  <Square className="w-5 h-5" />
                </Button>
                <Button variant="boombox" size="icon" className="rounded-full w-12 h-12">
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Right Speaker */}
            <div className="hidden md:block">
              <SpeakerGrill />
            </div>
          </div>
          
          {/* Volume Slider */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                transition={{ duration: 1, delay: 1 }}
                className="h-full bg-gradient-to-r from-led-green via-led-amber to-led-red rounded-full"
              />
            </div>
          </div>
          
          {/* Bottom Chrome Strip with Wood Accent */}
          <div className="mt-6 flex gap-2">
            <div className="wood-surface flex-1 h-4 rounded-bl-xl" />
            <div className="chrome-surface flex-1 h-4" />
            <div className="wood-surface flex-1 h-4 rounded-br-xl" />
          </div>
        </motion.div>
        
        {/* Tagline Below Boombox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-xl md:text-2xl text-foreground/80 font-light">
            Rewind time and <span className="text-primary font-medium">reimagine yourself</span>.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Powered by advanced AI that preserves your identity while transforming everything else. 
            Step into legendary moments throughout history.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button variant="led" size="xl">
              Start Transforming
            </Button>
            <Button variant="ghost" size="lg" className="text-muted-foreground">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
