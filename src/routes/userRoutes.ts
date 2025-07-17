import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validateUpdateProfile, validateNotificationSettings, validatePrivacySettings } from '../middleware/validators';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - fullName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         fullName:
 *           type: string
 *         profileImage:
 *           type: string
 *         bio:
 *           type: string
 *         age:
 *           type: number
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/profile', authMiddleware, UserController.getProfile);

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: Get another user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile/:userId', authMiddleware, UserController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *               age:
 *                 type: number
 *               location:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authMiddleware, validateUpdateProfile, UserController.updateProfile);

/**
 * @swagger
 * /api/users/profile/image:
 *   post:
 *     summary: Upload profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 */
router.post('/profile/image', authMiddleware, upload.single('image'), UserController.uploadProfileImage);

/**
 * @swagger
 * /api/users/settings/notifications:
 *   put:
 *     summary: Update notification settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationSettings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
 */
router.put('/settings/notifications', authMiddleware, validateNotificationSettings, UserController.updateNotificationSettings);

/**
 * @swagger
 * /api/users/settings/privacy:
 *   put:
 *     summary: Update privacy settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privacySettings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Privacy settings updated successfully
 */
router.put('/settings/privacy', authMiddleware, validatePrivacySettings, UserController.updatePrivacySettings);

/**
 * @swagger
 * /api/users/{userId}/follow:
 *   post:
 *     summary: Follow/Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow/Unfollow successful
 */
router.post('/:userId/follow', authMiddleware, UserController.toggleFollow);

/**
 * @swagger
 * /api/users/{userId}/followers:
 *   get:
 *     summary: Get user's followers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 */
router.get('/:userId/followers', authMiddleware, UserController.getFollowers);

/**
 * @swagger
 * /api/users/{userId}/following:
 *   get:
 *     summary: Get user's following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Following retrieved successfully
 */
router.get('/:userId/following', authMiddleware, UserController.getFollowing);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get('/search', authMiddleware, UserController.searchUsers);

/**
 * @swagger
 * /api/users/analytics:
 *   get:
 *     summary: Get user analytics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: period
 *         in: query
 *         schema:
 *           type: string
 *           enum: [1h, 24h, 7d, 30d, 90d]
 *           default: 30d
 *     responses:
 *       200:
 *         description: User analytics retrieved successfully
 */
router.get('/analytics', authMiddleware, UserController.getUserAnalytics);

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get('/dashboard', authMiddleware, UserController.getDashboard);

/**
 * @swagger
 * /api/users/device-token:
 *   post:
 *     summary: Update device token for push notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceToken:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [ios, android]
 *     responses:
 *       200:
 *         description: Device token updated successfully
 */
router.post('/device-token', authMiddleware, UserController.updateDeviceToken);

/**
 * @swagger
 * /api/users/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/account', authMiddleware, UserController.deleteAccount);

export default router;