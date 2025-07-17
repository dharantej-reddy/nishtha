import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

// Import configurations
import { config } from './config/config';
import { connectDB } from './config/database';
import { initRedis } from './config/redis';
import { initFirebase } from './config/firebase';
import { logger } from './utils/logger';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import placeRoutes from './routes/placeRoutes';
import liveRoutes from './routes/liveRoutes';
import videoRoutes from './routes/videoRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import travelRoutes from './routes/travelRoutes';
import communityRoutes from './routes/communityRoutes';
import donationRoutes from './routes/donationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import adminRoutes from './routes/adminRoutes';

// Import services
import { NotificationService } from './services/notification/NotificationService';
import { AnalyticsService } from './services/analytics/AnalyticsService';
import { initJobs } from './jobs/jobScheduler';

// Import socket handlers
import { initSocketHandlers } from './utils/socketHandlers';

class App {
  public app: express.Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeServices();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "http:"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim())
        }
      }));
    }

    // Static file serving
    this.app.use('/uploads', express.static('uploads'));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/places', placeRoutes);
    this.app.use('/api/live', liveRoutes);
    this.app.use('/api/videos', videoRoutes);
    this.app.use('/api/marketplace', marketplaceRoutes);
    this.app.use('/api/bookings', bookingRoutes);
    this.app.use('/api/travel', travelRoutes);
    this.app.use('/api/community', communityRoutes);
    this.app.use('/api/donations', donationRoutes);
    this.app.use('/api/notifications', notificationRoutes);
    this.app.use('/api/analytics', analyticsRoutes);
    this.app.use('/api/admin', adminRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

  private initializeSwagger(): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'SacredConnect API',
          version: '1.0.0',
          description: 'Comprehensive API for SacredConnect - Spiritual Connection Platform',
          contact: {
            name: 'SacredConnect Team',
            email: 'api@sacredconnect.com',
            url: 'https://sacredconnect.com'
          }
        },
        servers: [
          {
            url: process.env.API_URL || 'http://localhost:5000',
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts']
    };

    const specs = swaggerJsdoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'SacredConnect API Documentation'
    }));
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database
      await connectDB();
      logger.info('Database connected successfully');

      // Initialize Redis
      await initRedis();
      logger.info('Redis connected successfully');

      // Initialize Firebase
      await initFirebase();
      logger.info('Firebase initialized successfully');

      // Initialize Socket.IO handlers
      initSocketHandlers(this.io);
      logger.info('Socket.IO handlers initialized');

      // Initialize notification service
      await NotificationService.initialize();
      logger.info('Notification service initialized');

      // Initialize analytics service
      await AnalyticsService.initialize();
      logger.info('Analytics service initialized');

      // Initialize scheduled jobs
      initJobs();
      logger.info('Scheduled jobs initialized');

    } catch (error) {
      logger.error('Service initialization failed:', error);
      throw error;
    }
  }

  public listen(): void {
    const port = config.port || 5000;
    
    this.server.listen(port, () => {
      logger.info(`🚀 SacredConnect API Server running on port ${port}`);
      logger.info(`📚 API Documentation: http://localhost:${port}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${port}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  private gracefulShutdown(): void {
    logger.info('Received shutdown signal, closing server...');
    
    this.server.close(() => {
      logger.info('HTTP server closed');
      
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
}

// Start the server
const app = new App();
app.listen();

export default app;