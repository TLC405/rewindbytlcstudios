import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_TRANSFORMATIONS = [
  {
    id: 1,
    title: "Beatles Stage Break",
    era: "1969",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Ali Sparring Session",
    era: "1964",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=800&fit=crop",
  },
  {
    id: 3,
    title: "Motown Rehearsal",
    era: "1983",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop",
  },
  {
    id: 4,
    title: "Sun Records Jam",
    era: "1956",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=800&fit=crop",
  },
  {
    id: 5,
    title: "Abbey Road",
    era: "1969",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=800&fit=crop",
  },
];

export function ExampleGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EXAMPLE_TRANSFORMATIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = EXAMPLE_TRANSFORMATIONS[currentIndex];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main image container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 bg-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/90 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xs font-mono text-primary tracking-wider">
                {current.era}
              </span>
              <h3 className="font-display text-xl text-foreground mt-1">
                {current.title}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {EXAMPLE_TRANSFORMATIONS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
