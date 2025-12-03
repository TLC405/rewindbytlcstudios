import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transformation {
  id: string;
  original_image_url: string;
  transformed_image_url: string | null;
  status: string;
  created_at: string;
  scenarios?: {
    title: string;
    era: string;
  };
}

interface UserGalleryProps {
  userId: string;
}

export function UserGallery({ userId }: UserGalleryProps) {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransformations();
  }, [userId]);

  const fetchTransformations = async () => {
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          scenarios (
            title,
            era
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransformations(data || []);
    } catch (error) {
      console.error('Error fetching transformations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transformations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTransformations(prev => prev.filter(t => t.id !== id));
      toast.success('Transformation deleted');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `rewind-${title}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#ff6b9d]" />
      </div>
    );
  }

  if (transformations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transformations yet. Create your first legendary moment!</p>
      </div>
    );
  }

  return (
    <section className="relative py-12 px-4">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: 'rgba(255, 107, 157, 0.1)',
              border: '1px solid rgba(255, 107, 157, 0.3)',
            }}
          >
            <span className="font-digital text-xs tracking-widest text-[#ff6b9d]">YOUR GALLERY</span>
          </div>
          <h2 className="font-display text-3xl text-foreground">
            Legendary{' '}
            <span 
              style={{
                background: 'linear-gradient(180deg, #ffbe76 0%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Moments
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {transformations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(255, 107, 157, 0.2)',
              }}
            >
              {item.transformed_image_url && (
                <img
                  src={item.transformed_image_url}
                  alt={item.scenarios?.title || 'Transformation'}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0015] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-display text-sm text-foreground mb-1">
                    {item.scenarios?.title}
                  </p>
                  <p className="font-digital text-[10px] text-[#ff6b9d]">
                    {item.scenarios?.era}
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-[#0a0015]/50 hover:bg-[#ff6b9d]/20"
                      onClick={() => item.transformed_image_url && handleDownload(item.transformed_image_url, item.scenarios?.title || 'transformation')}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-[#0a0015]/50 hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
