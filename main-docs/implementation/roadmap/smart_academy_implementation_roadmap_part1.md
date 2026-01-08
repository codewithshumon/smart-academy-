# Smart Academy Website - 12-Phase Implementation Roadmap
## Comprehensive Sequential Development Plan

**Version:** 1.0  
**Date:** November 28, 2025  
**Environment:** Local Linux/Windows Desktop → Cloud Deployment  
**Developer:** Single Solo Full-Stack Developer  
**IDE:** VSCode on Linux OS

---

## Document Overview

This comprehensive roadmap provides a detailed, sequential implementation plan for developing the Smart Academy website from initial environment setup through deployment. The plan is specifically tailored for:

- **Solo full-stack developer** working independently
- **Local development** on a Linux desktop computer
- **VSCode IDE** as the primary development environment
- **Sequential implementation** following strict SRS requirements
- **Own cloud server deployment** in Smart Academy's data center

### Key Success Factors

1. **Strict adherence to SRS requirements** - 100% requirement coverage
2. **Technology stack compliance** - Following approved tech stack exactly
3. **Sequential execution** - Each phase builds on previous phases
4. **Testing at every stage** - No phase completion without tests
5. **Documentation** - Code and API documentation throughout

### Total Estimated Timeline

- **Development Duration:** 10-12 months
- **Testing Buffer:** Built into each phase
- **Deployment:** 2-4 weeks additional

---

## Phase 1: Local Development Environment Setup & Project Initialization
**Duration:** 1-2 weeks  
**Effort:** 40-60 hours  
**Prerequisite:** None  
**Deliverables:** Fully configured development environment

### 1.1 Operating System & Core Tools Setup

#### 1.1.1 Linux OS Configuration

```bash
# Verify Linux version (Ubuntu 22.04 LTS recommended)
lsb_release -a

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install -y build-essential curl wget git vim
sudo apt install -y software-properties-common apt-transport-https ca-certificates
```

#### 1.1.2 Install Node.js 20 LTS

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 20.11.0 LTS
nvm install 20.11.0
nvm use 20.11.0
nvm alias default 20.11.0

# Verify installation
node --version  # Should show v20.11.0
npm --version   # Should show 10.x.x

# Install global npm packages
npm install -g yarn pnpm pm2 nodemon eslint prettier
```

#### 1.1.3 Install and Configure Git

```bash
# Install Git
sudo apt install -y git

# Configure Git
git config --global user.name "Smart Academy Dev"
git config --global user.email "dev@smartacademy.bd"
git config --global core.autocrlf input
git config --global init.defaultBranch main
git config --global pull.rebase false

# Generate SSH key for GitHub/GitLab
ssh-keygen -t ed25519 -C "dev@smartacademy.bd"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Display public key to add to GitHub
cat ~/.ssh/id_ed25519.pub
```

#### 1.1.4 Install VSCode IDE

```bash
# Download and install VSCode
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code

# Launch VSCode
code .
```

**Essential VSCode Extensions to Install:**

```bash
# Install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension ms-azuretools.vscode-docker
code --install-extension rangav.vscode-thunder-client
code --install-extension ckolkman.vscode-postgres
code --install-extension cweijan.vscode-redis-client
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag
code --install-extension bradlc.vscode-tailwindcss
code --install-extension humao.rest-client
code --install-extension christian-kohler.npm-intellisense
code --install-extension christian-kohler.path-intellisense
code --install-extension sonarsource.sonarlint-vscode
code --install-extension mhutchie.git-graph
code --install-extension yzhang.markdown-all-in-one
code --install-extension mikestead.dotenv
```

**VSCode Settings Configuration:**

Create `.vscode/settings.json` in your workspace:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.fontSize": 14,
  "editor.wordWrap": "on",
  "editor.rulers": [100],
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### 1.2 Database & Cache Setup (Local)

#### 1.2.1 Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose plugin
sudo apt install docker-compose-plugin

# Verify installations
docker --version
docker compose version

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

#### 1.2.2 Create Development Docker Compose File

Create `docker-compose.dev.yml` in project root:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: smart_academy_postgres_dev
    environment:
      POSTGRES_DB: smart_academy_dev
      POSTGRES_USER: smart_admin
      POSTGRES_PASSWORD: SmartDev2025!Secure
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --lc-collate=en_US.UTF-8 --lc-ctype=en_US.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smart_admin -d smart_academy_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: smart_academy_redis_dev
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Elasticsearch (for search functionality)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: smart_academy_elasticsearch_dev
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_dev_data:/usr/share/elasticsearch/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  # MailHog (Email testing)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: smart_academy_mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    restart: unless-stopped

  # pgAdmin (Database Management UI)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: smart_academy_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@smartacademy.local
      PGADMIN_DEFAULT_PASSWORD: SmartAdmin2025
      PGADMIN_CONFIG_SERVER_MODE: 'False'
      PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_dev_data:/var/lib/pgadmin
    depends_on:
      - postgres
    restart: unless-stopped

  # Redis Commander (Redis Management UI)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: smart_academy_redis_commander
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  postgres_dev_data:
  redis_dev_data:
  elasticsearch_dev_data:
  pgadmin_dev_data:

networks:
  default:
    name: smart_academy_network
    driver: bridge
```

#### 1.2.3 Start Development Services

```bash
# Start all services
docker compose -f docker-compose.dev.yml up -d

# Check service status
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Test PostgreSQL connection
docker exec -it smart_academy_postgres_dev psql -U smart_admin -d smart_academy_dev

# Test Redis connection
docker exec -it smart_academy_redis_dev redis-cli ping
```

**Access Development Tools:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Elasticsearch: `http://localhost:9200`
- pgAdmin: `http://localhost:5050`
- MailHog UI: `http://localhost:8025`
- Redis Commander: `http://localhost:8081`

### 1.3 Project Structure Initialization

#### 1.3.1 Create Root Project Directory

```bash
# Create main project directory
mkdir -p ~/projects/smart-academy
cd ~/projects/smart-academy

# Initialize Git repository
git init
git branch -M main

# Create README
cat > README.md << 'EOF'
# Smart Academy Website

Islamic English Medium School Management System

## Project Structure

- `frontend/` - Next.js 14+ frontend application
- `backend/` - Node.js + Express.js REST API
- `database/` - Database schemas, migrations, and seeds
- `shared/` - Shared types, constants, and utilities
- `docs/` - Project documentation
- `scripts/` - Automation scripts
- `docker/` - Docker configurations

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: Node.js 20, Express.js, TypeScript
- Database: PostgreSQL 16, Redis 7
- Search: Elasticsearch 8

## Getting Started

See [Quick Start Guide](docs/quick-start.md)
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Next.js
.next/
out/
build/

# Environment variables
.env
.env*.local
.env.development
.env.production

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/
*.tmp

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
*.sqlite
*.db

# Build outputs
dist/
*.tsbuildinfo

# Docker
docker-compose.override.yml
EOF
```

#### 1.3.2 Create Complete Directory Structure

```bash
# Create all project directories
mkdir -p frontend/src/{app,components,lib,hooks,contexts,styles,types}
mkdir -p frontend/public/{images,fonts,icons}

mkdir -p backend/src/{controllers,models,routes,middlewares,services,utils,config,validators}
mkdir -p backend/tests/{unit,integration,e2e}
mkdir -p backend/uploads/{students,applications,gallery,documents,receipts}
mkdir -p backend/logs

mkdir -p database/{migrations,seeds,schemas,scripts}

mkdir -p shared/{types,constants,utils}

mkdir -p docs/{api,architecture,deployment,user-guides}

mkdir -p scripts/{setup,deployment,maintenance,testing}

mkdir -p docker/{development,production,nginx}

mkdir -p .github/workflows

# Create initial files
touch frontend/README.md
touch backend/README.md
touch database/README.md
touch docs/README.md

# Display structure
tree -L 2 -I 'node_modules'
```

### 1.4 Initialize Git Repository with Proper Structure

```bash
# Add initial commit
git add .
git commit -m "chore: initial project structure setup"

# Create develop branch
git checkout -b develop

# Create .gitattributes for line endings
cat > .gitattributes << 'EOF'
* text=auto eol=lf
*.{cmd,[cC][mM][dD]} text eol=crlf
*.{bat,[bB][aA][tT]} text eol=crlf
*.jpg binary
*.png binary
*.gif binary
*.ico binary
*.mov binary
*.mp4 binary
*.mp3 binary
*.flv binary
*.fla binary
*.swf binary
*.gz binary
*.zip binary
*.7z binary
*.ttf binary
*.eot binary
*.woff binary
*.woff2 binary
*.pdf binary
EOF

git add .gitattributes
git commit -m "chore: add gitattributes for consistent line endings"
```

### 1.5 Setup Code Quality Tools

#### 1.5.1 Root Level Package.json

Create `package.json` in root:

```json
{
  "name": "smart-academy",
  "version": "1.0.0",
  "description": "Smart Academy Website - Islamic English Medium School",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "lint": "npm run lint:backend && npm run lint:frontend",
    "lint:backend": "cd backend && npm run lint",
    "lint:frontend": "cd frontend && npm run lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    "docker:dev:up": "docker compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker compose -f docker-compose.dev.yml down",
    "docker:dev:logs": "docker compose -f docker-compose.dev.yml logs -f",
    "prepare": "husky install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "prettier": "^3.1.1"
  },
  "engines": {
    "node": ">=20.11.0",
    "npm": ">=10.0.0"
  }
}
```

#### 1.5.2 Install Root Dependencies

```bash
npm install
```

#### 1.5.3 Setup Husky for Git Hooks

```bash
# Initialize Husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

#### 1.5.4 Configure Prettier

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false
}
```

Create `.prettierignore`:

```
node_modules
.next
dist
build
coverage
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
```

#### 1.5.5 Configure lint-staged

Add to root `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

### 1.6 Phase 1 Completion Checklist

- [ ] Linux OS updated and configured
- [ ] Node.js 20.11.0 LTS installed and verified
- [ ] Git installed and configured with SSH keys
- [ ] VSCode installed with all required extensions
- [ ] Docker and Docker Compose installed
- [ ] All development services running (PostgreSQL, Redis, Elasticsearch, MailHog)
- [ ] Project directory structure created
- [ ] Git repository initialized with proper branches
- [ ] Code quality tools configured (Prettier, Husky, lint-staged)
- [ ] All development tools accessible (pgAdmin, MailHog, Redis Commander)
- [ ] Documentation README files created

### 1.7 Phase 1 Verification Tests

```bash
# Verify Node.js
node --version  # Should show v20.11.0
npm --version   # Should show 10.x.x

# Verify Git
git --version
git config --list

# Verify Docker
docker --version
docker compose version
docker ps  # Should show running containers

# Test PostgreSQL
docker exec -it smart_academy_postgres_dev psql -U smart_admin -d smart_academy_dev -c "SELECT version();"

# Test Redis
docker exec -it smart_academy_redis_dev redis-cli ping

# Test Elasticsearch
curl http://localhost:9200

# Verify directory structure
tree -L 2 -I 'node_modules'
```

### 1.8 Environment Setup Documentation

Create `docs/development-setup.md`:

```markdown
# Development Environment Setup

## System Requirements

- OS: Linux (Ubuntu 22.04 LTS recommended)
- RAM: 16GB minimum
- Storage: 50GB free space
- CPU: 4+ cores

## Installed Software

- Node.js: v20.11.0 LTS
- npm: v10.x
- Git: Latest
- Docker: Latest
- Docker Compose: Latest
- VSCode: Latest

## Running Services

- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Elasticsearch: localhost:9200
- pgAdmin: http://localhost:5050
- MailHog: http://localhost:8025
- Redis Commander: http://localhost:8081

## Database Credentials (Development)

- Database: smart_academy_dev
- Username: smart_admin
- Password: SmartDev2025!Secure

## Next Steps

Proceed to Phase 2: Backend Core Setup
```

---

## Phase 2: Backend Core Setup & Architecture
**Duration:** 2-3 weeks  
**Effort:** 80-120 hours  
**Prerequisite:** Phase 1 completed  
**Deliverables:** Functional backend API with authentication

### 2.1 Backend Project Initialization

#### 2.1.1 Initialize Backend Node.js Project

```bash
cd backend

# Initialize package.json
npm init -y

# Install TypeScript and type definitions
npm install -D typescript @types/node @types/express ts-node nodemon
npm install -D @types/cors @types/bcrypt @types/jsonwebtoken
npm install -D @types/multer @types/cookie-parser @types/morgan

# Initialize TypeScript configuration
npx tsc --init
```

#### 2.1.2 Configure TypeScript

Edit `backend/tsconfig.json`:

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
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@controllers/*": ["src/controllers/*"],
      "@models/*": ["src/models/*"],
      "@routes/*": ["src/routes/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"],
      "@validators/*": ["src/validators/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### 2.1.3 Install Core Backend Dependencies

```bash
# Core Framework
npm install express cors helmet compression

# Database
npm install pg pg-hstore
npm install ioredis

# Authentication & Security
npm install jsonwebtoken bcrypt
npm install express-rate-limit express-validator
npm install cookie-parser express-session

# File Upload
npm install multer sharp

# Utilities
npm install dotenv winston morgan
npm install axios date-fns lodash
npm install uuid

# ElasticSearch
npm install @elastic/elasticsearch

# Email
npm install nodemailer

# Dev Dependencies
npm install -D @types/compression @types/helmet
npm install -D @types/lodash @types/uuid
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint prettier eslint-config-prettier
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

#### 2.1.4 Configure Backend Package.json Scripts

Edit `backend/package.json`:

```json
{
  "name": "smart-academy-backend",
  "version": "1.0.0",
  "description": "Smart Academy Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:integration": "jest --testPathPattern=tests/integration",
    "migrate": "node dist/database/migrate.js",
    "seed": "node dist/database/seed.js",
    "db:reset": "npm run migrate && npm run seed",
    "clean": "rm -rf dist"
  },
  "keywords": ["smart-academy", "api", "education"],
  "author": "Smart Foundation",
  "license": "MIT"
}
```

#### 2.1.5 Configure Nodemon

Create `backend/nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

Install tsconfig-paths:

```bash
npm install -D tsconfig-paths
```

### 2.2 Backend Configuration Setup

#### 2.2.1 Create Environment Configuration

Create `backend/.env.development`:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1
APP_NAME=Smart Academy API

# Application URLs
APP_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1
ADMIN_URL=http://localhost:3000/admin

# Database - PostgreSQL
DATABASE_URL=postgresql://smart_admin:SmartDev2025!Secure@localhost:5432/smart_academy_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_academy_dev
DB_USER=smart_admin
DB_PASSWORD=SmartDev2025!Secure
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# JWT Authentication
JWT_SECRET=smart_academy_jwt_secret_dev_minimum_32_chars_long_key_2025
JWT_REFRESH_SECRET=smart_academy_refresh_secret_dev_minimum_32_chars_2025
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=smart-academy
JWT_AUDIENCE=smart-academy-users

# Session Configuration
SESSION_SECRET=smart_academy_session_secret_dev_min_32_chars_2025
SESSION_NAME=smart_academy_sid
SESSION_MAX_AGE=86400000
SESSION_SECURE=false
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Password Hashing
BCRYPT_ROUNDS=10

# Email Configuration (MailHog for development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=Smart Academy <noreply@smartacademy.local>
EMAIL_REPLY_TO=info@smartacademy.bd

# SMS Gateway (Development - Test Mode)
SMS_PROVIDER=test
SMS_API_KEY=test_sms_api_key
SMS_API_SECRET=test_sms_secret
SMS_SENDER_ID=SmartAcad
SMS_SANDBOX=true

# Payment Gateways (Sandbox/Test Mode)
# SSLCommerz
SSLCOMMERZ_STORE_ID=test_smart_academy
SSLCOMMERZ_STORE_PASSWORD=test_password_123
SSLCOMMERZ_SANDBOX=true
SSLCOMMERZ_SUCCESS_URL=http://localhost:3000/payment/success
SSLCOMMERZ_FAIL_URL=http://localhost:3000/payment/fail
SSLCOMMERZ_CANCEL_URL=http://localhost:3000/payment/cancel
SSLCOMMERZ_IPN_URL=http://localhost:5000/api/v1/payments/ipn

# bKash
BKASH_APP_KEY=test_app_key
BKASH_APP_SECRET=test_app_secret
BKASH_USERNAME=test_username
BKASH_PASSWORD=test_password
BKASH_SANDBOX=true
BKASH_CALLBACK_URL=http://localhost:5000/api/v1/payments/bkash/callback

# Nagad
NAGAD_MERCHANT_ID=test_merchant_123
NAGAD_MERCHANT_NUMBER=01700000000
NAGAD_PUBLIC_KEY=test_public_key
NAGAD_PRIVATE_KEY=test_private_key
NAGAD_SANDBOX=true

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp,gif
ALLOWED_DOCUMENT_TYPES=pdf,doc,docx,xls,xlsx
ALLOWED_VIDEO_TYPES=mp4,webm,ogg

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX_PREFIX=smart_academy_

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
LOG_MAX_SIZE=10m
LOG_MAX_FILES=7

# Feature Flags
ENABLE_SWAGGER=true
ENABLE_API_DOCS=true
ENABLE_METRICS=true
ENABLE_DEBUGGING=true

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Application Constants
ACADEMIC_YEAR=2024-2025
SCHOOL_TIMEZONE=Asia/Dhaka
SUPPORTED_LANGUAGES=en,bn,ar
DEFAULT_LANGUAGE=en
```

#### 2.2.2 Create Configuration Module

Create `backend/src/config/index.ts`:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

interface Config {
  // Server
  nodeEnv: string;
  port: number;
  apiVersion: string;
  appName: string;
  
  // URLs
  appUrl: string;
  apiUrl: string;
  adminUrl: string;
  
  // Database
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
    };
  };
  
  // Redis
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
    ttl: number;
  };
  
  // JWT
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    audience: string;
  };
  
  // Session
  session: {
    secret: string;
    name: string;
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
  
  // Security
  bcryptRounds: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  corsOrigin: string;
  allowedOrigins: string[];
  
  // Email
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
    replyTo: string;
  };
  
  // SMS
  sms: {
    provider: string;
    apiKey: string;
    apiSecret: string;
    senderId: string;
    sandbox: boolean;
  };
  
  // Payment Gateways
  payments: {
    sslcommerz: {
      storeId: string;
      storePassword: string;
      sandbox: boolean;
      successUrl: string;
      failUrl: string;
      cancelUrl: string;
      ipnUrl: string;
    };
    bkash: {
      appKey: string;
      appSecret: string;
      username: string;
      password: string;
      sandbox: boolean;
      callbackUrl: string;
    };
    nagad: {
      merchantId: string;
      merchantNumber: string;
      publicKey: string;
      privateKey: string;
      sandbox: boolean;
    };
  };
  
  // File Upload
  upload: {
    maxFileSize: number;
    uploadPath: string;
    allowedImageTypes: string[];
    allowedDocumentTypes: string[];
    allowedVideoTypes: string[];
  };
  
  // Elasticsearch
  elasticsearch: {
    node: string;
    indexPrefix: string;
  };
  
  // Logging
  logging: {
    level: string;
    filePath: string;
    maxSize: string;
    maxFiles: number;
  };
  
  // Feature Flags
  features: {
    enableSwagger: boolean;
    enableApiDocs: boolean;
    enableMetrics: boolean;
    enableDebugging: boolean;
  };
  
  // Pagination
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  
  // Application
  app: {
    academicYear: string;
    timezone: string;
    supportedLanguages: string[];
    defaultLanguage: string;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  appName: process.env.APP_NAME || 'Smart Academy API',
  
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:5000/api/v1',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3000/admin',
  
  database: {
    url: process.env.DATABASE_URL!,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'smart_academy_dev',
    user: process.env.DB_USER || 'smart_admin',
    password: process.env.DB_PASSWORD!,
    ssl: process.env.DB_SSL === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    },
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'smart-academy',
    audience: process.env.JWT_AUDIENCE || 'smart-academy-users',
  },
  
  session: {
    secret: process.env.SESSION_SECRET!,
    name: process.env.SESSION_NAME || 'smart_academy_sid',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
    secure: process.env.SESSION_SECURE === 'true',
    httpOnly: process.env.SESSION_HTTP_ONLY !== 'false',
    sameSite: (process.env.SESSION_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
  },
  
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@smartacademy.local',
    replyTo: process.env.EMAIL_REPLY_TO || 'info@smartacademy.bd',
  },
  
  sms: {
    provider: process.env.SMS_PROVIDER || 'test',
    apiKey: process.env.SMS_API_KEY || '',
    apiSecret: process.env.SMS_API_SECRET || '',
    senderId: process.env.SMS_SENDER_ID || 'SmartAcad',
    sandbox: process.env.SMS_SANDBOX === 'true',
  },
  
  payments: {
    sslcommerz: {
      storeId: process.env.SSLCOMMERZ_STORE_ID || '',
      storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
      sandbox: process.env.SSLCOMMERZ_SANDBOX === 'true',
      successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || '',
      failUrl: process.env.SSLCOMMERZ_FAIL_URL || '',
      cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || '',
      ipnUrl: process.env.SSLCOMMERZ_IPN_URL || '',
    },
    bkash: {
      appKey: process.env.BKASH_APP_KEY || '',
      appSecret: process.env.BKASH_APP_SECRET || '',
      username: process.env.BKASH_USERNAME || '',
      password: process.env.BKASH_PASSWORD || '',
      sandbox: process.env.BKASH_SANDBOX === 'true',
      callbackUrl: process.env.BKASH_CALLBACK_URL || '',
    },
    nagad: {
      merchantId: process.env.NAGAD_MERCHANT_ID || '',
      merchantNumber: process.env.NAGAD_MERCHANT_NUMBER || '',
      publicKey: process.env.NAGAD_PUBLIC_KEY || '',
      privateKey: process.env.NAGAD_PRIVATE_KEY || '',
      sandbox: process.env.NAGAD_SANDBOX === 'true',
    },
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || 
      ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    allowedDocumentTypes: process.env.ALLOWED_DOCUMENT_TYPES?.split(',') || 
      ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    allowedVideoTypes: process.env.ALLOWED_VIDEO_TYPES?.split(',') || 
      ['mp4', 'webm', 'ogg'],
  },
  
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    indexPrefix: process.env.ELASTICSEARCH_INDEX_PREFIX || 'smart_academy_',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    filePath: process.env.LOG_FILE_PATH || './logs',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '7', 10),
  },
  
  features: {
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableApiDocs: process.env.ENABLE_API_DOCS === 'true',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    enableDebugging: process.env.ENABLE_DEBUGGING === 'true',
  },
  
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  },
  
  app: {
    academicYear: process.env.ACADEMIC_YEAR || '2024-2025',
    timezone: process.env.SCHOOL_TIMEZONE || 'Asia/Dhaka',
    supportedLanguages: process.env.SUPPORTED_LANGUAGES?.split(',') || 
      ['en', 'bn', 'ar'],
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  },
};

// Validation
const requiredEnvVars = [
  'DATABASE_URL',
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'SESSION_SECRET',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export default config;
```

*To be continued in Part 2...*

---

**Document Status:** Part 1 of 4 Complete  
**Next Part:** Phases 4-6 (Frontend Development, Integration)
