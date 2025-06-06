/**
 * Bridge AI+BCI Platform - User Model
 * Comprehensive user schema with BCI training history and subscription management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic user information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  
  // Profile information
  profile: {
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    avatar: { type: String }, // URL to profile image
    bio: { type: String, maxlength: 500 },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    location: {
      country: String,
      city: String,
      timezone: String
    }
  },

  // Account settings
  settings: {
    language: { type: String, default: 'en', enum: ['en', 'zh', 'es', 'fr', 'de', 'ja'] },
    theme: { type: String, default: 'dark', enum: ['light', 'dark', 'auto'] },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      trainingReminders: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, default: 'private', enum: ['public', 'friends', 'private'] },
      shareTrainingData: { type: Boolean, default: false },
      allowResearch: { type: Boolean, default: false }
    }
  },

  // BCI and training data
  bciProfile: {
    // Baseline neural metrics established during calibration
    baseline: {
      stress: { type: Number, min: 0, max: 100 },
      focus: { type: Number, min: 0, max: 100 },
      empathy: { type: Number, min: 0, max: 100 },
      regulation: { type: Number, min: 0, max: 100 },
      calibratedAt: Date,
      calibrationQuality: { type: String, enum: ['excellent', 'good', 'fair', 'needs-recalibration'] }
    },
    
    // Current skill levels
    skillLevels: {
      stressManagement: { type: Number, default: 0, min: 0, max: 100 },
      empathyTraining: { type: Number, default: 0, min: 0, max: 100 },
      conflictResolution: { type: Number, default: 0, min: 0, max: 100 },
      emotionalRegulation: { type: Number, default: 0, min: 0, max: 100 },
      activeListening: { type: Number, default: 0, min: 0, max: 100 }
    },
    
    // Training preferences
    preferences: {
      preferredScenarios: [{ type: String, enum: ['family', 'relationship', 'workplace', 'friendship'] }],
      trainingIntensity: { type: String, default: 'moderate', enum: ['gentle', 'moderate', 'intensive'] },
      sessionDuration: { type: Number, default: 15, min: 5, max: 60 }, // minutes
      weeklyGoal: { type: Number, default: 3, min: 1, max: 14 } // sessions per week
    },
    
    // Achievement tracking
    achievements: [{
      type: { type: String, required: true },
      title: { type: String, required: true },
      description: String,
      earnedAt: { type: Date, default: Date.now },
      level: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] }
    }],
    
    // Streaks and statistics
    stats: {
      totalSessions: { type: Number, default: 0 },
      totalTrainingTime: { type: Number, default: 0 }, // minutes
      currentStreak: { type: Number, default: 0 }, // days
      longestStreak: { type: Number, default: 0 },
      lastSessionDate: Date,
      averageStressReduction: { type: Number, default: 0 },
      averageEmpathyImprovement: { type: Number, default: 0 }
    }
  },

  // Subscription and billing
  subscription: {
    plan: { 
      type: String, 
      default: 'free', 
      enum: ['free', 'basic', 'pro', 'premium', 'enterprise'] 
    },
    status: { 
      type: String, 
      default: 'active', 
      enum: ['active', 'inactive', 'cancelled', 'past_due', 'unpaid'] 
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEndsAt: Date,
    cancelledAt: Date,
    features: {
      maxSessionsPerMonth: { type: Number, default: 5 },
      advancedAnalytics: { type: Boolean, default: false },
      aiCoachAccess: { type: Boolean, default: false },
      customScenarios: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false }
    }
  },

  // Security and verification
  verification: {
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerified: { type: Boolean, default: false },
    phoneNumber: String,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String
  },

  // Password reset
  passwordReset: {
    token: String,
    expires: Date,
    attempts: { type: Number, default: 0 },
    lastAttempt: Date
  },

  // Login tracking
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      city: String
    },
    success: { type: Boolean, default: true }
  }],

  // Account status
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'suspended', 'deleted']
  },
  
  // Terms and privacy
  legal: {
    termsAcceptedAt: Date,
    privacyAcceptedAt: Date,
    marketingOptIn: { type: Boolean, default: false },
    dataProcessingConsent: { type: Boolean, default: false }
  },

  // Referral system
  referral: {
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCode: { type: String, unique: true, sparse: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    referralRewards: { type: Number, default: 0 } // in credits or currency
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  
  // Indexes for performance
  indexes: [
    { email: 1 },
    { username: 1 },
    { 'subscription.stripeCustomerId': 1 },
    { 'verification.emailVerificationToken': 1 },
    { 'passwordReset.token': 1 },
    { 'referral.referralCode': 1 },
    { status: 1, 'subscription.plan': 1 }
  ]
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const payload = {
    userId: this._id,
    email: this.email,
    username: this.username,
    plan: this.subscription.plan,
    verified: this.verification.emailVerified
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'bridge-ai-bci-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'bridge-ai-bci',
    audience: 'bridge-users'
  });
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  const payload = {
    userId: this._id,
    type: 'refresh'
  };
  
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'bridge-refresh-secret', {
    expiresIn: '30d',
    issuer: 'bridge-ai-bci',
    audience: 'bridge-users'
  });
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.verification.emailVerificationToken = token;
  this.verification.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordReset.token = token;
  this.passwordReset.expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  this.passwordReset.attempts = 0;
  
  return token;
};

// Generate unique referral code
userSchema.methods.generateReferralCode = function() {
  if (!this.referral.referralCode) {
    const crypto = require('crypto');
    this.referral.referralCode = this.username.toUpperCase() + 
      crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  return this.referral.referralCode;
};

// Update BCI baseline
userSchema.methods.updateBCIBaseline = function(metrics) {
  this.bciProfile.baseline = {
    ...metrics,
    calibratedAt: new Date(),
    calibrationQuality: this.calculateCalibrationQuality(metrics)
  };
};

// Calculate calibration quality based on signal consistency
userSchema.methods.calculateCalibrationQuality = function(metrics) {
  const variance = this.calculateMetricsVariance(metrics);
  if (variance < 5) return 'excellent';
  if (variance < 10) return 'good';
  if (variance < 20) return 'fair';
  return 'needs-recalibration';
};

// Helper method to calculate metrics variance
userSchema.methods.calculateMetricsVariance = function(metrics) {
  const values = [metrics.stress, metrics.focus, metrics.empathy, metrics.regulation];
  const mean = values.reduce((a, b) => a + b) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

// Update skill levels after training session
userSchema.methods.updateSkillLevels = function(improvements) {
  Object.keys(improvements).forEach(skill => {
    if (this.bciProfile.skillLevels[skill] !== undefined) {
      this.bciProfile.skillLevels[skill] = Math.min(100, 
        this.bciProfile.skillLevels[skill] + improvements[skill]
      );
    }
  });
};

// Add achievement
userSchema.methods.addAchievement = function(type, title, description, level = 'bronze') {
  // Check if achievement already exists
  const exists = this.bciProfile.achievements.some(ach => 
    ach.type === type && ach.level === level
  );
  
  if (!exists) {
    this.bciProfile.achievements.push({
      type,
      title,
      description,
      level
    });
  }
};

// Update training statistics
userSchema.methods.updateTrainingStats = function(sessionData) {
  const stats = this.bciProfile.stats;
  
  stats.totalSessions += 1;
  stats.totalTrainingTime += sessionData.duration || 0;
  stats.lastSessionDate = new Date();
  
  // Update averages
  if (sessionData.stressReduction) {
    stats.averageStressReduction = (
      (stats.averageStressReduction * (stats.totalSessions - 1) + sessionData.stressReduction) 
      / stats.totalSessions
    );
  }
  
  if (sessionData.empathyImprovement) {
    stats.averageEmpathyImprovement = (
      (stats.averageEmpathyImprovement * (stats.totalSessions - 1) + sessionData.empathyImprovement) 
      / stats.totalSessions
    );
  }
  
  // Update streak
  this.updateStreak();
};

// Update current streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastSession = this.bciProfile.stats.lastSessionDate;
  
  if (!lastSession) {
    this.bciProfile.stats.currentStreak = 1;
    return;
  }
  
  const daysDiff = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, don't increment
    return;
  } else if (daysDiff === 1) {
    // Consecutive day
    this.bciProfile.stats.currentStreak += 1;
    this.bciProfile.stats.longestStreak = Math.max(
      this.bciProfile.stats.longestStreak,
      this.bciProfile.stats.currentStreak
    );
  } else {
    // Streak broken
    this.bciProfile.stats.currentStreak = 1;
  }
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  return this.subscription.status === 'active' && 
         (!this.subscription.currentPeriodEnd || this.subscription.currentPeriodEnd > new Date());
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive data
    delete ret.password;
    delete ret.verification.emailVerificationToken;
    delete ret.passwordReset;
    delete ret.loginHistory;
    delete ret.__v;
    return ret;
  }
});

// Create and export model
const User = mongoose.model('User', userSchema);

module.exports = User;
