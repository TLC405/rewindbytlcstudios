import { motion } from "framer-motion";

interface FilmStripProps {
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function FilmStrip({ position = "top", className = "" }: FilmStripProps) {
  const isHorizontal = position === "top" || position === "bottom";
  const count = isHorizontal ? 20 : 15;

  return (
    <div 
      className={`absolute pointer-events-none overflow-hidden ${className} ${
        position === "top" ? "top-0 left-0 right-0 h-8" :
        position === "bottom" ? "bottom-0 left-0 right-0 h-8" :
        position === "left" ? "left-0 top-0 bottom-0 w-8" :
        "right-0 top-0 bottom-0 w-8"
      }`}
    >
      <motion.div 
        className={`flex ${isHorizontal ? "flex-row" : "flex-col"} gap-1`}
        animate={{
          x: isHorizontal ? [-20, -80] : 0,
          y: isHorizontal ? 0 : [-20, -80],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`bg-foreground/10 rounded-sm flex-shrink-0 ${
              isHorizontal ? "w-6 h-4" : "w-4 h-6"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
