import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AtomicNavBarProps {
  user: any;
  credits?: number;
  onAuthClick: () => void;
}

export function AtomicNavBar({ user, credits = 0, onAuthClick }: AtomicNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-atomic rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-lg border border-primary/40 flex items-center justify-center"
              >
                <span className="font-display text-2xl text-neon">R</span>
              </motion.div>
              <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-lg -z-10" />
            </div>
            <span className="font-tech text-sm tracking-widest text-film-white/80 hidden sm:block">
              REWIND
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Credits Display */}
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-tech text-sm text-primary">{credits}</span>
                  <span className="text-xs text-film-white/50">credits</span>
                </motion.div>

                {/* User Menu */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-film-white/70 hover:text-film-white transition-colors rounded-xl hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn-atomic text-sm py-2 px-6"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-film-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="md:hidden mt-2 overflow-hidden"
            >
              <div className="glass-atomic rounded-2xl p-4 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-primary/10 border border-primary/30">
                      <span className="text-film-white/60 text-sm">Credits</span>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-tech text-primary">{credits}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full btn-ghost text-center py-3"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onAuthClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full btn-atomic text-center py-3"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}