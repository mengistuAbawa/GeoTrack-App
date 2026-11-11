import { useState, useCallback } from 'react';
import { logger } from '@/config/logger';

const TAG = 'useApi';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Custom hook for managing async API calls with loading/error states
 */
export const useApi = (apiCall: () => Promise<any>, options?: UseApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'An error occurred';
      setError(message);
      logger.error(TAG, 'API call failed', err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};
