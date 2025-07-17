import winston from 'winston';
import path from 'path';
import { config } from '../config/config';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(logColors);

// Create custom format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss:ms',
  }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
  ),
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat,
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: config.logLevel || 'info',
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: 'sacredconnect-api',
    environment: config.nodeEnv,
  },
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
    }),
  ],
});

// If in production, create a stream for Morgan HTTP logging
if (config.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'http.log'),
      level: 'http',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

// Create a stream object for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export a function to create child loggers with additional metadata
export const createChildLogger = (meta: object) => {
  return logger.child(meta);
};

// Helper functions for structured logging
export const logWithMetadata = (level: string, message: string, meta?: object) => {
  logger.log(level, message, meta);
};

export const logError = (error: Error, context?: object) => {
  logger.error('Error occurred', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  });
};

export const logUserAction = (userId: string, action: string, meta?: object) => {
  logger.info('User action', {
    userId,
    action,
    ...meta,
  });
};

export const logApiRequest = (method: string, url: string, userId?: string, meta?: object) => {
  logger.http('API Request', {
    method,
    url,
    userId,
    ...meta,
  });
};

export const logApiResponse = (method: string, url: string, statusCode: number, responseTime: number, userId?: string) => {
  logger.http('API Response', {
    method,
    url,
    statusCode,
    responseTime,
    userId,
  });
};

export const logDatabaseQuery = (collection: string, operation: string, duration: number, meta?: object) => {
  logger.debug('Database Query', {
    collection,
    operation,
    duration,
    ...meta,
  });
};

export const logExternalApiCall = (service: string, endpoint: string, method: string, statusCode: number, duration: number) => {
  logger.info('External API Call', {
    service,
    endpoint,
    method,
    statusCode,
    duration,
  });
};

export default logger;