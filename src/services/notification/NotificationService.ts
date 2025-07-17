import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { config } from '../../config/config';
import { logger } from '../../utils/logger';
import { User } from '../../models/User';
import { Notification } from '../../models/Notification';
import { Queue } from 'bull';
import Redis from 'ioredis';

interface NotificationData {
  userId: string;
  type: 'live_event' | 'booking_confirmation' | 'donation_received' | 'new_follower' | 'community_post' | 'marketplace_offer' | 'system' | 'reminder';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'normal' | 'high';
  scheduledFor?: Date;
  channels?: ('push' | 'email' | 'sms')[];
}

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: any;
}

interface BulkNotificationData {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  data?: any;
  channels?: ('push' | 'email' | 'sms')[];
}

export class NotificationService {
  private static emailTransporter: nodemailer.Transporter;
  private static notificationQueue: Queue;
  private static redis: Redis;

  /**
   * Initialize notification service
   */
  static async initialize(): Promise<void> {
    try {
      // Initialize email transporter
      this.emailTransporter = nodemailer.createTransporter({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword,
        },
      });

      // Initialize Redis for queue
      this.redis = new Redis(config.redisUrl);

      // Initialize notification queue
      this.notificationQueue = new Queue('notification processing', {
        redis: {
          host: config.redisHost,
          port: config.redisPort,
          password: config.redisPassword,
        },
      });

      // Process notification jobs
      this.notificationQueue.process('sendNotification', this.processNotification.bind(this));
      this.notificationQueue.process('sendBulkNotification', this.processBulkNotification.bind(this));
      this.notificationQueue.process('sendEmail', this.processEmail.bind(this));

      logger.info('✅ Notification service initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize notification service:', error);
      throw error;
    }
  }

  /**
   * Send notification to a user
   */
  static async sendNotification(notificationData: NotificationData): Promise<void> {
    try {
      // Save notification to database
      const notification = await this.saveNotification(notificationData);

      // Add to queue for processing
      await this.notificationQueue.add('sendNotification', {
        notificationId: notification._id,
        ...notificationData
      }, {
        priority: this.getPriority(notificationData.priority),
        delay: notificationData.scheduledFor 
          ? notificationData.scheduledFor.getTime() - Date.now() 
          : 0
      });

      logger.info(`Notification queued for user ${notificationData.userId}`);
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications to multiple users
   */
  static async sendBulkNotification(bulkData: BulkNotificationData): Promise<void> {
    try {
      // Split into chunks for better performance
      const chunkSize = 100;
      const chunks = this.chunkArray(bulkData.userIds, chunkSize);

      for (const chunk of chunks) {
        await this.notificationQueue.add('sendBulkNotification', {
          ...bulkData,
          userIds: chunk
        }, {
          priority: this.getPriority('normal')
        });
      }

      logger.info(`Bulk notification queued for ${bulkData.userIds.length} users`);
    } catch (error) {
      logger.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  static async sendEmail(emailData: EmailData): Promise<void> {
    try {
      await this.notificationQueue.add('sendEmail', emailData, {
        priority: this.getPriority('normal'),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      logger.info(`Email queued for ${emailData.to}`);
    } catch (error) {
      logger.error('Error queuing email:', error);
      throw error;
    }
  }

  /**
   * Process individual notification
   */
  private static async processNotification(job: any): Promise<void> {
    const { notificationId, userId, type, title, message, data, channels = ['push'] } = job.data;

    try {
      const user = await User.findById(userId).select('deviceTokens notificationSettings email phoneNumber');
      if (!user) {
        logger.warn(`User not found for notification: ${userId}`);
        return;
      }

      // Check user's notification preferences
      const preferences = user.notificationSettings;
      if (!this.shouldSendNotification(type, preferences)) {
        logger.info(`Notification skipped due to user preferences: ${userId}`);
        return;
      }

      // Send push notification
      if (channels.includes('push') && preferences.push && user.deviceTokens.length > 0) {
        await this.sendPushNotification(user.deviceTokens, title, message, data);
      }

      // Send email notification
      if (channels.includes('email') && preferences.email && user.email) {
        await this.sendEmailNotification(user.email, title, message, type, data);
      }

      // Send SMS notification (if implemented)
      if (channels.includes('sms') && preferences.sms && user.phoneNumber) {
        await this.sendSMSNotification(user.phoneNumber, message);
      }

      // Update notification status
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'sent',
        sentAt: new Date()
      });

      logger.info(`Notification sent successfully to user ${userId}`);
    } catch (error) {
      logger.error(`Error processing notification for user ${userId}:`, error);
      
      // Update notification status to failed
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'failed',
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Process bulk notifications
   */
  private static async processBulkNotification(job: any): Promise<void> {
    const { userIds, type, title, message, data, channels = ['push'] } = job.data;

    try {
      const users = await User.find({
        _id: { $in: userIds },
        isActive: true,
        isBlocked: false
      }).select('deviceTokens notificationSettings email phoneNumber');

      const pushTokens: string[] = [];
      const emailRecipients: string[] = [];
      const smsRecipients: string[] = [];

      // Collect recipients based on preferences
      for (const user of users) {
        const preferences = user.notificationSettings;
        
        if (!this.shouldSendNotification(type, preferences)) continue;

        if (channels.includes('push') && preferences.push && user.deviceTokens.length > 0) {
          pushTokens.push(...user.deviceTokens);
        }

        if (channels.includes('email') && preferences.email && user.email) {
          emailRecipients.push(user.email);
        }

        if (channels.includes('sms') && preferences.sms && user.phoneNumber) {
          smsRecipients.push(user.phoneNumber);
        }
      }

      // Send bulk push notifications
      if (pushTokens.length > 0) {
        await this.sendBulkPushNotification(pushTokens, title, message, data);
      }

      // Send bulk emails
      if (emailRecipients.length > 0) {
        await this.sendBulkEmail(emailRecipients, title, message, type, data);
      }

      // Send bulk SMS
      if (smsRecipients.length > 0) {
        await this.sendBulkSMS(smsRecipients, message);
      }

      logger.info(`Bulk notification processed for ${userIds.length} users`);
    } catch (error) {
      logger.error('Error processing bulk notification:', error);
      throw error;
    }
  }

  /**
   * Process email job
   */
  private static async processEmail(job: any): Promise<void> {
    const { to, subject, template, data } = job.data;

    try {
      const html = await this.generateEmailTemplate(template, data);
      
      await this.emailTransporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        html,
      });

      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Send push notification using Firebase
   */
  private static async sendPushNotification(
    tokens: string[], 
    title: string, 
    body: string, 
    data?: any
  ): Promise<void> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data ? JSON.stringify(data) : undefined,
        tokens: tokens.filter(token => token && token.length > 0),
      };

      if (message.tokens.length === 0) {
        logger.warn('No valid tokens for push notification');
        return;
      }

      const response = await admin.messaging().sendMulticast(message);
      
      if (response.failureCount > 0) {
        logger.warn(`Push notification failures: ${response.failureCount}/${response.responses.length}`);
        
        // Remove invalid tokens
        const invalidTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(tokens[idx]);
          }
        });

        if (invalidTokens.length > 0) {
          await this.removeInvalidTokens(invalidTokens);
        }
      }

      logger.info(`Push notification sent to ${response.successCount} devices`);
    } catch (error) {
      logger.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send bulk push notifications
   */
  private static async sendBulkPushNotification(
    tokens: string[], 
    title: string, 
    body: string, 
    data?: any
  ): Promise<void> {
    // Firebase has a limit of 500 tokens per request
    const chunkSize = 500;
    const chunks = this.chunkArray(tokens, chunkSize);

    for (const chunk of chunks) {
      await this.sendPushNotification(chunk, title, body, data);
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(
    email: string,
    title: string,
    message: string,
    type: string,
    data?: any
  ): Promise<void> {
    try {
      const template = this.getEmailTemplate(type);
      const html = await this.generateEmailTemplate(template, {
        title,
        message,
        ...data
      });

      await this.emailTransporter.sendMail({
        from: config.emailFrom,
        to: email,
        subject: title,
        html,
      });

      logger.info(`Email notification sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending email notification to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send bulk emails
   */
  private static async sendBulkEmail(
    emails: string[],
    title: string,
    message: string,
    type: string,
    data?: any
  ): Promise<void> {
    try {
      const template = this.getEmailTemplate(type);
      const html = await this.generateEmailTemplate(template, {
        title,
        message,
        ...data
      });

      // Send emails in batches to avoid rate limits
      const batchSize = 50;
      const batches = this.chunkArray(emails, batchSize);

      for (const batch of batches) {
        const promises = batch.map(email => 
          this.emailTransporter.sendMail({
            from: config.emailFrom,
            to: email,
            subject: title,
            html,
          })
        );

        await Promise.all(promises);
        
        // Add delay between batches
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      logger.info(`Bulk email sent to ${emails.length} recipients`);
    } catch (error) {
      logger.error('Error sending bulk email:', error);
      throw error;
    }
  }

  /**
   * Send SMS notification (placeholder - integrate with Twilio or similar)
   */
  private static async sendSMSNotification(phoneNumber: string, message: string): Promise<void> {
    try {
      // TODO: Integrate with Twilio or other SMS service
      logger.info(`SMS notification would be sent to ${phoneNumber}: ${message}`);
    } catch (error) {
      logger.error(`Error sending SMS to ${phoneNumber}:`, error);
      throw error;
    }
  }

  /**
   * Send bulk SMS notifications
   */
  private static async sendBulkSMS(phoneNumbers: string[], message: string): Promise<void> {
    try {
      // TODO: Implement bulk SMS sending
      logger.info(`Bulk SMS would be sent to ${phoneNumbers.length} numbers`);
    } catch (error) {
      logger.error('Error sending bulk SMS:', error);
      throw error;
    }
  }

  /**
   * Save notification to database
   */
  private static async saveNotification(notificationData: NotificationData): Promise<any> {
    const notification = new Notification({
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
      priority: notificationData.priority || 'normal',
      scheduledFor: notificationData.scheduledFor,
      status: 'pending'
    });

    return await notification.save();
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  private static shouldSendNotification(type: string, preferences: any): boolean {
    const typeMapping: { [key: string]: string } = {
      'live_event': 'liveEvents',
      'booking_confirmation': 'bookingReminders',
      'booking_reminder': 'bookingReminders',
      'community_post': 'communityUpdates',
      'marketplace_offer': 'marketplaceOffers',
      'donation_received': 'donationUpdates',
      'new_follower': 'communityUpdates',
    };

    const preferenceKey = typeMapping[type];
    return preferenceKey ? preferences[preferenceKey] : true;
  }

  /**
   * Get email template for notification type
   */
  private static getEmailTemplate(type: string): string {
    const templates: { [key: string]: string } = {
      'live_event': 'live-event',
      'booking_confirmation': 'booking-confirmation',
      'donation_received': 'donation-received',
      'new_follower': 'new-follower',
      'community_post': 'community-post',
      'marketplace_offer': 'marketplace-offer',
      'system': 'system-notification',
      'reminder': 'reminder'
    };

    return templates[type] || 'default';
  }

  /**
   * Generate email HTML from template
   */
  private static async generateEmailTemplate(template: string, data: any): Promise<string> {
    // Simple template replacement - in production, use a proper template engine
    const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{title}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B5A3C; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #8B5A3C; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SacredConnect</h1>
          </div>
          <div class="content">
            <h2>{{title}}</h2>
            <p>{{message}}</p>
            {{content}}
          </div>
          <div class="footer">
            <p>© 2024 SacredConnect. All rights reserved.</p>
            <p>You received this email because you're subscribed to SacredConnect notifications.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    let html = baseTemplate;
    
    // Replace placeholders
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key] || '');
    });

    return html;
  }

  /**
   * Remove invalid device tokens
   */
  private static async removeInvalidTokens(invalidTokens: string[]): Promise<void> {
    try {
      await User.updateMany(
        { deviceTokens: { $in: invalidTokens } },
        { $pullAll: { deviceTokens: invalidTokens } }
      );

      logger.info(`Removed ${invalidTokens.length} invalid device tokens`);
    } catch (error) {
      logger.error('Error removing invalid tokens:', error);
    }
  }

  /**
   * Get priority level for queue
   */
  private static getPriority(priority?: string): number {
    const priorities: { [key: string]: number } = {
      'low': 1,
      'normal': 5,
      'high': 10
    };

    return priorities[priority || 'normal'];
  }

  /**
   * Chunk array into smaller arrays
   */
  private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(userId?: string): Promise<any> {
    try {
      const matchStage = userId ? { userId } : {};
      
      const stats = await Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      return stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});
    } catch (error) {
      logger.error('Error getting notification stats:', error);
      return {};
    }
  }
}