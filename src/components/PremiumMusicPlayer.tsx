import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";

const TRACKS = [
  { title: "Neon Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Midnight Drive", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Retrograde", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

interface PremiumMusicPlayerProps {
  autoPlay?: boolean;
}

export function PremiumMusicPlayer({ autoPlay = true }: PremiumMusicPlayerProps) {
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
      {/* Audio Element */}
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
            style={{ background: 'hsl(175 45% 12% / 0.95)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-md"
            >
              <h2 className="font-display text-5xl text-film-white mb-4">REWIND</h2>
              <p className="text-film-white/60 mb-8 font-mono text-sm tracking-wide">
                Experience the journey with music
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleEnterWithMusic}
                  className="btn-gold flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Enter with Music
                </button>
                <button
                  onClick={handleEnterSilent}
                  className="btn-premium flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-5 h-5" />
                  Continue Silent
                </button>
              </div>
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
            className="glass-card rounded-full p-2 flex items-center gap-2"
          >
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-film-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <button onClick={prevTrack} className="p-2 text-film-white/60 hover:text-film-white">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  
                  <span className="font-mono text-xs text-film-white/80 whitespace-nowrap px-2">
                    {TRACKS[currentTrack].title}
                  </span>
                  
                  <button onClick={nextTrack} className="p-2 text-film-white/60 hover:text-film-white">
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-film-white/60 hover:text-film-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 rounded-full bg-film-white/10 flex items-center justify-center text-film-white/60 hover:text-film-white"
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
