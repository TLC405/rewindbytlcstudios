import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Coins, LogOut, Menu, X, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HommiesNavBarProps {
  user: any;
  credits?: number;
  displayName?: string;
  onAuthClick: () => void;
}

export function HommiesNavBar({ user, credits = 0, displayName, onAuthClick }: HommiesNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Catch you later, homie! 👋");
    setMobileMenuOpen(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (displayName) return displayName;
    if (user?.user_metadata?.display_name) return user.user_metadata.display_name;
    if (user?.email) return user.email.split('@')[0];
    return "Homie";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl text-foreground tracking-wider">
                REWIND
              </span>
              {user && (
                <span className="text-[10px] text-muted-foreground -mt-0.5 hidden md:block">
                  {getGreeting()}, {getUserName()}
                </span>
              )}
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4"
          >
            {user ? (
              <>
                {/* VIP Badge */}
                <div className="vip-tag">
                  <Crown className="w-3 h-3" />
                  <span>VIP</span>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm font-semibold text-foreground">{credits}</span>
                  <span className="text-xs text-muted-foreground">credits</span>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full hover:bg-muted transition-colors group"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn-primary flex items-center gap-2 py-3 px-6"
              >
                <Crown className="w-4 h-4" />
                <span>Trevels Hommies</span>
              </button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="p-4 space-y-4">
              {user ? (
                <>
                  {/* Greeting */}
                  <div className="text-center pb-4 border-b border-border/30">
                    <p className="text-muted-foreground text-sm">
                      {getGreeting()}, <span className="text-foreground font-semibold">{getUserName()}</span>
                    </p>
                    <div className="vip-tag mx-auto w-fit mt-2">
                      <Crown className="w-3 h-3" />
                      <span>VIP Member</span>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-muted">
                    <Coins className="w-5 h-5 text-primary" />
                    <span className="font-mono text-xl font-bold text-foreground">{credits}</span>
                    <span className="text-sm text-muted-foreground">credits</span>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Join Trevels Hommies</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}