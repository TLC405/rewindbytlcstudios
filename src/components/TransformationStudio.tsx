import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, Download, ArrowLeft, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SynthwaveBackground } from "./SynthwaveBackground";

interface Scenario {
  id: string;
  title: string;
  era: string;
  description: string;
  gradient: string;
  accent: string;
}

interface TransformationStudioProps {
  scenario: Scenario | null;
  onBack: () => void;
  userId: string;
}

export function TransformationStudio({ scenario, onBack, userId }: TransformationStudioProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
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
    if (!originalImage || !scenario) return;

    setIsTransforming(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

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

      if (data.error) {
        throw new Error(data.error);
      }

      setProgress(100);
      setTransformedImage(data.transformedImageUrl);
      toast.success('Transformation complete!');

    } catch (error: any) {
      console.error('Transform error:', error);
      toast.error(error.message || 'Transformation failed. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsTransforming(false);
    }
  };

  const handleDownload = () => {
    if (!transformedImage) return;
    
    const link = document.createElement('a');
    link.href = transformedImage;
    link.download = `rewind-${scenario?.era || 'transformation'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const clearImage = () => {
    setOriginalImage(null);
    setTransformedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen py-8 px-4 relative"
    >
      <SynthwaveBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-[#ff6b9d]/10 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">
                {scenario?.era}
              </span>
            </div>
            <h1 className="font-display text-3xl text-foreground">
              {scenario?.title}
            </h1>
          </div>
        </div>

        {/* Studio Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="space-y-4">
            <div 
              className="px-3 py-1 rounded inline-block"
              style={{ 
                background: 'rgba(255, 107, 157, 0.1)',
                border: '1px solid rgba(255, 107, 157, 0.3)'
              }}
            >
              <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">ORIGINAL</span>
            </div>
            
            <div 
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 107, 157, 0.1) 0%, rgba(26, 0, 51, 0.8) 100%)',
                border: '1px solid rgba(255, 107, 157, 0.2)',
              }}
              onClick={() => !originalImage && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {originalImage ? (
                <>
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                    className="absolute top-4 right-4 p-2 bg-[#0a0015]/80 rounded-full hover:bg-[#0a0015] transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground group-hover:text-[#ff6b9d] transition-colors">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Upload your photo</p>
                    <p className="text-sm opacity-70">Click or drag & drop</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full border-[#ff6b9d]/30 hover:bg-[#ff6b9d]/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          {/* Transformed Image */}
          <div className="space-y-4">
            <div 
              className="px-3 py-1 rounded inline-block"
              style={{ 
                background: 'rgba(255, 107, 157, 0.1)',
                border: '1px solid rgba(255, 107, 157, 0.3)'
              }}
            >
              <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">TRANSFORMED</span>
            </div>
            
            <div 
              className="relative aspect-square rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 107, 157, 0.1) 0%, rgba(26, 0, 51, 0.8) 100%)',
                border: '1px solid rgba(255, 107, 157, 0.2)',
              }}
            >
              {isTransforming ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-[#ff6b9d]/20 border-t-[#ff6b9d] animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#ff6b9d] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p 
                      className="font-display text-lg"
                      style={{
                        background: 'linear-gradient(180deg, #ffbe76 0%, #ff6b9d 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Transforming...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Entering {scenario?.era} era
                    </p>
                  </div>
                  <div className="w-48 h-2 bg-[#1a0033] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff6b9d] to-[#c44569]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : transformedImage ? (
                <img 
                  src={transformedImage} 
                  alt="Transformed" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center opacity-50">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-sm opacity-70">Your transformation will appear here</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-[#ff6b9d] to-[#c44569] hover:opacity-90 text-white"
                onClick={handleTransform}
                disabled={!originalImage || isTransforming}
              >
                {isTransforming ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isTransforming ? 'Transforming...' : 'Transform'}
              </Button>
              
              {transformedImage && (
                <Button
                  variant="outline"
                  className="border-[#ff6b9d]/30 hover:bg-[#ff6b9d]/10"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Scenario Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div 
            className="inline-block px-6 py-3 rounded-full"
            style={{
              background: 'rgba(255, 107, 157, 0.1)',
              border: '1px solid rgba(255, 107, 157, 0.2)',
            }}
          >
            <p className="text-sm text-foreground/80">
              {scenario?.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
