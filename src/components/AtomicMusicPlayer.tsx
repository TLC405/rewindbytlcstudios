import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2 } from "lucide-react";

const TRACKS = [
  { title: "Shook Ones (Remix)", artist: "TLC", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Midnight Drive", artist: "TLC Studios", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Retrograde", artist: "TLC Studios", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
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
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

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
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
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

      {/* Bottom Player Bar */}
      {!showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="glass-atomic border-t border-primary/20">
            {/* Progress bar */}
            <div className="h-0.5 bg-surface">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              {/* Now Playing Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-tech text-[10px] text-muted-foreground tracking-widest">Now Playing</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-film-white text-sm truncate">
                    {TRACKS[currentTrack].artist} - {TRACKS[currentTrack].title}
                  </p>
                  <p className="font-tech text-[10px] text-primary tracking-wider">TLC Studios</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevTrack} 
                  className="p-2 text-muted-foreground hover:text-film-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-void hover:shadow-lg hover:shadow-primary/30 transition-shadow"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </motion.button>
                
                <button 
                  onClick={nextTrack} 
                  className="p-2 text-muted-foreground hover:text-film-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-muted-foreground hover:text-film-white transition-colors ml-2"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Branding */}
              <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
                <div className="text-right">
                  <p className="font-display text-xl text-film-white">
                    <span className="text-neon">R</span>EWIN<span className="text-neon-pink">D</span>
                  </p>
                  <p className="font-tech text-[9px] text-muted-foreground tracking-widest">
                    Powered by Truth, Love & Connection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}