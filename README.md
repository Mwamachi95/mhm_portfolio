# Heinz Mwamachi Portfolio

A sophisticated, production-ready portfolio website showcasing creative work through immersive animations, scroll-driven interactions, and a refined user experience.

## Overview

This portfolio is built with modern web technologies to deliver a premium browsing experience. It features an animated intro sequence, smooth scrolling, a custom cursor system, and dynamic project showcases that respond to user interactions.

### Key Features

- **Animated Intro Sequence** - Captivating logo animation with skip functionality
- **Smooth Scrolling** - Lenis-powered buttery smooth scroll experience
- **Custom Cursor** - Context-aware cursor with dynamic labels
- **Scroll-Driven Animations** - Projects expand and transform as you scroll
- **Dual-Layout System** - Desktop carousel vs mobile swipeable gallery
- **CMS Integration** - Sanity headless CMS for easy content management
- **Contact Form** - Validated form with Formspree integration
- **Fully Responsive** - Optimized for all device sizes
- **Accessibility First** - Keyboard navigation, screen reader support, reduced motion

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Components** | Shadcn/ui (New York) |
| **Animation** | Framer Motion 12 |
| **Scrolling** | Lenis |
| **CMS** | Sanity |
| **Forms** | React Hook Form + Zod |
| **Package Manager** | pnpm |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm 8.0 or later

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mhm_portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Development

```bash
# Start development server with Turbopack
pnpm dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Tailwind v4 configuration
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects listing & detail pages
│   └── studio/            # Sanity Studio
├── components/
│   ├── intro/             # Logo intro animation
│   ├── icons/             # Animated icons/logos
│   ├── navigation/        # Navbar, Footer, BackToTop
│   ├── sections/          # Page sections (About, Contact, etc.)
│   ├── projects/          # Project-specific components
│   └── ui/                # UI primitives (CustomCursor, etc.)
├── lib/
│   ├── sanity.ts          # Sanity client configuration
│   └── utils.ts           # Utility functions
└── sanity/
    ├── schemaTypes/       # Content schemas
    └── lib/               # Sanity utilities
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with intro, hero, projects showcase, contact CTA |
| `/projects` | Filterable project grid with layout toggle |
| `/projects/[slug]` | Individual project detail with lightbox |
| `/about` | Scroll-driven about page with image transitions |
| `/contact` | Contact form |
| `/studio` | Sanity Studio for content management |

## Documentation

- **[DESIGN.md](./DESIGN.md)** - UI/UX design system, color palette, typography, animations
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, patterns, dependencies
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant guidance for development

## Features in Detail

### Intro Animation

An 8-second animated logo sequence plays on first visit, featuring:
- 10-path SVG with staggered color transitions
- Random final colors from brand palette
- Click-to-skip functionality
- Smooth transition to hero section

### Projects Showcase

**Desktop Experience:**
- Scroll-driven timeline animation
- Cards expand and contract in sequence
- "Projects" text scales and fades
- Horizontal row sliding effect

**Mobile Experience:**
- Horizontal swipeable carousel
- Pagination dots
- Navigation arrows
- Touch-optimized interactions

### Custom Cursor

A sophisticated cursor replacement that:
- Shows contextual labels (`[ VIEW ]`, `[ OPEN ]`, `[ CLOSE ]`)
- Uses spring physics for smooth scaling
- Automatically detects touch devices
- Uses RAF for 60fps animation

### Form Validation

The contact form features:
- Real-time Zod schema validation
- Field-level error messages
- Auto-focus on first error
- Loading and success states
- Formspree backend integration

## Performance

- **Server Components** by default for optimal initial load
- **Turbopack** for fast development builds
- **Image Optimization** via Next.js Image + Sanity CDN
- **Code Splitting** for route-based chunks
- **Passive Event Listeners** for scroll performance
- **RAF Animation Loops** for smooth 60fps animations

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation (Tab, Escape, Arrow keys)
- Focus visible indicators
- `prefers-reduced-motion` support
- Screen reader compatible

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Create production build
pnpm start    # Run production server
pnpm lint     # Run ESLint
```

## Deployment

The project is optimized for deployment on [Vercel](https://vercel.com):

```bash
# Deploy to Vercel
vercel
```

Configure the following in your Vercel project:
- Environment variables for Sanity
- Node.js 18.x runtime

## License

Private - All rights reserved.

---

Built with Next.js, Tailwind CSS, and Framer Motion.
