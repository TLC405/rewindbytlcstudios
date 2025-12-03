import { motion } from "framer-motion";

interface VUMeterProps {
  label: string;
}

export function VUMeter({ label }: VUMeterProps) {
  const bars = 12;
  
  return (
    <div className="cassette-window rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className="font-digital text-xs text-muted-foreground">{label}</span>
        <div className="flex-1 flex items-end gap-0.5 h-6">
          {Array.from({ length: bars }).map((_, i) => {
            const delay = i * 0.05;
            const isRed = i >= bars - 2;
            const isYellow = i >= bars - 4 && i < bars - 2;
            
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ 
                  scaleY: [0.2, 0.3 + Math.random() * 0.7, 0.4, 0.2 + Math.random() * 0.5],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay,
                }}
                className={`flex-1 origin-bottom rounded-sm ${
                  isRed 
                    ? "bg-led-red shadow-[0_0_8px_hsl(0_85%_50%/0.6)]" 
                    : isYellow 
                    ? "bg-led-amber shadow-[0_0_8px_hsl(35_100%_50%/0.4)]"
                    : "bg-led-green shadow-[0_0_6px_hsl(120_70%_40%/0.4)]"
                }`}
                style={{ height: "100%" }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Scale markings */}
      <div className="flex justify-between mt-1 px-6">
        <span className="font-digital text-[8px] text-muted-foreground">-20</span>
        <span className="font-digital text-[8px] text-muted-foreground">0</span>
        <span className="font-digital text-[8px] text-led-red">+3</span>
      </div>
    </div>
  );
}
