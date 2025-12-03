import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Built-in ambient tracks (royalty-free vibes)
const tracks = [
  { 
    id: '1', 
    title: 'Synthwave Dreams', 
    artist: 'Rewind FM',
    era: '80s',
    // Using a placeholder - in production would use actual audio files
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  { 
    id: '2', 
    title: 'Disco Nights', 
    artist: 'Rewind FM',
    era: '70s',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    id: '3', 
    title: 'Future Beats', 
    artist: 'Rewind FM',
    era: 'Future',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

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
  }, []);

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
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setProgress(0);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
    setProgress(0);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />
      
      {/* Floating music button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-glow-amber flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music className="w-6 h-6 text-primary-foreground" />
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Expanded player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-72 boombox-body rounded-2xl p-4 shadow-2xl"
          >
            {/* Track info */}
            <div className="mb-4">
              <div className="cassette-window p-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-digital text-[10px] tracking-widest text-muted-foreground">
                    {currentTrack.era}
                  </span>
                </div>
              </div>
              <h4 className="font-display text-lg text-foreground truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="hover:bg-primary/10"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="boombox"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="hover:bg-primary/10"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="shrink-0 hover:bg-primary/10"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={([v]) => setVolume(v / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>

            {/* VU meter visualization */}
            <div className="flex items-end justify-center gap-1 mt-4 h-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 bg-primary rounded-t"
                  animate={{
                    height: isPlaying 
                      ? [4 + Math.random() * 24, 8 + Math.random() * 20, 4 + Math.random() * 24]
                      : 4
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
