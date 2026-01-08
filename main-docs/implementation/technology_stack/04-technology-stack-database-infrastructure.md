# Smart Academy Website Redevelopment
## Technology Stack - Part 4: Database, Infrastructure & DevOps

---

## Database Technologies

### 1. Primary Database

#### PostgreSQL 16+

**Purpose:** Primary relational database for all application data

**Why PostgreSQL:**
- ✅ ACID compliant for data integrity
- ✅ Excellent performance and scalability
- ✅ JSON/JSONB support for flexible data
- ✅ Full-text search capabilities
- ✅ Strong data types and validation
- ✅ Robust transaction support
- ✅ Mature replication and backup
- ✅ Excellent documentation
- ✅ Active community

**Installation (Docker Recommended):**

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: smart_academy_postgres
    environment:
      POSTGRES_DB: smart_academy_dev
      POSTGRES_USER: smart_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=en_US.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    command: >
      postgres 
      -c max_connections=200
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=128MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=2621kB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smart_admin -d smart_academy_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
```

**Database Schema Design:**

```sql
-- Core User Management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'parent', 'teacher', 'student', 'staff')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- User Profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    photo_url TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Bangladesh',
    postal_code VARCHAR(20),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Academic Structure
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id),
    credits INTEGER DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Management
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    roll_number INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    blood_group VARCHAR(5),
    emergency_contact VARCHAR(20),
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_status ON students(status);

-- Parent Management
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(20) CHECK (relationship_type IN ('father', 'mother', 'guardian')),
    occupation VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parent_student_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, student_id)
);

-- Teacher Management
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    qualification TEXT,
    join_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    academic_year_id UUID REFERENCES academic_years(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, subject_id, class_id, section_id, academic_year_id)
);

-- Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    marked_by UUID REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);

-- Exams and Grades
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50) CHECK (exam_type IN ('midterm', 'final', 'quiz', 'assignment')),
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    academic_year_id UUID REFERENCES academic_years(id),
    exam_date DATE,
    max_marks INTEGER NOT NULL,
    passing_marks INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(5),
    remarks TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_id)
);

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_exam ON grades(exam_id);

-- Admission Applications
CREATE TABLE admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id VARCHAR(20) UNIQUE NOT NULL,
    student_first_name VARCHAR(100) NOT NULL,
    student_last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    class_applied UUID REFERENCES classes(id),
    previous_school VARCHAR(200),
    parent_name VARCHAR(200) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_relationship VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'withdrawn')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_applications_status ON admission_applications(status);
CREATE INDEX idx_applications_date ON admission_applications(submitted_at);

CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES admission_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Management
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID REFERENCES academic_years(id),
    class_id UUID REFERENCES classes(id),
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('tuition', 'admission', 'exam', 'library', 'transport', 'other')),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES fee_structures(id),
    amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'waived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID REFERENCES students(id),
    student_fee_id UUID REFERENCES student_fees(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('sslcommerz', 'bkash', 'nagad', 'cash', 'bank_transfer')),
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Content Management
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    title_ar VARCHAR(255),
    content TEXT NOT NULL,
    content_bn TEXT,
    content_ar TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    title_ar VARCHAR(255),
    content TEXT NOT NULL,
    content_bn TEXT,
    content_ar TEXT,
    featured_image TEXT,
    category VARCHAR(50),
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    author_id UUID REFERENCES users(id),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_published ON news_articles(published_at);
CREATE INDEX idx_news_category ON news_articles(category);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    title_ar VARCHAR(255),
    description TEXT,
    description_bn TEXT,
    description_ar TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    category VARCHAR(50),
    featured_image TEXT,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_dates ON events(start_date, end_date);

CREATE TABLE gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    title_ar VARCHAR(255),
    description TEXT,
    cover_image TEXT,
    album_type VARCHAR(50) CHECK (album_type IN ('photo', 'video')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    file_path TEXT NOT NULL,
    thumbnail_path TEXT,
    title VARCHAR(255),
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50)[] CHECK (target_audience <@ ARRAY['all', 'parents', 'students', 'teachers', 'staff']::VARCHAR[]),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    parent_message_id UUID REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Session Management
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);

-- Audit Logging
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_news_title_search ON news_articles USING gin(to_tsvector('english', title));
CREATE INDEX idx_news_content_search ON news_articles USING gin(to_tsvector('english', content));
CREATE INDEX idx_pages_title_search ON pages USING gin(to_tsvector('english', title));
```

**Database Migrations:**

```typescript
// database/migrations/001_create_users_table.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'parent', 'teacher', 'student', 'staff'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      last_login: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  },
};
```

### 2. Cache Layer

#### Redis 7+

**Purpose:** Session storage, caching, and real-time features

**Docker Configuration:**
```yaml
  redis:
    image: redis:7-alpine
    container_name: smart_academy_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: >
      redis-server
      --appendonly yes
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis_data:
    driver: local
```

**Redis Usage Patterns:**

```typescript
// Session storage
await redis.setex(`session:${userId}`, 86400, JSON.stringify(sessionData));

// API response caching
await redis.setex(`cache:news:latest`, 300, JSON.stringify(news));

// Rate limiting
const requests = await redis.incr(`ratelimit:${ip}`);
await redis.expire(`ratelimit:${ip}`, 60);

// Real-time counters
await redis.hincrby('stats:views', 'homepage', 1);
```

### 3. Search Engine

#### Elasticsearch 8+ (Optional, for advanced search)

**Purpose:** Full-text search, multilingual support

**Docker Configuration:**
```yaml
  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: smart_academy_elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    restart: unless-stopped

volumes:
  elasticsearch_data:
    driver: local
```

---

## Infrastructure & DevOps

### 1. Containerization

#### Docker 24+ & Docker Compose

**Complete Development Stack:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: smart_academy_postgres
    environment:
      POSTGRES_DB: smart_academy_dev
      POSTGRES_USER: smart_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - smart_academy_network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: smart_academy_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - smart_academy_network
    restart: unless-stopped

  # Elasticsearch (Optional)
  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: smart_academy_elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - smart_academy_network
    restart: unless-stopped

  # MinIO (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: smart_academy_minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - smart_academy_network
    restart: unless-stopped

  # MailHog (Development Email Server)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: smart_academy_mailhog
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # Web UI
    networks:
      - smart_academy_network

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: smart_academy_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - smart_academy_network
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
  minio_data:
  pgadmin_data:

networks:
  smart_academy_network:
    driver: bridge
```

**Quick Start Commands:**
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart specific service
docker compose restart postgres

# Clean everything
docker compose down -v
```

### 2. Process Management

#### PM2 5+

**Purpose:** Production process management for Node.js

**Installation:**
```bash
npm install -g pm2
```

**PM2 Configuration:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'smart-academy-api',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,
    },
  ],
};
```

**PM2 Commands:**
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart
pm2 restart smart-academy-api

# Stop
pm2 stop smart-academy-api

# Delete
pm2 delete smart-academy-api

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### 3. Web Server

#### Nginx 1.25+

**Purpose:** Reverse proxy, load balancing, static file serving

**Nginx Configuration:**
```nginx
# /etc/nginx/sites-available/smart-academy

upstream backend_api {
    least_conn;
    server 127.0.0.1:5000;
    # For multiple instances:
    # server 127.0.0.1:5001;
    # server 127.0.0.1:5002;
}

upstream frontend_app {
    server 127.0.0.1:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name mysmart.academy www.mysmart.academy;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mysmart.academy www.mysmart.academy;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/mysmart.academy/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mysmart.academy/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Client Max Body Size
    client_max_body_size 10M;

    # API Proxy
    location /api/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Files (Uploads)
    location /uploads/ {
        alias /var/www/smart-academy/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend Application
    location / {
        proxy_pass http://frontend_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security - Block access to hidden files
    location ~ /\. {
        deny all;
    }

    # Logs
    access_log /var/log/nginx/smart-academy-access.log;
    error_log /var/log/nginx/smart-academy-error.log;
}
```

### 4. SSL/TLS Certificate

#### Let's Encrypt + Certbot

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d mysmart.academy -d www.mysmart.academy

# Auto-renewal (already set up with certbot)
sudo certbot renew --dry-run
```

### 5. Backup Strategy

#### Automated Database Backup Script

```bash
#!/bin/bash
# backup-database.sh

# Configuration
DB_NAME="smart_academy_prod"
DB_USER="smart_admin"
BACKUP_DIR="/var/backups/smart-academy/database"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"
RETENTION_DAYS=30

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
    echo "Backup created successfully: $BACKUP_FILE"
    
    # Delete old backups
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up (older than $RETENTION_DAYS days)"
else
    echo "Backup failed!"
    exit 1
fi

# Optional: Upload to cloud storage
# aws s3 cp $BACKUP_FILE s3://smart-academy-backups/database/
```

**Cron Job for Daily Backup:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-database.sh >> /var/log/backup.log 2>&1
```

---

*Continue to next document for Deployment, Monitoring, and Testing...*
