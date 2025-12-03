import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PremiumNavBarProps {
  user: any;
  credits?: number;
  onAuthClick: () => void;
}

export function PremiumNavBar({ user, credits = 0, onAuthClick }: PremiumNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  return (
    <nav className="relative z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="font-display text-2xl text-film-white tracking-wide">R</span>
          <span className="font-mono text-xs text-film-white/60 hidden sm:block">REWIND</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-6"
        >
          {user ? (
            <>
              {/* Credits Display */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-film-white/10 border border-film-white/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm text-film-white">{credits}</span>
                <span className="text-xs text-film-white/60">credits</span>
              </div>

              {/* User Menu */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-film-white/80 hover:text-film-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="btn-gold"
            >
              Sign In
            </button>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-film-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 overflow-hidden"
          >
            <div className="glass-card rounded-xl p-4 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-film-white/60 text-sm">Credits</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-mono text-film-white">{credits}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full btn-premium text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="w-full btn-gold text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
