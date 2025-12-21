import { motion } from 'framer-motion';
import { Cpu, Zap, Clock, Radio } from 'lucide-react';
import { EraConfig } from '@/lib/decadePrompts';

interface TerminalConsoleProps {
  selectedEra: EraConfig | null;
  status: 'idle' | 'ready' | 'generating' | 'complete';
}

export const TerminalConsole = ({ selectedEra, status }: TerminalConsoleProps) => {
  const statusMessages = {
    idle: 'AWAITING INPUT...',
    ready: 'FLUX CAPACITOR: CHARGED',
    generating: 'TIME CIRCUITS: ACTIVE',
    complete: 'DESTINATION REACHED',
  };

  const statusColors = {
    idle: 'text-muted-foreground',
    ready: 'text-primary',
    generating: 'text-cyan-400',
    complete: 'text-green-400',
  };

  return (
    <div className="terminal rounded-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-primary">Time Machine Console</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>

      {/* Console content */}
      <div className="p-4 space-y-3 text-xs">
        {/* Status indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${status === 'idle' ? 'text-muted-foreground' : 'text-primary animate-pulse'}`} />
            <span className="text-muted-foreground">FLUX CAPACITOR:</span>
            <span className={status === 'idle' ? 'text-muted-foreground' : 'text-primary'}>
              {status === 'idle' ? 'STANDBY' : 'ONLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${status === 'generating' ? 'text-cyan-400 animate-spin' : 'text-muted-foreground'}`} />
            <span className="text-muted-foreground">TIME CIRCUITS:</span>
            <span className={status === 'generating' ? 'text-cyan-400' : 'text-muted-foreground'}>
              {status === 'generating' ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">DESTINATION ERA:</span>
          </div>
          
          {selectedEra ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="pl-6"
            >
              <div className="text-lg font-display text-gradient-gold">
                {selectedEra.year} — {selectedEra.name}
              </div>
              <div className="text-muted-foreground mt-1 leading-relaxed">
                {selectedEra.shortTagline}
              </div>
            </motion.div>
          ) : (
            <div className="pl-6 text-muted-foreground animate-pulse">
              SELECT DESTINATION...
            </div>
          )}
        </div>

        {/* Status message */}
        <div className="border-t border-border pt-3 flex items-center gap-2">
          <span className="text-muted-foreground">&gt;</span>
          <span className={`${statusColors[status]} ${status === 'generating' ? 'animate-pulse' : ''}`}>
            {statusMessages[status]}
          </span>
          {status === 'generating' && (
            <span className="animate-pulse">_</span>
          )}
        </div>
      </div>
    </div>
  );
};
