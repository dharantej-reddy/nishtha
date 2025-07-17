# SacredConnect Backend API

<div align="center">

**Comprehensive Backend API for SacredConnect Spiritual Platform**

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-6.0%2B-red)](https://redis.io/)
[![Express](https://img.shields.io/badge/Express-4.18%2B-lightgrey)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7%2B-black)](https://socket.io/)

</div>

## 🚀 Overview

This is the backend API for **SacredConnect**, a comprehensive spiritual connection platform. Built with Node.js, TypeScript, and modern technologies, this API provides all necessary services for user management, live streaming, marketplace operations, community features, and more.

## ✨ Key Features

### 🔐 **Authentication & User Management**
- JWT-based authentication with refresh tokens
- Comprehensive user profiles with 100+ fields
- Social features (follow/unfollow, search)
- Profile image upload and management
- Privacy and notification settings
- Account verification system

### 📡 **Real-time Communication**
- Socket.IO integration for live features
- Real-time chat for live streaming
- Live viewer count tracking
- Room-based communication
- Real-time notifications

### 🔔 **Multi-channel Notification System**
- Push notifications via Firebase
- Email notifications with templates
- SMS notifications (ready for Twilio)
- Queue-based processing with Bull
- User preference management
- Scheduled notifications

### 📊 **Advanced Analytics Platform**
- Real-time analytics with Redis
- User behavior tracking
- Event analytics and insights
- Performance monitoring
- Dashboard data aggregation
- Custom reporting

### 🗄️ **Database Architecture**
- MongoDB with Mongoose ODM
- Optimized indexing strategy
- Data relationships and references
- Aggregation pipelines
- Connection pooling
- Health monitoring

### 🔒 **Security & Performance**
- Rate limiting and CORS protection
- Input validation with express-validator
- Helmet security headers
- Error handling and logging
- Redis caching layer
- Background job processing

## 🛠️ Technology Stack

### **Core Technologies**
```
Runtime      : Node.js 16+
Framework    : Express.js 4.18+
Language     : TypeScript 5.0+
Database     : MongoDB 6.0+ with Mongoose ODM
Cache        : Redis 6.0+ with ioredis
Authentication: JWT with bcryptjs
```

### **External Integrations**
```
File Storage : Cloudinary (images, videos, documents)
Push Notifications: Firebase Cloud Messaging
Email Service: Nodemailer with SMTP
Payment Gateways: Stripe & Razorpay (ready)
Maps & Location: Google Maps API (ready)
Queue Management: Bull (Redis-based)
```

### **Development Tools**
```
Documentation: Swagger/OpenAPI 3.0
Testing      : Jest & Supertest
Linting      : ESLint with TypeScript
Logging      : Winston with multiple transports
Validation   : Express Validator
Process Management: PM2 (ready)
```

## 📁 Project Structure

```
SacredConnect-Backend/
├── src/
│   ├── config/               # Configuration files
│   │   ├── config.ts         # Main app configuration
│   │   ├── database.ts       # MongoDB setup
│   │   ├── redis.ts          # Redis configuration
│   │   └── firebase.ts       # Firebase setup
│   ├── controllers/          # Request handlers
│   │   └── userController.ts # User management (fully implemented)
│   ├── models/              # Database schemas
│   │   ├── User.ts          # Complete user model
│   │   ├── Notification.ts  # Notification system
│   │   ├── Analytics.ts     # Analytics tracking
│   │   ├── PlaceOfWorship.ts# Places of worship
│   │   └── LiveEvent.ts     # Live streaming events
│   ├── routes/              # API route definitions
│   │   ├── userRoutes.ts    # User endpoints (complete)
│   │   ├── authRoutes.ts    # Authentication routes
│   │   └── [other routes]   # Additional feature routes
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Global error handling
│   │   ├── upload.ts        # File upload handling
│   │   └── validators.ts    # Request validation
│   ├── services/            # Business logic
│   │   ├── notification/    # Notification service
│   │   ├── analytics/       # Analytics service
│   │   └── upload/          # File upload service
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Winston logging
│   │   ├── AppError.ts      # Custom error class
│   │   └── socketHandlers.ts# Socket.IO handlers
│   ├── jobs/                # Background tasks
│   │   └── jobScheduler.ts  # Cron job management
│   └── server.ts            # Main application entry
├── logs/                    # Application logs
├── uploads/                 # Temporary file storage
├── tests/                   # Test files
├── package.json             # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── .env.example            # Environment template
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 6.0+
- Redis 6.0+
- npm 7+

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd SacredConnect-Backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Services**
```bash
# Start MongoDB
sudo systemctl start mongod

# Start Redis
sudo systemctl start redis
```

4. **Run Application**
```bash
# Development mode
npm run dev

# Production build
npm run build && npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### **Interactive Documentation**
- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs.json
- **Health Check**: http://localhost:5000/health

### **Core Endpoints**

#### Authentication
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login  
POST   /api/auth/refresh       # Refresh JWT token
POST   /api/auth/logout        # User logout
```

#### User Management (Fully Implemented)
```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update profile
POST   /api/users/profile/image # Upload profile image
PUT    /api/users/settings/*   # Update settings
POST   /api/users/:id/follow   # Follow/unfollow user
GET    /api/users/search       # Search users
GET    /api/users/analytics    # User analytics
DELETE /api/users/account      # Delete account
```

#### Other Features (Structured)
```
/api/places/*        # Places of worship
/api/live/*          # Live streaming
/api/marketplace/*   # Marketplace
/api/bookings/*      # Service bookings
/api/community/*     # Community features
/api/donations/*     # Donations
/api/notifications/* # Notifications
/api/analytics/*     # Analytics
```

## 🗄️ Database Models

### **User Model** (Complete Implementation)
```typescript
interface IUser {
  // Basic Information
  email: string;
  username: string;
  password: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  
  // Personal Details
  age?: number;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
  
  // Location
  location?: {
    address: string;
    coordinates: [number, number];
  };
  
  // Religious Preferences
  preferredReligions: string[];
  favoriteLanguages: string[];
  
  // Social Features
  followers: number;
  following: number;
  followedPlaces: ObjectId[];
  
  // Settings
  notificationSettings: object;
  privacySettings: object;
  
  // Security & Verification
  verificationStatus: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Subscription & Analytics
  subscriptionType: string;
  lastActive: Date;
  loginCount: number;
  
  // And 50+ more fields...
}
```

### **Supporting Models**
- **Notifications**: Multi-channel notification management
- **Analytics**: Event tracking and user behavior
- **PlaceOfWorship**: Sacred places database
- **LiveEvent**: Live streaming events

## 🔒 Security Implementation

### **Authentication**
- JWT tokens with configurable expiration
- Refresh token mechanism
- Password hashing with bcrypt (12 rounds)
- Account verification system
- Two-factor authentication ready

### **API Security**
- Rate limiting (100 requests/15 minutes)
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### **Data Protection**
- Environment variable configuration
- Sensitive data encryption
- Secure error responses
- Audit trails for critical operations
- GDPR compliance ready

## 📈 Performance Features

### **Caching Strategy**
- Redis for session storage
- Real-time analytics caching
- Database query result caching
- API response caching
- Background job queues

### **Database Optimization**
- Strategic indexing for all models
- Connection pooling
- Query optimization
- Aggregation pipelines
- Read/write splitting ready

### **Monitoring & Logging**
- Winston structured logging
- Request/response logging
- Error tracking and alerting
- Performance monitoring
- Health check endpoints

## 🔄 Background Jobs

### **Scheduled Tasks**
```typescript
// Hourly cleanup
cron.schedule('0 * * * *', cleanup);

// Analytics processing (every 30 min)
cron.schedule('*/30 * * * *', processAnalytics);

// Daily digest (9 AM)
cron.schedule('0 9 * * *', sendDailyDigest);

// Weekly reports (Sunday 10 AM)
cron.schedule('0 10 * * 0', weeklyReport);

// Monthly cleanup (1st day, 2 AM)
cron.schedule('0 2 1 * *', monthlyCleanup);
```

### **Queue Jobs**
- Email sending (with retry)
- Push notification delivery
- Image processing and optimization
- Analytics data aggregation
- Report generation

## 🧪 Testing

### **Run Tests**
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- --testPathPattern=user.test.ts
```

### **Test Structure**
- Unit tests for models and utilities
- Integration tests for API endpoints
- Service tests for business logic
- Database tests with mock data
- Authentication flow tests

## 🚀 Deployment

### **Development Scripts**
```bash
npm run dev          # Development with auto-reload
npm run build        # TypeScript compilation
npm run start        # Production server
npm run typecheck    # Type checking
npm run lint         # Code linting
npm run test         # Run test suite
```

### **Environment Configuration**
```bash
# Required Environment Variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://localhost:27017/sacredconnect
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Optional Service Integrations
CLOUDINARY_NAME=your-cloudinary-name
FIREBASE_PROJECT_ID=your-firebase-project
STRIPE_SECRET_KEY=your-stripe-key
SMTP_HOST=smtp.gmail.com
REDIS_URL=redis://localhost:6379
```

### **Production Deployment**
1. Set environment variables
2. Build the application (`npm run build`)
3. Start with process manager (`pm2 start dist/server.js`)
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates
6. Enable monitoring and logging

### **Docker Support**
```bash
# Build image
docker build -t sacredconnect-backend .

# Run container
docker run -p 5000:5000 sacredconnect-backend

# Docker Compose
docker-compose up -d
```

## 📊 Analytics & Monitoring

### **Built-in Analytics**
- User behavior tracking
- API usage statistics
- Performance metrics
- Error rate monitoring
- Real-time dashboards

### **Health Monitoring**
- Database connection status
- Redis connectivity
- External service health
- Memory and CPU usage
- Queue processing status

## 🤝 Development

### **Code Quality**
- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Husky for git hooks
- Comprehensive error handling

### **API Design**
- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Comprehensive error messages
- OpenAPI documentation

### **Contributing**
1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Follow TypeScript best practices
5. Submit pull request

## 📞 Support

### **Documentation**
- API Documentation: http://localhost:5000/api-docs
- Project Wiki: [GitHub Wiki](https://github.com/your-org/SacredConnect/wiki)
- Deployment Guide: [docs/deployment.md](docs/deployment.md)

### **Issues & Support**
- Bug Reports: [GitHub Issues](https://github.com/your-org/SacredConnect/issues)
- Feature Requests: [GitHub Discussions](https://github.com/your-org/SacredConnect/discussions)
- Email: backend-support@sacredconnect.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**Part of the SacredConnect Spiritual Platform**

[🏠 Main Project](../README.md) • [📱 Mobile App](../SacredConnect/README.md) • [📖 Documentation](https://docs.sacredconnect.com)

*Built with ❤️ for the global spiritual community*

</div>