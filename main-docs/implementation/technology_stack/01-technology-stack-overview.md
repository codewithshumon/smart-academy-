# Smart Academy Website Redevelopment
## Comprehensive Technology Stack Documentation

**Version:** 1.0  
**Date:** November 28, 2025  
**Project:** Smart Academy Website Redevelopment  
**Development Environment:** Local (Windows 11/Linux) → Cloud Deployment

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Development Environment Setup](#development-environment-setup)
3. [Core Technology Stack](#core-technology-stack)
4. [Frontend Technologies](#frontend-technologies)
5. [Backend Technologies](#backend-technologies)
6. [Database Technologies](#database-technologies)
7. [Additional Documentation](#additional-documentation)

---

## Executive Summary

### Project Overview

This technology stack has been specifically designed to meet **100% of the Smart Academy Website Redevelopment SRS requirements** while optimizing for:

- Local development on Windows 11 or Linux desktop computers
- Use of VSCode as the primary IDE
- Local development and database servers
- Eventual deployment to Smart Academy's own cloud server in their data center
- Support for multilingual content (English, Bangla, Arabic with RTL)
- Integration with Bangladesh payment gateways (SSLCommerz, bKash, Nagad)
- Scalability to 500+ concurrent users and 5,000+ students
- WCAG 2.1 Level AA accessibility compliance
- PCI-DSS compliant payment processing
- 99.5% uptime target

### Technology Philosophy

The selected technologies prioritize:

1. **Proven Stability**: Production-ready, well-documented technologies
2. **Developer Experience**: Modern tools that enhance productivity
3. **Performance**: Fast page loads (<3s on 4G) and API responses (<2s)
4. **Security**: Industry-standard security practices and compliance
5. **Maintainability**: Clear code structure and comprehensive documentation
6. **Scalability**: Ability to grow with Smart Academy's needs
7. **Local-First Development**: Seamless local development experience
8. **Cost-Effectiveness**: Open-source technologies with minimal licensing costs

### Key Technology Decisions

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Frontend Framework** | React 18+ with Next.js 14+ | SEO, SSR, performance, modern React features |
| **Backend Framework** | Node.js 20 LTS + Express.js | JavaScript ecosystem consistency, async support |
| **Database** | PostgreSQL 16+ | ACID compliance, JSON support, scalability |
| **Cache/Session** | Redis 7+ | Fast session storage, caching, real-time features |
| **Payment Gateway** | SSLCommerz, bKash, Nagad | Bangladesh market standard |
| **Authentication** | JWT + bcrypt/Argon2 | Stateless, secure, scalable |
| **File Storage** | Local filesystem + MinIO | S3-compatible, self-hosted |
| **Search Engine** | Elasticsearch 8+ | Full-text search, multilingual support |
| **Email Service** | NodeMailer + SMTP | Self-hosted email capability |
| **SMS Service** | Bangladesh SMS Gateway APIs | Local provider integration |

---

## Development Environment Setup

### 1. Local Development Machine Requirements

#### Minimum Hardware Requirements

```
CPU: Intel Core i5 (8th Gen) or AMD Ryzen 5 or better
RAM: 16GB minimum (32GB recommended)
Storage: 256GB SSD minimum (512GB recommended)
Network: Stable broadband internet connection
```

#### Operating System Options

**Option 1: Windows 11**
- Windows 11 Pro or Enterprise (64-bit)
- WSL2 (Windows Subsystem for Linux) enabled
- Ubuntu 22.04 LTS running on WSL2

**Option 2: Linux**
- Ubuntu 22.04 LTS (Recommended)
- Linux Mint 21+
- Fedora 38+
- Any modern Linux distribution with kernel 5.15+

### 2. Essential Software Installation

#### 2.1 VSCode IDE Setup

**Installation:**
```bash
# Windows 11
# Download from https://code.visualstudio.com/

# Linux (Ubuntu/Debian)
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

**Required VSCode Extensions:**
```
# Essential Extensions
1. ESLint (dbaeumer.vscode-eslint)
2. Prettier - Code formatter (esbenp.prettier-vscode)
3. GitLens (eamodio.gitlens)
4. Docker (ms-azuretools.vscode-docker)
5. Thunder Client (rangav.vscode-thunder-client) - API testing
6. PostgreSQL (ckolkman.vscode-postgres)
7. Redis (cweijan.vscode-redis-client)

# Frontend Development
8. ES7+ React/Redux/React-Native snippets (dsznajder.es7-react-js-snippets)
9. Auto Rename Tag (formulahendry.auto-rename-tag)
10. Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
11. CSS Peek (pranaygp.vscode-css-peek)

# Backend Development
12. REST Client (humao.rest-client)
13. npm Intellisense (christian-kohler.npm-intellisense)
14. Path Intellisense (christian-kohler.path-intellisense)

# Code Quality
15. SonarLint (sonarsource.sonarlint-vscode)
16. Error Lens (usernamehw.errorlens)

# Git
17. Git Graph (mhutchie.git-graph)
18. GitLab Workflow (gitlab.gitlab-workflow)

# Utilities
19. Live Server (ritwickdey.liveserver)
20. Markdown All in One (yzhang.markdown-all-in-one)
21. DotENV (mikestead.dotenv)
22. Import Cost (wix.vscode-import-cost)
```

**VSCode Settings Configuration:**
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
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### 2.2 Node.js and npm Setup

**Installation:**
```bash
# Windows 11 (using nvm-windows)
# Download from https://github.com/coreybutler/nvm-windows/releases
# Then install Node.js LTS
nvm install 20.11.0
nvm use 20.11.0

# Linux (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20.11.0
nvm use 20.11.0
nvm alias default 20.11.0

# Verify installation
node --version  # Should output v20.11.0
npm --version   # Should output 10.x.x
```

**Global npm Packages:**
```bash
npm install -g yarn pnpm pm2 nodemon eslint prettier
```

#### 2.3 Git Version Control

**Installation:**
```bash
# Windows 11
# Download from https://git-scm.com/download/win

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install git

# Verify
git --version
```

**Git Configuration:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@smartacademy.bd"
git config --global core.autocrlf input  # Linux
git config --global core.autocrlf true   # Windows
git config --global init.defaultBranch main
git config --global pull.rebase false
```

#### 2.4 Docker Desktop (Optional but Recommended)

**Purpose:** Containerized services for consistent development environment

**Installation:**
```bash
# Windows 11
# Download from https://www.docker.com/products/docker-desktop/

# Linux (Ubuntu)
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 3. Local Development Server Setup

#### 3.1 PostgreSQL Database Server

**Option A: Native Installation**

```bash
# Windows 11
# Download from https://www.postgresql.org/download/windows/
# Install PostgreSQL 16.x
# Remember password for postgres user

# Linux (Ubuntu)
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_secure_password';"
```

**Option B: Docker (Recommended)**

```bash
# Create docker-compose.yml for development services
# See separate docker-compose configuration file
docker compose up -d postgres
```

**Database Setup:**
```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost

-- Create database
CREATE DATABASE smart_academy_dev;

-- Create user
CREATE USER smart_admin WITH PASSWORD 'your_secure_dev_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE smart_academy_dev TO smart_admin;

-- Connect to database
\c smart_academy_dev

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO smart_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smart_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smart_admin;
```

#### 3.2 Redis Server

**Option A: Native Installation**

```bash
# Windows 11 (via WSL2)
# Redis doesn't run natively on Windows
# Use WSL2 or Docker

# Linux (Ubuntu)
sudo apt update
sudo apt install redis-server

# Start service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test
redis-cli ping  # Should return PONG
```

**Option B: Docker (Recommended)**

```bash
docker compose up -d redis
```

#### 3.3 Elasticsearch Server

**Docker Installation (Recommended):**

```bash
docker compose up -d elasticsearch
```

**Configuration:**
```yaml
# Elasticsearch development configuration
# See docker-compose.yml file
```

### 4. Development Project Structure

```
smart-academy/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router (Next.js 14+)
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities and helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── contexts/        # React contexts
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── validators/      # Input validation
│   ├── tests/               # Unit and integration tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.development
│
├── database/                 # Database schemas and migrations
│   ├── migrations/
│   ├── seeds/
│   ├── schemas/
│   └── scripts/
│
├── shared/                   # Shared types and utilities
│   ├── types/
│   ├── constants/
│   └── utils/
│
├── docs/                     # Project documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # System architecture
│   ├── deployment/          # Deployment guides
│   └── user-guides/         # User manuals
│
├── scripts/                  # Automation scripts
│   ├── setup/
│   ├── deployment/
│   └── maintenance/
│
├── docker/                   # Docker configurations
│   ├── development/
│   ├── production/
│   └── nginx/
│
├── .github/                  # GitHub workflows
│   └── workflows/
│
├── docker-compose.yml        # Development services
├── docker-compose.prod.yml   # Production services
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

### 5. Environment Variables Setup

**Frontend (.env.local):**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false

# Third-party Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

**Backend (.env.development):**
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://smart_admin:your_password@localhost:5432/smart_academy_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_academy_dev
DB_USER=smart_admin
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Session
SESSION_SECRET=your_session_secret_key_minimum_32_characters
SESSION_MAX_AGE=86400000

# Email (Development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@smartacademy.local

# SMS Gateway (Development - use test credentials)
SMS_PROVIDER=test
SMS_API_KEY=test_key
SMS_SENDER_ID=SmartAcad

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,docx

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
```

---

## Core Technology Stack

### 1. Runtime Environment

#### Node.js 20.11.0 LTS

**Purpose:** JavaScript runtime for backend and build tools

**Key Features:**
- Long-term support until April 2026
- Improved performance with V8 engine
- Native support for ES modules
- Built-in test runner
- Stable API for production use

**Installation Verification:**
```bash
node --version  # v20.11.0
npm --version   # 10.2.4+
```

### 2. Package Management

#### npm 10.x / Yarn 4.x / pnpm 8.x

**Primary:** npm (comes with Node.js)  
**Alternative:** pnpm (faster, disk-efficient)

**Rationale for npm:**
- Built-in with Node.js
- Largest package registry
- Excellent documentation
- Wide industry adoption

**pnpm as Alternative:**
```bash
npm install -g pnpm
pnpm --version
```

### 3. Version Control

#### Git 2.43+

**Purpose:** Source code management and collaboration

**Repository Structure:**
```
main (production)
  └── develop (integration)
      ├── feature/* (new features)
      ├── bugfix/* (bug fixes)
      ├── hotfix/* (urgent fixes)
      └── release/* (release preparation)
```

**Commit Convention:**
```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Code refactoring
- test: Tests
- chore: Maintenance
```

### 4. Development Tools

#### ESLint + Prettier

**Purpose:** Code quality and consistent formatting

**ESLint Configuration (.eslintrc.json):**
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Prettier Configuration (.prettierrc):**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### Husky + lint-staged

**Purpose:** Pre-commit hooks for code quality

**Installation:**
```bash
npm install --save-dev husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
```

**.husky/pre-commit:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**lint-staged Configuration (package.json):**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,scss}": [
      "prettier --write"
    ]
  }
}
```

---

*Continue to next document for Frontend Technologies...*
