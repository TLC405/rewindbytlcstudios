import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Users, Calendar, MapPin } from "lucide-react";

interface Scene {
  id: string;
  title: string;
  description: string;
  era: string;
  celebs?: string[];
}

interface ScenePreviewProps {
  scene: Scene;
  uploadedPhoto: string;
  onEnter: () => void;
  onBack: () => void;
}

// Extract celebrities from description (look for names)
const extractCelebrities = (description: string): string[] => {
  // Common celebrity name patterns from descriptions
  const celebPatterns = [
    /with\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /alongside\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /next to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
  ];
  
  const celebs: string[] = [];
  const lowerDesc = description.toLowerCase();
  
  // Known celebrities to look for
  const knownCelebs = [
    'Elvis Presley', 'Marilyn Monroe', 'James Dean', 'Chuck Berry',
    'MLK', 'Martin Luther King', 'Muhammad Ali', 'The Beatles', 'John Lennon',
    'Bruce Lee', 'Stevie Wonder', 'Diana Ross', 'Marvin Gaye',
    'Michael Jackson', 'Prince', 'Madonna', 'Whitney Houston',
    'Tupac', 'Tupac Shakur', 'Biggie', 'Notorious B.I.G.', 'Will Smith',
    'Beyoncé', 'Jay-Z', 'Eminem', 'Usher', 'Alicia Keys',
    'Drake', 'Kendrick Lamar', 'Rihanna', 'LeBron James',
    'Shaq', 'Shaquille O\'Neal', 'Michael Jordan', 'Jordan', 'Kobe Bryant',
    'Eddie Murphy', 'Aretha Franklin', 'James Brown',
    'Aaliyah', 'TLC', 'Lauryn Hill', 'Queen Latifah',
    'Salt-N-Pepa', 'Janet Jackson', 'Diddy', 'Nas', 'Mary J. Blige'
  ];
  
  knownCelebs.forEach(celeb => {
    if (lowerDesc.includes(celeb.toLowerCase())) {
      celebs.push(celeb);
    }
  });
  
  return celebs.slice(0, 4); // Max 4 celebrities
};

export function ScenePreview({ scene, uploadedPhoto, onEnter, onBack }: ScenePreviewProps) {
  const celebrities = scene.celebs?.length ? scene.celebs : extractCelebrities(scene.description);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col px-4 py-6 md:py-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <img src={uploadedPhoto} alt="Your photo" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Scene Preview Card */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden"
        >
          {/* Scene Header */}
          <div className="aspect-video relative bg-gradient-to-br from-muted to-card">
            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Preview Mode
                </span>
              </div>
            </div>
            
            {/* Era badge */}
            <div className="absolute top-4 left-4">
              <span className="era-tag">{scene.era}</span>
            </div>
          </div>

          {/* Scene Details */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {scene.title}
              </h2>
              <p className="text-muted-foreground">
                {scene.description}
              </p>
            </div>

            {/* Scene Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Era</p>
                  <p className="text-sm font-medium text-foreground">{scene.era}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Legends</p>
                  <p className="text-sm font-medium text-foreground">{celebrities.length || '3-4'} icons</p>
                </div>
              </div>
            </div>

            {/* Celebrities List */}
            {celebrities.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                  Featured Legends
                </p>
                <div className="flex flex-wrap gap-2">
                  {celebrities.map((celeb, i) => (
                    <motion.span
                      key={celeb}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {celeb}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* What to expect */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                What You'll Get
              </p>
              <ul className="text-sm text-foreground space-y-1">
                <li>• Your face preserved with perfect accuracy</li>
                <li>• Fresh {scene.era} hairstyle & fashion</li>
                <li>• Authentic era photography style</li>
                <li>• You as the star among legends</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <button
            onClick={onEnter}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span>Enter This Scene</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            1 credit will be used for this transformation
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
