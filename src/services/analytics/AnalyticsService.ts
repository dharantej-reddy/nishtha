import { Analytics } from '../../models/Analytics';
import { User } from '../../models/User';
import { PlaceOfWorship } from '../../models/PlaceOfWorship';
import { LiveEvent } from '../../models/LiveEvent';
import { logger } from '../../utils/logger';
import { config } from '../../config/config';
import Redis from 'ioredis';
import moment from 'moment';

interface EventData {
  userId?: string;
  sessionId?: string;
  entityType?: string;
  entityId?: string;
  properties?: any;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    coordinates?: [number, number];
  };
  device?: {
    platform?: string;
    version?: string;
    model?: string;
  };
  timestamp?: Date;
}

interface AnalyticsQuery {
  eventType?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  groupBy?: string;
  limit?: number;
}

export class AnalyticsService {
  private static redis: Redis;
  private static isInitialized = false;

  /**
   * Initialize analytics service
   */
  static async initialize(): Promise<void> {
    try {
      this.redis = new Redis(config.redisUrl);
      this.isInitialized = true;
      logger.info('✅ Analytics service initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize analytics service:', error);
      throw error;
    }
  }

  /**
   * Track a single event
   */
  static async trackEvent(
    eventType: string, 
    data: EventData = {},
    skipDatabase = false
  ): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const eventData = {
        eventType,
        timestamp: data.timestamp || new Date(),
        userId: data.userId,
        sessionId: data.sessionId,
        entityType: data.entityType,
        entityId: data.entityId,
        properties: data.properties || {},
        location: data.location,
        device: data.device
      };

      // Store in Redis for real-time analytics
      await this.storeInRedis(eventType, eventData);

      // Store in database for historical analytics (if not skipped)
      if (!skipDatabase) {
        await this.storeInDatabase(eventData);
      }

      // Update real-time counters
      await this.updateCounters(eventType, eventData);

      logger.debug(`Event tracked: ${eventType} for user ${data.userId}`);
    } catch (error) {
      logger.error('Error tracking event:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Track multiple events in batch
   */
  static async trackEvents(events: Array<{ eventType: string; data: EventData }>): Promise<void> {
    try {
      const timestamp = new Date();
      const batch = events.map(({ eventType, data }) => ({
        eventType,
        timestamp,
        userId: data.userId,
        sessionId: data.sessionId,
        entityType: data.entityType,
        entityId: data.entityId,
        properties: data.properties || {},
        location: data.location,
        device: data.device
      }));

      // Store in database
      await Analytics.insertMany(batch);

      // Store in Redis for real-time analytics
      for (const event of batch) {
        await this.storeInRedis(event.eventType, event);
        await this.updateCounters(event.eventType, event);
      }

      logger.debug(`Batch tracked: ${events.length} events`);
    } catch (error) {
      logger.error('Error tracking batch events:', error);
    }
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(userId: string, period = '30d'): Promise<any> {
    try {
      const startDate = this.getPeriodStartDate(period);
      const endDate = new Date();

      const [
        totalEvents,
        eventsByType,
        dailyActivity,
        deviceInfo,
        locationInfo
      ] = await Promise.all([
        this.getTotalEvents({ userId, startDate, endDate }),
        this.getEventsByType({ userId, startDate, endDate }),
        this.getDailyActivity({ userId, startDate, endDate }),
        this.getDeviceInfo({ userId, startDate, endDate }),
        this.getLocationInfo({ userId, startDate, endDate })
      ]);

      return {
        period,
        totalEvents,
        eventsByType,
        dailyActivity,
        deviceInfo,
        locationInfo,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error getting user analytics:', error);
      return null;
    }
  }

  /**
   * Get entity analytics (places, events, etc.)
   */
  static async getEntityAnalytics(
    entityType: string, 
    entityId: string, 
    period = '30d'
  ): Promise<any> {
    try {
      const startDate = this.getPeriodStartDate(period);
      const endDate = new Date();

      const [
        totalEvents,
        eventsByType,
        dailyActivity,
        uniqueUsers,
        topEvents
      ] = await Promise.all([
        this.getTotalEvents({ entityType, entityId, startDate, endDate }),
        this.getEventsByType({ entityType, entityId, startDate, endDate }),
        this.getDailyActivity({ entityType, entityId, startDate, endDate }),
        this.getUniqueUsers({ entityType, entityId, startDate, endDate }),
        this.getTopEvents({ entityType, entityId, startDate, endDate, limit: 10 })
      ]);

      return {
        period,
        entityType,
        entityId,
        totalEvents,
        eventsByType,
        dailyActivity,
        uniqueUsers,
        topEvents,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error getting entity analytics:', error);
      return null;
    }
  }

  /**
   * Get app-wide analytics
   */
  static async getAppAnalytics(period = '30d'): Promise<any> {
    try {
      const startDate = this.getPeriodStartDate(period);
      const endDate = new Date();

      const [
        totalEvents,
        totalUsers,
        activeUsers,
        eventsByType,
        dailyActivity,
        topPlaces,
        topEvents,
        userGrowth
      ] = await Promise.all([
        this.getTotalEvents({ startDate, endDate }),
        this.getTotalUsers(),
        this.getActiveUsers({ startDate, endDate }),
        this.getEventsByType({ startDate, endDate }),
        this.getDailyActivity({ startDate, endDate }),
        this.getTopPlaces({ startDate, endDate, limit: 10 }),
        this.getTopEvents({ startDate, endDate, limit: 10 }),
        this.getUserGrowth({ startDate, endDate })
      ]);

      return {
        period,
        totalEvents,
        totalUsers,
        activeUsers,
        eventsByType,
        dailyActivity,
        topPlaces,
        topEvents,
        userGrowth,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error getting app analytics:', error);
      return null;
    }
  }

  /**
   * Get real-time analytics from Redis
   */
  static async getRealTimeAnalytics(): Promise<any> {
    try {
      const pipeline = this.redis.pipeline();
      
      // Get current hour counters
      const currentHour = moment().format('YYYY-MM-DD-HH');
      const keys = [
        `analytics:events:${currentHour}`,
        `analytics:users:${currentHour}`,
        `analytics:live_streams:${currentHour}`,
        `analytics:bookings:${currentHour}`,
        `analytics:donations:${currentHour}`
      ];

      keys.forEach(key => pipeline.hgetall(key));
      const results = await pipeline.exec();

      const realTimeData = {
        currentHour,
        events: results[0][1] || {},
        users: results[1][1] || {},
        liveStreams: results[2][1] || {},
        bookings: results[3][1] || {},
        donations: results[4][1] || {},
        generatedAt: new Date()
      };

      return realTimeData;
    } catch (error) {
      logger.error('Error getting real-time analytics:', error);
      return null;
    }
  }

  /**
   * Get recent activities for a user
   */
  static async getRecentActivities(userId: string, limit = 20): Promise<any[]> {
    try {
      const activities = await Analytics.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .select('eventType entityType entityId properties timestamp')
        .lean();

      return activities.map(activity => ({
        ...activity,
        description: this.getActivityDescription(activity)
      }));
    } catch (error) {
      logger.error('Error getting recent activities:', error);
      return [];
    }
  }

  /**
   * Generate insights from analytics data
   */
  static async generateInsights(userId?: string, period = '30d'): Promise<any> {
    try {
      const startDate = this.getPeriodStartDate(period);
      const endDate = new Date();

      const insights = [];

      // User engagement insights
      if (userId) {
        const userInsights = await this.generateUserInsights(userId, startDate, endDate);
        insights.push(...userInsights);
      } else {
        const appInsights = await this.generateAppInsights(startDate, endDate);
        insights.push(...appInsights);
      }

      return {
        period,
        insights,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error generating insights:', error);
      return { insights: [] };
    }
  }

  /**
   * Private helper methods
   */

  private static async storeInRedis(eventType: string, eventData: any): Promise<void> {
    try {
      const hour = moment(eventData.timestamp).format('YYYY-MM-DD-HH');
      const day = moment(eventData.timestamp).format('YYYY-MM-DD');

      // Store hourly counters
      const hourKey = `analytics:events:${hour}`;
      await this.redis.hincrby(hourKey, eventType, 1);
      await this.redis.expire(hourKey, 86400 * 7); // Keep for 7 days

      // Store daily counters
      const dayKey = `analytics:events:${day}`;
      await this.redis.hincrby(dayKey, eventType, 1);
      await this.redis.expire(dayKey, 86400 * 30); // Keep for 30 days

      // Store user activity
      if (eventData.userId) {
        const userKey = `analytics:users:${hour}`;
        await this.redis.sadd(userKey, eventData.userId);
        await this.redis.expire(userKey, 86400 * 7);
      }
    } catch (error) {
      logger.error('Error storing in Redis:', error);
    }
  }

  private static async storeInDatabase(eventData: any): Promise<void> {
    try {
      const analytics = new Analytics(eventData);
      await analytics.save();
    } catch (error) {
      logger.error('Error storing in database:', error);
    }
  }

  private static async updateCounters(eventType: string, eventData: any): Promise<void> {
    try {
      // Update specific counters based on event type
      switch (eventType) {
        case 'live_stream_view':
          await this.incrementLiveStreamCounter(eventData.entityId);
          break;
        case 'place_view':
          await this.incrementPlaceCounter(eventData.entityId, 'views');
          break;
        case 'place_follow':
          await this.incrementPlaceCounter(eventData.entityId, 'followers');
          break;
        case 'donation_made':
          await this.incrementDonationCounter(eventData.properties?.amount || 0);
          break;
      }
    } catch (error) {
      logger.error('Error updating counters:', error);
    }
  }

  private static async incrementLiveStreamCounter(eventId: string): Promise<void> {
    if (!eventId) return;
    
    const hour = moment().format('YYYY-MM-DD-HH');
    const key = `analytics:live_streams:${hour}`;
    await this.redis.hincrby(key, eventId, 1);
    await this.redis.expire(key, 86400);
  }

  private static async incrementPlaceCounter(placeId: string, type: string): Promise<void> {
    if (!placeId) return;
    
    const hour = moment().format('YYYY-MM-DD-HH');
    const key = `analytics:places:${hour}`;
    await this.redis.hincrby(key, `${placeId}:${type}`, 1);
    await this.redis.expire(key, 86400);
  }

  private static async incrementDonationCounter(amount: number): Promise<void> {
    const hour = moment().format('YYYY-MM-DD-HH');
    const key = `analytics:donations:${hour}`;
    await this.redis.hincrby(key, 'count', 1);
    await this.redis.hincrbyfloat(key, 'amount', amount);
    await this.redis.expire(key, 86400);
  }

  private static getPeriodStartDate(period: string): Date {
    const periodMap: { [key: string]: number } = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30,
      '90d': 24 * 90
    };

    const hours = periodMap[period] || 24 * 30;
    return moment().subtract(hours, 'hours').toDate();
  }

  private static async getTotalEvents(query: AnalyticsQuery): Promise<number> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.userId) filter.userId = query.userId;
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;
    if (query.eventType) filter.eventType = query.eventType;

    return await Analytics.countDocuments(filter);
  }

  private static async getEventsByType(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.userId) filter.userId = query.userId;
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: query.limit || 20 }
    ]);
  }

  private static async getDailyActivity(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.userId) filter.userId = query.userId;
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  private static async getUniqueUsers(query: AnalyticsQuery): Promise<number> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;

    const result = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$userId'
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    return result[0]?.count || 0;
  }

  private static async getTotalUsers(): Promise<number> {
    return await User.countDocuments({ isActive: true });
  }

  private static async getActiveUsers(query: AnalyticsQuery): Promise<number> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }

    const result = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$userId'
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    return result[0]?.count || 0;
  }

  private static async getTopPlaces(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = { entityType: 'place' };
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$entityId',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: query.limit || 10 },
      {
        $lookup: {
          from: 'placesofworship',
          localField: '_id',
          foreignField: '_id',
          as: 'place'
        }
      },
      { $unwind: { path: '$place', preserveNullAndEmptyArrays: true } }
    ]);
  }

  private static async getTopEvents(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = {};
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: query.limit || 10 }
    ]);
  }

  private static async getUserGrowth(query: AnalyticsQuery): Promise<any[]> {
    return await User.aggregate([
      {
        $match: {
          createdAt: { $gte: query.startDate, $lte: query.endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  private static async getDeviceInfo(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = { 'device.platform': { $exists: true } };
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.userId) filter.userId = query.userId;

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$device.platform',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  private static async getLocationInfo(query: AnalyticsQuery): Promise<any[]> {
    const filter: any = { 'location.country': { $exists: true } };
    
    if (query.startDate && query.endDate) {
      filter.timestamp = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.userId) filter.userId = query.userId;

    return await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }

  private static getActivityDescription(activity: any): string {
    const descriptions: { [key: string]: string } = {
      'profile_view': 'Viewed a profile',
      'place_view': 'Visited a place of worship',
      'live_stream_view': 'Watched a live stream',
      'booking_made': 'Made a service booking',
      'donation_made': 'Made a donation',
      'community_post': 'Posted in community',
      'marketplace_purchase': 'Purchased from marketplace',
      'user_follow': 'Followed a user',
      'place_follow': 'Followed a place',
    };

    return descriptions[activity.eventType] || activity.eventType;
  }

  private static async generateUserInsights(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<any[]> {
    const insights = [];

    // Most active day
    const dailyActivity = await this.getDailyActivity({ userId, startDate, endDate });
    if (dailyActivity.length > 0) {
      const mostActiveDay = dailyActivity.reduce((max, day) => 
        day.count > max.count ? day : max
      );
      insights.push({
        type: 'most_active_day',
        title: 'Most Active Day',
        description: `You were most active on ${mostActiveDay._id} with ${mostActiveDay.count} activities`,
        data: mostActiveDay
      });
    }

    // Favorite activity
    const eventsByType = await this.getEventsByType({ userId, startDate, endDate });
    if (eventsByType.length > 0) {
      const favoriteActivity = eventsByType[0];
      insights.push({
        type: 'favorite_activity',
        title: 'Favorite Activity',
        description: `Your most common activity is ${favoriteActivity._id} (${favoriteActivity.count} times)`,
        data: favoriteActivity
      });
    }

    return insights;
  }

  private static async generateAppInsights(startDate: Date, endDate: Date): Promise<any[]> {
    const insights = [];

    // Most popular feature
    const eventsByType = await this.getEventsByType({ startDate, endDate });
    if (eventsByType.length > 0) {
      const popularFeature = eventsByType[0];
      insights.push({
        type: 'popular_feature',
        title: 'Most Popular Feature',
        description: `${popularFeature._id} is the most used feature with ${popularFeature.count} uses`,
        data: popularFeature
      });
    }

    // User growth trend
    const userGrowth = await this.getUserGrowth({ startDate, endDate });
    if (userGrowth.length > 1) {
      const growthRate = ((userGrowth[userGrowth.length - 1].newUsers - userGrowth[0].newUsers) / userGrowth[0].newUsers) * 100;
      insights.push({
        type: 'user_growth',
        title: 'User Growth',
        description: `User growth rate: ${growthRate.toFixed(1)}% over the period`,
        data: { growthRate, userGrowth }
      });
    }

    return insights;
  }
}