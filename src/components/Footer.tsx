import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-[#ff6b9d]/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <h3 
              className="font-display text-3xl mb-2"
              style={{
                background: 'linear-gradient(180deg, #ffbe76 0%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              REWIND
            </h3>
            <p className="font-digital text-[10px] tracking-widest text-muted-foreground">
              TRUTH • LOVE • CONNECTION
            </p>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-[#ff6b9d] transition-colors">
              How It Works
            </a>
            <a href="#scenarios" className="text-sm text-muted-foreground hover:text-[#ff6b9d] transition-colors">
              Scenarios
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-[#ff6b9d] transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-[#ff6b9d] transition-colors">
              Contact
            </a>
          </nav>
          
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="font-digital text-xs tracking-wider text-muted-foreground">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[#ff6b9d]/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            © 2024 TLC Studios. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Powered by{" "}
            <span className="text-[#ff6b9d]">Truth</span>,{" "}
            <span className="text-[#ff6b9d]">Love</span>, and{" "}
            <span className="text-[#ff6b9d]">Connection</span>.
          </p>
        </motion.div>
        
        {/* Decorative EQ bars */}
        <div className="mt-8 flex items-end justify-center gap-1 h-8 opacity-30">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, 8 + Math.random() * 24, 4],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.02,
              }}
              className="w-1 rounded-full"
              style={{
                background: 'linear-gradient(to top, #4ade80, #ffbe76, #ff6b9d)',
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
