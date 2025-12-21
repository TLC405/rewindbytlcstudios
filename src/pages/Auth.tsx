import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Clock, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isLogin ? 'Welcome back!' : 'Account created!' });
      navigate('/lab');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md surface-metal rounded-2xl p-8 border-metallic"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl surface-metal border-metallic flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-gradient-gold">
            {isLogin ? 'WELCOME BACK' : 'JOIN REWIND'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? 'Enter your credentials' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-4 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Enter Rewind' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/lab')}
            className="text-sm text-primary hover:underline"
          >
            Continue as Guest →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
