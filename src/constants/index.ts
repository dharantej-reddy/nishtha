// Color constants
export const COLORS = {
  primary: '#8B5A3C', // Sacred brown
  secondary: '#F4E4BC', // Light cream
  accent: '#D4AF37', // Sacred gold
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  transparent: 'transparent',
  
  // Religion specific colors
  hindu: '#FF6B35',
  christian: '#4A90E2',
  islamic: '#2ECC71',
  buddhist: '#9B59B6',
  sikh: '#E67E22',
  jewish: '#3498DB',
  
  // Gradient colors
  primaryGradient: ['#8B5A3C', '#A0522D'],
  secondaryGradient: ['#F4E4BC', '#DDD6C0'],
  accentGradient: ['#D4AF37', '#FFD700'],
};

// Spacing constants
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// Border radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// Screen dimensions
export const SCREEN = {
  width: 375, // iPhone 12 Pro width for reference
  height: 812, // iPhone 12 Pro height for reference
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.sacredconnect.com/v1',
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
    FOLLOWERS: '/user/followers',
    FOLLOWING: '/user/following',
    FOLLOW: '/user/follow',
    UNFOLLOW: '/user/unfollow',
  },
  
  // Places of Worship
  PLACES: {
    LIST: '/places',
    DETAILS: '/places/:id',
    SEARCH: '/places/search',
    NEARBY: '/places/nearby',
    FOLLOW: '/places/:id/follow',
    UNFOLLOW: '/places/:id/unfollow',
    REVIEWS: '/places/:id/reviews',
    ADD_REVIEW: '/places/:id/reviews',
  },
  
  // Live Events
  LIVE: {
    EVENTS: '/live/events',
    JOIN: '/live/:id/join',
    LEAVE: '/live/:id/leave',
    COMMENT: '/live/:id/comments',
    LIKE: '/live/:id/like',
    UNLIKE: '/live/:id/unlike',
  },
  
  // Recorded Videos
  VIDEOS: {
    LIST: '/videos',
    DETAILS: '/videos/:id',
    WATCH: '/videos/:id/watch',
    LIKE: '/videos/:id/like',
    UNLIKE: '/videos/:id/unlike',
    COMMENT: '/videos/:id/comments',
    PURCHASE: '/videos/:id/purchase',
  },
  
  // Marketplace
  MARKETPLACE: {
    ITEMS: '/marketplace/items',
    DETAILS: '/marketplace/:id',
    PURCHASE: '/marketplace/:id/purchase',
    CART: '/marketplace/cart',
    ORDERS: '/marketplace/orders',
    WISHLIST: '/marketplace/wishlist',
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAILS: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    CONFIRM: '/bookings/:id/confirm',
    PRIESTS: '/bookings/priests',
    AVAILABILITY: '/bookings/availability',
  },
  
  // Travel
  TRAVEL: {
    PLANS: '/travel/plans',
    CREATE: '/travel/plans',
    DETAILS: '/travel/:id',
    VIEWPOINTS: '/travel/viewpoints',
    ACCOMMODATIONS: '/travel/accommodations',
    CAB_BOOKING: '/travel/cab',
    ROUTE_PLANNING: '/travel/route',
  },
  
  // Community
  COMMUNITY: {
    POSTS: '/community/posts',
    CREATE_POST: '/community/posts',
    POST_DETAILS: '/community/posts/:id',
    LIKE_POST: '/community/posts/:id/like',
    COMMENT: '/community/posts/:id/comments',
    AGE_GROUPS: '/community/age-groups',
  },
  
  // Donations
  DONATIONS: {
    CAMPAIGNS: '/donations/campaigns',
    DONATE: '/donations/donate',
    HISTORY: '/donations/history',
    CREATE_CAMPAIGN: '/donations/campaigns',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },
  
  // Payment
  PAYMENT: {
    METHODS: '/payment/methods',
    ADD_METHOD: '/payment/methods',
    REMOVE_METHOD: '/payment/methods/:id',
    PROCESS: '/payment/process',
    HISTORY: '/payment/history',
  },
};

// Religion types
export const RELIGION_TYPES = [
  { key: 'temple', label: 'Hindu Temple', icon: '🕉️', color: COLORS.hindu },
  { key: 'church', label: 'Church', icon: '✝️', color: COLORS.christian },
  { key: 'mosque', label: 'Mosque', icon: '☪️', color: COLORS.islamic },
  { key: 'synagogue', label: 'Synagogue', icon: '✡️', color: COLORS.jewish },
  { key: 'gurudwara', label: 'Gurudwara', icon: '☬', color: COLORS.sikh },
  { key: 'buddhist_temple', label: 'Buddhist Temple', icon: '☸️', color: COLORS.buddhist },
  { key: 'other', label: 'Other', icon: '🏛️', color: COLORS.gray[600] },
];

// Service types
export const SERVICE_TYPES = [
  { key: 'home_service', label: 'Home Service', icon: '🏠' },
  { key: 'special_pooja', label: 'Special Pooja', icon: '🙏' },
  { key: 'consultation', label: 'Spiritual Consultation', icon: '💬' },
  { key: 'guide_tour', label: 'Guided Tour', icon: '👨‍🏫' },
  { key: 'event_ticket', label: 'Event Tickets', icon: '🎫' },
];

// Age groups for community
export const AGE_GROUPS = [
  { key: '13-17', label: 'Teens (13-17)', color: COLORS.info },
  { key: '18-25', label: 'Young Adults (18-25)', color: COLORS.success },
  { key: '26-35', label: 'Adults (26-35)', color: COLORS.warning },
  { key: '36-50', label: 'Middle Age (36-50)', color: COLORS.primary },
  { key: '51-65', label: 'Mature (51-65)', color: COLORS.secondary },
  { key: '65+', label: 'Seniors (65+)', color: COLORS.accent },
];

// Marketplace categories
export const MARKETPLACE_CATEGORIES = [
  { key: 'prasad', label: 'Prasad', icon: '🍯' },
  { key: 'religious_books', label: 'Religious Books', icon: '📚' },
  { key: 'clothing', label: 'Religious Clothing', icon: '👕' },
  { key: 'artifacts', label: 'Religious Artifacts', icon: '🏺' },
  { key: 'music', label: 'Devotional Music', icon: '🎵' },
  { key: 'incense', label: 'Incense & Candles', icon: '🕯️' },
  { key: 'other', label: 'Other Items', icon: '📦' },
];

// Event types
export const EVENT_TYPES = [
  { key: 'prayer', label: 'Prayer', icon: '🙏' },
  { key: 'pooja', label: 'Pooja/Ceremony', icon: '🛕' },
  { key: 'ceremony', label: 'Special Ceremony', icon: '⭐' },
  { key: 'cultural_event', label: 'Cultural Event', icon: '🎭' },
  { key: 'teaching', label: 'Spiritual Teaching', icon: '📖' },
  { key: 'festival', label: 'Festival', icon: '🎉' },
];

// Transportation types
export const CAB_TYPES = [
  { key: 'mini', label: 'Mini', seats: 4, icon: '🚗' },
  { key: 'sedan', label: 'Sedan', seats: 4, icon: '🚙' },
  { key: 'suv', label: 'SUV', seats: 6, icon: '🚐' },
  { key: 'shared', label: 'Shared', seats: 3, icon: '🚌' },
];

// Donation purposes
export const DONATION_PURPOSES = [
  { key: 'general', label: 'General Donation', icon: '💰' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'event', label: 'Special Events', icon: '🎉' },
  { key: 'charity', label: 'Charity Work', icon: '❤️' },
  { key: 'construction', label: 'Construction', icon: '🏗️' },
  { key: 'education', label: 'Education', icon: '📚' },
];

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'SacredConnect',
  VERSION: '1.0.0',
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi'],
  SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'aac'],
  PAGINATION_LIMIT: 20,
  SEARCH_DEBOUNCE_TIME: 300,
  VIDEO_QUALITY_OPTIONS: ['360p', '480p', '720p', '1080p'],
  LIVE_STREAM_QUALITY: '720p',
  MAP_ZOOM_LEVEL: 15,
  NEARBY_RADIUS: 50, // km
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  DONATION_SUCCESS: 'Thank you for your donation!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  POST_CREATED: 'Post created successfully!',
  FOLLOW_SUCCESS: 'Successfully followed!',
  UNFOLLOW_SUCCESS: 'Successfully unfollowed!',
};

// Status constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  THEME: '@theme',
  LANGUAGE: '@language',
  LOCATION: '@location',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  NOTIFICATION_SETTINGS: '@notification_settings',
  SEARCH_HISTORY: '@search_history',
  RECENT_PLACES: '@recent_places',
};

// Permissions
export const PERMISSIONS = {
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  LOCATION: 'location',
  NOTIFICATION: 'notification',
  PHOTO_LIBRARY: 'photo_library',
  CONTACTS: 'contacts',
};

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/sacredconnect',
  TWITTER: 'https://twitter.com/sacredconnect',
  INSTAGRAM: 'https://instagram.com/sacredconnect',
  YOUTUBE: 'https://youtube.com/sacredconnect',
  LINKEDIN: 'https://linkedin.com/company/sacredconnect',
};

// Support and legal
export const SUPPORT = {
  EMAIL: 'support@sacredconnect.com',
  PHONE: '+1-800-SACRED',
  PRIVACY_POLICY: 'https://sacredconnect.com/privacy',
  TERMS_OF_SERVICE: 'https://sacredconnect.com/terms',
  FAQ: 'https://sacredconnect.com/faq',
  CONTACT: 'https://sacredconnect.com/contact',
};

// Language options
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export default {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SCREEN,
  API_ENDPOINTS,
  RELIGION_TYPES,
  SERVICE_TYPES,
  AGE_GROUPS,
  MARKETPLACE_CATEGORIES,
  EVENT_TYPES,
  CAB_TYPES,
  DONATION_PURPOSES,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STATUS,
  STORAGE_KEYS,
  PERMISSIONS,
  SOCIAL_LINKS,
  SUPPORT,
  LANGUAGES,
  CURRENCIES,
};