# Technical Architecture

This document provides a comprehensive technical overview of the Heinz Mwamachi Portfolio application, including architecture decisions, patterns, and implementation details.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Directory Structure](#directory-structure)
- [Rendering Strategy](#rendering-strategy)
- [Data Layer](#data-layer)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)
- [Animation System](#animation-system)
- [Form Handling](#form-handling)
- [Performance Optimizations](#performance-optimizations)
- [Configuration](#configuration)

---

## Technology Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |

### Styling & UI

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| tailwind-merge | 3.3.0 | Class deduplication |
| clsx | 2.1.1 | Conditional classes |
| class-variance-authority | 0.7.1 | Component variants |
| lucide-react | 0.555.0 | Icon library |

### Animation

| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | 12.23.24 | Component animations |
| lenis | 1.3.15 | Smooth scrolling |

### Content Management

| Package | Version | Purpose |
|---------|---------|---------|
| @sanity/client | 7.3.0 | Sanity API client |
| @sanity/image-url | 1.1.0 | Image URL builder |
| next-sanity | 9.12.5 | Next.js integration |
| @portabletext/react | 6.0.0 | Rich text rendering |
| sanity | 4.19.0 | Sanity Studio |

### Form Handling

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.69.0 | Form state management |
| @hookform/resolvers | 5.1.0 | Validation integration |
| zod | 4.3.4 | Schema validation |

---

## Application Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Navbar    │  │ CustomCursor│  │  SmoothScrollProvider│ │
│  │  (Client)   │  │  (Client)   │  │      (Client)        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Page Components                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Server Components → Data Fetching                      ││
│  │  Client Components → Interactivity                      ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                        Footer                                │
│                       (Client)                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Sanity CMS                              │
│                    (Content API)                             │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
1. Request → Next.js Server
2. Server Component renders → Fetches Sanity data
3. HTML streamed to client
4. Client Components hydrate
5. Lenis initializes smooth scrolling
6. CustomCursor activates (if not touch device)
7. Framer Motion animations begin
```

---

## Directory Structure

```
mhm_portfolio/
├── public/                     # Static assets
│   └── images/                 # Public images
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles + Tailwind config
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx        # Projects listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Project detail
│   │   ├── ideas/
│   │   │   └── page.tsx
│   │   ├── illustrations/
│   │   │   └── page.tsx
│   │   ├── websites/
│   │   │   └── page.tsx
│   │   └── studio/
│   │       └── [[...tool]]/
│   │           └── page.tsx    # Sanity Studio
│   ├── components/
│   │   ├── HomeContent.tsx     # Home page orchestrator
│   │   ├── smooth-scroll-provider.tsx
│   │   ├── intro/
│   │   │   └── LogoIntro.tsx
│   │   ├── icons/
│   │   │   └── AnimatedLogo.tsx
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── BackToTop.tsx
│   │   ├── sections/
│   │   │   ├── ProjectsShowcase.tsx
│   │   │   ├── ProjectsShowcaseWrapper.tsx
│   │   │   ├── AboutContent.tsx
│   │   │   └── ContactCTA.tsx
│   │   ├── projects/
│   │   │   ├── ProjectsGrid.tsx
│   │   │   └── ProjectDetail.tsx
│   │   └── ui/
│   │       └── CustomCursor.tsx
│   ├── lib/
│   │   ├── sanity.ts           # Sanity client
│   │   ├── utils.ts            # Utility functions
│   │   └── typography.ts       # Typography helpers
│   └── sanity/
│       ├── env.ts              # Environment config
│       ├── structure.ts        # Studio structure
│       ├── lib/
│       │   ├── client.ts
│       │   ├── image.ts
│       │   └── live.ts
│       └── schemaTypes/
│           ├── index.ts
│           └── project.ts
├── .env.local                  # Environment variables
├── components.json             # Shadcn/ui config
├── next.config.ts              # Next.js config
├── postcss.config.mjs          # PostCSS config
├── tailwind.config.ts          # (Not used - v4 CSS-based)
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## Rendering Strategy

### Server Components (Default)

All components are Server Components unless explicitly marked with `'use client'`.

**Server Component Examples:**
- `src/app/page.tsx` - Home page
- `src/app/about/page.tsx` - About page
- `src/components/sections/ProjectsShowcaseWrapper.tsx` - Data fetching wrapper

**Benefits:**
- Zero JavaScript shipped for static content
- Direct database/API access
- Faster initial page load
- Better SEO

### Client Components

Marked with `'use client'` directive for interactivity.

**Client Component Examples:**
- `Navbar.tsx` - Scroll detection, menu state
- `CustomCursor.tsx` - Mouse tracking
- `ProjectsShowcase.tsx` - Scroll animations
- `ContactCTA.tsx` - Form handling

### Hybrid Pattern

```tsx
// Server Component (wrapper)
// src/components/sections/ProjectsShowcaseWrapper.tsx
export async function ProjectsShowcaseWrapper() {
  const projects = await client.fetch(projectsQuery)
  return <ProjectsShowcase projects={projects} />
}

// Client Component (interactive)
// src/components/sections/ProjectsShowcase.tsx
'use client'
export function ProjectsShowcase({ projects }: Props) {
  // Animation logic here
}
```

---

## Data Layer

### Sanity Client Configuration

```typescript
// src/lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c53e33he',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)
```

### GROQ Queries

```groq
// Fetch all projects
*[_type == "project"] | order(date desc) {
  _id,
  title,
  slug,
  category,
  date,
  description,
  featuredImage,
  "images": images[]{
    asset->,
    alt,
    caption
  }
}

// Fetch single project by slug
*[_type == "project" && slug.current == $slug][0] {
  ...,
  "previousProject": *[_type == "project" && date < ^.date] | order(date desc)[0] {
    title, slug, featuredImage
  },
  "nextProject": *[_type == "project" && date > ^.date] | order(date asc)[0] {
    title, slug, featuredImage
  }
}
```

### Content Schema

```typescript
// src/sanity/schemaTypes/project.ts
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', type: 'string', options: {
      list: ['Websites', 'Illustration', 'Branding', 'Ideas']
    }},
    { name: 'date', type: 'date' },
    { name: 'description', type: 'text' },
    { name: 'featuredImage', type: 'image' },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'problem', type: 'array', of: [{ type: 'block' }] },
    { name: 'context', type: 'array', of: [{ type: 'block' }] },
    { name: 'solution', type: 'array', of: [{ type: 'block' }] },
    { name: 'websiteUrl', type: 'url' },
  ]
}
```

---

## Component Architecture

### Component Categories

#### 1. Page Components (`src/app/`)
- Entry points for routes
- Minimal logic, delegate to section components
- Handle metadata exports

#### 2. Section Components (`src/components/sections/`)
- Large page sections (hero, about, contact)
- Self-contained with their own data/state
- May combine server and client patterns

#### 3. Feature Components (`src/components/projects/`, etc.)
- Specific feature implementations
- Project grid, project detail, etc.

#### 4. UI Components (`src/components/ui/`)
- Reusable primitives
- Custom cursor, buttons, etc.

#### 5. Navigation (`src/components/navigation/`)
- Navbar, footer, back-to-top
- Global across all pages

### Component Complexity Map

| Component | Lines | Type | Responsibilities |
|-----------|-------|------|------------------|
| ProjectDetail | 809 | Client | Lightbox, navigation, rich text |
| ProjectsShowcase | 443 | Client | Scroll animations, dual layouts |
| ContactCTA | 387 | Client | Form validation, submission |
| ProjectsGrid | 359 | Client | Filtering, layout toggle |
| CustomCursor | 289 | Client | Mouse tracking, labels |
| Navbar | 289 | Client | Menu, scroll detection |
| AboutContent | 182 | Client | Scroll parallax, image swap |

---

## State Management

### Local State Patterns

No global state library is used. State is managed locally:

```typescript
// Component-level state
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [selectedCategory, setSelectedCategory] = useState('All')

// Refs for animation values
const scrollRef = useRef<HTMLDivElement>(null)
const cursorRef = useRef({ x: 0, y: 0 })
```

### Context Providers

#### Smooth Scroll Context

```typescript
// src/components/smooth-scroll-provider.tsx
'use client'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    setLenis(lenisInstance)
    return () => lenisInstance.destroy()
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}

export const useLenis = () => useContext(LenisContext)
```

### Framer Motion State

Scroll-driven animations use Framer Motion's hooks:

```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end end']
})

const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
```

---

## Styling Architecture

### Tailwind CSS v4 Configuration

Tailwind v4 uses CSS-based configuration instead of JavaScript:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-primary: #507579;
  --color-secondary: #658590;
  --color-background: #FFFFFF;
  --color-foreground: #1B3033;
  --color-accent: #A0C8C4;
  --color-muted: #577275;
  --color-border: #C3CFD6;
  --color-dark-bg: #304544;
  --color-dark-fg: #C0D5CE;

  --font-syne: 'Syne', sans-serif;
  --font-jakarta: 'Plus Jakarta Sans', sans-serif;

  --radius: 0.625rem;
}
```

### Utility Function

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Component Styling Pattern

```tsx
<div className={cn(
  "flex items-center justify-between",
  "px-4 py-2",
  isActive && "bg-primary text-white",
  className
)}>
```

---

## Animation System

### Framer Motion Patterns

#### Basic Animation

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

#### Scroll-Driven Animation

```typescript
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start']
})

const y = useTransform(scrollYProgress, [0, 1], [100, -100])
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
```

#### Stagger Children

```typescript
const container = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="initial" animate="animate">
  {items.map(i => <motion.li variants={item} key={i} />)}
</motion.ul>
```

### Lenis Smooth Scroll

Integrated via React context, provides:
- Smooth wheel scrolling
- Custom easing function
- RAF-based updates
- Programmatic scroll methods

### Custom Cursor Animation

Uses RAF loop with linear interpolation:

```typescript
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

function animate() {
  current.x = lerp(current.x, target.x, 0.15)
  current.y = lerp(current.y, target.y, 0.15)

  cursor.style.transform = `translate(${current.x}px, ${current.y}px)`

  requestAnimationFrame(animate)
}
```

---

## Form Handling

### Architecture

```
┌─────────────────────────────────────────────┐
│              ContactCTA Component            │
├─────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────────┐   │
│  │ React Hook  │ ←→ │  Zod Resolver    │   │
│  │    Form     │    │                  │   │
│  └─────────────┘    └──────────────────┘   │
│         │                    │              │
│         ▼                    ▼              │
│  ┌─────────────┐    ┌──────────────────┐   │
│  │   Form UI   │    │  Validation      │   │
│  │  Components │    │  Schema          │   │
│  └─────────────┘    └──────────────────┘   │
│         │                                   │
│         ▼                                   │
│  ┌─────────────────────────────────────┐   │
│  │           Formspree API              │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Zod Schema

```typescript
const contactSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})
```

### Form Configuration

```typescript
const form = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  mode: 'onBlur',
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  },
})
```

---

## Performance Optimizations

### Server Components

- Default rendering mode
- Zero client-side JavaScript for static content
- Direct API access without waterfalls

### Image Optimization

```typescript
// Next.js Image with Sanity CDN
<Image
  src={urlFor(image).width(1200).auto('format').quality(85).url()}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

### Event Listener Optimization

```typescript
// Passive listeners for scroll events
window.addEventListener('scroll', handleScroll, { passive: true })

// RAF-based animations
const rafId = requestAnimationFrame(animate)
return () => cancelAnimationFrame(rafId)
```

### Code Splitting

- Automatic route-based splitting via Next.js
- Dynamic imports for heavy components
- Client components only where needed

### Hydration Safety

```typescript
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
}, [])

if (!isMounted) return null
```

---

## Configuration

### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Shadcn/ui Configuration

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Security Considerations

### Content Security

- Sanity CDN for image delivery
- Environment variables for sensitive config
- No exposed API keys in client code

### Form Security

- Client-side validation with Zod
- Formspree handles spam protection
- Input sanitization via schema constraints

### Hydration Safety

- `suppressHydrationWarning` on `<body>` for browser extension compatibility
- Mount checks before rendering interactive content

---

## Testing Strategy

### Recommended Approach

```bash
# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint

# Build verification
pnpm build
```

### Manual Testing Checklist

- [ ] Intro animation plays and can be skipped
- [ ] Smooth scrolling works on all pages
- [ ] Custom cursor shows correct labels
- [ ] Projects filter and layout toggle work
- [ ] Project detail lightbox functions
- [ ] Contact form validates and submits
- [ ] Mobile responsive on all breakpoints
- [ ] Keyboard navigation works
- [ ] Reduced motion preference respected

---

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

### Environment Setup

1. Add environment variables in Vercel dashboard
2. Configure Sanity CORS for production domain
3. Set Node.js 18.x runtime

### Build Output

```
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB   102 kB
├ ○ /about                     3.1 kB   99 kB
├ ○ /contact                   4.8 kB   101 kB
├ ○ /projects                  6.7 kB   103 kB
├ ○ /projects/[slug]           8.2 kB   105 kB
└ ○ /studio/[[...tool]]        1.2 MB   (Sanity Studio)
```

---

## File Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/app/layout.tsx` | Root layout, providers, fonts | 74 |
| `src/app/globals.css` | All Tailwind config, button patterns | 438 |
| `src/components/HomeContent.tsx` | Home page orchestrator | 118 |
| `src/components/ui/CustomCursor.tsx` | Custom cursor system | 289 |
| `src/components/navigation/Navbar.tsx` | Navigation with scroll effects | 289 |
| `src/components/sections/ProjectsShowcase.tsx` | Scroll-driven carousel | 443 |
| `src/components/sections/ContactCTA.tsx` | Form with validation | 387 |
| `src/components/projects/ProjectDetail.tsx` | Full project page | 809 |
| `src/components/projects/ProjectsGrid.tsx` | Filterable grid | 359 |
| `src/lib/sanity.ts` | Sanity client setup | 21 |
| `src/lib/utils.ts` | cn() utility | 6 |
