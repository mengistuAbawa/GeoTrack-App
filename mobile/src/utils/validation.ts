/**
 * Validation utilities for input validation
 */

export const validatePhone = (phone: string): boolean => {
  // E.164 format: +[1-9]\d{7,14}
  const e164Regex = /^\+[1-9]\d{7,14}$/;
  const cleaned = phone.replace(/[\s()-]/g, '');
  return e164Regex.test(cleaned);
};

export const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s()-]/g, '');
};

export const validateEmail = (email: string): boolean => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOtp = (code: string): boolean => {
  // 6-digit OTP
  return /^\d{6}$/.test(code);
};

export const isValidCoordinate = (lat: number, lon: number): boolean => {
  return (
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    Number.isFinite(lon) &&
    lon >= -180 &&
    lon <= 180
  );
};

export const isValidTimestamp = (timestamp: any): boolean => {
  const date = new Date(timestamp);
  return !Number.isNaN(date.getTime());
};
