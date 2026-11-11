/**
 * Formatting utilities for display
 */

import { formatDistanceToNow } from 'date-fns';

export const formatPhoneNumber = (phone: string): string => {
  // Format phone to readable format
  if (!phone) return '';
  // Keep the +X format but add spaces for readability
  const cleaned = phone.replace(/[\s]/g, '');
  return cleaned; // Could add custom formatting here if needed
};

export const formatLocation = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export const formatLocationShort = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatAccuracy = (accuracy: number | null | undefined): string => {
  if (!accuracy) return 'Unknown';
  return `±${Math.round(accuracy)}m`;
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

export const formatAltitude = (altitude: number | null | undefined): string => {
  if (!altitude) return 'N/A';
  return `${Math.round(altitude)}m`;
};
