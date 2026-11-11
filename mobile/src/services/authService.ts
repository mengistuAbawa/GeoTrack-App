import api from '@/config/api';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, OtpRequestPayload, OtpVerifyPayload, User } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'AuthService';

export const authService = {
  requestOtp: async (phone: string): Promise<{ message: string; developmentCode?: string }> => {
    try {
      const payload: OtpRequestPayload = { phone };
      const response = await api.post('/auth/request-otp', payload);
      logger.info(TAG, 'OTP requested successfully');
      return response.data;
    } catch (error) {
      logger.error(TAG, 'Failed to request OTP', error);
      throw error;
    }
  },

  verifyOtp: async (phone: string, code: string): Promise<AuthResponse> => {
    try {
      const payload: OtpVerifyPayload = { phone, code };
      const response = await api.post<AuthResponse>('/auth/verify-otp', payload);
      const { token, user } = response.data;

      // Store token securely
      await SecureStore.setItemAsync('authToken', token);

      // Store user info
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('lastLoginPhone', phone);

      logger.info(TAG, 'OTP verified successfully');
      return response.data;
    } catch (error) {
      logger.error(TAG, 'Failed to verify OTP', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>('/users/me');
      return response.data.user;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch current user', error);
      throw error;
    }
  },

  updateProfile: async (
    fullName?: string,
    email?: string,
    avatarUrl?: string
  ): Promise<User> => {
    try {
      const payload = {
        fullName,
        email,
        avatarUrl,
      };

      const response = await api.patch<{ user: User }>('/users/me', payload);
      const user = response.data.user;

      // Update cached user
      await AsyncStorage.setItem('user', JSON.stringify(user));

      logger.info(TAG, 'Profile updated successfully');
      return user;
    } catch (error) {
      logger.error(TAG, 'Failed to update profile', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync('authToken');

      // Clear async storage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('lastLoginPhone');

      logger.info(TAG, 'Logged out successfully');
    } catch (error) {
      logger.error(TAG, 'Failed to logout', error);
      throw error;
    }
  },

  getStoredToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      logger.error(TAG, 'Failed to get stored token', error);
      return null;
    }
  },

  getStoredUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      logger.error(TAG, 'Failed to get stored user', error);
      return null;
    }
  },

  isSessionValid: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return false;

      // Try to fetch current user to validate token
      await authService.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};
