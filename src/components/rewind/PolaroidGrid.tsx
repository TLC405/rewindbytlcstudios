import { motion } from 'framer-motion';
import { Download, ZoomIn } from 'lucide-react';
import { eraConfig, eraOrder } from '@/lib/decadePrompts';

export interface GenerationResult {
  eraId: string;
  imageUrl: string;
  status: 'pending' | 'generating' | 'complete' | 'error';
}

interface PolaroidGridProps {
  results: GenerationResult[];
  activeEra: string | null;
  onSelectEra: (eraId: string) => void;
  onDownloadAll: () => void;
}

export const PolaroidGrid = ({ 
  results, 
  activeEra, 
  onSelectEra, 
  onDownloadAll 
}: PolaroidGridProps) => {
  const completedCount = results.filter(r => r.status === 'complete').length;
  
  const rotations = [-3, 2, -1, 3, -2, 1, -3, 2, -1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-gradient-gold">
          Your Time Travel Gallery
        </h2>
        {completedCount > 0 && (
          <button 
            onClick={onDownloadAll}
            className="btn-gold flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download All ({completedCount})
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {eraOrder.map((eraId, index) => {
          const era = eraConfig[eraId];
          const result = results.find(r => r.eraId === eraId);
          const isActive = activeEra === eraId;
          const rotation = rotations[index % rotations.length];

          return (
            <motion.div
              key={eraId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectEra(eraId)}
              className={`
                polaroid relative cursor-pointer transition-all duration-300
                ${isActive ? 'ring-2 ring-primary scale-105 z-10' : 'hover:scale-102'}
              `}
              style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
            >
              {/* Image container */}
              <div className="aspect-square rounded-sm overflow-hidden bg-muted relative">
                {result?.status === 'complete' && result.imageUrl ? (
                  <>
                    <img 
                      src={result.imageUrl} 
                      alt={era.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : result?.status === 'generating' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : result?.status === 'error' ? (
                  <div className="absolute inset-0 flex items-center justify-center text-destructive">
                    <span className="text-xs">Error</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                    {era.icon}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="polaroid-label font-display">
                {era.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
