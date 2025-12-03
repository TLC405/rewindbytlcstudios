import { motion } from "framer-motion";

export function SynthwaveBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#1a0033] to-[#2d1b4e]" />
      
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Sun */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[15%]">
        <motion.div
          className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Sun glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff6b35] via-[#ff4757] to-[#c44569] blur-3xl opacity-50" />
          
          {/* Sun body */}
          <div className="absolute inset-[10%] rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ffbe76] via-[#ff7979] to-[#eb4d4b]" />
            
            {/* Sun lines (retrowave style) */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[3px] bg-[#0a0015]/40"
                style={{ 
                  bottom: `${15 + i * 10}%`,
                  transform: `scaleX(${1 - i * 0.05})`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* City silhouette */}
      <div className="absolute bottom-[30%] left-0 right-0 h-[20%]">
        <svg
          viewBox="0 0 1200 200"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0033" />
              <stop offset="100%" stopColor="#0a0015" />
            </linearGradient>
          </defs>
          
          {/* Buildings */}
          <path
            fill="url(#buildingGradient)"
            d="M0,200 L0,150 L30,150 L30,120 L50,120 L50,140 L80,140 L80,100 L100,100 L100,80 L120,80 L120,100 L140,100 L140,130 L170,130 L170,90 L190,90 L190,110 L220,110 L220,70 L240,70 L240,50 L260,50 L260,70 L280,70 L280,110 L320,110 L320,60 L340,60 L340,40 L360,40 L360,60 L380,60 L380,90 L420,90 L420,50 L440,50 L440,30 L460,30 L460,50 L480,50 L480,80 L520,80 L520,40 L540,40 L540,20 L560,20 L560,10 L580,10 L580,20 L600,20 L600,40 L620,40 L620,70 L660,70 L660,30 L680,30 L680,15 L700,15 L700,30 L720,30 L720,60 L760,60 L760,80 L800,80 L800,50 L820,50 L820,30 L840,30 L840,50 L860,50 L860,90 L900,90 L900,60 L920,60 L920,40 L940,40 L940,60 L960,60 L960,100 L1000,100 L1000,70 L1020,70 L1020,90 L1050,90 L1050,120 L1080,120 L1080,100 L1100,100 L1100,130 L1130,130 L1130,110 L1160,110 L1160,140 L1200,140 L1200,200 Z"
          />
          
          {/* Building windows (glowing) */}
          {[...Array(50)].map((_, i) => (
            <motion.rect
              key={i}
              x={50 + Math.random() * 1100}
              y={120 + Math.random() * 60}
              width={3}
              height={5}
              fill="#ff6b9d"
              opacity={0.6}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Neon grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] perspective-[500px]">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, 
                transparent 0%,
                rgba(255, 107, 157, 0.1) 30%,
                rgba(255, 107, 157, 0.2) 100%
              )
            `,
            transform: 'rotateX(75deg)',
            transformOrigin: 'top center',
          }}
        >
          {/* Horizontal grid lines */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`h-${i}`}
                className="absolute w-full h-px"
                style={{
                  top: `${i * 5}%`,
                  background: 'linear-gradient(90deg, transparent 0%, #ff6b9d 20%, #ff6b9d 80%, transparent 100%)',
                  opacity: 0.4 + (i / 20) * 0.4,
                }}
                animate={{
                  translateY: ['0%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          
          {/* Vertical grid lines */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px"
                style={{
                  left: `${(i / 30) * 100}%`,
                  background: 'linear-gradient(180deg, transparent 0%, #c44569 50%, #ff6b9d 100%)',
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fog/mist at horizon */}
      <div className="absolute bottom-[28%] left-0 right-0 h-[15%] bg-gradient-to-t from-[#ff6b9d]/10 via-[#c44569]/5 to-transparent blur-sm" />
      
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-gradient-radial from-[#ff6b9d]/20 via-transparent to-transparent" />
    </div>
  );
}
