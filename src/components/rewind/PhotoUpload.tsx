import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, User, Camera } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, previewUrl: string) => void;
  currentPhoto: string | null;
  onClear: () => void;
}

export const PhotoUpload = ({ onPhotoSelect, currentPhoto, onClear }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      onPhotoSelect(file, previewUrl);
    }
  }, [onPhotoSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onPhotoSelect(file, previewUrl);
    }
  }, [onPhotoSelect]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentPhoto ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden screen-glow border border-border">
              <img 
                src={currentPhoto} 
                alt="Your photo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <button
              onClick={onClear}
              className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground">Master Photo Locked</span>
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              upload-zone aspect-square rounded-xl cursor-pointer
              ${isDragging ? 'active' : ''}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="w-16 h-16 rounded-full surface-metal border-metallic flex items-center justify-center">
                {isDragging ? (
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your selfie here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </div>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
};
