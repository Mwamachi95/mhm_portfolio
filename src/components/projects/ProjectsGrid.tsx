'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

interface Project {
  id: string
  title: string
  slug: string
  category: string
  description?: string
  thumbnail?: SanityImage
}

interface ProjectsGridProps {
  projects: Project[]
}

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Websites', value: 'websites' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Branding', value: 'branding' },
  { label: 'Ideas', value: 'ideas' },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
}

const filterBarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
  )
}

function RowsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      <rect x="2" y="3" width="16" height="4" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="16" height="4" rx="1" fill="currentColor" />
      <rect x="2" y="15" width="16" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

function ProjectCardGrid({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group"
      data-cursor="view"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 bg-muted/20">
          {project.thumbnail ? (
            <Image
              src={urlFor(project.thumbnail).width(800).height(600).auto('format').url()}
              alt={project.thumbnail.alt || project.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="font-display text-2xl font-semibold text-muted-foreground/30">
                {project.title}
              </span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium text-foreground capitalize">
              {project.category}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent z-10">
            <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
              {project.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ProjectCardRow({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group"
      data-cursor="view"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="flex gap-6 p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
          {/* Image */}
          <div className="relative w-48 md:w-64 aspect-[4/3] flex-shrink-0 rounded-md overflow-hidden">
            {project.thumbnail ? (
              <Image
                src={urlFor(project.thumbnail).width(400).height(300).auto('format').url()}
                alt={project.thumbnail.alt || project.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="256px"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="font-display text-lg font-semibold text-muted-foreground/30">
                  {project.title}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="inline-block w-fit px-3 py-1 mb-2 bg-background/80 border border-border/50 rounded-full text-xs font-medium text-foreground capitalize">
              {project.category}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [layout, setLayout] = useState<'grid' | 'rows'>('grid')
  const [mounted, setMounted] = useState(false)

  const categoryParam = searchParams.get('category') || 'all'

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredProjects =
    categoryParam === 'all'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === categoryParam.toLowerCase())

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      router.push('/projects', { scroll: false })
    } else {
      router.push(`/projects?category=${category}`, { scroll: false })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 md:mb-12"
        >
          Projects
        </motion.h1>

        {/* Filter Bar */}
        <motion.div
          variants={filterBarVariants}
          initial="hidden"
          animate="visible"
          className="sticky top-20 md:top-24 z-40 bg-background/80 backdrop-blur-sm py-4 -mx-6 sm:-mx-8 md:-mx-12 lg:-mx-16 px-6 sm:px-8 md:px-12 lg:px-16 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`btn-pill px-4 py-2 rounded-full text-sm font-medium ${
                    categoryParam === cat.value
                      ? 'btn-pill-active'
                      : 'btn-pill-inactive'
                  }`}
                  aria-pressed={categoryParam === cat.value}
                >
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Layout Toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-lg border border-border/50 bg-muted/10">
              <button
                onClick={() => setLayout('grid')}
                className={`btn-icon p-2 rounded-md ${
                  layout === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-muted/20'
                }`}
                aria-label="Grid view"
                aria-pressed={layout === 'grid'}
              >
                <GridIcon active={layout === 'grid'} />
              </button>
              <button
                onClick={() => setLayout('rows')}
                className={`btn-icon p-2 rounded-md ${
                  layout === 'rows' ? 'bg-background shadow-sm' : 'hover:bg-muted/20'
                }`}
                aria-label="List view"
                aria-pressed={layout === 'rows'}
              >
                <RowsIcon active={layout === 'rows'} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={`${categoryParam}-${layout}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={
                layout === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'
                  : 'flex flex-col gap-4 md:gap-6'
              }
            >
              {filteredProjects.map((project, index) =>
                layout === 'grid' ? (
                  <ProjectCardGrid key={project.id} project={project} index={index} />
                ) : (
                  <ProjectCardRow key={project.id} project={project} />
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <p className="text-lg text-muted-foreground mb-4">
                No projects found in this category.
              </p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="btn-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <span className="relative z-10">View all projects</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
