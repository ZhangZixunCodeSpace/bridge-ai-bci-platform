/**
 * Bridge AI+BCI Platform - Subscription Controller
 * Stripe payment integration and subscription management
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { databaseManager } = require('../config/database');

class SubscriptionController {
  constructor() {
    this.plans = {
      free: {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        currency: 'usd',
        interval: 'month',
        features: {
          maxSessionsPerMonth: 5,
          advancedAnalytics: false,
          aiCoachAccess: false,
          customScenarios: false,
          prioritySupport: false,
          exportData: false
        }
      },
      basic: {
        id: 'basic',
        name: 'Basic Plan',
        price: 999, // $9.99 in cents
        currency: 'usd',
        interval: 'month',
        stripeProductId: process.env.STRIPE_BASIC_PRODUCT_ID,
        stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
        features: {
          maxSessionsPerMonth: 25,
          advancedAnalytics: true,
          aiCoachAccess: false,
          customScenarios: false,
          prioritySupport: false,
          exportData: true
        }
      },
      pro: {
        id: 'pro',
        name: 'Pro Plan',
        price: 1999, // $19.99 in cents
        currency: 'usd',
        interval: 'month',
        stripeProductId: process.env.STRIPE_PRO_PRODUCT_ID,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
        features: {
          maxSessionsPerMonth: 100,
          advancedAnalytics: true,
          aiCoachAccess: true,
          customScenarios: true,
          prioritySupport: false,
          exportData: true
        }
      },
      premium: {
        id: 'premium',
        name: 'Premium Plan',
        price: 4999, // $49.99 in cents
        currency: 'usd',
        interval: 'month',
        stripeProductId: process.env.STRIPE_PREMIUM_PRODUCT_ID,
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
        features: {
          maxSessionsPerMonth: -1, // unlimited
          advancedAnalytics: true,
          aiCoachAccess: true,
          customScenarios: true,
          prioritySupport: true,
          exportData: true
        }
      }
    };
  }

  /**
   * Get available subscription plans
   */
  async getPlans(req, res) {
    try {
      const plansWithPricing = Object.values(this.plans).map(plan => ({
        ...plan,
        priceFormatted: plan.price === 0 ? 'Free' : `$${(plan.price / 100).toFixed(2)}`,
        isCurrentPlan: req.user ? req.user.plan === plan.id : false
      }));

      res.json({
        success: true,
        data: {
          plans: plansWithPricing
        }
      });
    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve subscription plans'
      });
    }
  }

  /**
   * Create checkout session for subscription
   */
  async createCheckoutSession(req, res) {
    try {
      const { planId, successUrl, cancelUrl } = req.body;
      const userId = req.user.userId;

      // Validate plan
      const plan = this.plans[planId];
      if (!plan || planId === 'free') {
        return res.status(400).json({
          success: false,
          error: 'Invalid subscription plan'
        });
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Create or get Stripe customer
      let customerId = user.subscription.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.fullName,
          metadata: {
            userId: user._id.toString(),
            username: user.username
          }
        });
        customerId = customer.id;
        
        // Update user with customer ID
        user.subscription.stripeCustomerId = customerId;
        await user.save();
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
        metadata: {
          userId: user._id.toString(),
          planId: planId
        },
        subscription_data: {
          metadata: {
            userId: user._id.toString(),
            planId: planId
          }
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        customer_update: {
          address: 'auto',
          name: 'auto'
        }
      });

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url
        }
      });

    } catch (error) {
      console.error('Create checkout session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create checkout session'
      });
    }
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(req, res) {
    try {
      const userId = req.user.userId;
      const { returnUrl } = req.body;

      const user = await User.findById(userId);
      if (!user || !user.subscription.stripeCustomerId) {
        return res.status(400).json({
          success: false,
          error: 'No active subscription found'
        });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.subscription.stripeCustomerId,
        return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
      });

      res.json({
        success: true,
        data: {
          url: portalSession.url
        }
      });

    } catch (error) {
      console.error('Create portal session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create billing portal session'
      });
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const currentPlan = this.plans[user.subscription.plan];
      const subscriptionData = {
        plan: user.subscription.plan,
        status: user.subscription.status,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        trialEndsAt: user.subscription.trialEndsAt,
        cancelledAt: user.subscription.cancelledAt,
        features: currentPlan.features,
        usage: await this.getUserUsage(userId)
      };

      // Get latest subscription info from Stripe if available
      if (user.subscription.stripeSubscriptionId) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            user.subscription.stripeSubscriptionId
          );
          
          subscriptionData.stripeStatus = stripeSubscription.status;
          subscriptionData.nextPayment = new Date(stripeSubscription.current_period_end * 1000);
        } catch (stripeError) {
          console.error('Error fetching Stripe subscription:', stripeError);
        }
      }

      res.json({
        success: true,
        data: subscriptionData
      });

    } catch (error) {
      console.error('Get subscription status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve subscription status'
      });
    }
  }

  /**
   * Get user usage statistics
   */
  async getUserUsage(userId) {
    try {
      const user = await User.findById(userId);
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      // Get session count for current month
      const sessionCount = await databaseManager.redisClient.get(`usage:sessions:${userId}:${currentMonth.getTime()}`);
      
      return {
        currentMonth: {
          sessions: parseInt(sessionCount) || 0,
          resetDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        },
        allTime: {
          sessions: user.bciProfile.stats.totalSessions,
          trainingTime: user.bciProfile.stats.totalTrainingTime
        }
      };
    } catch (error) {
      console.error('Error getting user usage:', error);
      return {
        currentMonth: { sessions: 0 },
        allTime: { sessions: 0, trainingTime: 0 }
      };
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancelled(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  }

  /**
   * Handle successful checkout
   */
  async handleCheckoutCompleted(session) {
    const userId = session.metadata.userId;
    const planId = session.metadata.planId;

    if (!userId || !planId) {
      console.error('Missing metadata in checkout session');
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    // Update user subscription
    const plan = this.plans[planId];
    user.subscription.plan = planId;
    user.subscription.status = 'active';
    user.subscription.stripeCustomerId = session.customer;
    user.subscription.features = { ...plan.features };

    if (session.subscription) {
      user.subscription.stripeSubscriptionId = session.subscription;
    }

    await user.save();

    // Send welcome email for paid plans
    if (planId !== 'free') {
      try {
        await emailService.sendSubscriptionWelcomeEmail(
          user.email,
          user.profile.firstName,
          plan.name
        );
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    console.log(`Subscription activated for user ${userId}: ${planId}`);
  }

  /**
   * Handle subscription updates
   */
  async handleSubscriptionUpdate(subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Update subscription details
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.stripeSubscriptionId = subscription.id;

    // Handle cancellation
    if (subscription.cancel_at_period_end) {
      user.subscription.cancelledAt = new Date();
    } else {
      user.subscription.cancelledAt = undefined;
    }

    await user.save();
    console.log(`Subscription updated for user ${userId}`);
  }

  /**
   * Handle subscription cancellation
   */
  async handleSubscriptionCancelled(subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Downgrade to free plan
    user.subscription.plan = 'free';
    user.subscription.status = 'cancelled';
    user.subscription.features = { ...this.plans.free.features };
    user.subscription.cancelledAt = new Date();

    await user.save();
    console.log(`Subscription cancelled for user ${userId}`);
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    // Reset usage counters for new billing period
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    await databaseManager.redisClient.del(`usage:sessions:${user._id}:${currentMonth.getTime()}`);

    console.log(`Payment succeeded for user ${user._id}`);
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(invoice) {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    // Update subscription status
    user.subscription.status = 'past_due';
    await user.save();

    // Send payment failed notification
    try {
      await emailService.sendPaymentFailedEmail(
        user.email,
        user.profile.firstName,
        invoice.hosted_invoice_url
      );
    } catch (emailError) {
      console.error('Failed to send payment failed email:', emailError);
    }

    console.log(`Payment failed for user ${user._id}`);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { reason, feedback } = req.body;

      const user = await User.findById(userId);
      if (!user || !user.subscription.stripeSubscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'No active subscription found'
        });
      }

      // Cancel at period end to allow access until paid period expires
      await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: reason || 'user_request',
          cancellation_feedback: feedback || ''
        }
      });

      user.subscription.cancelledAt = new Date();
      await user.save();

      // Log cancellation for analytics
      await databaseManager.redisClient.lPush('cancellations', JSON.stringify({
        userId: user._id,
        plan: user.subscription.plan,
        reason,
        feedback,
        timestamp: new Date()
      }));

      res.json({
        success: true,
        message: 'Subscription will be cancelled at the end of the current billing period'
      });

    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription'
      });
    }
  }

  /**
   * Check usage limits
   */
  async checkUsageLimit(userId, action) {
    try {
      const user = await User.findById(userId);
      if (!user) return { allowed: false, reason: 'User not found' };

      const plan = this.plans[user.subscription.plan];
      if (!plan) return { allowed: false, reason: 'Invalid plan' };

      // Check subscription status
      if (user.subscription.status !== 'active' && user.subscription.plan !== 'free') {
        return { allowed: false, reason: 'Subscription inactive' };
      }

      // Check specific action limits
      switch (action) {
        case 'training_session':
          return await this.checkSessionLimit(userId, plan);
        case 'advanced_analytics':
          return { allowed: plan.features.advancedAnalytics, reason: 'Plan upgrade required' };
        case 'ai_coach':
          return { allowed: plan.features.aiCoachAccess, reason: 'Plan upgrade required' };
        case 'custom_scenarios':
          return { allowed: plan.features.customScenarios, reason: 'Plan upgrade required' };
        default:
          return { allowed: true };
      }
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return { allowed: false, reason: 'System error' };
    }
  }

  /**
   * Check session limit for current month
   */
  async checkSessionLimit(userId, plan) {
    if (plan.features.maxSessionsPerMonth === -1) {
      return { allowed: true }; // Unlimited
    }

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const sessionCount = await databaseManager.redisClient.get(
      `usage:sessions:${userId}:${currentMonth.getTime()}`
    );

    const usedSessions = parseInt(sessionCount) || 0;
    const allowed = usedSessions < plan.features.maxSessionsPerMonth;

    return {
      allowed,
      reason: allowed ? null : 'Monthly session limit reached',
      usage: {
        used: usedSessions,
        limit: plan.features.maxSessionsPerMonth,
        resetDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    };
  }

  /**
   * Increment usage counter
   */
  async incrementUsage(userId, action) {
    try {
      if (action === 'training_session') {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        await databaseManager.redisClient.incr(
          `usage:sessions:${userId}:${currentMonth.getTime()}`
        );

        // Set expiry for automatic cleanup
        await databaseManager.redisClient.expire(
          `usage:sessions:${userId}:${currentMonth.getTime()}`,
          60 * 60 * 24 * 35 // 35 days
        );
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }
}

module.exports = new SubscriptionController();
