import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { VinylLogo } from './VinylLogo';

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/lab', label: 'Lab', icon: Zap },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <VinylLogo size="sm" />
            <span className="text-chrome text-xl md:text-2xl tracking-wider hidden sm:block">
              TLC REWIND
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => signOut()}
                className="btn-record flex items-center gap-2 text-sm text-foreground !px-4 !py-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="btn-gold flex items-center gap-2 text-sm !px-4 !py-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-border/50 mt-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 w-full text-left text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-primary" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5 text-primary" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
