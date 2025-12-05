import { useState, useRef, useEffect } from "react";
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
  preUploadedPhoto?: string | null;
}

export function AtomicStudio({ scenario, onBack, userId, preUploadedPhoto }: AtomicStudioProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(preUploadedPhoto || null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-start transform if we have a pre-uploaded photo
  useEffect(() => {
    if (preUploadedPhoto && !transformedImage && !isTransforming) {
      // Small delay for smooth UX
      const timer = setTimeout(() => {
        handleTransform();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [preUploadedPhoto]);

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
      className="min-h-screen relative px-4 py-6 md:py-8 pb-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-1 mx-4"
          >
            <span className="era-tag mb-1">{scenario.era}</span>
            <h2 className="font-display text-lg md:text-2xl font-bold text-foreground mt-2 line-clamp-1">
              {scenario.title}
            </h2>
          </motion.div>

          <div className="w-16" />
        </div>

        {/* Main Content - Stacked on mobile, side by side on desktop */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Upload Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-xs tracking-wider text-muted-foreground uppercase">Your Photo</span>
            </div>
            
            <motion.div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group card-premium"
              onClick={() => fileInputRef.current?.click()}
            >
              {originalImage ? (
                <>
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-sm text-foreground font-medium">Tap to change</span>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"
                  >
                    <Upload className="w-7 h-7 text-muted-foreground" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-foreground font-medium mb-1">Upload your photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                  </div>
                </div>
              )}
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {originalImage && !transformedImage && !isTransforming && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full btn-primary flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                <span>Transform</span>
              </motion.button>
            )}
          </motion.div>

          {/* Result Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs tracking-wider text-muted-foreground uppercase">Result</span>
            </div>
            
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden card-premium">
              <AnimatePresence mode="wait">
                {transformedImage ? (
                  <motion.img
                    key="result"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={transformedImage}
                    alt="Transformed"
                    className="w-full h-full object-cover"
                  />
                ) : isTransforming ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center gap-6 p-8"
                  >
                    {/* Simple elegant loader */}
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border-2 border-muted border-t-primary"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-display text-xl font-bold text-foreground mb-1">Rewinding...</p>
                      <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-40 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="h-full flex flex-col items-center justify-center gap-4 p-8"
                  >
                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm text-center">
                      Your transformation<br />will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {transformedImage && (
              <div className="flex gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleDownload}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleReset}
                  className="btn-secondary flex items-center justify-center gap-2 px-4"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scene Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-8 max-w-lg mx-auto"
        >
          {scenario.description}
        </motion.p>
      </div>
    </motion.div>
  );
}