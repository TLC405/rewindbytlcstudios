import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, LogOut, Coins, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./AuthModal";

interface NavBarProps {
  user: any;
  onAuthChange: () => void;
}

export function NavBar({ user, onAuthChange }: NavBarProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setCredits(data.credits);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onAuthChange();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="cassette-window px-3 py-1">
              <span className="font-digital text-sm tracking-widest led-text">REWIND</span>
            </div>
            <span className="hidden sm:block text-xs text-muted-foreground">
              TLC Studios
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Credits */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-digital text-xs">{credits}</span>
                </div>
                
                {/* User info */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="boombox"
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <div className="p-4 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Welcome back!</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Coins className="w-3 h-3" />
                        <span>{credits} credits</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="boombox"
                  className="w-full"
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onAuthChange}
      />
    </>
  );
}
