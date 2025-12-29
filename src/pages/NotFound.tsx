import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { VinylLogo } from '@/components/rewind/VinylLogo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-8">
          <VinylLogo size="lg" />
        </div>

        <h1 className="font-display text-8xl md:text-9xl text-gradient-gold mb-4">404</h1>

        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl text-foreground">TIME CIRCUIT MISCALIBRATED</h2>
        </div>

        <p className="text-muted-foreground mb-8">
          The timeline you're looking for doesn't exist. Let's get you back to HQ.
        </p>

        <Link to="/" className="btn-gold inline-flex items-center gap-3">
          <Home className="w-5 h-5" />
          <span>Return to HQ</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
