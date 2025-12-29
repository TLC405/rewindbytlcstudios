import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface HommieCodeInputProps {
  onSuccess: () => void;
}

const HOMMIE_CODE = '1309';

export const HommieCodeInput = ({ onSuccess }: HommieCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === HOMMIE_CODE) {
      setIsSuccess(true);
      toast.success("Welcome, Hommie! You're in.");
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setIsShaking(true);
      toast.error("That's not the code, fam.");
      setTimeout(() => setIsShaking(false), 500);
      setCode('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <Lock className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h3 className="font-display text-xl text-foreground mb-1">
            TLC's Hommies Only
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter the code to unlock the time machine
          </p>
        </div>

        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter TLC's Hommies Code"
            maxLength={4}
            className={`
              w-full px-5 py-4 text-center text-2xl tracking-[0.5em] font-mono
              bg-secondary/50 border-2 rounded-xl
              text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal
              focus:outline-none focus:ring-2 focus:ring-primary/50
              transition-all duration-300
              ${isSuccess 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-border hover:border-primary/50'
              }
            `}
            disabled={isSuccess}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.button
              key="submit"
              type="submit"
              disabled={code.length < 4}
              className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: code.length >= 4 ? 1.02 : 1 }}
              whileTap={{ scale: code.length >= 4 ? 0.98 : 1 }}
            >
              <span>Enter the Lab</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-4 text-green-400"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Access Granted</span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};