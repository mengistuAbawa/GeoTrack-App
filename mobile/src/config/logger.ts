const isDev = process.env.EXPO_PUBLIC_ENABLE_DEV_LOGGING === 'true';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export const logger = {
  debug: (tag: string, message: string, data?: any) => {
    if (isDev) {
      console.log(`[${LogLevel.DEBUG}] ${tag}:`, message, data);
    }
  },
  info: (tag: string, message: string, data?: any) => {
    console.log(`[${LogLevel.INFO}] ${tag}:`, message, data);
  },
  warn: (tag: string, message: string, data?: any) => {
    console.warn(`[${LogLevel.WARN}] ${tag}:`, message, data);
  },
  error: (tag: string, message: string, error?: any) => {
    console.error(`[${LogLevel.ERROR}] ${tag}:`, message, error);
  },
};
