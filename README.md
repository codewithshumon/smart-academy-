# Smart Academy Website Redevelopment

## Project Overview

Smart Academy is an Islamic English Medium School established in 2020 by Smart Foundation, serving underprivileged children in rural Bangladesh. This project transforms the current minimal website into a comprehensive digital platform with multiple user portals, payment integration, and multilingual support.

## Technology Stack

-   **Frontend:** React 18.2+, Next.js 14+, TypeScript 5.3+, Tailwind CSS 3.4+
-   **Backend:** Node.js 20 LTS, Express.js 4.18+, TypeScript 5.3+
-   **Database:** PostgreSQL 16+, Redis 7+
-   **Authentication:** JWT + bcrypt/Argon2
-   **Payment Gateways:** SSLCommerz, bKash, Nagad

## Development Environment

### Prerequisites

-   **Node.js:** v20.11.0 LTS
-   **npm:** v10.x (comes with Node.js)
-   **Git:** Latest version
-   **VSCode:** Latest version
-   **Docker Desktop:** Latest version (optional but recommended)

### Hardware Requirements

-   **CPU:** Intel Core i5 or AMD Ryzen 5 (8th Gen or newer)
-   **RAM:** 16GB minimum (32GB recommended)
-   **Storage:** 20GB free space on SSD

## Project Structure

```
smart-academy/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router (Next.js 14+)
│   │   │   ├── (public)/       # Public pages
│   │   │   ├── admin/         # Admin dashboard
│   │   └── portal/         # User portals (Parent, Student, Teacher)
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── common/          # Common components
│   ├── lib/               # Utilities and helpers
│   │   ├── api/             # API client configuration
│   │   ├── utils/           # Utility functions
│   │   └── validations/      # Input validation schemas
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── public/            # Static assets
│   │       ├── images/         # Image files
│   │       ├── icons/           # Icon files
│   │       └── fonts/           # Font files
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.local          # Environment variables
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
│   ├── database/             # Database-related files
│   │   ├── migrations/      # Database migrations
│   │   ├── seeds/            # Seed data scripts
│   │   ├── schemas/          # Database schemas
│   │   └── scripts/          # Automation scripts
│   ├── tests/               # Unit and integration tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.development  # Environment variables
│
├── shared/                   # Shared types and utilities
│   ├── types/             # Shared TypeScript types
│   ├── constants/         # Shared constants
│   └── utils/             # Shared utility functions
│
├── docs/                     # Project documentation
│   ├── api/             # API documentation
│   ├── architecture/      # System architecture
│   ├── deployment/       # Deployment guides
│   └── user-guides/     # User manuals
│
├── scripts/                  # Automation scripts
│   ├── setup/            # Project setup scripts
│   ├── deployment/        # Deployment automation
│   └── maintenance/       # Maintenance scripts
│
├── docker/                   # Docker configurations
│   ├── development/        # Development services
│   └── production/         # Production services
│
└── github/                   # GitHub workflows
    └── workflows/         # CI/CD pipelines
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-academy
```

### 2. Install Dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 3. Setup Environment Variables

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend (.env.development):**

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://smart_admin:password@localhost:5432/smart_academy_dev
```

### 4. Start Development Servers

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm run dev
```

## Development Workflow

1. Create a new feature branch
2. Make changes
3. Test thoroughly
4. Commit changes
5. Create pull request

## Documentation

Comprehensive documentation is available in the [`main-docs/`](main-docs/) directory:

-   **Implementation Roadmap:** Complete 12-phase development plan
-   **SRS:** Software Requirements Specification
-   **Technology Stack:** Detailed technology documentation
-   **Authentication System:** Complete authentication implementation
-   **Component Documentation:** UI component library
-   **Design System:** Design tokens and guidelines
-   **MCP Server Troubleshooting:** Configuration and setup guides

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request with clear description

## License

Copyright © 2025 Smart Foundation. All rights reserved.

## Contact

For questions or support, please refer to the documentation in the [`main-docs/`](main-docs/) directory.
