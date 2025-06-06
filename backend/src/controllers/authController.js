/**
 * Bridge AI+BCI Platform - Authentication Controller
 * Complete user authentication system with JWT, email verification, and security features
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const User = require('../models/User');
const { databaseManager } = require('../config/database');
const emailService = require('../services/emailService');

class AuthController {
  constructor() {
    // Rate limiting configurations
    this.loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 login attempts per windowMs
      message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.registerLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // Limit each IP to 3 registration attempts per hour
      message: {
        error: 'Too many registration attempts, please try again later.',
        retryAfter: '1 hour'
      }
    });
  }

  /**
   * User Registration
   */
  async register(req, res) {
    try {
      const { email, username, password, firstName, lastName, referralCode } = req.body;

      // Validation
      const validationErrors = this.validateRegistrationData({
        email, username, password, firstName, lastName
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmailOrUsername(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists with this email or username'
        });
      }

      // Handle referral
      let referringUser = null;
      if (referralCode) {
        referringUser = await User.findOne({ 'referral.referralCode': referralCode.toUpperCase() });
      }

      // Create new user
      const userData = {
        email: email.toLowerCase(),
        username,
        password,
        profile: {
          firstName: firstName?.trim(),
          lastName: lastName?.trim()
        },
        legal: {
          termsAcceptedAt: new Date(),
          privacyAcceptedAt: new Date(),
          dataProcessingConsent: true
        }
      };

      if (referringUser) {
        userData.referral = { referredBy: referringUser._id };
      }

      const user = new User(userData);
      
      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      
      // Generate referral code for new user
      user.generateReferralCode();

      await user.save();

      // Update referring user if applicable
      if (referringUser) {
        referringUser.referral.referredUsers.push(user._id);
        referringUser.referral.referralRewards += 100; // 100 credits for referral
        await referringUser.save();
      }

      // Send verification email
      try {
        await emailService.sendVerificationEmail(user.email, verificationToken, user.profile.firstName);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      // Generate tokens
      const authToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      // Store refresh token in Redis
      await databaseManager.redisClient.setEx(
        `refresh_token:${user._id}`,
        30 * 24 * 60 * 60, // 30 days
        refreshToken
      );

      // Track login
      this.trackLogin(req, user._id, true);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: this.sanitizeUserData(user),
          tokens: {
            access: authToken,
            refresh: refreshToken
          }
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed. Please try again.'
      });
    }
  }

  /**
   * User Login
   */
  async login(req, res) {
    try {
      const { identifier, password, rememberMe = false } = req.body;

      // Validation
      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email/username and password are required'
        });
      }

      // Find user
      const user = await User.findByEmailOrUsername(identifier);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if account is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'Account is suspended or inactive'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        // Track failed login
        this.trackLogin(req, user._id, false);
        
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate tokens
      const tokenExpiry = rememberMe ? '30d' : '7d';
      const authToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
          plan: user.subscription.plan,
          verified: user.verification.emailVerified
        },
        process.env.JWT_SECRET || 'bridge-ai-bci-secret',
        { expiresIn: tokenExpiry }
      );

      const refreshToken = user.generateRefreshToken();

      // Store refresh token in Redis
      const refreshExpiry = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
      await databaseManager.redisClient.setEx(
        `refresh_token:${user._id}`,
        refreshExpiry,
        refreshToken
      );

      // Update last login
      user.bciProfile.stats.lastSessionDate = new Date();
      await user.save();

      // Track successful login
      this.trackLogin(req, user._id, true);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: this.sanitizeUserData(user),
          tokens: {
            access: authToken,
            refresh: refreshToken
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed. Please try again.'
      });
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'bridge-refresh-secret'
      );

      // Check if token exists in Redis
      const storedToken = await databaseManager.redisClient.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      // Generate new tokens
      const newAuthToken = user.generateAuthToken();
      const newRefreshToken = user.generateRefreshToken();

      // Update refresh token in Redis
      await databaseManager.redisClient.setEx(
        `refresh_token:${user._id}`,
        7 * 24 * 60 * 60, // 7 days
        newRefreshToken
      );

      res.json({
        success: true,
        data: {
          tokens: {
            access: newAuthToken,
            refresh: newRefreshToken
          }
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }

  /**
   * Logout
   */
  async logout(req, res) {
    try {
      const userId = req.user?.userId;

      if (userId) {
        // Remove refresh token from Redis
        await databaseManager.redisClient.del(`refresh_token:${userId}`);
        
        // Optionally, add the current token to a blacklist
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          const decoded = jwt.decode(token);
          if (decoded && decoded.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
              await databaseManager.redisClient.setEx(`blacklist:${token}`, ttl, 'true');
            }
          }
        }
      }

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }

  /**
   * Email Verification
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required'
        });
      }

      // Find user with verification token
      const user = await User.findOne({
        'verification.emailVerificationToken': token,
        'verification.emailVerificationExpires': { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }

      // Mark email as verified
      user.verification.emailVerified = true;
      user.verification.emailVerificationToken = undefined;
      user.verification.emailVerificationExpires = undefined;

      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed'
      });
    }
  }

  /**
   * Resend Verification Email
   */
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.verification.emailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified'
        });
      }

      // Generate new verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      await emailService.sendVerificationEmail(user.email, verificationToken, user.profile.firstName);

      res.json({
        success: true,
        message: 'Verification email sent'
      });

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }
  }

  /**
   * Forgot Password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists
        return res.json({
          success: true,
          message: 'If an account with this email exists, a password reset link has been sent.'
        });
      }

      // Check rate limiting for password reset attempts
      if (user.passwordReset.attempts >= 3 && 
          user.passwordReset.lastAttempt && 
          Date.now() - user.passwordReset.lastAttempt.getTime() < 60 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          error: 'Too many password reset attempts. Please try again in 1 hour.'
        });
      }

      // Generate reset token
      const resetToken = user.generatePasswordResetToken();
      user.passwordReset.lastAttempt = new Date();
      user.passwordReset.attempts = (user.passwordReset.attempts || 0) + 1;
      
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(user.email, resetToken, user.profile.firstName);

      res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Validate password
      if (!this.isValidPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long and contain letters and numbers'
        });
      }

      // Find user with reset token
      const user = await User.findOne({
        'passwordReset.token': token,
        'passwordReset.expires': { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Update password
      user.password = newPassword;
      user.passwordReset.token = undefined;
      user.passwordReset.expires = undefined;
      user.passwordReset.attempts = 0;

      await user.save();

      // Invalidate all existing sessions
      await databaseManager.redisClient.del(`refresh_token:${user._id}`);

      res.json({
        success: true,
        message: 'Password reset successful'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Password reset failed'
      });
    }
  }

  /**
   * Change Password (for authenticated users)
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Validate new password
      if (!this.isValidPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 8 characters long and contain letters and numbers'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Password change failed'
      });
    }
  }

  /**
   * Get Current User Profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: this.sanitizeUserData(user)
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user profile'
      });
    }
  }

  // Helper Methods

  validateRegistrationData({ email, username, password, firstName, lastName }) {
    const errors = [];

    if (!email || !validator.isEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!username || username.length < 3 || username.length > 30) {
      errors.push('Username must be between 3 and 30 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (!this.isValidPassword(password)) {
      errors.push('Password must be at least 8 characters long and contain letters and numbers');
    }

    if (firstName && (typeof firstName !== 'string' || firstName.length > 50)) {
      errors.push('First name must be a string with maximum 50 characters');
    }

    if (lastName && (typeof lastName !== 'string' || lastName.length > 50)) {
      errors.push('Last name must be a string with maximum 50 characters');
    }

    return errors;
  }

  isValidPassword(password) {
    return password && 
           password.length >= 8 && 
           /[a-zA-Z]/.test(password) && 
           /[0-9]/.test(password);
  }

  sanitizeUserData(user) {
    const userObj = user.toJSON();
    delete userObj.password;
    delete userObj.verification.emailVerificationToken;
    delete userObj.passwordReset;
    delete userObj.loginHistory;
    return userObj;
  }

  async trackLogin(req, userId, success) {
    try {
      const loginData = {
        timestamp: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        success
      };

      await User.findByIdAndUpdate(userId, {
        $push: {
          loginHistory: {
            $each: [loginData],
            $slice: -10 // Keep only last 10 login records
          }
        }
      });
    } catch (error) {
      console.error('Failed to track login:', error);
    }
  }
}

module.exports = new AuthController();
