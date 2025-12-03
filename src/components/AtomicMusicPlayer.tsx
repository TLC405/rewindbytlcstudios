import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2 } from "lucide-react";

const TRACKS = [
  { title: "Neon Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Midnight Drive", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Retrograde", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

interface AtomicMusicPlayerProps {
  autoPlay?: boolean;
}

export function AtomicMusicPlayer({ autoPlay = true }: AtomicMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPrompt, setShowPrompt] = useState(autoPlay);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleEnterWithMusic = () => {
    setShowPrompt(false);
    setIsPlaying(true);
    audioRef.current?.play();
  };

  const handleEnterSilent = () => {
    setShowPrompt(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
        loop={false}
      />

      {/* Autoplay Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'hsl(220 25% 6% / 0.98)' }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
                style={{
                  background: 'conic-gradient(from 0deg, hsl(185 100% 50% / 0.3), hsl(320 100% 60% / 0.3), hsl(270 80% 60% / 0.3), hsl(185 100% 50% / 0.3))',
                  filter: 'blur(100px)'
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative text-center max-w-lg"
            >
              {/* Logo */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 30px hsl(185 100% 50% / 0.3)",
                    "0 0 60px hsl(185 100% 50% / 0.5), 0 0 80px hsl(320 100% 60% / 0.3)",
                    "0 0 30px hsl(185 100% 50% / 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-8 rounded-2xl border border-primary/40 flex items-center justify-center bg-primary/10"
              >
                <Music2 className="w-12 h-12 text-primary" />
              </motion.div>

              <h2 className="font-display text-6xl md:text-7xl mb-4">
                <span className="text-neon">R</span>
                <span className="text-film-white">EWIN</span>
                <span className="text-neon-pink">D</span>
              </h2>
              
              <p className="text-muted-foreground mb-8 font-tech text-sm tracking-widest uppercase">
                Experience the journey with music
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnterWithMusic}
                  className="btn-atomic flex items-center justify-center gap-3"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Enter with Music</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnterSilent}
                  className="btn-ghost flex items-center justify-center gap-3"
                >
                  <VolumeX className="w-5 h-5" />
                  <span>Continue Silent</span>
                </motion.button>
              </div>

              {/* Decorative corners */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
              <div className="absolute -top-8 -right-8 w-16 h-16 border-t-2 border-r-2 border-accent/30" />
              <div className="absolute -bottom-8 -left-8 w-16 h-16 border-b-2 border-l-2 border-accent/30" />
              <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-primary/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Player */}
      {!showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div
            layout
            className="glass-atomic rounded-2xl p-2 flex items-center gap-2"
          >
            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-void hover:shadow-lg hover:shadow-primary/30 transition-shadow"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <button onClick={prevTrack} className="p-2 text-muted-foreground hover:text-film-white transition-colors">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  
                  <span className="font-tech text-xs text-film-white/80 whitespace-nowrap px-2 min-w-[100px] text-center">
                    {TRACKS[currentTrack].title}
                  </span>
                  
                  <button onClick={nextTrack} className="p-2 text-muted-foreground hover:text-film-white transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-muted-foreground hover:text-film-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted-foreground hover:text-film-white transition-colors"
            >
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="text-lg"
              >
                ›
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}