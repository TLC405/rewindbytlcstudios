import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Zap, Shield, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const navItems = [
    { path: '/lab', label: 'Lab', icon: Zap },
    { path: '/#how-it-works', label: 'How it Works', icon: Clock },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-heavy"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg surface-metal border-metallic flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <span className="text-chrome text-2xl tracking-wider">TLC REWIND</span>
          </Link>

          {/* Nav Links */}
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

          {/* Auth Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => signOut()}
                className="btn-record flex items-center gap-2 text-sm text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="btn-gold flex items-center gap-2 text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
