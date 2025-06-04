import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';

// Import configurations and middleware
import { config } from './config/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bciRoutes from './routes/bci';
import trainingRoutes from './routes/training';
import aiRoutes from './routes/ai';
import analysisRoutes from './routes/analysis';
import healthRoutes from './routes/health';

// Import services
import { prisma } from './services/database';
import { redisClient } from './services/redis';
import { setupSwagger } from './config/swagger';
import { BCIService } from './services/bciService';
import { TrainingService } from './services/trainingService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.NODE_ENV === 'production' 
    ? [config.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging middleware
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/bci', authMiddleware, bciRoutes);
app.use('/api/training', authMiddleware, trainingRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/analysis', authMiddleware, analysisRoutes);

// Setup Swagger documentation
if (config.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join-user-room', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Handle BCI data streaming
  socket.on('bci-stream-start', async (data) => {
    try {
      const { userId, sessionId } = data;
      await BCIService.startStream(userId, sessionId);
      socket.join(`bci-${sessionId}`);
      
      // Emit confirmation
      socket.emit('bci-stream-started', { sessionId });
      logger.info(`BCI stream started for session ${sessionId}`);
    } catch (error) {
      socket.emit('bci-stream-error', { error: 'Failed to start BCI stream' });
      logger.error('BCI stream start error:', error);
    }
  });

  // Handle training session updates
  socket.on('training-update', async (data) => {
    try {
      const { sessionId, metrics, response } = data;
      await TrainingService.updateSession(sessionId, { metrics, response });
      
      // Broadcast to session participants
      io.to(`training-${sessionId}`).emit('training-updated', data);
      logger.info(`Training session ${sessionId} updated`);
    } catch (error) {
      socket.emit('training-error', { error: 'Failed to update training session' });
      logger.error('Training update error:', error);
    }
  });

  // Handle neural feedback
  socket.on('neural-feedback-request', async (data) => {
    try {
      const { sessionId, metrics } = data;
      const feedback = await BCIService.generateFeedback(metrics);
      
      socket.emit('neural-feedback', { feedback, timestamp: new Date() });
    } catch (error) {
      socket.emit('neural-feedback-error', { error: 'Failed to generate feedback' });
      logger.error('Neural feedback error:', error);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  await prisma.$disconnect();
  await redisClient.quit();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  await prisma.$disconnect();
  await redisClient.quit();
  
  process.exit(0);
});

// Start server
const PORT = config.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 Bridge API server running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.NODE_ENV}`);
  logger.info(`🗄️  Database: ${config.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  logger.info(`🔴 Redis: ${config.REDIS_URL ? 'Connected' : 'Not configured'}`);
  
  if (config.NODE_ENV !== 'production') {
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  }
});

export { app, io };