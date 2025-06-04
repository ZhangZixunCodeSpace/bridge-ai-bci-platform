import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { BCISimulator } from './services/bciSimulator';
import { SignalGenerator } from './services/signalGenerator';
import { NeuralProcessor } from './services/neuralProcessor';
import { RedisClient } from './services/redisClient';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Configuration
const config = {
  PORT: parseInt(process.env.PORT || '9000', 10),
  WEBSOCKET_PORT: parseInt(process.env.WEBSOCKET_PORT || '9001', 10),
  SAMPLE_RATE: parseInt(process.env.BCI_SAMPLE_RATE || '256', 10),
  CHANNELS: parseInt(process.env.BCI_CHANNELS || '32', 10),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(compression());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize services
const redisClient = new RedisClient(config.REDIS_URL);
const signalGenerator = new SignalGenerator(config.SAMPLE_RATE, config.CHANNELS);
const neuralProcessor = new NeuralProcessor();
const bciSimulator = new BCISimulator(signalGenerator, neuralProcessor, redisClient);

// Socket.IO for real-time communication
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
  },
});

// WebSocket server for BCI data streaming
const wss = new WebSocketServer({ port: config.WEBSOCKET_PORT });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'bridge-bci-simulator',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    configuration: {
      sampleRate: config.SAMPLE_RATE,
      channels: config.CHANNELS,
      websocketPort: config.WEBSOCKET_PORT,
    },
  });
});

// BCI device endpoints
app.get('/api/devices', (req, res) => {
  res.json({
    availableDevices: [
      {
        id: 'simulator-1',
        name: 'Bridge Neural Simulator',
        type: 'simulator',
        channels: config.CHANNELS,
        sampleRate: config.SAMPLE_RATE,
        status: 'available',
      },
      {
        id: 'simulator-eeg-32',
        name: 'EEG 32-Channel Simulator',
        type: 'eeg',
        channels: 32,
        sampleRate: 256,
        status: 'available',
      },
    ],
  });
});

app.post('/api/connect', async (req, res) => {
  try {
    const { deviceId, userId } = req.body;
    
    if (!deviceId || !userId) {
      return res.status(400).json({ error: 'deviceId and userId are required' });
    }

    const sessionId = await bciSimulator.connect(deviceId, userId);
    
    res.json({
      success: true,
      sessionId,
      device: {
        id: deviceId,
        connected: true,
        sampleRate: config.SAMPLE_RATE,
        channels: config.CHANNELS,
      },
    });
  } catch (error) {
    logger.error('Connection error:', error);
    res.status(500).json({ error: 'Failed to connect to BCI device' });
  }
});

app.post('/api/disconnect', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    await bciSimulator.disconnect(sessionId);
    
    res.json({
      success: true,
      message: 'BCI device disconnected',
    });
  } catch (error) {
    logger.error('Disconnection error:', error);
    res.status(500).json({ error: 'Failed to disconnect BCI device' });
  }
});

app.get('/api/status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const status = await bciSimulator.getStatus(sessionId);
    
    res.json(status);
  } catch (error) {
    logger.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get BCI status' });
  }
});

app.post('/api/calibrate', async (req, res) => {
  try {
    const { sessionId, duration = 120, taskType = 'baseline' } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    await bciSimulator.startCalibration(sessionId, { duration, taskType });
    
    res.json({
      success: true,
      message: 'Calibration started',
      duration,
      taskType,
    });
  } catch (error) {
    logger.error('Calibration error:', error);
    res.status(500).json({ error: 'Failed to start calibration' });
  }
});

app.get('/api/metrics/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { realtime = 'false' } = req.query;
    
    const metrics = await bciSimulator.getMetrics(sessionId, realtime === 'true');
    
    res.json(metrics);
  } catch (error) {
    logger.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-session', (sessionId: string) => {
    socket.join(`session-${sessionId}`);
    logger.info(`Socket ${socket.id} joined session ${sessionId}`);
  });

  socket.on('start-stream', async (data: { sessionId: string; userId: string }) => {
    try {
      const { sessionId, userId } = data;
      await bciSimulator.startStream(sessionId, userId);
      
      socket.emit('stream-started', { sessionId });
      logger.info(`Stream started for session ${sessionId}`);
    } catch (error) {
      socket.emit('stream-error', { error: 'Failed to start stream' });
      logger.error('Stream start error:', error);
    }
  });

  socket.on('stop-stream', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      await bciSimulator.stopStream(sessionId);
      
      socket.emit('stream-stopped', { sessionId });
      logger.info(`Stream stopped for session ${sessionId}`);
    } catch (error) {
      socket.emit('stream-error', { error: 'Failed to stop stream' });
      logger.error('Stream stop error:', error);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// WebSocket server for BCI data streaming
wss.on('connection', (ws, req) => {
  logger.info('BCI WebSocket client connected');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'subscribe') {
        const { sessionId } = data;
        
        // Start sending BCI data for this session
        const interval = setInterval(async () => {
          try {
            const metrics = await bciSimulator.getMetrics(sessionId, true);
            const signalData = await bciSimulator.getRawSignal(sessionId);
            
            ws.send(JSON.stringify({
              type: 'bci-data',
              sessionId,
              timestamp: new Date().toISOString(),
              metrics,
              signalData,
            }));
          } catch (error) {
            logger.error('Error sending BCI data:', error);
          }
        }, 100); // 10 Hz update rate
        
        // Store interval for cleanup
        (ws as any).dataInterval = interval;
        
        ws.send(JSON.stringify({
          type: 'subscribed',
          sessionId,
          sampleRate: config.SAMPLE_RATE,
          channels: config.CHANNELS,
        }));
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    logger.info('BCI WebSocket client disconnected');
    
    // Cleanup interval
    if ((ws as any).dataInterval) {
      clearInterval((ws as any).dataInterval);
    }
  });
  
  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/devices',
      'POST /api/connect',
      'POST /api/disconnect',
      'GET /api/status/:sessionId',
      'POST /api/calibrate',
      'GET /api/metrics/:sessionId',
    ],
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Connect to Redis
    await redisClient.connect();
    logger.info('✅ Redis connected');
    
    // Initialize BCI simulator
    await bciSimulator.initialize();
    logger.info('✅ BCI Simulator initialized');
    
    // Start HTTP server
    server.listen(config.PORT, () => {
      logger.info(`🚀 Bridge BCI Simulator running on port ${config.PORT}`);
      logger.info(`📡 WebSocket server running on port ${config.WEBSOCKET_PORT}`);
      logger.info(`🧠 Neural channels: ${config.CHANNELS}`);
      logger.info(`📊 Sample rate: ${config.SAMPLE_RATE} Hz`);
      logger.info(`🌐 Environment: ${config.NODE_ENV}`);
    });
    
    logger.info('🧠 BCI Simulator ready for neural training!');
    
  } catch (error) {
    logger.error('❌ Failed to start BCI Simulator:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  wss.close();
  server.close();
  await redisClient.disconnect();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  wss.close();
  server.close();
  await redisClient.disconnect();
  
  process.exit(0);
});

// Start the server
startServer();