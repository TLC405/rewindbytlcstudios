import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PreviewModeState {
  hasUsedFreeTransform: boolean;
  transformCount: number;
  isLoading: boolean;
}

export function usePreviewMode() {
  const [state, setState] = useState<PreviewModeState>({
    hasUsedFreeTransform: false,
    transformCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    checkIpUsage();
  }, []);

  const getClientIp = async (): Promise<string> => {
    try {
      // Use a simple fingerprint based on user agent + screen + timezone
      const fingerprint = [
        navigator.userAgent,
        screen.width,
        screen.height,
        screen.colorDepth,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        new Date().getTimezoneOffset(),
      ].join('|');
      
      // Create a hash-like identifier
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      return `fp_${Math.abs(hash).toString(36)}`;
    } catch {
      return `unknown_${Date.now()}`;
    }
  };

  const checkIpUsage = async () => {
    try {
      const ip = await getClientIp();
      
      const { data, error } = await supabase
        .from('ip_usage')
        .select('transformation_count')
        .eq('ip_address', ip)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setState({
          hasUsedFreeTransform: data.transformation_count >= 1,
          transformCount: data.transformation_count,
          isLoading: false,
        });
      } else {
        setState({
          hasUsedFreeTransform: false,
          transformCount: 0,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking IP usage:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const recordTransformation = async () => {
    try {
      const ip = await getClientIp();
      
      const { data: existing } = await supabase
        .from('ip_usage')
        .select('id, transformation_count')
        .eq('ip_address', ip)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('ip_usage')
          .update({ 
            transformation_count: existing.transformation_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('ip_usage')
          .insert({ 
            ip_address: ip, 
            transformation_count: 1 
          });
      }

      setState(prev => ({
        ...prev,
        hasUsedFreeTransform: true,
        transformCount: prev.transformCount + 1,
      }));
    } catch (error) {
      console.error('Error recording transformation:', error);
    }
  };

  return {
    ...state,
    recordTransformation,
    refreshUsage: checkIpUsage,
  };
}