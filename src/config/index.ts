/**
 * Application Configuration
 * Centralized configuration management with validation
 */

// Validate that required environment variables are set
function validateEnvVars() {
  const required = ['NEXT_PUBLIC_API_URL'];
  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Run validation
validateEnvVars();

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    timeout: 10000, // 10 seconds
  },

  // App Configuration
  app: {
    name: 'Smart Habit Tracker',
    description: 'Build better habits and achieve your goals',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableSocial: process.env.NEXT_PUBLIC_ENABLE_SOCIAL === 'true',
    enableGamification: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === 'true',
  },

  // Environment
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Type-safe config access
export type AppConfig = typeof config;
