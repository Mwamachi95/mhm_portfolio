# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 portfolio application using:
- **Next.js App Router** (not Pages Router)
- **TypeScript** with strict mode
- **Tailwind CSS v4** (CSS-based configuration, not JS config)
- **Shadcn/ui** component library (New York style)
- **Sanity CMS** for content management
- **pnpm** as package manager

## Development Commands

```bash
# Start development server (Turbopack enabled)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Architecture & Key Patterns

### Smooth Scroll Integration

The app uses Lenis for smooth scrolling, implemented as a client-side provider:
- `src/components/smooth-scroll-provider.tsx` wraps the entire app in `src/app/layout.tsx`
- This is a client component (`'use client'`) that initializes Lenis with RAF (requestAnimationFrame)
- The provider is applied globally in the root layout

### Hydration Warning Suppression

The `<body>` element in `src/app/layout.tsx` has `suppressHydrationWarning` to prevent errors from browser extensions (like Grammarly) that inject attributes into the DOM. This is intentional and should not be removed.

### Tailwind CSS v4 Configuration

This project uses **Tailwind CSS v4**, which has a different architecture:
- **No `tailwind.config.js` file** - configuration is CSS-based
- All Tailwind config is in `src/app/globals.css` using `@theme inline`
- CSS variables are defined in `:root` and `.dark` for theming
- Uses OKLCH color space for better color handling
- Custom variant for dark mode: `@custom-variant dark (&:is(.dark *))`

### Shadcn/ui Components

Configuration in `components.json`:
- Style: `new-york`
- Components go in `src/components/ui/`
- Import alias: `@/components/ui/[component]`
- Icon library: `lucide-react`

Add new components:
```bash
pnpm dlx shadcn@latest add [component-name]
```

### Import Aliases

TypeScript path mapping (`@/*`):
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/app` → `src/app`
- `@/hooks` → `src/hooks` (when created)

### Utility Functions

`src/lib/utils.ts` exports `cn()` for merging Tailwind classes:
```ts
import { cn } from "@/lib/utils"
```

Uses `clsx` and `tailwind-merge` under the hood.

### Sanity CMS Integration

Dependencies installed but not yet configured:
- `@sanity/client`
- `@sanity/image-url`
- `next-sanity`

When setting up Sanity, create configuration in `src/lib/sanity.ts` or `src/lib/sanity/` directory.

### Animation Libraries

- **Framer Motion** (`framer-motion`) - for component animations
- **Lenis** (`lenis`) - for smooth scrolling (already integrated)

## Styling Notes

- Default fonts: Geist Sans and Geist Mono (loaded via `next/font/google`)
- Font CSS variables: `--font-geist-sans` and `--font-geist-mono`
- Border radius: Defined with `--radius` variable (0.625rem default)
- Color system: Full Shadcn color palette with chart and sidebar colors included

## Important Technical Details

1. **React 19**: This project uses React 19.2.0, ensure compatibility when adding libraries
2. **Server Components by default**: All components are Server Components unless marked with `'use client'`
3. **Turbopack**: Development server uses Turbopack (faster than Webpack)
4. **CSS Variables**: Theming relies heavily on CSS variables - modify in `globals.css`, not Tailwind config
