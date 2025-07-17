import { body, param, query } from 'express-validator';

// User profile validation
export const validateUpdateProfile = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender value'),
  
  body('location.city')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
];

// Notification settings validation
export const validateNotificationSettings = [
  body('notificationSettings.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification setting must be boolean'),
  
  body('notificationSettings.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification setting must be boolean'),
  
  body('notificationSettings.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification setting must be boolean'),
];

// Privacy settings validation
export const validatePrivacySettings = [
  body('privacySettings.profileVisibility')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Invalid profile visibility value'),
  
  body('privacySettings.showLocation')
    .optional()
    .isBoolean()
    .withMessage('Show location setting must be boolean'),
  
  body('privacySettings.showAge')
    .optional()
    .isBoolean()
    .withMessage('Show age setting must be boolean'),
];

// User registration validation
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
  
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
];

// Login validation
export const validateLogin = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// MongoDB ObjectId validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

// Search validation
export const validateSearch = [
  query('q')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
];

// Place creation validation
export const validateCreatePlace = [
  body('name')
    .isLength({ min: 2, max: 200 })
    .withMessage('Place name must be between 2 and 200 characters'),
  
  body('type')
    .isIn(['temple', 'church', 'mosque', 'synagogue', 'gurudwara', 'monastery', 'other'])
    .withMessage('Invalid place type'),
  
  body('coordinates.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  
  body('address.city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.country')
    .notEmpty()
    .withMessage('Country is required'),
];