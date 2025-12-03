import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <h3 className="font-display text-3xl led-text mb-2">REWIND</h3>
            <p className="font-digital text-[10px] tracking-widest text-muted-foreground">
              TRUTH • LOVE • CONNECTION
            </p>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Scenarios
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
          
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
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
          className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            © 2024 TLC Studios. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Powered by{" "}
            <span className="text-primary">Truth</span>,{" "}
            <span className="text-primary">Love</span>, and{" "}
            <span className="text-primary">Connection</span>.
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
              className="w-1 bg-gradient-to-t from-led-green via-led-amber to-led-red rounded-full"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
