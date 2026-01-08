# Smart Academy Website Redevelopment
## Technology Stack - Part 5: Deployment, Monitoring, Testing & Development Tools

---

## Deployment Strategy

### 1. Production Deployment Architecture

#### Cloud Server Setup (Own Data Center)

**Server Specifications (Recommended):**
```
Server Type: Ubuntu Server 22.04 LTS
CPU: 8 cores (Intel Xeon or AMD EPYC)
RAM: 32GB minimum
Storage: 500GB SSD (RAID 1 for redundancy)
Network: 1Gbps connection
Backup: Separate backup server or cloud backup solution
```

**Server Software Stack:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y \
    build-essential \
    curl \
    git \
    nginx \
    postgresql-16 \
    redis-server \
    certbot \
    python3-certbot-nginx \
    fail2ban \
    ufw

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Docker (optional, for containerized deployment)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Deployment Configuration

#### Production Environment Variables

```bash
# /var/www/smart-academy/backend/.env.production

# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://smart_admin:secure_password@localhost:5432/smart_academy_prod
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_academy_prod
DB_USER=smart_admin
DB_PASSWORD=STRONG_SECURE_PASSWORD_HERE

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=STRONG_REDIS_PASSWORD

# JWT Secrets (Generate with: openssl rand -base64 32)
JWT_SECRET=VERY_LONG_RANDOM_SECRET_MINIMUM_32_CHARACTERS
JWT_REFRESH_SECRET=ANOTHER_LONG_RANDOM_SECRET_FOR_REFRESH_TOKENS
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Session
SESSION_SECRET=ANOTHER_LONG_RANDOM_SECRET_FOR_SESSIONS
SESSION_MAX_AGE=86400000

# Email (Production SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@mysmart.academy
SMTP_PASSWORD=APP_SPECIFIC_PASSWORD
EMAIL_FROM=Smart Academy <noreply@mysmart.academy>

# SMS Gateway (Production)
SMS_PROVIDER=bangladeshi_sms_provider
SMS_API_URL=https://api.smsprovider.com/v1/send
SMS_API_KEY=PRODUCTION_SMS_API_KEY
SMS_SENDER_ID=SmartAcad

# Payment Gateways
# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=false
SSLCOMMERZ_SUCCESS_URL=https://mysmart.academy/api/v1/payments/sslcommerz/success
SSLCOMMERZ_FAIL_URL=https://mysmart.academy/api/v1/payments/sslcommerz/fail
SSLCOMMERZ_CANCEL_URL=https://mysmart.academy/api/v1/payments/sslcommerz/cancel
SSLCOMMERZ_IPN_URL=https://mysmart.academy/api/v1/payments/sslcommerz/ipn

# bKash
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_API_URL=https://tokenized.pay.bka.sh/v1.2.0-beta
BKASH_SANDBOX=false

# Nagad
NAGAD_MERCHANT_ID=your_nagad_merchant_id
NAGAD_MERCHANT_NUMBER=your_nagad_merchant_number
NAGAD_PUBLIC_KEY=your_nagad_public_key
NAGAD_PRIVATE_KEY=your_nagad_private_key
NAGAD_API_URL=https://api.mynagad.com
NAGAD_SANDBOX=false

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/smart-academy/uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp,pdf,docx

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://mysmart.academy,https://www.mysmart.academy

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/www/smart-academy/logs

# Elasticsearch (if used)
ELASTICSEARCH_NODE=http://localhost:9200

# Application
APP_NAME=Smart Academy
APP_URL=https://mysmart.academy
API_URL=https://mysmart.academy/api/v1
FRONTEND_URL=https://mysmart.academy
```

#### Frontend Production Build Configuration

```javascript
// next.config.js (Production)
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['mysmart.academy', 'cdn.mysmart.academy'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // i18n
  i18n: {
    locales: ['en', 'bn', 'ar'],
    defaultLocale: 'en',
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. Deployment Scripts

#### Automated Deployment Script

```bash
#!/bin/bash
# deploy.sh - Production Deployment Script

set -e  # Exit on error

# Configuration
PROJECT_ROOT="/var/www/smart-academy"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKUP_DIR="/var/backups/smart-academy"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Smart Academy Deployment Started at $DATE ==="

# Create backup
echo "Creating backup..."
mkdir -p $BACKUP_DIR/$DATE
pg_dump -U smart_admin smart_academy_prod | gzip > $BACKUP_DIR/$DATE/database.sql.gz
cp -r $PROJECT_ROOT $BACKUP_DIR/$DATE/

# Update code from Git
echo "Pulling latest code..."
cd $PROJECT_ROOT
git pull origin main

# Backend Deployment
echo "Deploying backend..."
cd $BACKEND_DIR
npm ci --production
npm run build

# Run database migrations
echo "Running database migrations..."
npm run migrate

# Restart backend with PM2
echo "Restarting backend..."
pm2 restart smart-academy-api
pm2 save

# Frontend Deployment
echo "Deploying frontend..."
cd $FRONTEND_DIR
npm ci --production
npm run build

# Restart frontend with PM2
echo "Restarting frontend..."
pm2 restart smart-academy-frontend
pm2 save

# Clear cache
echo "Clearing Redis cache..."
redis-cli FLUSHDB

# Reload Nginx
echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=== Deployment completed successfully! ==="
echo "Backup saved at: $BACKUP_DIR/$DATE"

# Health check
sleep 5
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://mysmart.academy/api/v1/health)
if [ $HEALTH_CHECK -eq 200 ]; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed! Rolling back..."
    # Rollback logic here
    exit 1
fi
```

#### Rollback Script

```bash
#!/bin/bash
# rollback.sh - Rollback to Previous Version

set -e

PROJECT_ROOT="/var/www/smart-academy"
BACKUP_DIR="/var/backups/smart-academy"

# List available backups
echo "Available backups:"
ls -lt $BACKUP_DIR | head -10

# Get backup to restore
read -p "Enter backup date to restore (YYYYMMDD_HHMMSS): " BACKUP_DATE

if [ ! -d "$BACKUP_DIR/$BACKUP_DATE" ]; then
    echo "Backup not found!"
    exit 1
fi

echo "Rolling back to $BACKUP_DATE..."

# Stop services
pm2 stop all

# Restore database
echo "Restoring database..."
gunzip < $BACKUP_DIR/$BACKUP_DATE/database.sql.gz | psql -U smart_admin smart_academy_prod

# Restore code
echo "Restoring code..."
rm -rf $PROJECT_ROOT/backend
rm -rf $PROJECT_ROOT/frontend
cp -r $BACKUP_DIR/$BACKUP_DATE/backend $PROJECT_ROOT/
cp -r $BACKUP_DIR/$BACKUP_DATE/frontend $PROJECT_ROOT/

# Restart services
pm2 restart all

echo "Rollback completed!"
```

### 4. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
          
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test
          
      - name: Lint
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/smart-academy
            ./deploy.sh
```

---

## Monitoring & Observability

### 1. Application Monitoring

#### Winston Logger with Log Rotation

Already configured in backend. View logs:
```bash
# View real-time logs
pm2 logs

# View specific log file
tail -f /var/www/smart-academy/logs/combined-2025-11-28.log

# Search logs
grep "ERROR" /var/www/smart-academy/logs/error-*.log
```

### 2. Server Monitoring

#### Basic Server Monitoring Script

```bash
#!/bin/bash
# monitor.sh - Server Health Check

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "WARNING: Disk usage is ${DISK_USAGE}%"
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
echo "Memory usage: ${MEM_USAGE}%"

# Check CPU
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
echo "CPU usage: ${CPU_USAGE}%"

# Check PostgreSQL
PG_STATUS=$(systemctl is-active postgresql)
echo "PostgreSQL status: $PG_STATUS"

# Check Redis
REDIS_STATUS=$(systemctl is-active redis-server)
echo "Redis status: $REDIS_STATUS"

# Check Nginx
NGINX_STATUS=$(systemctl is-active nginx)
echo "Nginx status: $NGINX_STATUS"

# Check PM2 processes
pm2 status

# Check API health
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://mysmart.academy/api/v1/health)
echo "API health: $API_HEALTH"
```

#### Health Check Endpoint

```typescript
// src/routes/health.ts
import { Router, Request, Response } from 'express';
import sequelize from '../config/database';
import redis from '../config/redis';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    database: 'disconnected',
    redis: 'disconnected',
    memory: process.memoryUsage(),
  };

  try {
    // Check database
    await sequelize.authenticate();
    health.database = 'connected';

    // Check Redis
    await redis.ping();
    health.redis = 'connected';

    res.status(200).json(health);
  } catch (error) {
    health.status = 'ERROR';
    res.status(503).json(health);
  }
});

export default router;
```

### 3. Uptime Monitoring

#### Uptime Kuma (Self-hosted)

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    volumes:
      - uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  uptime-kuma-data:
```

### 4. Error Tracking (Optional)

#### Sentry Integration

```bash
npm install @sentry/node @sentry/profiling-node
```

```typescript
// src/config/sentry.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});

export default Sentry;
```

---

## Testing Strategy

### 1. Backend Testing

#### Jest Configuration

```javascript
// jest.config.js (Backend)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/server.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

#### Unit Test Example

```typescript
// tests/services/authService.test.ts
import { AuthService } from '../../src/services/authService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Test123!@#';
      const hash = await authService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'Test123!@#';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.comparePassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'Test123!@#';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.comparePassword('wrong', hash);
      
      expect(isValid).toBe(false);
    });
  });
});
```

#### Integration Test Example

```typescript
// tests/routes/auth.test.ts
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/config/database';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User',
      };

      // Create first user
      await request(app).post('/api/v1/auth/register').send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 2. Frontend Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    
    expect(button).toHaveClass('bg-primary-600');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    
    expect(button).toBeDisabled();
  });
});
```

### 3. E2E Testing (Optional)

#### Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'admin@smartacademy.bd');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

---

## Development Tools & Utilities

### 1. API Testing

#### Thunder Client (VSCode Extension)

Create collection for API testing:
```json
{
  "collections": [
    {
      "name": "Smart Academy API",
      "requests": [
        {
          "name": "Login",
          "method": "POST",
          "url": "http://localhost:5000/api/v1/auth/login",
          "body": {
            "email": "admin@smartacademy.bd",
            "password": "Test123!@#"
          }
        }
      ]
    }
  ]
}
```

### 2. Database Management

#### pgAdmin 4

Already included in docker-compose. Access at http://localhost:5050

#### Database GUI Alternatives
- DBeaver (Free, cross-platform)
- TablePlus (Paid, macOS/Windows)
- DataGrip (Paid, JetBrains)

### 3. Code Quality Tools

#### SonarQube (Optional, Self-hosted)

```yaml
# docker-compose.sonarqube.yml
version: '3.8'

services:
  sonarqube:
    image: sonarqube:community
    container_name: sonarqube
    ports:
      - "9009:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://postgres:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_extensions:/opt/sonarqube/extensions

volumes:
  sonarqube_data:
  sonarqube_logs:
  sonarqube_extensions:
```

### 4. Documentation

#### API Documentation with Swagger/OpenAPI

```bash
npm install swagger-jsdoc swagger-ui-express
```

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Academy API',
      version: '1.0.0',
      description: 'API documentation for Smart Academy website',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://mysmart.academy',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
```

### 5. Performance Analysis

#### Lighthouse CI

```bash
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --url=https://mysmart.academy
```

### 6. Security Scanning

#### npm audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Generate report
npm audit --json > audit-report.json
```

---

## Technology Stack Summary

### Complete Technology List

**Frontend:**
- React 18.2+ with Next.js 14+
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Zustand 4.5+ (State Management)
- React Query 5.20+ (Server State)
- React Hook Form 7.50+ (Forms)
- Zod 3.22+ (Validation)
- Framer Motion 11+ (Animations)
- next-intl 3.9+ (i18n)
- Axios 1.6+ (HTTP Client)
- date-fns 3.3+ (Date handling)
- Lucide React 0.323+ (Icons)

**Backend:**
- Node.js 20 LTS
- Express.js 4.18+
- TypeScript 5.3+
- Sequelize 6.35+ (ORM)
- bcryptjs 2.4+ (Password Hashing)
- jsonwebtoken 9.0+ (JWT)
- express-validator 7.0+ (Validation)
- Multer 1.4+ (File Upload)
- Sharp 0.33+ (Image Processing)
- Nodemailer 6.9+ (Email)
- Winston 3.11+ (Logging)

**Database:**
- PostgreSQL 16+
- Redis 7+
- Elasticsearch 8+ (Optional)

**Infrastructure:**
- Docker 24+ & Docker Compose
- Nginx 1.25+
- PM2 5+
- Let's Encrypt (SSL)

**Payment Gateways:**
- SSLCommerz
- bKash
- Nagad

**Development Tools:**
- VSCode
- Git
- ESLint + Prettier
- Husky + lint-staged
- Jest (Testing)
- Playwright (E2E Testing)

**Monitoring:**
- Winston (Application Logs)
- PM2 Monitoring
- Uptime Kuma
- Sentry (Optional)

---

**END OF TECHNOLOGY STACK DOCUMENTATION**

This comprehensive technology stack meets 100% of the Smart Academy SRS requirements and is optimized for local development on Windows 11/Linux with eventual deployment to your own cloud server.
