# Smart Academy Website Redevelopment
## Quick Start Guide - Local Development Setup

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
8. [Development Workflow](#development-workflow)

---

## Prerequisites

### Required Software

- **Operating System:** Windows 11 or Linux (Ubuntu 22.04 recommended)
- **Node.js:** v20.11.0 LTS
- **npm:** v10.x (comes with Node.js)
- **Git:** Latest version
- **VSCode:** Latest version
- **Docker Desktop:** Latest version (optional but recommended)
- **PostgreSQL:** 16+ (can use Docker)
- **Redis:** 7+ (can use Docker)

### Hardware Requirements

- CPU: Intel Core i5 or AMD Ryzen 5 (8th Gen or newer)
- RAM: 16GB minimum
- Storage: 20GB free space on SSD
- Internet: Stable broadband connection

---

## Initial Setup

### Step 1: Install Node.js

**Windows:**
```powershell
# Download Node.js installer from https://nodejs.org/
# Run the installer and follow the prompts
# Verify installation
node --version  # Should show v20.11.0
npm --version   # Should show 10.x.x
```

**Linux (Ubuntu):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node.js
nvm install 20.11.0
nvm use 20.11.0
nvm alias default 20.11.0

# Verify
node --version
npm --version
```

### Step 2: Install Git

**Windows:**
```powershell
# Download Git from https://git-scm.com/download/win
# Run the installer
# Verify
git --version
```

**Linux:**
```bash
sudo apt update
sudo apt install git
git --version
```

### Step 3: Install VSCode

**Windows:**
```powershell
# Download from https://code.visualstudio.com/
# Run the installer
```

**Linux:**
```bash
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

### Step 4: Install Docker Desktop (Recommended)

**Windows:**
```powershell
# Download from https://www.docker.com/products/docker-desktop/
# Run the installer
# Start Docker Desktop
# Verify
docker --version
docker compose version
```

**Linux:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify
docker --version
docker compose version
```

### Step 5: Clone Repository

```bash
# Create project directory
mkdir -p ~/projects
cd ~/projects

# Clone repository (replace with actual repo URL)
git clone https://github.com/smart-foundation/smart-academy.git
cd smart-academy

# Create necessary directories
mkdir -p backend frontend database shared docs
```

---

## Database Setup

### Option A: Using Docker (Recommended)

#### Step 1: Create Docker Compose File

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: smart_academy_postgres_dev
    environment:
      POSTGRES_DB: smart_academy_dev
      POSTGRES_USER: smart_admin
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: smart_academy_redis_dev
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data
    restart: unless-stopped

  mailhog:
    image: mailhog/mailhog:latest
    container_name: smart_academy_mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: smart_academy_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@smartacademy.local
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    volumes:
      - pgadmin_dev_data:/var/lib/pgadmin
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_dev_data:
  redis_dev_data:
  pgadmin_dev_data:
```

#### Step 2: Start Services

```bash
# Start all services
docker compose -f docker-compose.dev.yml up -d

# Check status
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down
```

#### Step 3: Access Services

- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **pgAdmin:** http://localhost:5050
- **MailHog UI:** http://localhost:8025

### Option B: Native Installation

**Windows:**
```powershell
# Install PostgreSQL
# Download from https://www.postgresql.org/download/windows/
# Run installer, set password for postgres user

# Install Redis (via WSL2)
wsl --install
# Then install Redis in WSL2

# Or use Redis for Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

**Linux:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

---

## Backend Setup

### Step 1: Initialize Backend Project

```bash
cd backend

# Install dependencies
npm install

# Install dev dependencies
npm install -D typescript @types/node @types/express ts-node nodemon
```

### Step 2: Create Environment File

Create `backend/.env.development`:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://smart_admin:dev_password_123@localhost:5432/smart_academy_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_academy_dev
DB_USER=smart_admin
DB_PASSWORD=dev_password_123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets (for development only)
JWT_SECRET=dev_jwt_secret_key_minimum_32_characters_long
JWT_REFRESH_SECRET=dev_refresh_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Session
SESSION_SECRET=dev_session_secret_key_minimum_32_characters
SESSION_MAX_AGE=86400000

# Email (MailHog for development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@smartacademy.local

# SMS (Test mode)
SMS_PROVIDER=test
SMS_API_KEY=test_key
SMS_SENDER_ID=SmartAcad

# Payment Gateways (Sandbox)
SSLCOMMERZ_STORE_ID=test_store_id
SSLCOMMERZ_STORE_PASSWORD=test_password
SSLCOMMERZ_SANDBOX=true

BKASH_APP_KEY=test_app_key
BKASH_APP_SECRET=test_app_secret
BKASH_USERNAME=test_username
BKASH_PASSWORD=test_password
BKASH_SANDBOX=true

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,docx

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# Application
APP_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1
```

### Step 3: Create Database Tables

```bash
# Run migrations
npm run migrate

# Or create tables manually
psql -U smart_admin -d smart_academy_dev -f database/schema.sql
```

### Step 4: Seed Database (Optional)

```bash
# Run seed data
npm run seed
```

### Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# The API will be available at http://localhost:5000
```

### Step 6: Verify Backend

Open browser or use curl:
```bash
curl http://localhost:5000/api/v1/health
```

Should return:
```json
{
  "uptime": 123,
  "timestamp": 1701234567890,
  "status": "OK",
  "database": "connected",
  "redis": "connected"
}
```

---

## Frontend Setup

### Step 1: Initialize Frontend Project

```bash
cd frontend

# Create Next.js project
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Or if already initialized
npm install
```

### Step 2: Create Environment File

Create `frontend/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false

# Google Maps (for development, use test key)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_test_key
```

### Step 3: Install Dependencies

```bash
# Install required packages
npm install \
  next-intl \
  axios \
  zustand \
  @tanstack/react-query \
  react-hook-form \
  @hookform/resolvers \
  zod \
  framer-motion \
  lucide-react \
  date-fns \
  class-variance-authority \
  clsx \
  tailwind-merge

# Install dev dependencies
npm install -D \
  @types/react \
  @types/react-dom \
  @types/node \
  @testing-library/react \
  @testing-library/jest-dom \
  jest \
  jest-environment-jsdom
```

### Step 4: Start Frontend Server

```bash
# Development mode
npm run dev

# The application will be available at http://localhost:3000
```

---

## Running the Application

### Full Stack Development

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 3: Docker Services (if using)
```bash
docker compose -f docker-compose.dev.yml up
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **API Docs:** http://localhost:5000/api-docs (if Swagger is configured)
- **pgAdmin:** http://localhost:5050
- **MailHog:** http://localhost:8025

---

## Common Issues & Troubleshooting

### Issue 1: Port Already in Use

**Problem:** Error: Port 5000 is already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

### Issue 2: Database Connection Failed

**Problem:** Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
docker compose ps  # If using Docker
sudo systemctl status postgresql  # If native

# Check connection
psql -U smart_admin -d smart_academy_dev -h localhost

# Reset Docker containers
docker compose down -v
docker compose up -d
```

### Issue 3: Redis Connection Failed

**Problem:** Cannot connect to Redis

**Solution:**
```bash
# Test Redis connection
redis-cli ping  # Should return PONG

# Check if Redis is running
docker compose ps redis
sudo systemctl status redis-server

# Restart Redis
docker compose restart redis
```

### Issue 4: Module Not Found

**Problem:** Error: Cannot find module 'xxx'

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### Issue 5: TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Rebuild TypeScript
npm run build

# Fix common issues
npm install -D @types/node @types/express @types/react
```

### Issue 6: Permission Denied (Linux)

**Problem:** EACCES: permission denied

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Or use sudo (not recommended)
sudo npm install
```

---

## Development Workflow

### Daily Workflow

1. **Pull Latest Changes**
   ```bash
   git pull origin develop
   ```

2. **Start Development Environment**
   ```bash
   # Start Docker services
   docker compose -f docker-compose.dev.yml up -d
   
   # Start backend
   cd backend && npm run dev
   
   # Start frontend (in new terminal)
   cd frontend && npm run dev
   ```

3. **Make Changes**
   - Edit code in VSCode
   - Changes auto-reload in development mode

4. **Test Changes**
   ```bash
   # Run tests
   npm test
   
   # Check types
   npm run type-check
   
   # Lint code
   npm run lint
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   git push origin feature/user-auth
   ```

### Creating a New Feature

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/admission-system
   ```

2. **Develop Feature**
   - Write code
   - Write tests
   - Update documentation

3. **Test Thoroughly**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Create Pull Request**
   ```bash
   git push origin feature/admission-system
   # Then create PR on GitHub
   ```

### Database Migrations

```bash
# Create new migration
npm run migration:create add_student_table

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:undo

# Rollback all migrations
npm run migrate:undo:all
```

### Debugging

**VSCode Debug Configuration (.vscode/launch.json):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Next Steps

1. **Review Technology Stack Documents:**
   - Part 1: Overview and Core Technologies
   - Part 2: Frontend Technologies
   - Part 3: Backend Technologies
   - Part 4: Database and Infrastructure
   - Part 5: Deployment and Monitoring

2. **Explore Project Structure:**
   - Review SRS documents
   - Understand database schema
   - Review API endpoints

3. **Start Development:**
   - Pick a feature to work on
   - Follow development workflow
   - Write tests
   - Submit pull requests

4. **Join Team:**
   - Set up communication channels
   - Review coding standards
   - Attend team meetings

---

## Support

For issues or questions:
- Check documentation in `/docs` directory
- Review SRS documents
- Contact team lead
- Create issue on GitHub

---

**Happy Coding!** 🚀
