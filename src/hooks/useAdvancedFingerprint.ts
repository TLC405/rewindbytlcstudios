import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FingerprintData {
  fingerprint_hash: string;
  canvas_hash: string;
  webgl_hash: string;
  audio_hash: string;
  screen_hash: string;
  timezone: string;
  language: string;
  platform: string;
  device_memory: number | null;
  cpu_cores: number | null;
}

interface FingerprintState {
  isBlocked: boolean;
  hasUsedFreeTransform: boolean;
  transformCount: number;
  isLoading: boolean;
  fingerprint: FingerprintData | null;
}

// Simple hash function
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Canvas fingerprinting
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    canvas.width = 200;
    canvas.height = 50;

    // Draw various shapes and text
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('REWIND 🎬', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('REWIND 🎬', 4, 17);

    // Add some geometry
    ctx.beginPath();
    ctx.arc(50, 25, 20, 0, Math.PI * 2);
    ctx.stroke();

    return simpleHash(canvas.toDataURL());
  } catch {
    return 'canvas-error';
  }
};

// WebGL fingerprinting
const getWebGLFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    const data = [
      debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
      debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
      gl.getParameter(gl.VERSION),
      gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      gl.getParameter(gl.MAX_TEXTURE_SIZE),
      gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    ].join('|');

    return simpleHash(data);
  } catch {
    return 'webgl-error';
  }
};

// Audio fingerprinting
const getAudioFingerprint = async (): Promise<string> => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 'no-audio';

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gain = context.createGain();
    const processor = context.createScriptProcessor(4096, 1, 1);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, context.currentTime);

    gain.gain.setValueAtTime(0, context.currentTime);

    oscillator.connect(analyser);
    analyser.connect(processor);
    processor.connect(gain);
    gain.connect(context.destination);

    oscillator.start(0);

    const dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(dataArray);
    
    oscillator.stop();
    await context.close();

    const sample = dataArray.slice(0, 30).join(',');
    return simpleHash(sample);
  } catch {
    return 'audio-error';
  }
};

// Screen fingerprint
const getScreenFingerprint = (): string => {
  const data = [
    screen.width,
    screen.height,
    screen.colorDepth,
    screen.pixelDepth,
    window.devicePixelRatio,
    screen.availWidth,
    screen.availHeight,
  ].join('|');
  return simpleHash(data);
};

// Generate full fingerprint
const generateFingerprint = async (): Promise<FingerprintData> => {
  const canvas_hash = getCanvasFingerprint();
  const webgl_hash = getWebGLFingerprint();
  const audio_hash = await getAudioFingerprint();
  const screen_hash = getScreenFingerprint();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const platform = navigator.platform;
  const device_memory = (navigator as any).deviceMemory || null;
  const cpu_cores = navigator.hardwareConcurrency || null;

  // Combine all hashes for master fingerprint
  const combined = [
    canvas_hash,
    webgl_hash,
    audio_hash,
    screen_hash,
    timezone,
    platform,
    device_memory,
    cpu_cores,
  ].join('::');

  return {
    fingerprint_hash: simpleHash(combined),
    canvas_hash,
    webgl_hash,
    audio_hash,
    screen_hash,
    timezone,
    language,
    platform,
    device_memory,
    cpu_cores,
  };
};

// Check similarity between fingerprints (returns score 0-100)
const checkSimilarity = (fp1: Partial<FingerprintData>, fp2: Partial<FingerprintData>): number => {
  let matches = 0;
  let total = 0;

  const fields: (keyof FingerprintData)[] = [
    'canvas_hash',
    'webgl_hash', 
    'audio_hash',
    'screen_hash',
    'timezone',
    'platform',
    'device_memory',
    'cpu_cores',
  ];

  for (const field of fields) {
    if (fp1[field] !== undefined && fp2[field] !== undefined) {
      total++;
      if (fp1[field] === fp2[field]) {
        matches++;
      }
    }
  }

  return total > 0 ? Math.round((matches / total) * 100) : 0;
};

export function useAdvancedFingerprint() {
  const [state, setState] = useState<FingerprintState>({
    isBlocked: false,
    hasUsedFreeTransform: false,
    transformCount: 0,
    isLoading: true,
    fingerprint: null,
  });

  const checkFingerprint = useCallback(async () => {
    try {
      const fp = await generateFingerprint();
      
      // Check for exact match first
      const { data: exactMatch } = await supabase
        .from('device_fingerprints')
        .select('*')
        .eq('fingerprint_hash', fp.fingerprint_hash)
        .maybeSingle();

      if (exactMatch) {
        setState({
          isBlocked: exactMatch.is_blocked,
          hasUsedFreeTransform: exactMatch.transformation_count >= 1,
          transformCount: exactMatch.transformation_count,
          isLoading: false,
          fingerprint: fp,
        });
        return;
      }

      // Check for partial matches (VPN/incognito detection)
      const { data: partialMatches } = await supabase
        .from('device_fingerprints')
        .select('*')
        .or(`canvas_hash.eq.${fp.canvas_hash},webgl_hash.eq.${fp.webgl_hash}`)
        .limit(10);

      if (partialMatches && partialMatches.length > 0) {
        // Check similarity for each match
        for (const match of partialMatches) {
          const similarity = checkSimilarity(fp, match as any);
          
          // 70%+ similarity = likely same person with VPN/incognito
          if (similarity >= 70) {
            setState({
              isBlocked: match.is_blocked,
              hasUsedFreeTransform: match.transformation_count >= 1,
              transformCount: match.transformation_count,
              isLoading: false,
              fingerprint: fp,
            });
            return;
          }
        }
      }

      // No match found - new user
      setState({
        isBlocked: false,
        hasUsedFreeTransform: false,
        transformCount: 0,
        isLoading: false,
        fingerprint: fp,
      });
    } catch (error) {
      console.error('Fingerprint check error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkFingerprint();
  }, [checkFingerprint]);

  const recordTransformation = useCallback(async () => {
    if (!state.fingerprint) return;

    try {
      const fp = state.fingerprint;

      // Try to upsert the fingerprint
      const { data: existing } = await supabase
        .from('device_fingerprints')
        .select('id, transformation_count')
        .eq('fingerprint_hash', fp.fingerprint_hash)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('device_fingerprints')
          .update({
            transformation_count: existing.transformation_count + 1,
            last_seen_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('device_fingerprints')
          .insert({
            ...fp,
            transformation_count: 1,
          });
      }

      setState(prev => ({
        ...prev,
        hasUsedFreeTransform: true,
        transformCount: prev.transformCount + 1,
      }));

      // Also record in ip_usage for backwards compatibility
      const legacyHash = `fp_${fp.fingerprint_hash}`;
      const { data: legacyExisting } = await supabase
        .from('ip_usage')
        .select('id, transformation_count')
        .eq('ip_address', legacyHash)
        .maybeSingle();

      if (legacyExisting) {
        await supabase
          .from('ip_usage')
          .update({
            transformation_count: legacyExisting.transformation_count + 1,
            last_used_at: new Date().toISOString(),
          })
          .eq('id', legacyExisting.id);
      } else {
        await supabase
          .from('ip_usage')
          .insert({
            ip_address: legacyHash,
            transformation_count: 1,
          });
      }
    } catch (error) {
      console.error('Error recording transformation:', error);
    }
  }, [state.fingerprint]);

  return {
    ...state,
    recordTransformation,
    refreshFingerprint: checkFingerprint,
  };
}
