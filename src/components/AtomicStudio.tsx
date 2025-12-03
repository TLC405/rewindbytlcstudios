import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowLeft, Download, Sparkles, Image as ImageIcon, RotateCcw, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
}

interface AtomicStudioProps {
  scenario: Scenario;
  onBack: () => void;
  userId: string;
}

export function AtomicStudio({ scenario, onBack, userId }: AtomicStudioProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setTransformedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage || !userId) return;

    setIsTransforming(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 12, 92));
    }, 600);

    try {
      const { data: transformation, error: createError } = await supabase
        .from('transformations')
        .insert({
          user_id: userId,
          scenario_id: scenario.id,
          original_image_url: 'pending',
          status: 'processing'
        })
        .select()
        .single();

      if (createError) throw createError;

      const { data, error } = await supabase.functions.invoke('transform-image', {
        body: {
          imageBase64: originalImage,
          scenarioId: scenario.id,
          userId,
          transformationId: transformation.id
        }
      });

      if (error) throw error;

      setProgress(100);
      setTransformedImage(data.transformedImageUrl);
      toast.success('Transformation complete!');
    } catch (error: any) {
      console.error('Transform error:', error);
      toast.error(error.message || 'Transformation failed');
    } finally {
      clearInterval(progressInterval);
      setIsTransforming(false);
    }
  };

  const handleDownload = async () => {
    if (!transformedImage) return;

    try {
      const response = await fetch(transformedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rewind-${scenario.era.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setTransformedImage(null);
    setProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative z-10 px-4 py-8 pb-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-film-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-tech text-sm tracking-wider">Back</span>
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="era-badge mb-2 inline-flex">
              <Sparkles className="w-3 h-3 text-primary mr-2" />
              <span className="text-primary">{scenario.era}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-film-white">{scenario.title}</h2>
          </motion.div>

          <div className="w-20" />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Upload Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-tech text-xs tracking-widest text-primary uppercase">Original</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 card-atomic" />
              
              {originalImage ? (
                <>
                  <img src={originalImage} alt="Original" className="relative z-10 w-full h-full object-cover" />
                  <div className="absolute inset-0 z-20 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-tech text-sm text-film-white">Click to change</span>
                  </div>
                </>
              ) : (
                <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center"
                  >
                    <Upload className="w-8 h-8 text-primary/60" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-film-white/80 font-medium mb-1">Upload your photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                  </div>
                </div>
              )}

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/40 z-30" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/40 z-30" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/40 z-30" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/40 z-30" />
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {originalImage && !transformedImage && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full btn-atomic flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isTransforming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full"
                    />
                    <span>Transforming... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Transform</span>
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Result Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-tech text-xs tracking-widest text-accent uppercase">Transformed</span>
            </div>
            
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 card-atomic" />
              
              <AnimatePresence mode="wait">
                {transformedImage ? (
                  <motion.img
                    key="result"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={transformedImage}
                    alt="Transformed"
                    className="relative z-10 w-full h-full object-cover"
                  />
                ) : isTransforming ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 h-full flex flex-col items-center justify-center gap-8 p-8"
                  >
                    {/* Animated rings */}
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-2 border-primary/30 border-t-primary"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 rounded-full border-2 border-accent/30 border-b-accent"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Zap className="w-8 h-8 text-primary" />
                      </motion.div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-display text-2xl text-film-white mb-2">REWINDING TIME</p>
                      <p className="font-tech text-sm text-primary">{Math.round(progress)}%</p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-48 h-1 bg-deep rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-8"
                  >
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm text-center">
                      Your legendary transformation<br />will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent/40 z-30" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent/40 z-30" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent/40 z-30" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent/40 z-30" />
            </div>

            {transformedImage && (
              <div className="flex gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleDownload}
                  className="flex-1 btn-atomic flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleReset}
                  className="btn-ghost flex items-center justify-center gap-2 px-4"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}