import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'AuthContext';

export enum AuthState {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

interface AuthContextType {
  state: AuthState;
  user: User | null;
  error: string | null;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(AuthState.IDLE);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState(AuthState.LOADING);
        const token = await authService.getStoredToken();

        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setState(AuthState.AUTHENTICATED);
          logger.info(TAG, 'Session restored');
        } else {
          setState(AuthState.UNAUTHENTICATED);
        }
      } catch (err) {
        logger.error(TAG, 'Failed to initialize auth', err);
        setState(AuthState.UNAUTHENTICATED);
        await authService.logout();
      }
    };

    initializeAuth();
  }, []);

  const requestOtp = useCallback(async (phone: string) => {
    try {
      setError(null);
      setState(AuthState.LOADING);
      await authService.requestOtp(phone);
      logger.info(TAG, 'OTP requested');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to request OTP';
      setError(message);
      setState(AuthState.ERROR);
      logger.error(TAG, 'OTP request failed', err);
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    try {
      setError(null);
      setState(AuthState.LOADING);
      const { user: newUser } = await authService.verifyOtp(phone, code);
      setUser(newUser);
      setState(AuthState.AUTHENTICATED);
      logger.info(TAG, 'OTP verified, user authenticated');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to verify OTP';
      setError(message);
      setState(AuthState.ERROR);
      logger.error(TAG, 'OTP verification failed', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(AuthState.LOADING);
      await authService.logout();
      setUser(null);
      setError(null);
      setState(AuthState.UNAUTHENTICATED);
      logger.info(TAG, 'User logged out');
    } catch (err) {
      logger.error(TAG, 'Logout failed', err);
      setState(AuthState.ERROR);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (state !== AuthState.AUTHENTICATED) return;

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      logger.info(TAG, 'User data refreshed');
    } catch (err) {
      logger.error(TAG, 'Failed to refresh user', err);
      // If refresh fails due to auth, logout
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.status === 401) {
        await logout();
      }
    }
  }, [state, logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    state,
    user,
    error,
    requestOtp,
    verifyOtp,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
