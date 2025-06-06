/**
 * Bridge AI+BCI Platform - Email Service
 * Comprehensive email service using Nodemailer with templates for all notifications
 */

const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.init();
  }

  /**
   * Initialize email service and templates
   */
  async init() {
    try {
      // Configure email transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log('📧 Email service initialized successfully');

      // Load email templates
      await this.loadTemplates();
    } catch (error) {
      console.error('Email service initialization failed:', error);
    }
  }

  /**
   * Load all email templates
   */
  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/emails');
      
      const templateFiles = [
        'welcome.hbs',
        'verification.hbs',
        'password-reset.hbs',
        'subscription-welcome.hbs',
        'payment-failed.hbs',
        'training-reminder.hbs',
        'weekly-report.hbs',
        'achievement-unlock.hbs'
      ];

      for (const file of templateFiles) {
        try {
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const templateName = file.replace('.hbs', '');
          
          this.templates.set(templateName, handlebars.compile(templateContent));
          console.log(`✅ Loaded email template: ${templateName}`);
        } catch (fileError) {
          console.warn(`⚠️ Could not load template ${file}:`, fileError.message);
          // Create fallback template
          this.createFallbackTemplate(file.replace('.hbs', ''));
        }
      }
    } catch (error) {
      console.error('Error loading email templates:', error);
      this.createFallbackTemplates();
    }
  }

  /**
   * Create fallback templates if files are missing
   */
  createFallbackTemplates() {
    // Welcome email template
    this.templates.set('welcome', handlebars.compile(`
      <div style="font-family: 'SF Pro Display', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1445;">
        <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 40px 30px; text-align: center;">
          <h1 style="color: #0c1445; margin: 0; font-size: 32px; font-weight: bold;">Welcome to Bridge!</h1>
          <p style="color: #0c1445; margin: 16px 0 0; font-size: 18px;">🧠 Your Neural Communication Journey Begins</p>
        </div>
        <div style="padding: 40px 30px; color: white;">
          <h2 style="color: #fbbf24; margin-bottom: 20px;">Hello {{firstName}},</h2>
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Welcome to Bridge, the world's first AI+BCI platform for neural communication training!
          </p>
          <p style="line-height: 1.6; margin-bottom: 20px;">
            You're now part of an exclusive community pioneering the future of human communication through neuroscience and artificial intelligence.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #fbbf24; color: #0c1445; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Start Your Neural Training
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
            Best regards,<br>The Bridge Team
          </p>
        </div>
      </div>
    `));

    // Email verification template
    this.templates.set('verification', handlebars.compile(`
      <div style="font-family: 'SF Pro Display', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1445;">
        <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 40px 30px; text-align: center;">
          <h1 style="color: #0c1445; margin: 0; font-size: 28px; font-weight: bold;">Verify Your Email</h1>
          <p style="color: #0c1445; margin: 16px 0 0; font-size: 16px;">🔐 Secure Your Bridge Account</p>
        </div>
        <div style="padding: 40px 30px; color: white;">
          <h2 style="color: #fbbf24; margin-bottom: 20px;">Hello {{firstName}},</h2>
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Please verify your email address to complete your Bridge account setup and start your neural training journey.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verificationUrl}}" style="background: #fbbf24; color: #0c1445; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">
            This verification link will expire in 24 hours. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `));

    // Add other fallback templates...
    console.log('📧 Fallback email templates created');
  }

  /**
   * Create a specific fallback template
   */
  createFallbackTemplate(templateName) {
    const fallbackTemplate = handlebars.compile(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #fbbf24;">Bridge AI+BCI Platform</h1>
        <p>{{message}}</p>
        <p style="color: #666; font-size: 12px;">
          This is an automated message from Bridge. Please do not reply to this email.
        </p>
      </div>
    `);
    
    this.templates.set(templateName, fallbackTemplate);
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(email, firstName) {
    try {
      const template = this.templates.get('welcome');
      const html = template({
        firstName: firstName || 'Neural Pioneer',
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
        supportUrl: `${process.env.FRONTEND_URL}/support`
      });

      await this.sendEmail({
        to: email,
        subject: '🧠 Welcome to Bridge - Your Neural Journey Starts Now!',
        html
      });

      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email, token, firstName) {
    try {
      const template = this.templates.get('verification');
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
      
      const html = template({
        firstName: firstName || 'User',
        verificationUrl
      });

      await this.sendEmail({
        to: email,
        subject: '🔐 Verify Your Bridge Account Email',
        html
      });

      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, token, firstName) {
    try {
      const template = this.templates.get('password-reset') || this.templates.get('verification');
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      
      const html = template({
        firstName: firstName || 'User',
        resetUrl,
        verificationUrl: resetUrl // fallback for shared template
      });

      await this.sendEmail({
        to: email,
        subject: '🔑 Reset Your Bridge Password',
        html
      });

      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  /**
   * Send subscription welcome email
   */
  async sendSubscriptionWelcomeEmail(email, firstName, planName) {
    try {
      const template = this.templates.get('subscription-welcome') || this.templates.get('welcome');
      
      const html = template({
        firstName: firstName || 'User',
        planName,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
        featuresUrl: `${process.env.FRONTEND_URL}/features/${planName.toLowerCase()}`
      });

      await this.sendEmail({
        to: email,
        subject: `🎉 Welcome to Bridge ${planName} - Premium Neural Training Unlocked!`,
        html
      });

      console.log(`Subscription welcome email sent to ${email} for ${planName}`);
    } catch (error) {
      console.error('Failed to send subscription welcome email:', error);
      throw error;
    }
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailedEmail(email, firstName, invoiceUrl) {
    try {
      const template = this.templates.get('payment-failed') || handlebars.compile(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">Payment Issue - Bridge Subscription</h1>
          <p>Hello {{firstName}},</p>
          <p>We had trouble processing your payment for your Bridge subscription.</p>
          <p>Please update your payment method to continue enjoying premium neural training features.</p>
          <a href="{{invoiceUrl}}" style="background: #fbbf24; color: #0c1445; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Update Payment Method
          </a>
        </div>
      `);
      
      const html = template({
        firstName: firstName || 'User',
        invoiceUrl,
        supportUrl: `${process.env.FRONTEND_URL}/support`
      });

      await this.sendEmail({
        to: email,
        subject: '⚠️ Payment Issue - Bridge Subscription',
        html
      });

      console.log(`Payment failed email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send payment failed email:', error);
      throw error;
    }
  }

  /**
   * Send training reminder email
   */
  async sendTrainingReminderEmail(email, firstName, streakDays, missedDays) {
    try {
      const template = this.templates.get('training-reminder') || handlebars.compile(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #fbbf24;">🧠 Your Neural Training Awaits</h1>
          <p>Hello {{firstName}},</p>
          <p>Your brain is ready for more communication training! {{#if streakDays}}
            You had a {{streakDays}}-day training streak - let's keep the momentum going!
          {{else}}
            It's been {{missedDays}} days since your last session. Your neural pathways are waiting!
          {{/if}}</p>
          <a href="{{trainingUrl}}" style="background: #fbbf24; color: #0c1445; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Start Training Session
          </a>
        </div>
      `);
      
      const html = template({
        firstName: firstName || 'User',
        streakDays: streakDays > 0 ? streakDays : null,
        missedDays,
        trainingUrl: `${process.env.FRONTEND_URL}/training`
      });

      await this.sendEmail({
        to: email,
        subject: '🧠 Time for Your Neural Training Session',
        html
      });

      console.log(`Training reminder sent to ${email}`);
    } catch (error) {
      console.error('Failed to send training reminder:', error);
      throw error;
    }
  }

  /**
   * Send weekly progress report
   */
  async sendWeeklyReportEmail(email, firstName, weeklyStats) {
    try {
      const template = this.templates.get('weekly-report') || handlebars.compile(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #fbbf24;">📊 Your Weekly Neural Progress</h1>
          <p>Hello {{firstName}},</p>
          <p>Here's your neural training progress for this week:</p>
          <ul>
            <li>Training Sessions: {{sessions}}</li>
            <li>Total Training Time: {{totalTime}} minutes</li>
            <li>Average Stress Reduction: {{stressReduction}}%</li>
            <li>Average Empathy Improvement: {{empathyGain}}%</li>
          </ul>
          <a href="{{dashboardUrl}}" style="background: #fbbf24; color: #0c1445; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Full Dashboard
          </a>
        </div>
      `);
      
      const html = template({
        firstName: firstName || 'User',
        sessions: weeklyStats.sessions,
        totalTime: weeklyStats.totalTime,
        stressReduction: weeklyStats.stressReduction,
        empathyGain: weeklyStats.empathyGain,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`
      });

      await this.sendEmail({
        to: email,
        subject: '📊 Your Weekly Neural Training Report',
        html
      });

      console.log(`Weekly report sent to ${email}`);
    } catch (error) {
      console.error('Failed to send weekly report:', error);
      throw error;
    }
  }

  /**
   * Send achievement unlock notification
   */
  async sendAchievementEmail(email, firstName, achievement) {
    try {
      const template = this.templates.get('achievement-unlock') || handlebars.compile(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #fbbf24;">🏆 Achievement Unlocked!</h1>
          <p>Hello {{firstName}},</p>
          <p>Congratulations! You've unlocked a new achievement:</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #fbbf24; margin: 0;">{{title}}</h2>
            <p style="margin: 10px 0 0;">{{description}}</p>
            <span style="background: #fbbf24; color: #0c1445; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
              {{level}}
            </span>
          </div>
          <a href="{{achievementsUrl}}" style="background: #fbbf24; color: #0c1445; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View All Achievements
          </a>
        </div>
      `);
      
      const html = template({
        firstName: firstName || 'User',
        title: achievement.title,
        description: achievement.description,
        level: achievement.level,
        achievementsUrl: `${process.env.FRONTEND_URL}/dashboard?tab=achievements`
      });

      await this.sendEmail({
        to: email,
        subject: `🏆 Achievement Unlocked: ${achievement.title}`,
        html
      });

      console.log(`Achievement email sent to ${email}: ${achievement.title}`);
    } catch (error) {
      console.error('Failed to send achievement email:', error);
      throw error;
    }
  }

  /**
   * Send custom notification email
   */
  async sendNotificationEmail(email, subject, message, firstName) {
    try {
      const template = handlebars.compile(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #fbbf24;">Bridge Notification</h1>
          <p>Hello {{firstName}},</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
            {{{message}}}
          </div>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Bridge. If you have questions, visit our support center.
          </p>
        </div>
      `);
      
      const html = template({
        firstName: firstName || 'User',
        message
      });

      await this.sendEmail({
        to: email,
        subject: subject,
        html
      });

      console.log(`Notification email sent to ${email}: ${subject}`);
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error;
    }
  }

  /**
   * Core email sending method
   */
  async sendEmail({ to, subject, html, text, attachments }) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const mailOptions = {
        from: {
          name: 'Bridge AI+BCI Platform',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Convert HTML to plain text (basic implementation)
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Send bulk emails (for newsletters, announcements)
   */
  async sendBulkEmail(recipients, subject, template, templateData) {
    try {
      const promises = recipients.map(recipient => {
        const personalizedData = {
          ...templateData,
          firstName: recipient.firstName,
          email: recipient.email
        };

        const html = template(personalizedData);
        
        return this.sendEmail({
          to: recipient.email,
          subject: subject,
          html
        }).catch(error => {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          return { error: error.message, email: recipient.email };
        });
      });

      const results = await Promise.all(promises);
      const successful = results.filter(result => !result.error).length;
      const failed = results.filter(result => result.error);

      console.log(`Bulk email completed: ${successful} successful, ${failed.length} failed`);
      return { successful, failed };
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      throw error;
    }
  }

  /**
   * Get email service status
   */
  async getStatus() {
    try {
      if (!this.transporter) {
        return { status: 'disconnected', error: 'Transporter not initialized' };
      }

      await this.transporter.verify();
      return {
        status: 'connected',
        templatesLoaded: this.templates.size,
        availableTemplates: Array.from(this.templates.keys())
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
