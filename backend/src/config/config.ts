import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  NODE_ENV: string;
  PORT: number;
  
  // URLs
  FRONTEND_URL: string;
  BACKEND_URL: string;
  AI_SERVICE_URL: string;
  BCI_SIMULATOR_URL: string;
  
  // Database
  DATABASE_URL: string;
  
  // Redis
  REDIS_URL: string;
  
  // Authentication
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  
  // AI Service
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  OPENAI_MAX_TOKENS: number;
  OPENAI_TEMPERATURE: number;
  
  // BCI Configuration
  BCI_WEBSOCKET_URL: string;
  BCI_SAMPLE_RATE: number;
  BCI_CHANNELS: number;
  BCI_SIMULATION_MODE: boolean;
  
  // Email (Optional)
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  FROM_EMAIL?: string;
  
  // Cloud Storage (Optional)
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;
  
  // Monitoring
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  
  // Feature Flags
  FEATURE_BCI_HARDWARE: boolean;
  FEATURE_REAL_AI: boolean;
  FEATURE_ANALYTICS: boolean;
  FEATURE_PAYMENTS: boolean;
  FEATURE_NOTIFICATIONS: boolean;
}

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  BCI_SIMULATOR_URL: process.env.BCI_SIMULATOR_URL || 'http://localhost:9000',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://bridge_user:bridge_password@localhost:5432/bridge_db',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  
  // AI Service
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'demo-key',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  
  // BCI Configuration
  BCI_WEBSOCKET_URL: process.env.BCI_WEBSOCKET_URL || 'ws://localhost:9001',
  BCI_SAMPLE_RATE: parseInt(process.env.BCI_SAMPLE_RATE || '256', 10),
  BCI_CHANNELS: parseInt(process.env.BCI_CHANNELS || '32', 10),
  BCI_SIMULATION_MODE: process.env.BCI_SIMULATION_MODE === 'true',
  
  // Email (Optional)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL,
  
  // Cloud Storage (Optional)
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  
  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  
  // Feature Flags
  FEATURE_BCI_HARDWARE: process.env.FEATURE_BCI_HARDWARE === 'true',
  FEATURE_REAL_AI: process.env.FEATURE_REAL_AI !== 'false',
  FEATURE_ANALYTICS: process.env.FEATURE_ANALYTICS !== 'false',
  FEATURE_PAYMENTS: process.env.FEATURE_PAYMENTS === 'true',
  FEATURE_NOTIFICATIONS: process.env.FEATURE_NOTIFICATIONS !== 'false',
};

// Log configuration in development
if (config.NODE_ENV === 'development') {
  console.log('🔧 Configuration loaded:');
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   Port: ${config.PORT}`);
  console.log(`   Database: ${config.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`   Redis: ${config.REDIS_URL ? 'Configured' : 'Not configured'}`);
  console.log(`   AI Service: ${config.AI_SERVICE_URL}`);
  console.log(`   BCI Simulator: ${config.BCI_SIMULATOR_URL}`);
  console.log(`   BCI Hardware: ${config.FEATURE_BCI_HARDWARE ? 'Enabled' : 'Disabled'}`);
}