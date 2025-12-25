import { useState, useCallback } from 'react';

interface PreviewModeState {
  hasUsedFreeTransform: boolean;
  transformCount: number;
  isLoading: boolean;
}

// Client-side state only - actual rate limiting is enforced server-side
export function usePreviewMode() {
  const [state, setState] = useState<PreviewModeState>({
    hasUsedFreeTransform: false,
    transformCount: 0,
    isLoading: false,
  });

  // Mark that a transformation was attempted (for UI purposes only)
  const recordTransformation = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasUsedFreeTransform: true,
      transformCount: prev.transformCount + 1,
    }));
  }, []);

  // Reset local state (doesn't affect server-side limits)
  const refreshUsage = useCallback(() => {
    // No-op - server-side rate limiting handles the actual limits
    // This is just for UI state management
  }, []);

  return {
    ...state,
    recordTransformation,
    refreshUsage,
  };
}
