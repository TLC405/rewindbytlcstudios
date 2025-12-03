import { motion } from "framer-motion";
import { Scan, Wand2, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Pixel-Perfect Face Lock",
    description: "Your facial features, facial hair, and ears preserved with absolute precision. The AI treats your face as sacred—never blended, always authentic.",
    highlight: "100% Identity Preservation",
  },
  {
    icon: Wand2,
    title: "Zero-Tolerance Override",
    description: "Upload a selfie in a t-shirt, emerge as a Roman emperor. We strip away your original attire and generate era-appropriate everything from scratch.",
    highlight: "Complete Body Transformation",
  },
  {
    icon: Users,
    title: "Distinct Entity Separation",
    description: "Group shots with legends without morphing into them. TWO distinct individuals, clearly separated. You next to MJ, not becoming MJ.",
    highlight: "Celebrity Proximity™",
  },
  {
    icon: ShieldCheck,
    title: "Atomic Prompting",
    description: "Each transformation uses our proprietary 'Atomic Identity & Era Transformation' prompting strategy—built specifically for legendary moments.",
    highlight: "Advanced AI Architecture",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 mb-6">
            <span className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
            <span className="font-digital text-xs tracking-widest text-muted-foreground">TECHNOLOGY</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            How <span className="led-text">Rewind</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on sophisticated AI prompting strategies that separate identity from context, 
            allowing for impossible transformations while keeping you, undeniably you.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="boombox-body rounded-2xl p-6 h-full hover:shadow-glow-amber transition-all duration-500">
                {/* Icon & Highlight */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-digital text-[9px] tracking-widest text-led-green bg-led-green/10 px-2 py-1 rounded border border-led-green/20">
                    {feature.highlight}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:led-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Bottom Accent */}
                <div className="mt-6 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 bg-border rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 + i * 0.2 }}
                        className="h-full bg-gradient-to-r from-led-green via-led-amber to-led-red"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
