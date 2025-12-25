import { useState, useEffect, useCallback } from 'react';

const MAX_FREE_TRANSFORMS = 1;

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
  remainingTransforms: number;
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

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('REWIND 🎬', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('REWIND 🎬', 4, 17);

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
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
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
  const device_memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || null;
  const cpu_cores = navigator.hardwareConcurrency || null;

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

// Client-side fingerprint hook - actual rate limiting is enforced server-side
// This hook generates the fingerprint for passing to the Edge Function
// The Edge Function handles all rate limit checking and database updates
export function useAdvancedFingerprint() {
  const [state, setState] = useState<FingerprintState>({
    isBlocked: false,
    hasUsedFreeTransform: false,
    transformCount: 0,
    remainingTransforms: MAX_FREE_TRANSFORMS,
    isLoading: true,
    fingerprint: null,
  });

  const checkFingerprint = useCallback(async () => {
    try {
      const fp = await generateFingerprint();
      
      // Just generate the fingerprint - server will check rate limits
      setState({
        isBlocked: false,
        hasUsedFreeTransform: false,
        transformCount: 0,
        remainingTransforms: MAX_FREE_TRANSFORMS,
        isLoading: false,
        fingerprint: fp,
      });
    } catch (error) {
      console.error('Fingerprint generation error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkFingerprint();
  }, [checkFingerprint]);

  // Update local state after transformation (for UI purposes)
  // Actual rate limiting is handled server-side
  const recordTransformation = useCallback(() => {
    const newCount = state.transformCount + 1;
    const remaining = Math.max(0, MAX_FREE_TRANSFORMS - newCount);

    setState(prev => ({
      ...prev,
      hasUsedFreeTransform: newCount >= MAX_FREE_TRANSFORMS,
      transformCount: newCount,
      remainingTransforms: remaining,
    }));
  }, [state.transformCount]);

  // Handle rate limit response from server
  const handleRateLimitResponse = useCallback((isLimited: boolean, isBlocked: boolean = false) => {
    if (isLimited || isBlocked) {
      setState(prev => ({
        ...prev,
        hasUsedFreeTransform: true,
        isBlocked,
        remainingTransforms: 0,
      }));
    }
  }, []);

  return {
    ...state,
    recordTransformation,
    handleRateLimitResponse,
    refreshFingerprint: checkFingerprint,
  };
}
