import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, HardDrive, Activity, ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface AtomicControlPanelProps {
  isProcessing?: boolean;
  currentScenario?: string;
}

const ACTIVE_MODULES = [
  "Face_Lock_V3",
  "Era_Synthesis", 
  "Parallax_Engine",
  "Gemini_2.5_Flash"
];

const DECADE_SCENARIOS = [
  { era: "1950s", desc: "Marilyn Monroe / Brown Derby / Tuxedo" },
  { era: "1960s", desc: "Civil Rights March / MLK / Suit / Face Lock" },
  { era: "1970s", desc: "Disco VIP / Ali & Prince / Glam / No Boxing" },
  { era: "1980s", desc: "Stage Solo / MJ Dancing / Leather / Rock" },
  { era: "1990s", desc: "NSYNC Member / Music Video / Denim / Frost Tips" },
  { era: "2000s", desc: "Oscar Win / Legends Clapping / Spiky Hair" },
  { era: "Day One", desc: "Garden of Eden / Primal / First Human" },
];

export function AtomicControlPanel({ isProcessing = false, currentScenario }: AtomicControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({ ps: 60, latency: 12, memory: 245 });
  const [showWireframe, setShowWireframe] = useState(false);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        ps: Math.floor(55 + Math.random() * 10),
        latency: Math.floor(8 + Math.random() * 8),
        memory: Math.floor(230 + Math.random() * 30)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="glass-atomic rounded-xl overflow-hidden w-72">
        {/* Stats Bar */}
        <div className="px-4 py-3 border-b border-primary/20 bg-void/50">
          <div className="flex items-center justify-between gap-3">
            <StatBadge 
              label="PS" 
              value={stats.ps} 
              icon={<Cpu className="w-3 h-3" />}
              color="primary"
            />
            <StatBadge 
              label="LATENCY" 
              value={`${stats.latency}ms`} 
              icon={<Activity className="w-3 h-3" />}
              color="accent"
            />
            <StatBadge 
              label="MEMORY" 
              value={`${stats.memory}MB`} 
              icon={<HardDrive className="w-3 h-3" />}
              color="gold"
            />
          </div>
        </div>

        {/* GPU Status */}
        <div className="px-4 py-2 border-b border-primary/20 flex items-center justify-between">
          <span className="font-tech text-xs text-muted-foreground">GPU:</span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            <span className="font-tech text-xs text-green-400">ACTIVE</span>
          </motion.div>
        </div>

        {/* Active Modules */}
        <div className="px-4 py-3 border-b border-primary/20">
          <p className="font-tech text-[10px] text-muted-foreground mb-2 tracking-widest">ACTIVE MODULES</p>
          <div className="space-y-1">
            {ACTIVE_MODULES.map((module, i) => (
              <motion.div
                key={module}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={isProcessing ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
                <span className="font-mono text-xs text-film-white/80">{module}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Toggle Wireframe */}
        <div className="px-4 py-2 border-b border-primary/20">
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className="w-full flex items-center justify-between text-xs font-tech text-muted-foreground hover:text-primary transition-colors"
          >
            <span>TOGGLE WIREFRAME</span>
            <div className={`w-8 h-4 rounded-full transition-colors ${showWireframe ? 'bg-primary' : 'bg-surface'}`}>
              <motion.div
                animate={{ x: showWireframe ? 16 : 2 }}
                className="w-3 h-3 mt-0.5 rounded-full bg-film-white"
              />
            </div>
          </button>
        </div>

        {/* Expand/Collapse Config */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-tech text-primary hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>MASTER_PROMPT.config</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Config Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 bg-void/80 font-mono text-[10px] leading-relaxed max-h-64 overflow-y-auto">
                <p className="text-muted-foreground">{"// --- ATOMIC IDENTITY & ERA TRANSFORMATION PROTOCOL ---"}</p>
                <br />
                <p className="text-primary">SYSTEM_INSTRUCTION = {"{"}</p>
                <p className="text-film-white/70 pl-2">OBJECTIVE: <span className="text-gold">"Generate PREMIUM LEGENDARY album art."</span></p>
                <br />
                <p className="text-film-white/70 pl-2">CORE_DIRECTIVES: [</p>
                <p className="text-accent pl-4">"HYPER_ACCURATE_FACIAL_INTEGRITY"</p>
                <p className="text-accent pl-4">"ZERO_TOLERANCE_BODY_OVERRIDE"</p>
                <p className="text-accent pl-4">"LEGENDARY_SCENARIO_INJECTION"</p>
                <p className="text-film-white/70 pl-2">]</p>
                <p className="text-primary">{"}"}</p>
                <br />
                <p className="text-muted-foreground">{"// LOADING DECADE SCENARIOS..."}</p>
                {DECADE_SCENARIOS.map((s) => (
                  <p key={s.era} className={`${currentScenario?.includes(s.era) ? 'text-primary' : 'text-film-white/50'}`}>
                    {">"} {s.era}: {s.desc}
                  </p>
                ))}
                <br />
                <p className="text-green-400">{"// SYSTEM READY."}</p>
                <p className="text-green-400">{"// WAITING FOR USER UPLOAD..."}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatBadge({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: "primary" | "accent" | "gold";
}) {
  const colorClasses = {
    primary: "text-primary border-primary/30",
    accent: "text-accent border-accent/30",
    gold: "text-gold border-gold/30"
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${colorClasses[color]} bg-void/50`}>
      {icon}
      <span className="font-tech text-[10px] text-muted-foreground">{label}:</span>
      <span className="font-tech text-xs">{value}</span>
    </div>
  );
}