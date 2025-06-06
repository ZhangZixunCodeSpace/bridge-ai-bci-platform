/**
 * Bridge AI+BCI Platform - Authentication Middleware
 * JWT token verification and route protection
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { databaseManager } = require('../config/database');

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Check if token is blacklisted
    const isBlacklisted = await databaseManager.redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: 'Token has been invalidated'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bridge-ai-bci-secret');
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    // Attach user info to request
    req.user = {
      userId: user._id,
      email: user.email,
      username: user.username,
      plan: user.subscription.plan,
      verified: user.verification.emailVerified,
      isSubscriptionActive: user.isSubscriptionActive
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Optional authentication - attach user if token is valid, continue regardless
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Check if token is blacklisted
    const isBlacklisted = await databaseManager.redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bridge-ai-bci-secret');
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (user && user.status === 'active') {
      req.user = {
        userId: user._id,
        email: user.email,
        username: user.username,
        plan: user.subscription.plan,
        verified: user.verification.emailVerified,
        isSubscriptionActive: user.isSubscriptionActive
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token verification fails, just continue without user
    req.user = null;
    next();
  }
};

/**
 * Require email verification
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Require active subscription
 */
const requireActiveSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (!req.user.isSubscriptionActive && req.user.plan === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Active subscription required',
      code: 'SUBSCRIPTION_REQUIRED',
      upgradeUrl: '/pricing'
    });
  }

  next();
};

/**
 * Require specific subscription plan
 */
const requirePlan = (requiredPlans) => {
  if (!Array.isArray(requiredPlans)) {
    requiredPlans = [requiredPlans];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!requiredPlans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        error: `Plan upgrade required. Available plans: ${requiredPlans.join(', ')}`,
        code: 'PLAN_UPGRADE_REQUIRED',
        currentPlan: req.user.plan,
        requiredPlans: requiredPlans,
        upgradeUrl: '/pricing'
      });
    }

    next();
  };
};

/**
 * Rate limiting middleware for different user tiers
 */
const createTieredRateLimit = (limits) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs: limits.windowMs || 15 * 60 * 1000, // 15 minutes default
    
    max: (req) => {
      if (!req.user) {
        return limits.anonymous || 10;
      }

      switch (req.user.plan) {
        case 'enterprise':
          return limits.enterprise || 1000;
        case 'premium':
          return limits.premium || 500;
        case 'pro':
          return limits.pro || 200;
        case 'basic':
          return limits.basic || 100;
        case 'free':
        default:
          return limits.free || 50;
      }
    },
    
    keyGenerator: (req) => {
      return req.user ? `user:${req.user.userId}` : req.ip;
    },
    
    message: (req) => ({
      success: false,
      error: 'Rate limit exceeded',
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      resetTime: new Date(Date.now() + req.rateLimit.msBeforeNext),
      upgradeUrl: req.user && req.user.plan === 'free' ? '/pricing' : null
    }),
    
    standardHeaders: true,
    legacyHeaders: false
  });
};

/**
 * BCI session rate limiting - prevents abuse of compute-intensive operations
 */
const bciSessionLimiter = createTieredRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  anonymous: 2,
  free: 5,
  basic: 15,
  pro: 50,
  premium: 150,
  enterprise: 500
});

/**
 * API request rate limiting
 */
const apiRateLimiter = createTieredRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  anonymous: 50,
  free: 100,
  basic: 300,
  pro: 1000,
  premium: 2000,
  enterprise: 5000
});

/**
 * Training session rate limiting
 */
const trainingSessionLimiter = createTieredRateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  anonymous: 1,
  free: 3,
  basic: 10,
  pro: 25,
  premium: 100,
  enterprise: 500
});

/**
 * Admin role check
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.roles || !user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authorization check failed'
    });
  }
};

/**
 * Resource ownership check
 */
const requireOwnership = (resourceField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get resource ID from URL params or body
      const resourceUserId = req.params[resourceField] || req.body[resourceField];
      
      if (!resourceUserId) {
        return res.status(400).json({
          success: false,
          error: 'Resource identifier required'
        });
      }

      // Check if user owns the resource or is admin
      const user = await User.findById(req.user.userId);
      const isAdmin = user && user.roles && user.roles.includes('admin');
      
      if (req.user.userId.toString() !== resourceUserId.toString() && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own resources.'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      });
    }
  };
};

/**
 * Feature flag middleware
 */
const requireFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      // Check if feature is enabled globally
      const globalFeatureFlag = await databaseManager.redisClient.get(`feature:${featureName}`);
      if (globalFeatureFlag === 'false') {
        return res.status(503).json({
          success: false,
          error: 'Feature temporarily unavailable',
          code: 'FEATURE_DISABLED'
        });
      }

      // Check user-specific feature access
      if (req.user) {
        const userFeatureFlag = await databaseManager.redisClient.get(
          `feature:${featureName}:user:${req.user.userId}`
        );
        
        if (userFeatureFlag === 'false') {
          return res.status(403).json({
            success: false,
            error: 'Feature not available for your account',
            code: 'FEATURE_ACCESS_DENIED'
          });
        }
      }

      next();
    } catch (error) {
      console.error('Feature flag check error:', error);
      next(); // Fail open - continue if feature flag check fails
    }
  };
};

/**
 * Maintenance mode middleware
 */
const checkMaintenanceMode = async (req, res, next) => {
  try {
    const maintenanceMode = await databaseManager.redisClient.get('maintenance:enabled');
    
    if (maintenanceMode === 'true') {
      // Allow admin users during maintenance
      if (req.user) {
        const user = await User.findById(req.user.userId);
        if (user && user.roles && user.roles.includes('admin')) {
          return next();
        }
      }

      const maintenanceMessage = await databaseManager.redisClient.get('maintenance:message');
      const estimatedEnd = await databaseManager.redisClient.get('maintenance:estimated_end');

      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable for maintenance',
        message: maintenanceMessage || 'We are currently performing scheduled maintenance.',
        estimatedEnd: estimatedEnd ? new Date(estimatedEnd) : null,
        code: 'MAINTENANCE_MODE'
      });
    }

    next();
  } catch (error) {
    console.error('Maintenance mode check error:', error);
    next(); // Fail open - continue if maintenance check fails
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireEmailVerification,
  requireActiveSubscription,
  requirePlan,
  requireAdmin,
  requireOwnership,
  requireFeature,
  checkMaintenanceMode,
  bciSessionLimiter,
  apiRateLimiter,
  trainingSessionLimiter,
  createTieredRateLimit
};
