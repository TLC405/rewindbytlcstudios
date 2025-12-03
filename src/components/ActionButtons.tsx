import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";

interface ActionButtonsProps {
  onNewTape: () => void;
  onDownload?: () => void;
  hasTransformations?: boolean;
}

export function ActionButtons({ onNewTape, onDownload, hasTransformations = false }: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-4 py-8"
    >
      {hasTransformations && onDownload && (
        <button
          onClick={onDownload}
          className="btn-premium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Collection
        </button>
      )}
      
      <button
        onClick={onNewTape}
        className="btn-gold flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        New Tape
      </button>
    </motion.div>
  );
}
