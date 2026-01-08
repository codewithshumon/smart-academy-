# Smart Academy Website Redevelopment
## Technology Stack - Part 2: Frontend Technologies

---

## Frontend Technologies

### 1. Core Framework

#### React 18.2+ with Next.js 14+

**Purpose:** Modern frontend framework with server-side rendering

**Why Next.js:**
- ✅ **SEO Optimization:** Server-side rendering and static generation
- ✅ **Performance:** Automatic code splitting and optimization
- ✅ **Routing:** File-based routing system
- ✅ **API Routes:** Built-in API endpoints
- ✅ **Image Optimization:** Automatic image optimization
- ✅ **Internationalization:** Built-in i18n support for multilingual
- ✅ **TypeScript Support:** First-class TypeScript integration
- ✅ **Developer Experience:** Hot reload, error reporting

**Installation:**
```bash
npx create-next-app@latest smart-academy-frontend --typescript --tailwind --app --eslint
cd smart-academy-frontend
```

**Key Features Used:**
- App Router (Next.js 14+)
- React Server Components
- Server Actions
- Parallel Routes
- Intercepting Routes
- Middleware for authentication

**package.json (Frontend):**
```json
{
  "name": "smart-academy-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.1.0",
    "next-intl": "^3.9.0",
    "axios": "^1.6.7",
    "date-fns": "^3.3.1",
    "zod": "^3.22.4",
    "react-hook-form": "^7.50.1",
    "@hookform/resolvers": "^3.3.4",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.20.1",
    "framer-motion": "^11.0.3",
    "lucide-react": "^0.323.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@types/node": "^20.11.16",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "@typescript-eslint/eslint-plugin": "^6.20.0",
    "@typescript-eslint/parser": "^6.20.0",
    "prettier": "^3.2.5",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "@testing-library/react": "^14.2.1",
    "@testing-library/jest-dom": "^6.4.2",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

### 2. Programming Language

#### TypeScript 5.3+

**Purpose:** Type-safe JavaScript for better developer experience

**Benefits:**
- Type safety and error prevention
- Better IDE support and autocomplete
- Enhanced code documentation
- Easier refactoring
- Better team collaboration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. UI Styling

#### Tailwind CSS 3.4+

**Purpose:** Utility-first CSS framework for rapid UI development

**Why Tailwind:**
- ✅ Rapid development with utility classes
- ✅ Consistent design system
- ✅ Small production bundle (unused CSS purged)
- ✅ Responsive design utilities
- ✅ Dark mode support
- ✅ RTL support for Arabic
- ✅ Excellent documentation

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Smart Academy Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        islamic: {
          green: '#00A86B', // Islamic green
          gold: '#FFD700',  // Gold accent
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-noto-sans-bengali)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-sans-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'hard': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

**Additional Tailwind Plugins:**
```bash
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

### 4. State Management

#### Zustand 4.5+

**Purpose:** Lightweight state management for global state

**Why Zustand:**
- Minimal boilerplate
- No providers needed
- TypeScript support
- DevTools integration
- Small bundle size (~1KB)

**Example Store:**
```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'parent' | 'teacher' | 'student';
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user, token) => 
          set({ user, token, isAuthenticated: true }),
        logout: () => 
          set({ user: null, token: null, isAuthenticated: false }),
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
```

#### React Query (TanStack Query) 5.20+

**Purpose:** Server state management and data fetching

**Why React Query:**
- Automatic caching
- Background refetching
- Optimistic updates
- Pagination and infinite scroll
- Request deduplication
- Offline support

**Configuration:**
```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 5. Form Management

#### React Hook Form 7.50+ with Zod Validation

**Purpose:** Performant form handling with type-safe validation

**Why React Hook Form:**
- Excellent performance (minimal re-renders)
- Small bundle size
- Easy integration with UI libraries
- Built-in validation
- TypeScript support

**Why Zod:**
- Runtime type validation
- TypeScript inference
- Schema composition
- Detailed error messages

**Example Form:**
```typescript
// src/components/forms/AdmissionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const admissionSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  gender: z.enum(['male', 'female']),
  parentName: z.string().min(2),
  parentEmail: z.string().email('Invalid email address'),
  parentPhone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
  previousSchool: z.string().optional(),
  classApplied: z.string().min(1, 'Please select a class'),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export function AdmissionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const onSubmit = async (data: AdmissionFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### 6. UI Component Libraries

#### Headless UI + Custom Components

**Purpose:** Accessible, unstyled UI components

**Installation:**
```bash
npm install @headlessui/react @heroicons/react
```

**Custom Component Library Structure:**
```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Modal.tsx
│   ├── Dropdown.tsx
│   ├── Tabs.tsx
│   ├── Accordion.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Alert.tsx
│   ├── Toast.tsx
│   └── ...
├── forms/                 # Form components
│   ├── FormField.tsx
│   ├── FormError.tsx
│   ├── FormLabel.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── Navigation.tsx
│   └── ...
└── features/             # Feature-specific components
    ├── admission/
    ├── parent-portal/
    ├── student-portal/
    ├── teacher-portal/
    └── admin-dashboard/
```

**Example Button Component with CVA:**
```typescript
// src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        xl: 'h-12 px-10 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 7. Internationalization (i18n)

#### next-intl 3.9+

**Purpose:** Multilingual support for English, Bangla, and Arabic

**Installation:**
```bash
npm install next-intl
```

**Configuration:**
```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'bn', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Middleware:**
```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

**Translation Files Structure:**
```
messages/
├── en.json         # English translations
├── bn.json         # Bangla translations
└── ar.json         # Arabic translations
```

**Example Usage:**
```typescript
// In component
import { useTranslations } from 'next-intl';

export function WelcomeMessage() {
  const t = useTranslations('Home');
  
  return (
    <h1>{t('welcome')}</h1>
  );
}
```

### 8. Animation and Interactions

#### Framer Motion 11+

**Purpose:** Production-ready animation library

**Installation:**
```bash
npm install framer-motion
```

**Example Animations:**
```typescript
// src/components/animations/FadeIn.tsx
import { motion } from 'framer-motion';

export function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### 9. Icons

#### Lucide React 0.323+

**Purpose:** Beautiful, customizable icon library

**Why Lucide:**
- Tree-shakeable (only imports icons used)
- Consistent design
- Extensive icon set
- TypeScript support
- RTL compatible

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```typescript
import { Home, User, Settings, LogOut } from 'lucide-react';

<Home className="h-5 w-5" />
```

### 10. Date and Time Management

#### date-fns 3.3+

**Purpose:** Modern JavaScript date utility library

**Why date-fns:**
- Modular and tree-shakeable
- Immutable and pure functions
- TypeScript support
- Excellent i18n support
- Smaller than Moment.js

**Installation:**
```bash
npm install date-fns
```

**Usage:**
```typescript
import { format, parseISO, formatDistance } from 'date-fns';
import { bn, ar, enUS } from 'date-fns/locale';

// Format date based on locale
format(new Date(), 'PPP', { locale: bn });
```

### 11. HTTP Client

#### Axios 1.6+

**Purpose:** Promise-based HTTP client

**Why Axios:**
- Automatic JSON transformation
- Request/response interceptors
- Cancel requests
- Timeout support
- Browser and Node.js compatibility

**Configuration:**
```typescript
// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 12. Utility Functions

#### clsx + tailwind-merge

**Purpose:** Conditional className utility

**Installation:**
```bash
npm install clsx tailwind-merge
```

**Utility Function:**
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 13. Image Optimization

#### Next.js Image Component + Sharp

**Purpose:** Automatic image optimization

**Configuration:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['mysmart.academy', 'cdn.mysmart.academy'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

**Usage:**
```typescript
import Image from 'next/image';

<Image
  src="/campus.jpg"
  alt="Smart Academy Campus"
  width={1200}
  height={800}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 14. SEO Optimization

#### Next.js Metadata API

**Purpose:** Comprehensive SEO management

**Implementation:**
```typescript
// src/app/[locale]/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Smart Academy',
    default: 'Smart Academy - Islamic English Medium School',
  },
  description: 'Smart Academy provides quality Islamic education...',
  keywords: ['Islamic school', 'Bangladesh', 'English medium', 'Laxmipur'],
  authors: [{ name: 'Smart Academy' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mysmart.academy',
    siteName: 'Smart Academy',
    images: [
      {
        url: 'https://mysmart.academy/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smartacademy',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 15. Testing

#### Jest + React Testing Library

**Purpose:** Unit and integration testing

**Installation:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**Configuration:**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

---

*Continue to next document for Backend Technologies...*
