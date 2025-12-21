import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowLeft, Download, Sparkles, Image as ImageIcon, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
}

interface PreviewStudioProps {
  scenario: Scenario;
  onBack: () => void;
  preUploadedPhoto?: string | null;
  onTransformComplete: () => void;
  hasUsedFreeTransform: boolean;
  remainingTransforms: number;
  onShowLogin: () => void;
}

export function PreviewStudio({ 
  scenario, 
  onBack, 
  preUploadedPhoto, 
  onTransformComplete,
  hasUsedFreeTransform,
  remainingTransforms,
  onShowLogin 
}: PreviewStudioProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(preUploadedPhoto || null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preUploadedPhoto && !transformedImage && !isTransforming && !hasUsedFreeTransform) {
      const timer = setTimeout(() => {
        handleTransform();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [preUploadedPhoto, hasUsedFreeTransform]);

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
    if (!originalImage) return;

    if (hasUsedFreeTransform) {
      toast.error("You've used all free previews. Enter access code for unlimited!");
      onShowLogin();
      return;
    }

    setIsTransforming(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 92));
    }, 500);

    try {
      const { data: transformation, error: createError } = await supabase
        .from('transformations')
        .insert({
          user_id: null,
          scenario_id: scenario.id,
          original_image_url: 'preview',
          status: 'processing'
        })
        .select()
        .single();

      if (createError) throw createError;

      const { data, error } = await supabase.functions.invoke('transform-image', {
        body: {
          imageBase64: originalImage,
          scenarioId: scenario.id,
          userId: null,
          transformationId: transformation.id,
          isPreview: true,
          isFreeShowcase: true
        }
      });

      if (error) throw error;

      setProgress(100);
      setTransformedImage(data.transformedImageUrl);
      onTransformComplete();
      toast.success('Transformation complete! ✨');
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
      a.download = `rewind-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative px-4 py-6 md:py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-1 mx-4"
          >
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/25">
              {scenario.era}
            </span>
            <h2 className="font-display text-xl md:text-2xl text-foreground mt-2 line-clamp-1 drop-shadow-sm">
              {scenario.title}
            </h2>
          </motion.div>

          {/* Remaining transforms badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {remainingTransforms} left
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Photo</span>
            
            <motion.div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group bg-card border border-border/50"
              onClick={() => !hasUsedFreeTransform && fileInputRef.current?.click()}
            >
              {originalImage ? (
                <>
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                  {!hasUsedFreeTransform && (
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm text-foreground">Tap to change</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-foreground font-medium text-sm">Upload your photo</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
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

            {originalImage && !transformedImage && !isTransforming && !hasUsedFreeTransform && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Transform</span>
              </motion.button>
            )}

            {hasUsedFreeTransform && !transformedImage && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onShowLogin}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>Enter Access Code</span>
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
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Result</span>
            
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-border/50">
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
                    className="h-full flex flex-col items-center justify-center gap-5 p-8"
                  >
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
                      <p className="font-display text-2xl text-foreground tracking-wider drop-shadow-lg">REWINDING...</p>
                      <p className="text-sm text-primary font-mono mt-2 font-semibold">{Math.round(progress)}%</p>
                    </div>

                    <div className="w-48 h-2 bg-muted/50 rounded-full overflow-hidden border border-border/50">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="h-full flex flex-col items-center justify-center gap-4 p-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center border border-border/30">
                      <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground/70 text-sm text-center font-medium">
                      Your legendary result<br />will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {transformedImage && (
              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleDownload}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>

                {remainingTransforms > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={onBack}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <span>Try Another Scene ({remainingTransforms} left)</span>
                  </motion.button>
                )}

                {remainingTransforms === 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={onShowLogin}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Get Unlimited Access</span>
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Scene Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground/70 mt-8 max-w-md mx-auto"
        >
          {scenario.description}
        </motion.p>
      </div>
    </motion.div>
  );
}
