# SacredConnect Backend API

A comprehensive backend API for SacredConnect - A spiritual connection platform that connects users with places of worship worldwide. This backend provides all the necessary services for user management, live streaming, marketplace, bookings, donations, community features, and more.

![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green)
![Redis](https://img.shields.io/badge/Redis-6.0%2B-red)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Core Features
- **User Management**: Complete user authentication, profile management, and social features
- **Places of Worship**: Location-based discovery, detailed profiles, and verification system
- **Live Streaming**: Real-time video streaming with chat and audience engagement
- **Marketplace**: E-commerce platform for religious items, books, and digital content
- **Service Booking**: Schedule priests, tours, special events, and religious ceremonies
- **Travel Planning**: Trip planning with route optimization and accommodation booking
- **Community**: Age-based groups, discussions, posts, and social interactions
- **Donations**: Transparent donation system with campaign management
- **Analytics**: Comprehensive user behavior and app usage analytics
- **Notifications**: Multi-channel notifications (push, email, SMS)

### Technical Features
- **RESTful API**: Well-structured REST endpoints with OpenAPI documentation
- **Real-time Communication**: WebSocket support for live features
- **File Upload**: Cloud-based file storage with Cloudinary integration
- **Payment Processing**: Multi-gateway support (Stripe, Razorpay)
- **Caching**: Redis-based caching for improved performance
- **Queue Management**: Background job processing with Bull
- **Security**: JWT authentication, rate limiting, and data validation
- **Monitoring**: Comprehensive logging and error tracking
- **Testing**: Unit and integration tests with Jest
- **Docker**: Containerization support for easy deployment

## 🛠️ Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Queue**: Bull (Redis-based)
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin SDK
- **Payments**: Stripe, Razorpay
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Validation**: Express Validator

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** (version 7 or higher)
- **MongoDB** (version 6.0 or higher)
- **Redis** (version 6.0 or higher)
- **Git**

### Optional External Services
- **Cloudinary** account for file storage
- **Firebase** project for push notifications
- **Stripe** account for payment processing
- **Razorpay** account for Indian market payments
- **Gmail** or SMTP server for email notifications
- **Twilio** account for SMS notifications
- **Google Maps** API key for location services

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sacredconnect/backend.git
cd SacredConnect-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 4. Required Environment Variables
Update the `.env` file with your actual values:

```env
# Essential Configuration
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/sacredconnect
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key

# For push notifications
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# For file uploads
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# For email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 5. Start Required Services
```bash
# Start MongoDB (if running locally)
sudo systemctl start mongod

# Start Redis (if running locally)
sudo systemctl start redis
```

### 6. Run the Application
```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

Once the server is running, you can access:

- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health
- **OpenAPI Spec**: http://localhost:5000/api-docs.json

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/image` - Upload profile image
- `PUT /api/users/settings/notifications` - Update notification settings
- `PUT /api/users/settings/privacy` - Update privacy settings
- `POST /api/users/{userId}/follow` - Follow/unfollow user
- `GET /api/users/search` - Search users
- `GET /api/users/analytics` - Get user analytics
- `DELETE /api/users/account` - Delete user account

### Places of Worship
- `GET /api/places` - Get places with filters
- `GET /api/places/{id}` - Get place details
- `POST /api/places` - Create place (admin)
- `PUT /api/places/{id}` - Update place
- `POST /api/places/{id}/follow` - Follow place
- `GET /api/places/nearby` - Get nearby places

### Live Events
- `GET /api/live/events` - Get live events
- `GET /api/live/events/{id}` - Get event details
- `POST /api/live/events` - Create live event
- `PUT /api/live/events/{id}` - Update live event
- `POST /api/live/events/{id}/join` - Join live event

### Marketplace
- `GET /api/marketplace/items` - Get marketplace items
- `GET /api/marketplace/items/{id}` - Get item details
- `POST /api/marketplace/items` - Create item
- `PUT /api/marketplace/items/{id}` - Update item
- `POST /api/marketplace/purchase` - Purchase item

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Donations
- `GET /api/donations` - Get donations
- `POST /api/donations` - Make donation
- `GET /api/donations/campaigns` - Get campaigns
- `POST /api/donations/campaigns` - Create campaign

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post
- `PUT /api/community/posts/{id}` - Update post
- `POST /api/community/posts/{id}/like` - Like post
- `POST /api/community/posts/{id}/comment` - Comment on post

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/send` - Send notification (admin)

### Analytics
- `GET /api/analytics/app` - Get app analytics (admin)
- `GET /api/analytics/users` - Get user analytics (admin)
- `GET /api/analytics/realtime` - Get real-time analytics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=user.test.ts
```

## 📝 Development Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Type checking without compilation
npm run typecheck

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build directory
npm run clean

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Reset database
npm run db:reset
```

## 🐳 Docker Support

### Build Docker Image
```bash
npm run docker:build
```

### Run with Docker
```bash
npm run docker:run
```

### Docker Compose (with MongoDB and Redis)
```bash
docker-compose up -d
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Request data validation and sanitization
- **Password Hashing**: Bcrypt for secure password storage
- **Environment Variables**: Sensitive data protection
- **Error Handling**: Secure error responses without data leakage

## 📈 Performance Features

- **MongoDB Indexing**: Optimized database queries
- **Redis Caching**: Caching for frequently accessed data
- **Compression**: Response compression for better performance
- **Connection Pooling**: Efficient database connections
- **Background Jobs**: Queue-based processing for heavy tasks
- **Pagination**: Efficient data pagination
- **Image Optimization**: Cloudinary-based image processing

## 🔄 Background Jobs

The application uses Bull queues for background processing:

- **Notification Processing**: Email, push, and SMS notifications
- **Image Processing**: Resize and optimize uploaded images
- **Analytics Processing**: Process analytics data
- **Report Generation**: Generate periodic reports
- **Data Cleanup**: Clean expired tokens and sessions

## 📊 Monitoring & Logging

- **Winston Logging**: Structured logging with multiple transports
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Response time tracking
- **Health Checks**: Application health monitoring
- **Database Monitoring**: Connection and query monitoring

## 🌐 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database URLs
3. Set up SSL certificates
4. Configure reverse proxy (Nginx)
5. Set up process manager (PM2)

### Production Checklist
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] CDN configured
- [ ] Load balancer setup (if needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Update documentation for API changes
- Ensure all tests pass before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Team**: API development and database design
- **DevOps Team**: Infrastructure and deployment
- **QA Team**: Testing and quality assurance

## 📞 Support

For support and questions:
- **Email**: support@sacredconnect.com
- **Documentation**: [docs.sacredconnect.com](https://docs.sacredconnect.com)
- **Issues**: [GitHub Issues](https://github.com/sacredconnect/backend/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core API development
- [x] User management system
- [x] Authentication & authorization
- [x] Basic notification system

### Phase 2 (Next)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search capabilities
- [ ] Performance optimizations

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Advanced streaming features
- [ ] IoT device integration
- [ ] Blockchain integration for donations

---

**Made with ❤️ for the global spiritual community**