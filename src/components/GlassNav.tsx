import { motion } from "framer-motion";
import { User, Crown, LogIn, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface GlassNavProps {
  user: any;
  credits: number;
  displayName: string;
  onAuthClick: () => void;
  onLogout?: () => void;
}

export function GlassNav({ user, credits, displayName, onAuthClick, onLogout }: GlassNavProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto">
        <div className="glass-heavy rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="font-display text-lg text-primary-foreground font-bold"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                R
              </motion.span>
            </motion.div>
            <span className="font-display text-xl md:text-2xl text-foreground tracking-wide group-hover:text-primary transition-colors">
              REWIND
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Credits */}
                <motion.div
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{credits}</span>
                  <span className="text-xs text-muted-foreground">credits</span>
                </motion.div>

                {/* User menu */}
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground hidden md:block max-w-[100px] truncate">
                      {displayName || user.email?.split('@')[0]}
                    </span>
                  </motion.div>
                </div>

                {/* Mobile credits */}
                <div className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">{credits}</span>
                </div>
              </>
            ) : (
              <motion.button
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="w-4 h-4" />
                <span className="hidden md:inline">Join Hommies</span>
                <span className="md:hidden">Join</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
