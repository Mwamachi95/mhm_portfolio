# Design System & UI/UX Documentation

This document outlines the UI/UX design practices, patterns, and principles implemented in the Heinz Mwamachi Portfolio.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Patterns](#component-patterns)
- [Animation & Motion](#animation--motion)
- [Interaction Design](#interaction-design)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

---

## Design Philosophy

The portfolio follows a **minimal, sophisticated aesthetic** that prioritizes content while maintaining visual interest through subtle animations and thoughtful interactions. Key principles:

1. **Content-First**: Design elements support rather than overshadow the work
2. **Smooth Experiences**: Lenis smooth scrolling and Framer Motion animations create fluid interactions
3. **Intentional Motion**: Every animation serves a purpose—guiding attention or providing feedback
4. **Responsive Excellence**: Dual-layout systems ensure optimal experiences across devices
5. **Dark/Light Harmony**: Seamless transitions between dark and light sections

---

## Color System

### Primary Palette

The color system uses **OKLCH color space** for better perceptual uniformity and is defined in `globals.css`:

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| **Electric Blue** | `#507579` | Primary brand color, CTAs |
| **Steel Teal** | `#658590` | Secondary accents |
| **Jungle Green** | `#1B3033` | Dark text, foreground |
| **Opal** | `#A0C8C4` | Accent, highlights |
| **Jet Stream** | `#C0D5CE` | Light backgrounds, cards |
| **Indigo Dark** | `#304544` | Dark backgrounds |
| **Indigo Blue** | `#284652` | Alternative dark |
| **Cadet** | `#577275` | Muted text |
| **Periwinkle** | `#C3CFD6` | Borders, dividers |

### CSS Custom Properties

```css
:root {
  --color-primary: #507579;
  --color-secondary: #658590;
  --color-background: #FFFFFF;
  --color-foreground: #1B3033;
  --color-accent: #A0C8C4;
  --color-muted: #577275;
  --color-border: #C3CFD6;
  --color-dark-bg: #304544;
  --color-dark-fg: #C0D5CE;
}
```

### Section Color Transitions

The About page demonstrates scroll-driven background transitions through the brand palette, creating a storytelling effect as users scroll through biographical content.

---

## Typography

### Font Families

| Font | Weight Range | Usage |
|------|--------------|-------|
| **Syne** | 400-700 | Display headings, navigation, hero text |
| **Plus Jakarta Sans** | 300-600 | Body text, descriptions, UI elements |

### Font Loading

Fonts are loaded via `next/font/google` with the following configuration:

```typescript
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600'],
})
```

### Type Scale

- **Hero Titles**: `text-5xl` to `text-8xl` (clamp for responsiveness)
- **Section Headings**: `text-3xl` to `text-5xl`
- **Subheadings**: `text-xl` to `text-2xl`
- **Body**: `text-base` to `text-lg`
- **Captions/Labels**: `text-sm` to `text-xs`

---

## Spacing & Layout

### Grid System

- **Container Max Width**: Content constrained with responsive padding
- **Primary Grid**: 12-column implicit grid
- **Project Grid**: 2-column on desktop, single column on mobile
- **Gallery Grid**: 3-column masonry-style on desktop

### Spacing Scale

Using Tailwind's default spacing scale with emphasis on:
- **Section Padding**: `py-20` to `py-32`
- **Component Gaps**: `gap-4` to `gap-8`
- **Content Margins**: `mb-8` to `mb-16`

### Layout Patterns

1. **Full-Width Sections**: Hero, footer, project showcases
2. **Contained Content**: Prose sections with `max-w-3xl`
3. **Split Layouts**: Two-column forms, about page image/text
4. **Sticky Elements**: Filter bars, floating navbar, about page images

---

## Component Patterns

### Button Variants

Six predefined button patterns defined in `globals.css`:

#### 1. Primary Button (`.btn-primary`)
- Dark background with sliding overlay effect
- Icon animates on hover
- Scale down on active state

```css
.btn-primary {
  @apply relative overflow-hidden bg-[--color-foreground]
         text-[--color-background] font-medium px-6 py-3;
}
```

#### 2. Secondary Button (`.btn-secondary`)
- Transparent with border
- Arrow slides on hover
- Background tint on hover

#### 3. Link Underline (`.link-underline`)
- Expanding underline from left
- Used for text navigation

#### 4. Overlay Button (`.btn-overlay`)
- Frosted glass effect
- White background with backdrop blur

#### 5. Filter Pill (`.btn-pill`)
- Used in project filtering
- Active state with solid background
- Subtle pulse animation

#### 6. Icon Button (`.btn-icon`)
- Scale and translation effects
- Used for actions like back-to-top

### Card Patterns

#### Project Card (Grid View)
- 4:3 aspect ratio image container
- Category badge overlay
- Title with gradient background
- Hover zoom effect on image

#### Project Card (Row View)
- Horizontal layout
- Thumbnail on left
- Content (title, category, date) on right
- Full-width clickable area

### Form Elements

- **Input Fields**: Border with focus ring, error state styling
- **Textareas**: Consistent styling with inputs
- **Labels**: Uppercase tracking, small text
- **Error Messages**: Red text, animated entry

---

## Animation & Motion

### Animation Library

Using **Framer Motion 12** for all component animations.

### Core Animation Values

```typescript
// Primary easing curve
const ease = [0.25, 0.46, 0.45, 0.94]

// Standard durations
const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  hero: 1.2
}

// Stagger delays
const stagger = {
  quick: 0.05,
  normal: 0.1,
  slow: 0.15
}
```

### Animation Patterns

#### Fade In Up
```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease }
}
```

#### Stagger Container
```typescript
const container = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

#### Scroll-Driven Animations
Using `useScroll()` and `useTransform()` for:
- Projects showcase card expansions
- About page background transitions
- Parallax image effects

### Smooth Scrolling

**Lenis** configuration in `smooth-scroll-provider.tsx`:

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})
```

### Logo Animation

The animated logo uses staggered color transitions across 10 SVG paths:
- 6.5s total duration
- 0.08s stagger between paths
- Random final colors from brand palette

---

## Interaction Design

### Custom Cursor

A sophisticated custom cursor system (`CustomCursor.tsx`):

#### Features
- Smooth interpolation with 0.15 lerp factor
- Data-attribute based labeling system
- Spring physics for scale animations
- Touch device auto-disable
- RAF-based animation loop

#### Cursor Labels
```html
<button data-cursor="VIEW">View Project</button>
<button data-cursor="OPEN">Open Menu</button>
<button data-cursor="CLOSE">Close</button>
```

#### Label Display
Labels appear inside the cursor circle:
- `[ VIEW ]` - For viewable content
- `[ OPEN ]` - For expandable elements
- `[ CLOSE ]` - For closeable modals

### Hover States

| Element | Hover Effect |
|---------|-------------|
| Project Cards | Image zoom, overlay reveal |
| Navigation Links | Underline expansion |
| Buttons | Overlay slide, icon animation |
| Menu Items | Text scale, color change |

### Focus States

- Clear `:focus-visible` rings
- High contrast focus indicators
- Skip link for keyboard users

### Scroll Interactions

1. **Navbar**: Floating glassmorphism, hides on scroll down
2. **About Link**: Repositions when menu opens or footer appears
3. **Back to Top**: Appears after 300px scroll
4. **Filter Bar**: Sticky with backdrop blur

---

## Responsive Design

### Breakpoint Strategy

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Patterns

#### Projects Showcase
- **Desktop**: Scroll-driven animated carousel with expanding cards
- **Mobile**: Horizontal swipeable carousel with dots and arrows

#### About Page
- **Desktop**: Split layout with sticky image frame
- **Mobile**: Stacked layout with fixed floating image

#### Navigation
- **Desktop**: Horizontal link bar
- **Mobile**: Full-screen overlay menu

### Responsive Typography

Using Tailwind's responsive prefixes:
```html
<h1 class="text-4xl md:text-6xl lg:text-8xl">
```

### Touch Optimization

- Custom cursor disabled on touch devices
- Touch-friendly tap targets (minimum 44x44px)
- Swipe gestures for carousels
- Passive scroll listeners for performance

---

## Accessibility

### Semantic Structure

- Proper heading hierarchy (h1 → h6)
- Landmark regions (`<main>`, `<nav>`, `<footer>`)
- Semantic HTML5 elements throughout

### ARIA Implementation

```html
<!-- Button states -->
<button aria-pressed="true" aria-label="Toggle grid view">

<!-- Form fields -->
<input
  aria-required="true"
  aria-invalid="true"
  aria-describedby="email-error"
/>

<!-- Dialogs -->
<div role="dialog" aria-modal="true" aria-label="Image lightbox">
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate interactive elements |
| `Enter/Space` | Activate buttons/links |
| `Escape` | Close modals/menus |
| `←/→` | Navigate lightbox images |

### Motion Sensitivity

Full support for `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .btn-primary::before,
  .btn-primary .btn-icon,
  .btn-secondary .btn-arrow {
    transition: none !important;
  }

  .link-underline::after {
    transition: none !important;
    transform: scaleX(1);
  }
}
```

### Color Contrast

All text meets WCAG AA standards:
- Body text: 4.5:1 minimum contrast
- Large text: 3:1 minimum contrast
- Interactive elements: Clear visual states

### Screen Reader Support

- Descriptive alt text for images
- Hidden decorative elements (`aria-hidden="true"`)
- Announce state changes with live regions
- Proper link context ("View Project Name" vs "View")

---

## Image Handling

### Optimization Strategy

Using Next.js Image component with Sanity CDN:

```typescript
<Image
  src={urlFor(image).width(1200).auto('format').quality(85).url()}
  alt={image.alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

### Placeholder Patterns

Gradient fallbacks for missing images:
```typescript
const gradientClasses = [
  'from-primary/20 to-accent/20',
  'from-secondary/20 to-muted/20',
  // ...more variations
]
```

### Lightbox Viewer

- Full-screen image viewing
- Keyboard navigation (arrows, escape)
- Image counter display
- Caption support
- Body scroll lock when open

---

## Performance Considerations

### Animation Performance

- GPU-accelerated transforms (`will-change`, `backface-visibility`)
- RAF-based animation loops
- Passive event listeners for scroll
- Intersection Observer for lazy animations

### Loading Strategy

- Above-fold images prioritized
- Lazy loading for off-screen content
- Suspense boundaries for async components
- Code splitting for heavy components

---

## Design Tokens Summary

```css
/* Colors */
--color-primary: #507579;
--color-secondary: #658590;
--color-background: #FFFFFF;
--color-foreground: #1B3033;
--color-accent: #A0C8C4;

/* Typography */
--font-syne: 'Syne', sans-serif;
--font-jakarta: 'Plus Jakarta Sans', sans-serif;

/* Spacing */
--radius: 0.625rem;

/* Animation */
--ease-primary: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--duration-fast: 0.2s;
--duration-normal: 0.4s;
--duration-slow: 0.8s;

/* Smooth Scroll */
--scroll-duration: 1.2s;
```

---

## File References

| Pattern | Location |
|---------|----------|
| Color definitions | `src/app/globals.css` |
| Button patterns | `src/app/globals.css` |
| Custom cursor | `src/components/ui/CustomCursor.tsx` |
| Smooth scroll | `src/components/smooth-scroll-provider.tsx` |
| Animation examples | `src/components/sections/ProjectsShowcase.tsx` |
| Form patterns | `src/components/sections/ContactCTA.tsx` |
| Responsive layouts | `src/components/projects/ProjectDetail.tsx` |
