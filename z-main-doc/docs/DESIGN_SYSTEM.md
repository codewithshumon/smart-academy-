# Smart Academy Design System Documentation

## Overview

The Smart Academy Design System is a comprehensive UI/UX foundation for an Islamic educational institution in Bangladesh. It combines modern design principles with Islamic cultural elements and Bangladesh-specific requirements.

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Responsive Design](#responsive-design)
5. [Accessibility](#accessibility)
6. [Interactive Elements](#interactive-elements)
7. [Wireframes](#wireframes)
8. [Usage Guidelines](#usage-guidelines)

## Brand Identity

### Color Palette

Our color system reflects Islamic traditions and modern education:

#### Primary Colors
- **Emerald Green** (`#10b981`): Primary brand color representing growth and Islamic heritage
- **Deep Blue** (`#1e40af`): Secondary color representing trust and stability
- **Amber** (`#f59e0b`): Accent color representing wisdom and knowledge

#### Neutral Colors
- **Gray Scale**: From `#f9fafb` to `#111827` for text and backgrounds
- **White** (`#ffffff`): Pure white for clean, modern interfaces

#### Bangladesh Flag Integration
- **Green** (`#006a4e`): Bangladesh national green
- **Red** (`#f42a41`): Bangladesh national red (used sparingly for accents)

### Typography

#### Font Families
- **Primary**: Inter (modern, readable sans-serif)
- **Arabic**: Amiri Quran (Arabic script support)
- **Bengali**: SolaimanLipi (Bengali script support)

#### Type Scale
- **Display**: `text-4xl` to `text-6xl` (48px to 60px)
- **Heading**: `text-2xl` to `text-3xl` (24px to 30px)
- **Body**: `text-base` to `text-lg` (16px to 18px)
- **Small**: `text-sm` to `text-xs` (14px to 12px)

### Iconography

Our icon library includes:
- **Educational Icons**: Books, graduation caps, academic symbols
- **Islamic Elements**: Mosque, Quran, prayer symbols
- **Bangladesh Specific**: Local cultural elements and symbols

## Design Tokens

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### Border Radius
- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)

### Shadows
- **Subtle**: `shadow-sm`
- **Default**: `shadow-md`
- **Prominent**: `shadow-lg`
- **Dramatic**: `shadow-xl`

## Component Library

### Core Components

#### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Variants:**
- `primary`: Emerald green background
- `secondary`: Deep blue background
- `tertiary`: Amber background
- `ghost`: Transparent with colored text

**Sizes:**
- `sm`: Small button (32px height)
- `md`: Medium button (40px height)
- `lg`: Large button (48px height)

#### Input
```tsx
import { Input } from '@/components/ui/input';

<Input
  type="email"
  placeholder="Enter email"
  error={hasError}
  helperText="Please enter a valid email"
/>
```

**Features:**
- Built-in validation states
- Error handling with helper text
- Accessibility attributes
- Multiple input types

#### Card
```tsx
import { Card } from '@/components/ui/card';

<Card className="p-6 hover:shadow-lg">
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Layout Components

#### Container
Responsive container with max-width constraints:
- Mobile: Full width
- Tablet: 768px max-width
- Desktop: 1024px max-width
- Large: 1280px max-width

#### Grid
Responsive grid system:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Large: 4-6 columns

### Navigation Components

#### Header
Sticky navigation with:
- Logo placement
- Navigation menu
- CTA buttons
- Mobile hamburger menu

#### Footer
Comprehensive footer with:
- Organization information
- Quick links
- Contact details
- Social media links

### Feedback Components

#### Alert
```tsx
import { Alert } from '@/components/ui/alert';

<Alert variant="success" dismissible>
  Operation completed successfully!
</Alert>
```

**Variants:**
- `success`: Green styling for positive feedback
- `warning`: Amber styling for warnings
- `error`: Red styling for errors
- `info`: Blue styling for information

#### Modal
Accessible modal dialog with:
- Focus trapping
- Escape key handling
- Screen reader support
- Multiple sizes

## Responsive Design

### Breakpoints
- **Mobile**: `sm` (640px and up)
- **Tablet**: `md` (768px and up)
- **Desktop**: `lg` (1024px and up)
- **Large**: `xl` (1280px and up)

### Mobile-First Approach
All components use mobile-first CSS with progressive enhancement for larger screens.

### Bangladesh Optimizations
- Optimized for low bandwidth conditions
- Touch-friendly interactions
- Reduced motion support
- Bengali language support

## Accessibility

### WCAG 2.1 AA Compliance

Our design system meets WCAG 2.1 AA standards:

#### Color Contrast
- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3.0:1 minimum contrast ratio
- Interactive elements: 3.0:1 minimum contrast ratio

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip navigation links

#### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels and roles
- Screen reader announcements
- Alternative text for images

### Accessibility Features

#### Focus Management
```tsx
import { focusManagement } from '@/lib/accessibility';

// Trap focus within modal
const cleanup = focusManagement.trapFocus(modalElement);
// Call cleanup() when modal closes
```

#### Screen Reader Announcements
```tsx
import { screenReader } from '@/lib/accessibility';

screenReader.announce('Form submitted successfully');
```

## Interactive Elements

### Animations

#### Animation Variants
- `fadeIn`: Fade in animation
- `slideInUp`: Slide up from bottom
- `scaleIn`: Scale from small to normal
- `bounceIn`: Bounce entrance effect

#### Performance Optimizations
- CSS transforms for smooth animations
- Reduced motion support
- Hardware acceleration
- Bangladesh bandwidth considerations

#### Usage Example
```tsx
import { useAnimation } from '@/lib/animations';

const { elementRef, trigger } = useAnimation('fadeIn', 'mount');

<div ref={elementRef}>
  Animated content
</div>
```

### Micro-interactions

#### Hover States
- Button color transitions
- Card elevation changes
- Link underline animations

#### Loading States
- Skeleton screens
- Progress indicators
- Loading spinners

## Wireframes

### Available Wireframes

#### HomepageWireframe
Complete homepage structure with:
- Hero section
- Featured programs
- Statistics
- News and events
- Testimonials

#### AboutWireframe
Comprehensive about page with:
- History timeline
- Mission and vision
- Leadership team
- Facilities overview

#### AcademicsWireframe
Educational program details with:
- Curriculum overview
- Program details
- Teaching methods
- Assessment system

#### AdmissionsWireframe
Admission process information with:
- Application steps
- Program selection
- Fee structure
- Important dates

#### ContactWireframe
Contact information and form with:
- Contact details
- Interactive form
- Map location
- FAQ section

#### AuthWireframe
Authentication flows with:
- Login form
- Registration form
- Password reset
- Social login options

### Usage Example
```tsx
import { HomepageWireframe } from '@/components/wireframes';

<HomepageWireframe />
```

## Usage Guidelines

### Design Principles

#### Islamic Values Integration
- Respect for Islamic traditions
- Modest and appropriate imagery
- Cultural sensitivity
- Family-oriented design

#### Bangladesh Context
- Local language support (Bengali)
- Cultural relevance
- Bandwidth optimization
- Mobile-first approach

#### Educational Focus
- Clear information hierarchy
- Age-appropriate design
- Accessibility for all users
- Professional appearance

### Best Practices

#### Component Usage
1. Use semantic HTML elements
2. Provide proper alt text for images
3. Ensure keyboard accessibility
4. Test with screen readers
5. Validate color contrast

#### Performance
1. Optimize images for web
2. Use appropriate file formats
3. Implement lazy loading
4. Minimize bundle size
5. Test on slow connections

#### Responsive Design
1. Design mobile-first
2. Test on actual devices
3. Consider touch interactions
4. Optimize for different screen sizes
5. Ensure content is accessible

### Customization

#### Theme Customization
The design system supports:
- Color scheme variations
- Typography adjustments
- Spacing modifications
- Component variants

#### Extending Components
1. Follow existing patterns
2. Maintain accessibility
3. Use design tokens
4. Document changes
5. Test thoroughly

## Implementation Notes

### Technology Stack
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG components
- **Animations**: CSS-in-JS with performance optimizations

### File Structure
```
components/
├── ui/                 # Core UI components
├── wireframes/         # Page wireframes
├── lib/               # Utilities and design tokens
└── styles/             # Global styles
```

### Development Guidelines
1. Use TypeScript for all components
2. Follow React best practices
3. Implement proper error handling
4. Add comprehensive documentation
5. Test accessibility features

## Support and Maintenance

### Documentation Updates
This documentation is regularly updated with:
- New component additions
- Usage examples
- Best practices
- Performance tips
- Accessibility improvements

### Getting Help
For questions or support:
1. Check component documentation
2. Review usage examples
3. Test in isolation
4. Consult accessibility guidelines
5. Contact the design team

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Maintained by**: Smart Academy Development Team