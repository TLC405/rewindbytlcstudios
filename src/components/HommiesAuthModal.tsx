import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Mail, Lock, User, ArrowRight, Crown, Sparkles, Heart, 
  Camera, Calendar, Eye, EyeOff, Check, Star, Zap, Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HommiesAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TLC_ACCESS_CODE = "1309";

type Step = 'code' | 'welcome' | 'profile' | 'celebration';

const ERA_OPTIONS = [
  { id: '1950s', label: "1950s", icon: "🎷", description: "Rock & Roll, Elvis, Marilyn" },
  { id: '1960s', label: "1960s", icon: "🎸", description: "Beatles, Civil Rights, Moon Landing" },
  { id: '1970s', label: "1970s", icon: "🕺", description: "Disco, Funk, Muhammad Ali" },
  { id: '1980s', label: "1980s", icon: "📼", description: "MTV, MJ, Pop Culture" },
  { id: '1990s', label: "1990s", icon: "📟", description: "Hip-Hop, Grunge, Legends" },
];

const WELCOME_PERKS = [
  { icon: Zap, text: "10 Free Transformations", delay: 0.2 },
  { icon: Star, text: "Access to All Legendary Scenes", delay: 0.4 },
  { icon: Clock, text: "Travel Through Decades", delay: 0.6 },
  { icon: Crown, text: "VIP Inner Circle Member", delay: 0.8 },
];

export function HommiesAuthModal({ isOpen, onClose, onSuccess }: HommiesAuthModalProps) {
  const [step, setStep] = useState<Step>('code');
  const [accessCode, setAccessCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [favoriteEra, setFavoriteEra] = useState("");
  const [dreamMeeting, setDreamMeeting] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: "Too Short", color: "bg-destructive" };
    if (password.length < 8) return { level: 2, text: "Weak", color: "bg-orange-500" };
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 3, text: "Good", color: "bg-yellow-500" };
    }
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 4, text: "Strong", color: "bg-green-500" };
    }
    return { level: 2, text: "Moderate", color: "bg-yellow-500" };
  };

  const passwordStrength = getPasswordStrength();

  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setStep('code');
      setAccessCode('');
      setCodeValid(false);
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setFavoriteEra('');
      setDreamMeeting('');
      setProfilePhoto(null);
      setIsLogin(false);
    }
  }, [isOpen]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === TLC_ACCESS_CODE) {
      setCodeValid(true);
      setTimeout(() => setStep('welcome'), 300);
    } else {
      toast.error("That's not the right code, homie");
      setAccessCode('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setStep('celebration');
      } else {
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              display_name: username || fullName,
              full_name: fullName,
              favorite_era: favoriteEra,
              dream_meeting: dreamMeeting,
              avatar_url: profilePhoto
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        setStep('celebration');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCelebrationComplete = () => {
    onSuccess();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'code':
        return (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <Crown className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-wide">
                TREVELS HOMMIES
              </h2>
              <p className="text-muted-foreground">
                Enter the secret code to join the inner circle
              </p>
            </div>

            {/* Code Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="• • • •"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="input-premium text-center text-3xl tracking-[0.5em] font-mono uppercase"
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
                <span>Unlock the Door</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground/60">
              <Heart className="w-3 h-3 inline mr-1" />
              Powered by Truth, Love & Connection
            </p>
          </motion.div>
        );

      case 'welcome':
        return (
          <motion.div
            key="welcome-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8 text-center"
          >
            {/* Animated Welcome */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-7xl mb-4"
                >
                  🎉
                </motion.div>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-wide">
                YOU'RE IN!
              </h2>
              <p className="text-xl text-primary font-medium">
                Welcome to the Inner Circle
              </p>
            </motion.div>

            {/* Perks List */}
            <div className="space-y-4">
              {WELCOME_PERKS.map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: perk.delay }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <perk.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{perk.text}</span>
                  <Check className="w-5 h-5 text-green-500 ml-auto" />
                </motion.div>
              ))}
            </div>

            {/* Continue Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setStep('profile')}
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            key="profile-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="vip-tag mx-auto w-fit mb-4">
                <Crown className="w-4 h-4" />
                <span>VIP Profile</span>
              </div>
              <h2 className="font-display text-3xl text-foreground mb-2 tracking-wide">
                {isLogin ? 'WELCOME BACK' : 'CREATE YOUR PROFILE'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Let's travel through time together" : 'Set up your time traveler identity'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Profile Photo Upload */}
                  <div className="flex justify-center mb-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer overflow-hidden group"
                    >
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <Camera className="w-8 h-8 mb-1" />
                          <span className="text-xs">Optional</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-premium pl-12"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                    <input
                      type="text"
                      placeholder="Username (display name)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="input-premium pl-12"
                      required
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-12"
                  required
                />
              </div>

              {/* Password with Strength Indicator */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Password" : "Create Password (8+ chars)"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-12 pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Bar */}
                {!isLogin && password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.level ? passwordStrength.color : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{passwordStrength.text}</p>
                  </div>
                )}
              </div>

              {!isLogin && (
                <>
                  {/* Favorite Era Selection */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Favorite Era to Visit (Optional)
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {ERA_OPTIONS.map((era) => (
                        <button
                          key={era.id}
                          type="button"
                          onClick={() => setFavoriteEra(favoriteEra === era.id ? '' : era.id)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            favoriteEra === era.id 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border bg-muted/30 hover:border-primary/50'
                          }`}
                        >
                          <div className="text-xl mb-1">{era.icon}</div>
                          <div className="text-xs font-medium">{era.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dream Meeting Question */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Who would you travel back to meet? (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Muhammad Ali, The Beatles..."
                      value={dreamMeeting}
                      onChange={(e) => setDreamMeeting(e.target.value)}
                      className="input-premium"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!isLogin && passwordStrength.level < 2)}
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
                    <span>{isLogin ? 'Sign In' : 'Complete Profile'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center">
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

            {/* Back Button */}
            <button
              onClick={() => setStep('welcome')}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </motion.div>
        );

      case 'celebration':
        return (
          <motion.div
            key="celebration-step"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-8 py-6"
          >
            {/* Celebration Animation */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {/* Confetti-like particles */}
              <div className="relative">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: Math.cos(i * 30 * Math.PI / 180) * 80,
                      y: Math.sin(i * 30 * Math.PI / 180) * 80,
                    }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                    style={{
                      background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
                    }}
                  />
                ))}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="text-8xl inline-block"
                >
                  🚀
                </motion.div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-wide">
                YOU'RE READY!
              </h2>
              <p className="text-xl text-primary font-medium">
                10 Free Transformations Activated
              </p>
              <p className="text-muted-foreground">
                The legends of history await your arrival
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: "🎸", label: "Rock Stars" },
                { icon: "🥊", label: "Legends" },
                { icon: "👑", label: "Royalty" },
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleCelebrationComplete}
              className="w-full btn-primary flex items-center justify-center gap-3 text-lg py-4"
            >
              <span>Let's Go Back in Time</span>
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </motion.div>
        );
    }
  };

  // Progress indicator
  const getProgress = () => {
    switch (step) {
      case 'code': return 1;
      case 'welcome': return 2;
      case 'profile': return 3;
      case 'celebration': return 4;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb orb-gold w-80 h-80 top-1/4 -left-40 opacity-30" />
            <div className="orb orb-purple w-60 h-60 bottom-1/4 -right-20 opacity-30" />
          </div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md my-8"
          >
            <div className="card-glow p-8 md:p-10">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Indicator */}
              {step !== 'code' && (
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: s * 0.1 }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        s <= getProgress() ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
