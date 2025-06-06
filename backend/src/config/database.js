/**
 * Bridge AI+BCI Platform - Database Configuration
 * MongoDB and Redis setup for user data and BCI session storage
 */

const mongoose = require('mongoose');
const redis = require('redis');

class DatabaseManager {
  constructor() {
    this.mongoConnection = null;
    this.redisClient = null;
  }

  /**
   * Initialize MongoDB connection for user data
   */
  async connectMongoDB() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bridge-ai-bci';
      
      this.mongoConnection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('🧠 MongoDB connected successfully');
      
      // Monitor connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      return this.mongoConnection;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Initialize Redis connection for BCI session data and caching
   */
  async connectRedis() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: 0,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      };

      this.redisClient = redis.createClient(redisConfig);

      this.redisClient.on('connect', () => {
        console.log('⚡ Redis connected successfully');
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      await this.redisClient.connect();
      return this.redisClient;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Initialize all database connections
   */
  async initializeAll() {
    try {
      await Promise.all([
        this.connectMongoDB(),
        this.connectRedis()
      ]);

      console.log('🗄️ All database connections established');
      return {
        mongodb: this.mongoConnection,
        redis: this.redisClient
      };
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Store BCI session data in Redis (temporary storage)
   */
  async storeBCISession(sessionId, data, expireInSeconds = 3600) {
    try {
      await this.redisClient.setEx(
        `bci:session:${sessionId}`,
        expireInSeconds,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      console.error('Failed to store BCI session:', error);
      return false;
    }
  }

  /**
   * Retrieve BCI session data from Redis
   */
  async getBCISession(sessionId) {
    try {
      const data = await this.redisClient.get(`bci:session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve BCI session:', error);
      return null;
    }
  }

  /**
   * Store real-time BCI metrics (with automatic expiration)
   */
  async storeBCIMetrics(userId, metrics) {
    try {
      const key = `bci:metrics:${userId}:${Date.now()}`;
      await this.redisClient.setEx(key, 300, JSON.stringify(metrics)); // 5 minute expiry
      
      // Keep a list of recent metrics for this user
      await this.redisClient.lPush(`bci:metrics:list:${userId}`, key);
      await this.redisClient.lTrim(`bci:metrics:list:${userId}`, 0, 99); // Keep last 100 entries
      
      return true;
    } catch (error) {
      console.error('Failed to store BCI metrics:', error);
      return false;
    }
  }

  /**
   * Get recent BCI metrics for a user
   */
  async getRecentBCIMetrics(userId, limit = 10) {
    try {
      const keys = await this.redisClient.lRange(`bci:metrics:list:${userId}`, 0, limit - 1);
      const metrics = [];
      
      for (const key of keys) {
        const data = await this.redisClient.get(key);
        if (data) {
          metrics.push(JSON.parse(data));
        }
      }
      
      return metrics;
    } catch (error) {
      console.error('Failed to retrieve BCI metrics:', error);
      return [];
    }
  }

  /**
   * Cache neural training results
   */
  async cacheTrainingResult(userId, trainingId, results, expireInDays = 30) {
    try {
      const key = `training:result:${userId}:${trainingId}`;
      const expireInSeconds = expireInDays * 24 * 60 * 60;
      
      await this.redisClient.setEx(key, expireInSeconds, JSON.stringify({
        ...results,
        timestamp: Date.now(),
        userId,
        trainingId
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to cache training result:', error);
      return false;
    }
  }

  /**
   * Health check for all database connections
   */
  async healthCheck() {
    const health = {
      mongodb: false,
      redis: false,
      timestamp: new Date().toISOString()
    };

    try {
      // Check MongoDB
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      console.error('MongoDB health check failed:', error);
    }

    try {
      // Check Redis
      await this.redisClient.ping();
      health.redis = true;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    return health;
  }

  /**
   * Graceful shutdown
   */
  async disconnect() {
    try {
      if (this.mongoConnection) {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
      }

      if (this.redisClient) {
        await this.redisClient.quit();
        console.log('Redis disconnected');
      }
    } catch (error) {
      console.error('Error during database disconnect:', error);
    }
  }
}

// Export singleton instance
const databaseManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  databaseManager,
  
  // Convenience exports
  mongoose,
  redis: () => databaseManager.redisClient
};
