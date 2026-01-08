# Smart Academy Website - 12-Phase Implementation Roadmap
## Part 2: Backend Architecture & Database Setup

**Continuation of Phase 2 and Complete Phase 3**

---

## Phase 2: Backend Core Setup & Architecture (Continued)

### 2.3 Database Connection & ORM Setup

#### 2.3.1 Install Database Libraries

```bash
cd backend

# Install Sequelize ORM and PostgreSQL driver
npm install sequelize
npm install -D sequelize-cli @types/sequelize

# Initialize Sequelize
npx sequelize-cli init
```

#### 2.3.2 Configure Sequelize

Create `backend/src/config/database.ts`:

```typescript
import { Sequelize } from 'sequelize';
import config from './index';
import logger from '../utils/logger';

const sequelize = new Sequelize(config.database.url, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: config.database.pool.max,
    min: config.database.pool.min,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: config.database.ssl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    return false;
  }
};

// Sync database (only in development)
export const syncDatabase = async (force = false): Promise<void> => {
  if (config.nodeEnv === 'development') {
    try {
      await sequelize.sync({ force, alter: !force });
      logger.info(`Database synced successfully (force: ${force})`);
    } catch (error) {
      logger.error('Error syncing database:', error);
      throw error;
    }
  }
};

export default sequelize;
```

#### 2.3.3 Setup Redis Connection

Create `backend/src/config/redis.ts`:

```typescript
import Redis from 'ioredis';
import config from './index';
import logger from '../utils/logger';

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  db: config.redis.db,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Redis event handlers
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redisClient.on('close', () => {
  logger.warn('Redis connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

// Helper functions
export const cacheService = {
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(`Error getting key ${key} from cache:`, error);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redisClient.setex(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      logger.error(`Error setting key ${key} in cache:`, error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Error deleting key ${key} from cache:`, error);
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  },

  async flush(): Promise<void> {
    try {
      await redisClient.flushdb();
      logger.info('Redis cache flushed');
    } catch (error) {
      logger.error('Error flushing Redis cache:', error);
    }
  },
};

export default redisClient;
```

### 2.4 Logging System Setup

#### 2.4.1 Configure Winston Logger

Create `backend/src/utils/logger.ts`:

```typescript
import winston from 'winston';
import path from 'path';
import config from '../config';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: config.nodeEnv === 'development' ? consoleFormat : logFormat,
  }),
];

// Add file transports in production
if (config.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(config.logging.filePath, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(config.logging.filePath, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports,
  exitOnError: false,
});

// Stream for Morgan HTTP logging
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
```

### 2.5 Core Middleware Setup

#### 2.5.1 Create Error Handler Middleware

Create `backend/src/middlewares/errorHandler.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import config from '../config';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
```

#### 2.5.2 Create Validation Middleware

Create `backend/src/middlewares/validate.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    res.status(422).json({
      success: false,
      errors: extractedErrors,
    });
  };
};
```

#### 2.5.3 Create Authentication Middleware

Create `backend/src/middlewares/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from './errorHandler';
import { cacheService } from '../config/redis';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Check if token is blacklisted
    const isBlacklisted = await cacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('Token is invalid', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
```

### 2.6 Express Application Setup

#### 2.6.1 Create Main Application File

Create `backend/src/app.ts`:

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger, { stream } from './utils/logger';
import { errorHandler, notFound } from './middlewares/errorHandler';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Smart Academy API',
    version: config.apiVersion,
    status: 'running',
  });
});

// Import routes (will be created in next phases)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/students', studentRoutes);
// app.use('/api/v1/admissions', admissionRoutes);
// app.use('/api/v1/payments', paymentRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
```

#### 2.6.2 Create Server Entry Point

Create `backend/src/index.ts`:

```typescript
import app from './app';
import config from './config';
import logger from './utils/logger';
import { testDatabaseConnection } from './config/database';
import redisClient from './config/redis';

const PORT = config.port;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Close server
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database connection
      // await sequelize.close();
      logger.info('Database connection closed');

      // Close Redis connection
      await redisClient.quit();
      logger.info('Redis connection closed');

      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
      logger.info(`API URL: ${config.apiUrl}`);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const server = startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});
```

### 2.7 Testing Backend Setup

#### 2.7.1 Create Test Script

```bash
cd backend

# Start backend server
npm run dev
```

Expected output:
```
[timestamp] [info]: Database connection established successfully
[timestamp] [info]: Redis client connected
[timestamp] [info]: Redis client ready
[timestamp] [info]: Server running on port 5000 in development mode
[timestamp] [info]: API URL: http://localhost:5000/api/v1
```

#### 2.7.2 Test Endpoints

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test API endpoint
curl http://localhost:5000/api/v1
```

### 2.8 Phase 2 Completion Checklist

- [ ] Backend TypeScript project initialized
- [ ] All dependencies installed
- [ ] Configuration system working
- [ ] Database connection established
- [ ] Redis connection established
- [ ] Logging system functional
- [ ] Core middlewares created
- [ ] Express app setup complete
- [ ] Server starts successfully
- [ ] Health check endpoint working
- [ ] Error handling tested

---

## Phase 3: Database Schema Design & Implementation
**Duration:** 2-3 weeks  
**Effort:** 80-120 hours  
**Prerequisite:** Phase 2 completed  
**Deliverables:** Complete database with all tables and relationships

### 3.1 Database Design Documentation

#### 3.1.1 Create Database ERD Documentation

Create `database/README.md`:

```markdown
# Smart Academy Database Schema

## Overview

This document describes the complete database schema for the Smart Academy website.

## Database Information

- **DBMS:** PostgreSQL 16+
- **Character Set:** UTF8
- **Collation:** en_US.UTF-8
- **Timezone:** Asia/Dhaka

## Schema Organization

The database is organized into the following modules:

1. **Authentication & Authorization** - User management and access control
2. **Academic Management** - Students, classes, subjects, teachers
3. **Admission System** - Application processing
4. **Financial Management** - Payments and fees
5. **Communication** - Messages, announcements, notifications
6. **Content Management** - Website content, news, events
7. **Learning Resources** - Assignments, grades, attendance

## Naming Conventions

- **Tables:** Plural, lowercase, snake_case (e.g., `users`, `student_fees`)
- **Columns:** Lowercase, snake_case (e.g., `first_name`, `created_at`)
- **Primary Keys:** `id` (SERIAL or UUID)
- **Foreign Keys:** `{table}_id` (e.g., `user_id`, `student_id`)
- **Timestamps:** `created_at`, `updated_at`
- **Soft Delete:** `deleted_at` (nullable timestamp)

## Data Types

- **IDs:** SERIAL (auto-increment integer) or UUID
- **Strings:** VARCHAR(n) or TEXT
- **Numbers:** INTEGER, BIGINT, DECIMAL
- **Dates:** DATE, TIMESTAMP, TIMESTAMPTZ
- **Boolean:** BOOLEAN
- **JSON:** JSONB (for flexible data)
- **Enum:** Custom ENUM types for fixed values
```

#### 3.1.2 Create Schema SQL Files

Create `database/schemas/01_enums.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 1: Enum Types
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'principal',
  'teacher',
  'parent',
  'student',
  'staff'
);

-- User status
CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'pending'
);

-- Gender
CREATE TYPE gender AS ENUM (
  'male',
  'female'
);

-- Relationship type
CREATE TYPE relationship_type AS ENUM (
  'father',
  'mother',
  'guardian',
  'other'
);

-- Application status
CREATE TYPE application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'waitlisted',
  'withdrawn'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'cancelled'
);

-- Payment method
CREATE TYPE payment_method AS ENUM (
  'cash',
  'bank_transfer',
  'sslcommerz',
  'bkash',
  'nagad',
  'card'
);

-- Attendance status
CREATE TYPE attendance_status AS ENUM (
  'present',
  'absent',
  'late',
  'excused',
  'half_day'
);

-- Assignment status
CREATE TYPE assignment_status AS ENUM (
  'assigned',
  'submitted',
  'graded',
  'late',
  'missing'
);

-- Exam type
CREATE TYPE exam_type AS ENUM (
  'midterm',
  'final',
  'quiz',
  'practical',
  'oral',
  'class_test'
);

-- Fee type
CREATE TYPE fee_type AS ENUM (
  'tuition',
  'admission',
  'exam',
  'transport',
  'library',
  'sports',
  'development',
  'other'
);

-- Student status
CREATE TYPE student_status AS ENUM (
  'active',
  'inactive',
  'graduated',
  'transferred',
  'expelled',
  'withdrawn'
);

-- Teacher employment status
CREATE TYPE employment_status AS ENUM (
  'full_time',
  'part_time',
  'contract',
  'substitute',
  'resigned',
  'retired'
);

-- Message status
CREATE TYPE message_status AS ENUM (
  'unread',
  'read',
  'archived'
);

-- Notification type
CREATE TYPE notification_type AS ENUM (
  'info',
  'warning',
  'success',
  'error',
  'announcement'
);

-- Content status
CREATE TYPE content_status AS ENUM (
  'draft',
  'published',
  'archived',
  'scheduled'
);

-- Language code
CREATE TYPE language_code AS ENUM (
  'en',
  'bn',
  'ar'
);

COMMENT ON TYPE user_role IS 'User roles in the system';
COMMENT ON TYPE user_status IS 'User account status';
COMMENT ON TYPE gender IS 'Gender options';
COMMENT ON TYPE application_status IS 'Admission application status';
COMMENT ON TYPE payment_status IS 'Payment transaction status';
COMMENT ON TYPE attendance_status IS 'Student attendance status';
```

Create `database/schemas/02_core_tables.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 2: Core Tables
-- =============================================

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Users table (master user accounts)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  status user_status NOT NULL DEFAULT 'pending',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

COMMENT ON TABLE users IS 'Main user accounts table';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN users.failed_login_attempts IS 'Count of consecutive failed logins';
COMMENT ON COLUMN users.locked_until IS 'Account locked until this timestamp';

-- User profiles (extended user information)
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name_bn VARCHAR(100),
  last_name_bn VARCHAR(100),
  first_name_ar VARCHAR(100),
  last_name_ar VARCHAR(100),
  phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  date_of_birth DATE,
  gender gender,
  photo_url VARCHAR(500),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Bangladesh',
  national_id VARCHAR(50),
  language_preference language_code DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Asia/Dhaka',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);

COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON COLUMN user_profiles.language_preference IS 'Preferred UI language';

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- User sessions
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Audit logs
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS 'System-wide audit trail';
```

Create `database/schemas/03_academic_tables.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 3: Academic Management Tables
-- =============================================

-- =============================================
-- ACADEMIC STRUCTURE
-- =============================================

-- Academic years
CREATE TABLE academic_years (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_academic_years_is_current ON academic_years(is_current);

COMMENT ON TABLE academic_years IS 'Academic year definitions';

-- Classes/Grades
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  name_bn VARCHAR(50),
  name_ar VARCHAR(50),
  level INTEGER NOT NULL,
  description TEXT,
  academic_year_id INTEGER REFERENCES academic_years(id),
  capacity INTEGER,
  tuition_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);
CREATE INDEX idx_classes_level ON classes(level);

COMMENT ON TABLE classes IS 'Grade levels/classes';
COMMENT ON COLUMN classes.level IS 'Numeric grade level (1-12)';

-- Sections
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  room_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, name)
);

CREATE INDEX idx_sections_class_id ON sections(class_id);

COMMENT ON TABLE sections IS 'Class sections (e.g., Class 5-A, Class 5-B)';

-- Subjects
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  name_bn VARCHAR(100),
  name_ar VARCHAR(100),
  description TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE,
  credit_hours DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_is_mandatory ON subjects(is_mandatory);

COMMENT ON TABLE subjects IS 'Academic subjects';

-- Class subjects (subjects offered in each class)
CREATE TABLE class_subjects (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  is_compulsory BOOLEAN DEFAULT TRUE,
  weekly_hours INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, subject_id)
);

CREATE INDEX idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject_id ON class_subjects(subject_id);

-- =============================================
-- STUDENTS
-- =============================================

-- Students
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  admission_number VARCHAR(20) UNIQUE NOT NULL,
  admission_date DATE NOT NULL,
  class_id INTEGER REFERENCES classes(id),
  section_id INTEGER REFERENCES sections(id),
  roll_number VARCHAR(20),
  status student_status DEFAULT 'active',
  blood_group VARCHAR(5),
  medical_conditions TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(50),
  previous_school VARCHAR(200),
  transfer_certificate_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_students_status ON students(status);

COMMENT ON TABLE students IS 'Student records';
COMMENT ON COLUMN students.student_id IS 'System-generated student ID';
COMMENT ON COLUMN students.admission_number IS 'Admission number from admission process';

-- =============================================
-- PARENTS/GUARDIANS
-- =============================================

-- Parents
CREATE TABLE parents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occupation VARCHAR(100),
  organization VARCHAR(200),
  annual_income DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parents_user_id ON parents(user_id);

-- Parent-Student relationships
CREATE TABLE parent_student (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL,
  is_primary_contact BOOLEAN DEFAULT FALSE,
  can_pickup BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_student_parent_id ON parent_student(parent_id);
CREATE INDEX idx_parent_student_student_id ON parent_student(student_id);

COMMENT ON TABLE parent_student IS 'Parent-student relationships';
COMMENT ON COLUMN parent_student.is_primary_contact IS 'Primary contact for this student';

-- =============================================
-- TEACHERS
-- =============================================

-- Teachers
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  join_date DATE NOT NULL,
  end_date DATE,
  qualification VARCHAR(200),
  specialization VARCHAR(200),
  experience_years INTEGER,
  employment_status employment_status DEFAULT 'full_time',
  salary DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX idx_teachers_employment_status ON teachers(employment_status);

-- Teacher-Subject assignments
CREATE TABLE teacher_subjects (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id INTEGER REFERENCES sections(id),
  academic_year_id INTEGER REFERENCES academic_years(id),
  is_class_teacher BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id, subject_id, class_id, section_id, academic_year_id)
);

CREATE INDEX idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject_id ON teacher_subjects(subject_id);
CREATE INDEX idx_teacher_subjects_class_id ON teacher_subjects(class_id);

COMMENT ON COLUMN teacher_subjects.is_class_teacher IS 'Is this teacher the class teacher';
```

*Continue to Part 3 for remaining database tables...*

---

**Document Status:** Part 2 Complete  
**Next Part:** Phase 3 Continuation and Phases 4-6
