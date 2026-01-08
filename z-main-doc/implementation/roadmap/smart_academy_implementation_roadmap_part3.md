# Smart Academy Website - 12-Phase Implementation Roadmap
## Part 3: Database Completion & Frontend Foundation

**Phase 3 Continuation, Phases 4-6**

---

## Phase 3: Database Schema Design & Implementation (Continued)

### 3.2 Complete Database Schema Files

Create `database/schemas/04_admission_financial.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 4: Admission & Financial Tables
-- =============================================

-- =============================================
-- ADMISSION MANAGEMENT
-- =============================================

-- Applications
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(30) UNIQUE NOT NULL,
  -- Student Information
  student_first_name VARCHAR(100) NOT NULL,
  student_last_name VARCHAR(100) NOT NULL,
  student_first_name_bn VARCHAR(100),
  student_last_name_bn VARCHAR(100),
  student_date_of_birth DATE NOT NULL,
  student_gender gender NOT NULL,
  student_blood_group VARCHAR(5),
  student_photo_url VARCHAR(500),
  -- Class Applied For
  class_applied_id INTEGER REFERENCES classes(id),
  academic_year_id INTEGER REFERENCES academic_years(id),
  -- Previous Education
  previous_school VARCHAR(200),
  previous_class VARCHAR(50),
  previous_percentage DECIMAL(5,2),
  -- Contact Information
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Bangladesh',
  -- Application Status
  status application_status DEFAULT 'draft',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  decision_at TIMESTAMP,
  decision_by INTEGER REFERENCES users(id),
  decision_notes TEXT,
  -- Additional
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_application_id ON applications(application_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_class_applied_id ON applications(class_applied_id);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);

COMMENT ON TABLE applications IS 'Student admission applications';
COMMENT ON COLUMN applications.application_id IS 'Public-facing application reference number';

-- Application parents/guardians
CREATE TABLE application_parents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  email VARCHAR(255),
  occupation VARCHAR(100),
  organization VARCHAR(200),
  annual_income DECIMAL(12,2),
  national_id VARCHAR(50),
  is_primary_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_application_parents_application_id ON application_parents(application_id);

-- Application documents
CREATE TABLE application_documents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);

COMMENT ON TABLE application_documents IS 'Documents attached to applications';
COMMENT ON COLUMN application_documents.document_type IS 'birth_certificate, photo, transcript, etc.';

-- Application notes
CREATE TABLE application_notes (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  created_by INTEGER NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_application_notes_application_id ON application_notes(application_id);

-- =============================================
-- FINANCIAL MANAGEMENT
-- =============================================

-- Fee structures
CREATE TABLE fee_structures (
  id SERIAL PRIMARY KEY,
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  class_id INTEGER REFERENCES classes(id),
  fee_type fee_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  description TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fee_structures_academic_year_id ON fee_structures(academic_year_id);
CREATE INDEX idx_fee_structures_class_id ON fee_structures(class_id);
CREATE INDEX idx_fee_structures_fee_type ON fee_structures(fee_type);

COMMENT ON TABLE fee_structures IS 'Fee structure definitions';

-- Student fees (fee assignments)
CREATE TABLE student_fees (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id),
  amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_fees_student_id ON student_fees(student_id);
CREATE INDEX idx_student_fees_fee_structure_id ON student_fees(fee_structure_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);
CREATE INDEX idx_student_fees_due_date ON student_fees(due_date);

-- Payments
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  student_id INTEGER NOT NULL REFERENCES students(id),
  student_fee_id INTEGER REFERENCES student_fees(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_gateway VARCHAR(50),
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  notes TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);

COMMENT ON TABLE payments IS 'Payment transactions';
COMMENT ON COLUMN payments.gateway_response IS 'Full response from payment gateway';

-- Payment receipts
CREATE TABLE payment_receipts (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER UNIQUE NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  file_path VARCHAR(500),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_receipts_payment_id ON payment_receipts(payment_id);
CREATE INDEX idx_payment_receipts_receipt_number ON payment_receipts(receipt_number);
```

Create `database/schemas/05_academic_operations.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 5: Academic Operations
-- =============================================

-- =============================================
-- ATTENDANCE
-- =============================================

-- Attendance records
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  section_id INTEGER REFERENCES sections(id),
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  marked_by INTEGER NOT NULL REFERENCES teachers(id),
  remarks TEXT,
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_status ON attendance(status);

-- =============================================
-- EXAMINATIONS & GRADING
-- =============================================

-- Exams
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  exam_type exam_type NOT NULL,
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  class_id INTEGER NOT NULL REFERENCES classes(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  exam_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  max_marks DECIMAL(6,2) NOT NULL,
  passing_marks DECIMAL(6,2) NOT NULL,
  weightage DECIMAL(5,2),
  instructions TEXT,
  created_by INTEGER REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_academic_year_id ON exams(academic_year_id);
CREATE INDEX idx_exams_class_id ON exams(class_id);
CREATE INDEX idx_exams_subject_id ON exams(subject_id);
CREATE INDEX idx_exams_exam_date ON exams(exam_date);

-- Grades/Results
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(6,2) NOT NULL,
  grade VARCHAR(5),
  gpa DECIMAL(3,2),
  remarks TEXT,
  is_absent BOOLEAN DEFAULT FALSE,
  entered_by INTEGER NOT NULL REFERENCES teachers(id),
  entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, exam_id)
);

CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_exam_id ON grades(exam_id);

-- =============================================
-- ASSIGNMENTS
-- =============================================

-- Assignments
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  section_id INTEGER REFERENCES sections(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  teacher_id INTEGER NOT NULL REFERENCES teachers(id),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  max_marks DECIMAL(6,2),
  attachment_url VARCHAR(500),
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_subject_id ON assignments(subject_id);
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- Student assignment submissions
CREATE TABLE student_assignments (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_date TIMESTAMP,
  submission_text TEXT,
  attachment_url VARCHAR(500),
  marks_obtained DECIMAL(6,2),
  feedback TEXT,
  status assignment_status DEFAULT 'assigned',
  graded_by INTEGER REFERENCES teachers(id),
  graded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_student_assignments_assignment_id ON student_assignments(assignment_id);
CREATE INDEX idx_student_assignments_student_id ON student_assignments(student_id);
CREATE INDEX idx_student_assignments_status ON student_assignments(status);

-- =============================================
-- TIMETABLE/SCHEDULE
-- =============================================

-- Time slots
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_time_slots_slot_order ON time_slots(slot_order);

-- Class schedule
CREATE TABLE class_schedule (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  section_id INTEGER REFERENCES sections(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  teacher_id INTEGER NOT NULL REFERENCES teachers(id),
  time_slot_id INTEGER NOT NULL REFERENCES time_slots(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  academic_year_id INTEGER REFERENCES academic_years(id),
  room_number VARCHAR(20),
  effective_from DATE,
  effective_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_class_schedule_class_id ON class_schedule(class_id);
CREATE INDEX idx_class_schedule_section_id ON class_schedule(section_id);
CREATE INDEX idx_class_schedule_teacher_id ON class_schedule(teacher_id);
CREATE INDEX idx_class_schedule_day_of_week ON class_schedule(day_of_week);

COMMENT ON COLUMN class_schedule.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';
```

Create `database/schemas/06_content_communication.sql`:

```sql
-- =============================================
-- Smart Academy Database Schema
-- Part 6: Content & Communication
-- =============================================

-- =============================================
-- CONTENT MANAGEMENT
-- =============================================

-- Pages (static content pages)
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  content TEXT NOT NULL,
  content_bn TEXT,
  content_ar TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  featured_image_url VARCHAR(500),
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP,
  author_id INTEGER REFERENCES users(id),
  parent_page_id INTEGER REFERENCES pages(id),
  template VARCHAR(50),
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_author_id ON pages(author_id);
CREATE INDEX idx_pages_published_at ON pages(published_at);

-- News articles
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  excerpt TEXT,
  content TEXT NOT NULL,
  content_bn TEXT,
  content_ar TEXT,
  featured_image_url VARCHAR(500),
  category VARCHAR(50),
  tags TEXT[],
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP,
  author_id INTEGER REFERENCES users(id),
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_articles_slug ON news_articles(slug);
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_is_featured ON news_articles(is_featured);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  description TEXT,
  description_bn TEXT,
  description_ar TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  category VARCHAR(50),
  image_url VARCHAR(500),
  registration_required BOOLEAN DEFAULT FALSE,
  max_participants INTEGER,
  registration_deadline DATE,
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);

-- Event registrations
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  participant_name VARCHAR(200) NOT NULL,
  participant_email VARCHAR(255) NOT NULL,
  participant_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- Galleries
CREATE TABLE galleries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  description TEXT,
  album_type VARCHAR(50),
  cover_image_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_galleries_album_type ON galleries(album_type);
CREATE INDEX idx_galleries_created_at ON galleries(created_at);

-- Gallery media
CREATE TABLE gallery_media (
  id SERIAL PRIMARY KEY,
  gallery_id INTEGER NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  title VARCHAR(255),
  caption TEXT,
  display_order INTEGER,
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_media_gallery_id ON gallery_media(gallery_id);
CREATE INDEX idx_gallery_media_media_type ON gallery_media(media_type);

-- Documents/Downloads
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_is_public ON documents(is_public);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);

-- =============================================
-- COMMUNICATION
-- =============================================

-- Messages (direct messages between users)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  subject VARCHAR(255),
  body TEXT NOT NULL,
  status message_status DEFAULT 'unread',
  read_at TIMESTAMP,
  parent_message_id INTEGER REFERENCES messages(id),
  has_attachments BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);

-- Message attachments
CREATE TABLE message_attachments (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Announcements (broadcast messages)
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  title_ar VARCHAR(255),
  content TEXT NOT NULL,
  content_bn TEXT,
  content_ar TEXT,
  priority VARCHAR(20) DEFAULT 'normal',
  target_audience VARCHAR(50)[], -- ['all', 'students', 'parents', 'teachers', 'class_5']
  class_ids INTEGER[],
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_published_at ON announcements(published_at);
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Email logs
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- SMS logs
CREATE TABLE sms_logs (
  id SERIAL PRIMARY KEY,
  recipient_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  gateway_response JSONB,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_logs_recipient_phone ON sms_logs(recipient_phone);
CREATE INDEX idx_sms_logs_status ON sms_logs(status);
```

### 3.3 Database Initialization Script

Create `database/init/01_initialize.sql`:

```sql
-- =============================================
-- Smart Academy Database Initialization
-- =============================================

-- Run all schema files in order
\i /docker-entrypoint-initdb.d/schemas/01_enums.sql
\i /docker-entrypoint-initdb.d/schemas/02_core_tables.sql
\i /docker-entrypoint-initdb.d/schemas/03_academic_tables.sql
\i /docker-entrypoint-initdb.d/schemas/04_admission_financial.sql
\i /docker-entrypoint-initdb.d/schemas/05_academic_operations.sql
\i /docker-entrypoint-initdb.d/schemas/06_content_communication.sql

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column()
        ', t, t);
    END LOOP;
END;
$$ language 'plpgsql';
```

### 3.4 Seed Data

Create `database/seeds/01_initial_data.sql`:

```sql
-- =============================================
-- Smart Academy Initial Seed Data
-- =============================================

-- Academic Year
INSERT INTO academic_years (name, start_date, end_date, is_current)
VALUES 
  ('2024-2025', '2024-07-01', '2025-06-30', TRUE);

-- Time Slots
INSERT INTO time_slots (name, start_time, end_time, slot_order)
VALUES
  ('Period 1', '08:00', '08:45', 1),
  ('Period 2', '08:50', '09:35', 2),
  ('Period 3', '09:40', '10:25', 3),
  ('Break', '10:25', '10:45', 4),
  ('Period 4', '10:45', '11:30', 5),
  ('Period 5', '11:35', '12:20', 6),
  ('Lunch', '12:20', '13:00', 7),
  ('Period 6', '13:00', '13:45', 8),
  ('Period 7', '13:50', '14:35', 9);

-- Create Super Admin User
INSERT INTO users (email, password_hash, role, status, email_verified)
VALUES 
  ('admin@smartacademy.bd', '$2b$10$EXAMPLE_HASH_REPLACE_WITH_ACTUAL', 'super_admin', 'active', TRUE);

-- Create Admin Profile
INSERT INTO user_profiles (user_id, first_name, last_name, phone, language_preference)
SELECT id, 'System', 'Administrator', '+8801700000000', 'en'
FROM users
WHERE email = 'admin@smartacademy.bd';

-- Classes (Grades)
INSERT INTO classes (name, name_bn, level, capacity, tuition_fee)
VALUES
  ('Play Group', 'প্লে গ্রুপ', 0, 30, 3000.00),
  ('Nursery', 'নার্সারি', 1, 30, 3500.00),
  ('Class 1', 'প্রথম শ্রেণী', 2, 35, 4000.00),
  ('Class 2', 'দ্বিতীয় শ্রেণী', 3, 35, 4000.00),
  ('Class 3', 'তৃতীয় শ্রেণী', 4, 35, 4500.00),
  ('Class 4', 'চতুর্থ শ্রেণী', 5, 35, 4500.00),
  ('Class 5', 'পঞ্চম শ্রেণী', 6, 40, 5000.00),
  ('Class 6', 'ষষ্ঠ শ্রেণী', 7, 40, 5500.00),
  ('Class 7', 'সপ্তম শ্রেণী', 8, 40, 5500.00),
  ('Class 8', 'অষ্টম শ্রেণী', 9, 40, 6000.00),
  ('Class 9', 'নবম শ্রেণী', 10, 45, 6500.00),
  ('Class 10', 'দশম শ্রেণী', 11, 45, 6500.00);

-- Subjects
INSERT INTO subjects (code, name, name_bn, is_mandatory, credit_hours)
VALUES
  ('ENG', 'English', 'ইংরেজি', TRUE, 6.0),
  ('BAN', 'Bangla', 'বাংলা', TRUE, 6.0),
  ('MATH', 'Mathematics', 'গণিত', TRUE, 6.0),
  ('SCI', 'Science', 'বিজ্ঞান', TRUE, 5.0),
  ('SSC', 'Social Science', 'সামাজিক বিজ্ঞান', TRUE, 4.0),
  ('ISL', 'Islamic Studies', 'ইসলাম শিক্ষা', TRUE, 4.0),
  ('QUR', 'Quran Studies', 'কুরআন শিক্ষা', TRUE, 3.0),
  ('ARA', 'Arabic', 'আরবি', TRUE, 3.0),
  ('ICT', 'ICT', 'আইসিটি', FALSE, 2.0),
  ('PE', 'Physical Education', 'শারীরিক শিক্ষা', FALSE, 2.0);

COMMENT ON TABLE users IS 'Main user accounts - authentication and authorization';
COMMENT ON TABLE students IS 'Student records linked to user accounts';
COMMENT ON TABLE parents IS 'Parent/guardian records linked to user accounts';
COMMENT ON TABLE teachers IS 'Teacher records linked to user accounts';
```

### 3.5 Database Migration Scripts

Create `database/migrations/migrate.js`:

```javascript
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.development' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✓ Connected to database');

    // Read and execute schema files in order
    const schemaFiles = [
      '01_enums.sql',
      '02_core_tables.sql',
      '03_academic_tables.sql',
      '04_admission_financial.sql',
      '05_academic_operations.sql',
      '06_content_communication.sql',
    ];

    for (const file of schemaFiles) {
      console.log(`\nExecuting ${file}...`);
      const filePath = path.join(__dirname, '../schemas', file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await client.query(sql);
      console.log(`✓ ${file} executed successfully`);
    }

    // Execute initialization script
    console.log('\nExecuting initialization script...');
    const initPath = path.join(__dirname, '../init/01_initialize.sql');
    const initSql = fs.readFileSync(initPath, 'utf8');
    await client.query(initSql);
    console.log('✓ Initialization complete');

    console.log('\n✓ All migrations completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
```

Add to `backend/package.json`:

```json
{
  "scripts": {
    "db:migrate": "node database/migrations/migrate.js",
    "db:seed": "node database/seeds/seed.js",
    "db:reset": "npm run db:migrate && npm run db:seed"
  }
}
```

### 3.6 Phase 3 Completion

Run migrations:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

Verify database:

```bash
docker exec -it smart_academy_postgres_dev psql -U smart_admin -d smart_academy_dev

-- List all tables
\dt

-- Check table structures
\d users
\d students
\d teachers
```

### 3.7 Phase 3 Checklist

- [ ] All database schema files created
- [ ] Enums defined for all fixed values
- [ ] All tables created with proper relationships
- [ ] Indexes created on frequently queried columns
- [ ] Triggers for updated_at columns
- [ ] Initial seed data inserted
- [ ] Migration scripts working
- [ ] Database verified in pgAdmin
- [ ] ERD documentation complete

---

## Phase 4: Core Backend API Development
**Duration:** 3-4 weeks  
**Effort:** 120-160 hours  
**Prerequisite:** Phases 1-3 completed  
**Deliverables:** Authentication, User Management, Basic CRUD APIs

### 4.1 Authentication System Implementation

#### 4.1.1 Create User Model

Create `backend/src/models/User.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';
import config from '../config';

// User attributes interface
interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'principal' | 'teacher' | 'parent' | 'student' | 'staff';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Optional fields for creation
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'emailVerified' | 'failedLoginAttempts'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public role!: 'super_admin' | 'admin' | 'principal' | 'teacher' | 'parent' | 'student' | 'staff';
  public status!: 'active' | 'inactive' | 'suspended' | 'pending';
  public emailVerified!: boolean;
  public emailVerifiedAt?: Date;
  public lastLoginAt?: Date;
  public failedLoginAttempts!: number;
  public lockedUntil?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
  }

  public isAccountLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  // Static method to hash password
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcryptRounds);
  }

  // Convert to JSON (exclude sensitive data)
  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() };
    delete (values as any).passwordHash;
    return values;
  }
}

// Initialize model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.ENUM(
        'super_admin',
        'admin',
        'principal',
        'teacher',
        'parent',
        'student',
        'staff'
      ),
      allowNull: false,
      defaultValue: 'student',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_verified',
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      field: 'email_verified_at',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      field: 'last_login_at',
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'failed_login_attempts',
    },
    lockedUntil: {
      type: DataTypes.DATE,
      field: 'locked_until',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    paranoid: true, // Soft deletes
    timestamps: true,
  }
);

export default User;
```

*Continue in Part 4...*

---

**Document Status:** Part 3 Complete  
**Next Part:** Phase 4-6 Continuation (Authentication Services, Controllers, Routes)
