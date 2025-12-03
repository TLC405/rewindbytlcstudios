import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowLeft, Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
}

interface PremiumTransformationStudioProps {
  scenario: Scenario;
  onBack: () => void;
  userId: string;
}

export function PremiumTransformationStudio({ scenario, onBack, userId }: PremiumTransformationStudioProps) {
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

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    try {
      // Create transformation record
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

      // Call transform function
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative z-10 px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-film-white/70 hover:text-film-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono text-sm">Back</span>
          </button>

          <div className="text-center">
            <h2 className="font-display text-3xl text-film-white">{scenario.era}</h2>
            <p className="text-sm text-film-white/60">{scenario.title}</p>
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-film-white/60 uppercase tracking-wider">Original Photo</h3>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-dashed border-film-white/30 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {originalImage ? (
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-teal-dark/50">
                  <Upload className="w-12 h-12 text-film-white/40" />
                  <div className="text-center">
                    <p className="text-film-white/80 font-medium">Upload your photo</p>
                    <p className="text-sm text-film-white/50">JPG, PNG up to 10MB</p>
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

            {originalImage && !transformedImage && (
              <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isTransforming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-film-black/30 border-t-film-black rounded-full"
                    />
                    <span>Transforming... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Transform</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result Area */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-film-white/60 uppercase tracking-wider">Time-Traveled Result</h3>
            
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-teal-dark/50 border border-film-white/10">
              <AnimatePresence mode="wait">
                {transformedImage ? (
                  <motion.img
                    key="result"
                    initial={{ opacity: 0, scale: 1.1 }}
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
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                  >
                    {/* Animated Tape Reels */}
                    <div className="flex items-center gap-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border-4 border-film-white/30 border-t-primary"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border-4 border-film-white/30 border-t-primary"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="font-display text-xl text-film-white">REWINDING TIME</p>
                      <p className="font-mono text-sm text-film-white/60 mt-1">{Math.round(progress)}%</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 h-1 bg-film-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  >
                    <ImageIcon className="w-12 h-12 text-film-white/20" />
                    <p className="text-film-white/40 text-sm">Your transformation will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {transformedImage && (
              <button
                onClick={handleDownload}
                className="w-full btn-premium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
