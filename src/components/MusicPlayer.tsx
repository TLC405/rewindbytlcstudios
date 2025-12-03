import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Synthwave/retrowave tracks - royalty free vibes
const tracks = [
  { 
    id: '1', 
    title: 'Neon Dreams', 
    artist: 'Rewind FM',
    era: '80s Synthwave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  { 
    id: '2', 
    title: 'Midnight Drive', 
    artist: 'Rewind FM',
    era: 'Retrowave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    id: '3', 
    title: 'Digital Sunset', 
    artist: 'Rewind FM',
    era: 'Outrun',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  { 
    id: '4', 
    title: 'Chrome Hearts', 
    artist: 'Rewind FM',
    era: 'Darksynth',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
];

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export function MusicPlayer({ autoPlay = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(autoPlay);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Handle autoplay on first interaction
  useEffect(() => {
    if (hasInteracted && autoPlay && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowAutoplayPrompt(false);
      }).catch(console.error);
    }
  }, [hasInteracted, autoPlay]);

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
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const startMusic = () => {
    setHasInteracted(true);
    setShowAutoplayPrompt(false);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrev = () => {
    const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) audioRef.current.play();
      }
    }, 100);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(newIndex);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) audioRef.current.play();
      }
    }, 100);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />
      
      {/* Autoplay prompt overlay */}
      <AnimatePresence>
        {showAutoplayPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center max-w-md mx-4"
            >
              {/* Animated music icon */}
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] opacity-20 blur-xl" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] flex items-center justify-center">
                  <Music className="w-12 h-12 text-white" />
                </div>
                {/* Spinning rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#ff6b9d]/30"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <h2 className="font-display text-4xl text-foreground mb-4">
                <span className="led-text">REWIND FM</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Experience the journey with synthwave beats
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  variant="boombox"
                  size="lg"
                  onClick={startMusic}
                  className="w-full text-lg py-6"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Enter with Music
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAutoplayPrompt(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Continue without music
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating music button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] shadow-lg shadow-[#ff6b9d]/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music className="w-6 h-6 text-white" />
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#ff6b9d]"
              animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Audio visualizer bars */}
            <div className="absolute -top-3 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [4, 12 + Math.random() * 8, 4]
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </>
        )}
      </motion.button>

      {/* Expanded player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(26, 0, 51, 0.95), rgba(10, 0, 21, 0.98))',
              boxShadow: '0 20px 60px rgba(255, 107, 157, 0.2), 0 0 40px rgba(196, 69, 105, 0.1)',
              border: '1px solid rgba(255, 107, 157, 0.2)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Album art / visualizer */}
            <div className="relative h-32 bg-gradient-to-br from-[#ff6b9d]/20 to-[#c44569]/20 overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, #ff6b9d, #c44569, #ff6b9d)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              {/* Visualizer bars */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-20 px-4">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-white/80 rounded-t"
                    animate={{
                      height: isPlaying 
                        ? [8 + Math.random() * 40, 16 + Math.random() * 60, 8 + Math.random() * 40]
                        : 8
                    }}
                    transition={{
                      duration: 0.3 + Math.random() * 0.3,
                      repeat: Infinity,
                      delay: i * 0.03
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="p-4">
              {/* Track info */}
              <div className="mb-4">
                <span className="font-digital text-[10px] tracking-widest text-[#ff6b9d]">
                  {currentTrack.era}
                </span>
                <h4 className="font-display text-xl text-foreground truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-muted/30 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff6b9d] to-[#c44569]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="hover:bg-[#ff6b9d]/10 hover:text-[#ff6b9d]"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] hover:opacity-90"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="hover:bg-[#ff6b9d]/10 hover:text-[#ff6b9d]"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="shrink-0 hover:bg-[#ff6b9d]/10 hover:text-[#ff6b9d]"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={([v]) => {
                    setVolume(v / 100);
                    if (v > 0) setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Track list */}
              <div className="mt-4 pt-4 border-t border-border/20">
                <p className="font-digital text-[10px] tracking-widest text-muted-foreground mb-2">
                  UP NEXT
                </p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {tracks.map((track, i) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        setCurrentTrackIndex(i);
                        setTimeout(() => {
                          if (audioRef.current) {
                            audioRef.current.load();
                            audioRef.current.play();
                            setIsPlaying(true);
                          }
                        }, 100);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        i === currentTrackIndex 
                          ? 'bg-[#ff6b9d]/20 text-[#ff6b9d]' 
                          : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
