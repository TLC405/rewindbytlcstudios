import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Mail, Lock, ArrowRight, Crown, Sparkles, Heart, 
  Eye, EyeOff
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HommiesAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TLC_ACCESS_CODE = "1309";

type Step = 'code' | 'login';

export function HommiesAuthModal({ isOpen, onClose, onSuccess }: HommiesAuthModalProps) {
  const [step, setStep] = useState<Step>('code');
  const [accessCode, setAccessCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setStep('code');
      setAccessCode('');
      setCodeValid(false);
      setEmail('');
      setPassword('');
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === TLC_ACCESS_CODE) {
      setCodeValid(true);
      setTimeout(() => setStep('login'), 300);
    } else {
      toast.error("That's not the right code, homie");
      setAccessCode('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back, time traveler!");
        onSuccess();
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success("Welcome to the inner circle!");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'code':
        return (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <Crown className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-wide">
                TREVELS HOMMIES
              </h2>
              <p className="text-muted-foreground">
                Enter TLC's Hommies Code to join the inner circle
              </p>
            </div>

            {/* Code Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="• • • •"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="input-premium text-center text-3xl tracking-[0.5em] font-mono uppercase"
                  maxLength={4}
                  autoFocus
                />
                {codeValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                )}
              </div>

              <button
                type="submit"
                disabled={accessCode.length !== 4}
                className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Unlock the Door</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground/60">
              <Heart className="w-3 h-3 inline mr-1" />
              Powered by Truth, Love & Connection
            </p>
          </motion.div>
        );

      case 'login':
        return (
          <motion.div
            key="login-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <Crown className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="font-display text-3xl text-foreground mb-2 tracking-wide">
                {isLogin ? 'WELCOME BACK' : 'JOIN THE CIRCLE'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Let's travel through time together" : 'Create your time traveler account'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-12"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-12 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-medium underline underline-offset-4">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </span>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground/60">
              <Heart className="w-3 h-3 inline mr-1" />
              Powered by Truth, Love & Connection
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}