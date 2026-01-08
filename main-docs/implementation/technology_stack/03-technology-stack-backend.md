# Smart Academy Website Redevelopment
## Technology Stack - Part 3: Backend Technologies

---

## Backend Technologies

### 1. Core Framework

#### Node.js 20 LTS + Express.js 4.18+

**Purpose:** Scalable backend server and REST API

**Why Express.js:**
- ✅ Mature and stable framework
- ✅ Extensive middleware ecosystem
- ✅ Excellent documentation
- ✅ Performance and scalability
- ✅ TypeScript support
- ✅ Large community
- ✅ Easy to test and maintain

**Installation:**
```bash
mkdir smart-academy-backend
cd smart-academy-backend
npm init -y
npm install express
npm install -D typescript @types/express @types/node ts-node nodemon
```

**package.json (Backend):**
```json
{
  "name": "smart-academy-backend",
  "version": "1.0.0",
  "description": "Smart Academy Backend API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "migrate": "node dist/database/migrate.js",
    "seed": "node dist/database/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.1",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1",
    "multer": "^1.4.5-lts.1",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.35.2",
    "ioredis": "^5.3.2",
    "nodemailer": "^6.9.8",
    "axios": "^1.6.5",
    "date-fns": "^3.3.1",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "pdfkit": "^0.14.0",
    "archiver": "^6.0.1",
    "sharp": "^0.33.2",
    "file-type": "^18.7.0",
    "clamav.js": "^0.17.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.6",
    "@types/nodemailer": "^6.4.14",
    "@types/pdfkit": "^0.13.3",
    "@types/archiver": "^6.0.2",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.2",
    "supertest": "^6.3.4",
    "@types/supertest": "^6.0.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

**Backend TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/controllers/*": ["./src/controllers/*"],
      "@/models/*": ["./src/models/*"],
      "@/services/*": ["./src/services/*"],
      "@/middlewares/*": ["./src/middlewares/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/config/*": ["./src/config/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 2. Database ORM

#### Sequelize 6.35+

**Purpose:** PostgreSQL ORM for type-safe database operations

**Why Sequelize:**
- ✅ Mature ORM with excellent TypeScript support
- ✅ Migration system
- ✅ Association management
- ✅ Transaction support
- ✅ Query builder
- ✅ Validation and hooks

**Installation:**
```bash
npm install sequelize pg pg-hstore
npm install -D sequelize-cli @types/sequelize
```

**Sequelize Configuration:**
```typescript
// src/config/database.ts
import { Sequelize } from 'sequelize';
import { config } from './config';

const sequelize = new Sequelize({
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  },
  dialectOptions: {
    ssl: config.env === 'production' ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
});

export default sequelize;
```

**Example Model:**
```typescript
// src/models/Student.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StudentAttributes {
  id: string;
  userId: string;
  studentId: string;
  admissionDate: Date;
  classId: string;
  sectionId: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes {
  public id!: string;
  public userId!: string;
  public studentId!: string;
  public admissionDate!: Date;
  public classId!: string;
  public sectionId!: string;
  public status!: 'active' | 'inactive' | 'graduated' | 'transferred';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    studentId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    admissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'transferred'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    underscored: true,
  }
);

export default Student;
```

### 3. Authentication & Authorization

#### JWT (jsonwebtoken) + bcryptjs

**Purpose:** Secure authentication and password hashing

**Installation:**
```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

**Authentication Service:**
```typescript
// src/services/authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/config';
import User from '../models/User';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.auth.bcryptRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.auth.jwtRefreshSecret, {
      expiresIn: config.auth.jwtRefreshExpiresIn,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.auth.jwtSecret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.auth.jwtRefreshSecret) as TokenPayload;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await this.comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }
}
```

**Authentication Middleware:**
```typescript
// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
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
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyAccessToken(token);
    
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
```

### 4. Input Validation

#### express-validator 7+

**Purpose:** Request validation and sanitization

**Installation:**
```bash
npm install express-validator
```

**Validation Middleware:**
```typescript
// src/validators/admissionValidator.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const admissionValidation = [
  body('studentName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Student name must be between 2 and 100 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 3 || age > 18) {
        throw new Error('Age must be between 3 and 18 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be male or female'),
  
  body('parentEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  
  body('parentPhone')
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Invalid Bangladesh phone number'),
  
  body('classApplied')
    .notEmpty()
    .withMessage('Class is required'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};
```

### 5. File Upload Management

#### Multer 1.4+ + Sharp 0.33+

**Purpose:** File upload handling and image processing

**Installation:**
```bash
npm install multer sharp file-type
npm install -D @types/multer
```

**File Upload Service:**
```typescript
// src/services/uploadService.ts
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import crypto from 'crypto';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export class FileUploadService {
  private uploadDir = process.env.UPLOAD_PATH || './uploads';

  async saveImage(
    buffer: Buffer,
    directory: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): Promise<string> {
    const { width = 1200, height, quality = 80 } = options || {};
    
    // Generate unique filename
    const filename = `${crypto.randomUUID()}.webp`;
    const filepath = path.join(this.uploadDir, directory, filename);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    // Process and save image
    await sharp(buffer)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(filepath);
    
    return filepath;
  }

  async savePDF(
    buffer: Buffer,
    directory: string
  ): Promise<string> {
    const filename = `${crypto.randomUUID()}.pdf`;
    const filepath = path.join(this.uploadDir, directory, filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    
    return filepath;
  }

  async deleteFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
```

### 6. Email Service

#### Nodemailer 6.9+

**Purpose:** Email sending functionality

**Installation:**
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**Email Service:**
```typescript
// src/services/emailService.ts
import nodemailer from 'nodemailer';
import { config } from '../config/config';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendAdmissionConfirmation(email: string, applicationId: string) {
    const html = `
      <h1>Application Received</h1>
      <p>Thank you for applying to Smart Academy.</p>
      <p>Your application ID is: <strong>${applicationId}</strong></p>
      <p>We will review your application and contact you soon.</p>
    `;

    return this.sendEmail(email, 'Application Received - Smart Academy', html);
  }

  async sendPaymentReceipt(email: string, receiptData: any) {
    // Implementation for payment receipt email
  }

  async sendPasswordReset(email: string, resetToken: string) {
    const resetUrl = `${config.app.url}/reset-password?token=${resetToken}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    return this.sendEmail(email, 'Password Reset - Smart Academy', html);
  }
}
```

### 7. SMS Service

#### Bangladesh SMS Gateway Integration

**Purpose:** SMS notifications and OTP

**SMS Service Implementation:**
```typescript
// src/services/smsService.ts
import axios from 'axios';
import { config } from '../config/config';

export class SMSService {
  private apiUrl: string;
  private apiKey: string;
  private senderId: string;

  constructor() {
    this.apiUrl = config.sms.apiUrl;
    this.apiKey = config.sms.apiKey;
    this.senderId = config.sms.senderId;
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Bangladesh SMS Gateway API format
      const response = await axios.post(this.apiUrl, {
        api_key: this.apiKey,
        sender_id: this.senderId,
        to: to,
        message: message,
      });

      return response.data.status === 'success';
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  async sendOTP(phone: string, otp: string): Promise<boolean> {
    const message = `Your Smart Academy OTP is: ${otp}. Valid for 5 minutes.`;
    return this.sendSMS(phone, message);
  }

  async sendAdmissionNotification(phone: string, status: string): Promise<boolean> {
    const message = `Your Smart Academy admission application status: ${status}`;
    return this.sendSMS(phone, message);
  }

  async sendPaymentConfirmation(phone: string, amount: number): Promise<boolean> {
    const message = `Payment of BDT ${amount} received. Thank you!`;
    return this.sendSMS(phone, message);
  }
}
```

### 8. Payment Gateway Integration

#### SSLCommerz, bKash, Nagad

**Purpose:** Bangladesh payment gateway integrations

**Installation:**
```bash
npm install sslcommerz-lts
```

**Payment Service:**
```typescript
// src/services/paymentService.ts
import SSLCommerzPayment from 'sslcommerz-lts';
import axios from 'axios';
import { config } from '../config/config';

export class PaymentService {
  private sslcommerz: SSLCommerzPayment;

  constructor() {
    this.sslcommerz = new SSLCommerzPayment(
      config.payment.sslcommerz.storeId,
      config.payment.sslcommerz.storePassword,
      config.payment.sslcommerz.sandbox
    );
  }

  // SSLCommerz Integration
  async initiateSSLCommerzPayment(paymentData: {
    amount: number;
    transactionId: string;
    studentId: string;
    email: string;
    phone: string;
  }) {
    const data = {
      total_amount: paymentData.amount,
      currency: 'BDT',
      tran_id: paymentData.transactionId,
      success_url: `${config.app.apiUrl}/payments/success`,
      fail_url: `${config.app.apiUrl}/payments/fail`,
      cancel_url: `${config.app.apiUrl}/payments/cancel`,
      ipn_url: `${config.app.apiUrl}/payments/ipn`,
      product_name: 'Tuition Fee',
      product_category: 'Education',
      product_profile: 'general',
      cus_name: paymentData.studentId,
      cus_email: paymentData.email,
      cus_phone: paymentData.phone,
      cus_add1: 'Narimpur, Ramganj, Laxmipur',
      cus_city: 'Laxmipur',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
    };

    return this.sslcommerz.init(data);
  }

  // bKash Integration
  async initiateBKashPayment(paymentData: {
    amount: number;
    invoiceNumber: string;
  }) {
    const token = await this.getBKashToken();
    
    const response = await axios.post(
      `${config.payment.bkash.apiUrl}/create`,
      {
        mode: '0011',
        payerReference: ' ',
        callbackURL: `${config.app.apiUrl}/payments/bkash/callback`,
        amount: paymentData.amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: paymentData.invoiceNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-APP-Key': config.payment.bkash.appKey,
        },
      }
    );

    return response.data;
  }

  private async getBKashToken(): Promise<string> {
    const response = await axios.post(
      `${config.payment.bkash.apiUrl}/token/grant`,
      {
        app_key: config.payment.bkash.appKey,
        app_secret: config.payment.bkash.appSecret,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          username: config.payment.bkash.username,
          password: config.payment.bkash.password,
        },
      }
    );

    return response.data.id_token;
  }

  // Nagad Integration
  async initiateNagadPayment(paymentData: {
    amount: number;
    orderId: string;
  }) {
    // Nagad API integration
    // Implementation specific to Nagad API requirements
  }

  async verifyPayment(transactionId: string, gateway: 'sslcommerz' | 'bkash' | 'nagad') {
    switch (gateway) {
      case 'sslcommerz':
        return this.sslcommerz.validate({ val_id: transactionId });
      case 'bkash':
        // Verify bKash payment
        break;
      case 'nagad':
        // Verify Nagad payment
        break;
    }
  }
}
```

### 9. Logging

#### Winston 3.11+

**Purpose:** Structured logging system

**Installation:**
```bash
npm install winston winston-daily-rotate-file
```

**Logger Configuration:**
```typescript
// src/config/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const logDir = process.env.LOG_FILE_PATH || './logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'smart-academy-api' },
  transports: [
    // Error logs
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
    }),
    // Combined logs
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
```

### 10. Error Handling

**Global Error Handler:**
```typescript
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

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
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown errors
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 11. Security Middleware

#### Helmet + CORS + Rate Limiting

**Security Configuration:**
```typescript
// src/config/security.ts
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';

export const configureSecurity = (app: Express) => {
  // Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // Stricter rate limit for authentication
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
  });

  app.use('/api/v1/auth/login', authLimiter);
  app.use('/api/v1/auth/register', authLimiter);
};
```

### 12. Cache Management

#### ioredis 5.3+

**Redis Configuration:**
```typescript
// src/config/redis.ts
import Redis from 'ioredis';
import { config } from './config';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;
```

**Cache Service:**
```typescript
// src/services/cacheService.ts
import redis from '../config/redis';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

---

*Continue to next document for Database and Infrastructure...*
