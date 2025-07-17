import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { UploadService } from '../services/upload/UploadService';
import { NotificationService } from '../services/notification/NotificationService';
import { AnalyticsService } from '../services/analytics/AnalyticsService';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export class UserController {
  
  /**
   * Get user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || req.user?._id;
      
      const user = await User.findById(userId)
        .populate('followedPlaces', 'name type images rating')
        .populate('favoriteEvents', 'title type startTime thumbnailUrl')
        .select('-password -twoFactorSecret -deviceTokens');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if user can view this profile
      const isOwnProfile = req.user?._id.toString() === userId;
      const canViewProfile = isOwnProfile || 
        user.privacySettings.profileVisibility === 'public' ||
        (user.privacySettings.profileVisibility === 'friends' && 
         user.following > 0); // Simplified friends check

      if (!canViewProfile) {
        throw new AppError('Profile is private', 403);
      }

      // Track profile view
      if (!isOwnProfile) {
        await AnalyticsService.trackEvent('profile_view', {
          viewedUserId: userId,
          viewerUserId: req.user?._id
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation error', 400, errors.array());
      }

      const userId = req.user?._id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.email;
      delete updateData.password;
      delete updateData.verificationStatus;
      delete updateData.subscriptionType;
      delete updateData.totalEarnings;
      delete updateData.referralCode;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -twoFactorSecret -deviceTokens');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Track profile update
      await AnalyticsService.trackEvent('profile_update', {
        userId,
        updatedFields: Object.keys(updateData)
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No image file provided', 400);
      }

      const userId = req.user?._id;
      const imageUrl = await UploadService.uploadImage(req.file, 'profiles');

      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true }
      ).select('-password -twoFactorSecret -deviceTokens');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await AnalyticsService.trackEvent('profile_image_upload', { userId });

      res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: { profileImage: imageUrl }
      });
    } catch (error) {
      logger.error('Upload profile image error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to upload profile image'
      });
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { notificationSettings } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { notificationSettings },
        { new: true }
      ).select('notificationSettings');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await AnalyticsService.trackEvent('notification_settings_update', { userId });

      res.json({
        success: true,
        message: 'Notification settings updated successfully',
        data: user.notificationSettings
      });
    } catch (error) {
      logger.error('Update notification settings error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update notification settings'
      });
    }
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { privacySettings } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { privacySettings },
        { new: true }
      ).select('privacySettings');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await AnalyticsService.trackEvent('privacy_settings_update', { userId });

      res.json({
        success: true,
        message: 'Privacy settings updated successfully',
        data: user.privacySettings
      });
    } catch (error) {
      logger.error('Update privacy settings error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update privacy settings'
      });
    }
  }

  /**
   * Follow/Unfollow another user
   */
  static async toggleFollow(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const targetUserId = req.params.userId;

      if (userId === targetUserId) {
        throw new AppError('Cannot follow yourself', 400);
      }

      const [user, targetUser] = await Promise.all([
        User.findById(userId),
        User.findById(targetUserId)
      ]);

      if (!targetUser) {
        throw new AppError('User not found', 404);
      }

      // Check if already following
      const isFollowing = user?.following || 0;
      
      // For simplicity, we'll just toggle the follow status
      // In a real app, you'd have a separate follows collection
      const operation = isFollowing ? 'unfollow' : 'follow';
      
      if (operation === 'follow') {
        await Promise.all([
          User.findByIdAndUpdate(userId, { $inc: { following: 1 } }),
          User.findByIdAndUpdate(targetUserId, { $inc: { followers: 1 } })
        ]);

        // Send notification
        await NotificationService.sendNotification({
          userId: targetUserId,
          type: 'new_follower',
          title: 'New Follower',
          message: `${user?.fullName} started following you`,
          data: { followerId: userId }
        });
      } else {
        await Promise.all([
          User.findByIdAndUpdate(userId, { $inc: { following: -1 } }),
          User.findByIdAndUpdate(targetUserId, { $inc: { followers: -1 } })
        ]);
      }

      await AnalyticsService.trackEvent(`user_${operation}`, {
        userId,
        targetUserId
      });

      res.json({
        success: true,
        message: `Successfully ${operation}ed user`,
        data: { operation }
      });
    } catch (error) {
      logger.error('Toggle follow error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to toggle follow'
      });
    }
  }

  /**
   * Get user's followers
   */
  static async getFollowers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      // For simplicity, returning mock data
      // In a real app, you'd query a follows collection
      const followers = await User.find({ following: { $gt: 0 } })
        .select('username fullName profileImage verificationStatus')
        .limit(limit)
        .skip(skip);

      const total = await User.countDocuments({ following: { $gt: 0 } });

      res.json({
        success: true,
        data: followers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get followers error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get followers'
      });
    }
  }

  /**
   * Get user's following
   */
  static async getFollowing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      // For simplicity, returning mock data
      // In a real app, you'd query a follows collection
      const following = await User.find({ followers: { $gt: 0 } })
        .select('username fullName profileImage verificationStatus')
        .limit(limit)
        .skip(skip);

      const total = await User.countDocuments({ followers: { $gt: 0 } });

      res.json({
        success: true,
        data: following,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get following error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get following'
      });
    }
  }

  /**
   * Search users
   */
  static async searchUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { q, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      if (!q || (q as string).length < 2) {
        throw new AppError('Search query must be at least 2 characters', 400);
      }

      const searchRegex = new RegExp(q as string, 'i');
      
      const users = await User.find({
        $or: [
          { username: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex }
        ],
        isActive: true,
        isBlocked: false
      })
      .select('username fullName profileImage verificationStatus location.city')
      .limit(parseInt(limit as string))
      .skip(skip);

      const total = await User.countDocuments({
        $or: [
          { username: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex }
        ],
        isActive: true,
        isBlocked: false
      });

      await AnalyticsService.trackEvent('user_search', {
        userId: req.user?._id,
        searchQuery: q,
        resultsCount: users.length
      });

      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      logger.error('Search users error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to search users'
      });
    }
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { period = '30d' } = req.query;

      const analytics = await AnalyticsService.getUserAnalytics(userId, period as string);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      logger.error('Get user analytics error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get user analytics'
      });
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { password, reason } = req.body;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid password', 400);
      }

      // Soft delete - mark as inactive instead of actually deleting
      await User.findByIdAndUpdate(userId, {
        isActive: false,
        isBlocked: true,
        blockedReason: `Account deleted by user: ${reason || 'No reason provided'}`,
        blockedAt: new Date()
      });

      await AnalyticsService.trackEvent('account_deleted', {
        userId,
        reason
      });

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete account'
      });
    }
  }

  /**
   * Update device token for push notifications
   */
  static async updateDeviceToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { deviceToken, platform } = req.body;

      await User.findByIdAndUpdate(userId, {
        $addToSet: { deviceTokens: deviceToken }
      });

      await AnalyticsService.trackEvent('device_token_updated', {
        userId,
        platform
      });

      res.json({
        success: true,
        message: 'Device token updated successfully'
      });
    } catch (error) {
      logger.error('Update device token error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update device token'
      });
    }
  }

  /**
   * Get user dashboard data
   */
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      const [
        user,
        analytics,
        recentActivities
      ] = await Promise.all([
        User.findById(userId).select('followers following rewardPoints totalEarnings subscriptionType'),
        AnalyticsService.getUserAnalytics(userId, '7d'),
        AnalyticsService.getRecentActivities(userId, 10)
      ]);

      const dashboardData = {
        user: {
          followers: user?.followers || 0,
          following: user?.following || 0,
          rewardPoints: user?.rewardPoints || 0,
          totalEarnings: user?.totalEarnings || 0,
          subscriptionType: user?.subscriptionType || 'free'
        },
        analytics,
        recentActivities
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get dashboard data'
      });
    }
  }
}