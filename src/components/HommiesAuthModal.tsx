import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Crown, Sparkles, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HommiesAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TLC_ACCESS_CODE = "1309";

const WELCOME_MESSAGES = [
  "Welcome to the fam! 🎉",
  "You're one of us now! 💯",
  "The legends await! ⚡",
  "Time to make history! 🚀",
  "Let's go back in time! 🕰️",
];

const PERSONALIZED_GREETINGS = [
  "Yo",
  "What's good",
  "Ayyy",
  "Welcome back",
];

export function HommiesAuthModal({ isOpen, onClose, onSuccess }: HommiesAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'code' | 'auth'>('code');
  const [codeValid, setCodeValid] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('code');
      setAccessCode('');
      setCodeValid(false);
    }
  }, [isOpen]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === TLC_ACCESS_CODE) {
      setCodeValid(true);
      setTimeout(() => setStep('auth'), 300);
      toast.success("Welcome to Trevels Hommies! 🎉");
    } else {
      toast.error("That's not the right code, homie");
      setAccessCode('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        const greeting = PERSONALIZED_GREETINGS[Math.floor(Math.random() * PERSONALIZED_GREETINGS.length)];
        toast.success(`${greeting}, homie! Let's make magic ✨`);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        
        const message = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
        toast.success(message);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb orb-gold w-80 h-80 top-1/4 -left-40" />
            <div className="orb orb-purple w-60 h-60 bottom-1/4 -right-20" />
          </div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            <div className="card-glow p-8 md:p-10">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {step === 'code' ? (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Header */}
                    <div className="text-center mb-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center pulse-glow"
                      >
                        <Crown className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-wide">
                        TREVELS HOMMIES
                      </h2>
                      <p className="text-muted-foreground">
                        Enter the secret code to join the fam
                      </p>
                    </div>

                    {/* Code Form */}
                    <form onSubmit={handleCodeSubmit} className="space-y-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter Access Code"
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                          className="input-premium text-center text-2xl tracking-[0.3em] font-mono uppercase"
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
                        <span>Verify Code</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground/60 mt-8">
                      <Heart className="w-3 h-3 inline mr-1" />
                      Powered by Truth, Love & Connection
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="vip-tag mx-auto w-fit mb-6">
                        <Crown className="w-4 h-4" />
                        <span>VIP Access</span>
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2 tracking-wide">
                        {isLogin ? 'WELCOME BACK' : 'JOIN THE FAM'}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {isLogin ? "Let's make some magic together" : 'Create your account to start time traveling'}
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="input-premium pl-12"
                            required={!isLogin}
                          />
                        </div>
                      )}

                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-premium pl-12"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-premium pl-12"
                          required
                          minLength={6}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                        ) : (
                          <>
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="text-primary font-semibold">
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </span>
                      </button>
                    </div>

                    {/* Back button */}
                    <button
                      onClick={() => setStep('code')}
                      className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back to code entry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}