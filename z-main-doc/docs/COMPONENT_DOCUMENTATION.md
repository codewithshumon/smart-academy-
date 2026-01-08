# Component Documentation

This document provides detailed documentation for all UI components in the Smart Academy Design System.

## Table of Contents

1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [Form](#form)
5. [Navigation](#navigation)
6. [Layout](#layout)
7. [Feedback](#feedback)
8. [Interactive Elements](#interactive-elements)

---

## Button

The Button component is a versatile interactive element used for actions and navigation.

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| variant | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost'` | `'primary'` | Visual style variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| disabled | `boolean` | `false` | Disable the button |
| loading | `boolean` | `false` | Show loading state |
| onClick | `function` | - | Click handler |
| children | `ReactNode` | - | Button content |

### Variants

#### Primary Button
```tsx
<Button variant="primary" onClick={handleSubmit}>
  Submit Form
</Button>
```
- Emerald green background
- White text
- Hover state with darker green

#### Secondary Button
```tsx
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>
```
- Deep blue background
- White text
- Hover state with darker blue

#### Tertiary Button
```tsx
<Button variant="tertiary" onClick={handleDownload}>
  Download
</Button>
```
- Amber background
- White text
- Hover state with darker amber

#### Ghost Button
```tsx
<Button variant="ghost" onClick={handleEdit}>
  Edit
</Button>
```
- Transparent background
- Colored text
- Hover state with colored background

### Sizes

#### Small Button
```tsx
<Button variant="primary" size="sm">
  Small
</Button>
```
- 32px height
- Smaller padding
- Smaller text

#### Medium Button
```tsx
<Button variant="primary" size="md">
  Medium
</Button>
```
- 40px height
- Standard padding
- Standard text size

#### Large Button
```tsx
<Button variant="primary" size="lg">
  Large
</Button>
```
- 48px height
- Larger padding
- Larger text

### States

#### Disabled State
```tsx
<Button variant="primary" disabled>
  Disabled
</Button>
```
- Reduced opacity
- No hover effects
- Not clickable

#### Loading State
```tsx
<Button variant="primary" loading>
  Loading...
</Button>
```
- Shows spinner
- Disabled during loading
- Maintains size

### Accessibility

- Keyboard accessible
- Screen reader friendly
- Focus visible
- ARIA attributes

---

## Input

The Input component provides form input with validation and error handling.

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| type | `'text' \| 'email' \| 'password' \| 'tel' \| 'number'` | `'text'` | Input type |
| placeholder | `string` | - | Placeholder text |
| value | `string` | - | Input value |
| onChange | `function` | - | Change handler |
| error | `boolean` | `false` | Error state |
| helperText | `string` | - | Helper text |
| required | `boolean` | `false` | Required field |
| disabled | `boolean` | `false` | Disabled state |
| label | `string` | - | Field label |

### Basic Usage

```tsx
<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  label="Email Address"
  required
/>
```

### With Validation

```tsx
<Input
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={setPassword}
  error={hasError}
  helperText="Password must be at least 8 characters"
  label="Password"
  required
/>
```

### Input Types

#### Email Input
```tsx
<Input
  type="email"
  placeholder="your@email.com"
  label="Email"
/>
```

#### Password Input
```tsx
<Input
  type="password"
  placeholder="Enter password"
  label="Password"
/>
```

#### Phone Input
```tsx
<Input
  type="tel"
  placeholder="+880 1234 5678"
  label="Phone Number"
/>
```

### Accessibility

- Proper labeling
- Error announcements
- Keyboard navigation
- Screen reader support

---

## Card

The Card component is a flexible container for grouping related content.

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| className | `string` | - | Additional CSS classes |
| onClick | `function` | - | Click handler |
| children | `ReactNode` | - | Card content |

### Sub-components

#### Card.Header
```tsx
<Card.Header className="p-4">
  <h3>Card Title</h3>
</Card.Header>
```

#### Card.Body
```tsx
<Card.Body className="p-4">
  <p>Card content goes here</p>
</Card.Body>
```

#### Card.Footer
```tsx
<Card.Footer className="p-4">
  <Button>Action</Button>
</Card.Footer>
```

### Basic Card

```tsx
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Card with Header and Footer

```tsx
<Card>
  <Card.Header>
    <h3>User Profile</h3>
  </Card.Header>
  <Card.Body>
    <p>User information</p>
  </Card.Body>
  <Card.Footer>
    <Button>Edit Profile</Button>
  </Card.Footer>
</Card>
```

### Interactive Card

```tsx
<Card 
  className="p-6 hover:shadow-lg cursor-pointer"
  onClick={handleCardClick}
>
  <h3>Clickable Card</h3>
  <p>Click to interact</p>
</Card>
```

---

## Form

The Form component provides form validation and submission handling.

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| onSubmit | `function` | - | Submit handler |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Form content |

### Basic Form

```tsx
<Form onSubmit={handleSubmit}>
  <Input
    type="email"
    label="Email"
    required
  />
  <Input
    type="password"
    label="Password"
    required
  />
  <Button type="submit">Login</Button>
</Form>
```

### Form with Validation

```tsx
<Form onSubmit={handleSubmit}>
  <Input
    type="text"
    label="Name"
    required
    error={errors.name}
    helperText={errors.name}
  />
  <Input
    type="email"
    label="Email"
    required
    error={errors.email}
    helperText={errors.email}
  />
  <Button type="submit">Submit</Button>
</Form>
```

---

## Navigation

### Header

The Header component provides site navigation.

```tsx
<Header>
  <Logo />
  <Navigation />
  <CTAButtons />
</Header>
```

### Footer

The Footer component provides site footer information.

```tsx
<Footer>
  <AboutSection />
  <QuickLinks />
  <ContactInfo />
  <SocialMedia />
</Footer>
```

### Breadcrumbs

The Breadcrumbs component provides navigation hierarchy.

```tsx
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Leadership', href: '/about/leadership' }
  ]}
/>
```

---

## Layout

### Container

The Container component provides responsive width constraints.

```tsx
<Container>
  <p>Content with max-width constraints</p>
</Container>
```

### Section

The Section component provides vertical spacing.

```tsx
<Section className="py-16">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>
```

### Grid

The Grid component provides responsive grid layout.

```tsx
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={6}>
  <Card>Grid Item 1</Card>
  <Card>Grid Item 2</Card>
  <Card>Grid Item 3</Card>
</Grid>
```

### Flex

The Flex component provides flexible layout.

```tsx
<Flex justify="between" align="center" className="p-4">
  <div>Left content</div>
  <div>Right content</div>
</Flex>
```

---

## Feedback

### Alert

The Alert component provides feedback messages.

#### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| variant | `'success' \| 'warning' \| 'error' \| 'info'` | `'info'` | Alert type |
| dismissible | `boolean` | `false` | Can be dismissed |
| onDismiss | `function` | - | Dismiss handler |
| children | `ReactNode` | - | Alert content |

#### Success Alert

```tsx
<Alert variant="success" dismissible onDismiss={handleDismiss}>
  Operation completed successfully!
</Alert>
```

#### Error Alert

```tsx
<Alert variant="error">
  Something went wrong. Please try again.
</Alert>
```

### Modal

The Modal component provides dialog overlay.

#### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| isOpen | `boolean` | `false` | Modal visibility |
| onClose | `function` | - | Close handler |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Modal size |
| title | `string` | - | Modal title |
| children | `ReactNode` | - | Modal content |

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Confirmation">
  <p>Are you sure you want to continue?</p>
  <div className="flex justify-end space-x-4 mt-6">
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>
```

---

## Interactive Elements

### Tabs

The Tabs component provides tabbed navigation.

```tsx
<Tabs
  tabs={[
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Tab 1 content</div>
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Tab 2 content</div>
    }
  ]}
  defaultTab="tab1"
/>
```

### Accordion

The Accordion component provides collapsible content sections.

```tsx
<Accordion
  items={[
    {
      id: 'section1',
      title: 'Section 1',
      content: <div>Section 1 content</div>
    },
    {
      id: 'section2',
      title: 'Section 2',
      content: <div>Section 2 content</div>
    }
  ]}
/>
```

### Tooltip

The Tooltip component provides additional information on hover.

```tsx
<Tooltip content="Additional information">
  <Button>Hover me</Button>
</Tooltip>
```

### ProgressBar

The ProgressBar component shows progress indication.

```tsx
<ProgressBar
  value={75}
  max={100}
  label="Upload Progress"
  showPercentage
  color="emerald"
/>
```

---

## Best Practices

### Component Composition

1. Use semantic HTML elements
2. Follow accessibility guidelines
3. Implement proper error handling
4. Use consistent styling
5. Test on different devices

### Performance

1. Optimize re-renders
2. Use memoization when needed
3. Implement lazy loading
4. Minimize bundle size
5. Test on slow connections

### Accessibility

1. Provide keyboard navigation
2. Add screen reader support
3. Use proper ARIA attributes
4. Ensure color contrast
5. Test with assistive technologies

---

## Troubleshooting

### Common Issues

#### Button Not Responding
- Check if onClick handler is properly defined
- Verify button is not disabled
- Check for JavaScript errors

#### Input Validation Not Working
- Ensure onChange handler is set
- Check validation logic
- Verify error state management

#### Modal Not Closing
- Check onClose handler
- Verify backdrop click handling
- Check escape key handling

### Getting Help

1. Check component documentation
2. Review code examples
3. Test in isolation
4. Check browser console
5. Contact development team

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Maintained by**: Smart Academy Development Team