'use client'

import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import { ArrowLeft, ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Helper function to process markdown-style formatting in plain text
// Handles cases where content was entered with **bold** or *italic* syntax
function processMarkdownInText(text: string): ReactNode[] {
  const elements: ReactNode[] = []
  let currentIndex = 0

  // Regex to match **bold** and *italic* patterns
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      elements.push(text.slice(currentIndex, match.index))
    }

    if (match[1]) {
      // Bold match (**text**)
      elements.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      // Italic match (*text*)
      elements.push(
        <em key={`italic-${match.index}`} className="italic">
          {match[4]}
        </em>
      )
    }

    currentIndex = match.index + match[0].length
  }

  // Add remaining text after last match
  if (currentIndex < text.length) {
    elements.push(text.slice(currentIndex))
  }

  return elements.length > 0 ? elements : [text]
}


interface SanityImage {
  _type: 'image'
  _key?: string
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

interface SanityBlock {
  _type: 'block'
  _key: string
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
}

interface Project {
  id: string
  title: string
  slug: string
  category: string
  date: string
  description?: string
  websiteUrl?: string
  heroImage?: SanityImage
  thumbnail?: SanityImage
  gallery?: SanityImage[]
  problem?: SanityBlock[]
  context?: SanityBlock[]
  solution?: SanityBlock[]
}

interface ProjectNavigation {
  previous: { title: string; slug: string; category: string; thumbnail?: SanityImage } | null
  next: { title: string; slug: string; category: string; thumbnail?: SanityImage } | null
}

interface ProjectDetailProps {
  project: Project
  navigation: ProjectNavigation
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const modalImageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// Recursive function to process React children and handle markdown in text nodes
function processChildren(children: ReactNode): ReactNode {
  return React.Children.map(children, (child) => {
    // Handle string children (plain text)
    if (typeof child === 'string') {
      if (child.includes('**') || /(?<!\*)\*(?!\*)/.test(child)) {
        return <>{processMarkdownInText(child)}</>
      }
      return child
    }
    return child
  })
}

// Portable Text components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base md:text-lg leading-relaxed text-foreground mb-4 last:mb-0">
        {processChildren(children)}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-8 mb-4">
        {processChildren(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mt-6 mb-3">
        {processChildren(children)}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
  },
}

// Format date to "Month Year"
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Fullscreen Image Viewer Component
function ImageViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: {
  images: SanityImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}) {
  const currentImage = images[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === images.length - 1

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && !isFirst) onPrevious()
      if (e.key === 'ArrowRight' && !isLast) onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isFirst, isLast, onClose, onNext, onPrevious])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 text-white/80 text-sm md:text-base font-body">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`absolute left-2 md:left-6 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all ${
              isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 text-white/80 hover:text-white'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Next button */}
          <button
            onClick={onNext}
            disabled={isLast}
            className={`absolute right-2 md:right-6 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all ${
              isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 text-white/80 hover:text-white'
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image container */}
          <AnimatePresence mode="wait">
            <motion.figure
              key={currentIndex}
              variants={modalImageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-[1] flex flex-col items-center justify-center p-4"
            >
              <Image
                src={urlFor(currentImage).width(2400).auto('format').url()}
                alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
                width={2400}
                height={1600}
                className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain mx-auto"
                unoptimized
              />
              {currentImage.caption && (
                <figcaption className="mt-4 text-sm md:text-base text-white/70 text-center max-w-2xl px-4">
                  {currentImage.caption}
                </figcaption>
              )}
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Interspersed Gallery Image Component (non-clickable, for content sections)
function InterspersedImage({ image, index, fullWidth = true }: { image: SanityImage; index: number; fullWidth?: boolean }) {
  return (
    <motion.figure
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={fullWidth ? 'w-full' : ''}
    >
      <div className={`relative ${fullWidth ? 'aspect-[16/9]' : 'aspect-[4/3]'} rounded-lg overflow-hidden`}>
        <Image
          src={urlFor(image).width(1600).height(fullWidth ? 900 : 1200).auto('format').url()}
          alt={image.alt || `Gallery image ${index + 1}`}
          fill
          className="object-cover"
          sizes={fullWidth ? '100vw' : '50vw'}
          unoptimized
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
    </motion.figure>
  )
}

// Interspersed Gallery Section with distributed images
function InterspersedSection({ images, variant = 'single' }: { images: SanityImage[]; variant?: 'single' | 'grid' | 'mixed' }) {
  if (images.length === 0) return null

  if (variant === 'single' || images.length === 1) {
    return (
      <div className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <InterspersedImage image={images[0]} index={0} fullWidth />
        </div>
      </div>
    )
  }

  if (variant === 'grid' || images.length === 2) {
    return (
      <div className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {images.map((image, index) => (
              <InterspersedImage key={image._key || index} image={image} index={index} fullWidth={false} />
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  // Mixed layout for 3+ images
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 space-y-6">
        <InterspersedImage image={images[0]} index={0} fullWidth />
        {images.length > 1 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {images.slice(1).map((image, index) => (
              <InterspersedImage key={image._key || index} image={image} index={index + 1} fullWidth={false} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Gallery Grid Thumbnail Component (clickable)
function GalleryThumbnail({
  image,
  index,
  onClick
}: {
  image: SanityImage
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      variants={fadeInUp}
      onClick={onClick}
      className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={`View ${image.alt || `image ${index + 1}`} in fullscreen`}
    >
      <Image
        src={urlFor(image).width(600).height(450).auto('format').url()}
        alt={image.alt || `Gallery image ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        unoptimized
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </motion.button>
  )
}

// Gallery Grid Section Component
function GalleryGridSection({
  images,
  onImageClick
}: {
  images: SanityImage[]
  onImageClick: (index: number) => void
}) {
  if (images.length === 0) return null

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Gallery
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {images.map((image, index) => (
            <GalleryThumbnail
              key={image._key || index}
              image={image}
              index={index}
              onClick={() => onImageClick(index)}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

// Content Section Component
function ContentSection({ title, content }: { title: string; content: SanityBlock[] }) {
  if (!content || content.length === 0) return null

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-8 md:py-12"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-prose">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
            {title}
          </h2>
          <div className="prose-content">
            <PortableText value={content} components={portableTextComponents} />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Navigation Card Component
function NavigationCard({
  project,
  direction,
}: {
  project: { title: string; slug: string; category: string; thumbnail?: SanityImage } | null
  direction: 'previous' | 'next'
}) {
  if (!project) {
    return (
      <div className={`flex-1 py-8 ${direction === 'next' ? 'text-right' : ''}`}>
        <p className="text-sm text-muted-foreground">
          {direction === 'previous' ? 'No previous project' : 'No next project'}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex-1 flex items-center gap-4 py-8 ${direction === 'next' ? 'flex-row-reverse text-right' : ''}`}
    >
      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={urlFor(project.thumbnail).width(200).height(200).auto('format').url()}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-1 ${direction === 'next' ? 'justify-end' : ''}`}>
          {direction === 'previous' && <ArrowLeft className="w-4 h-4" />}
          <span>{direction === 'previous' ? 'Previous' : 'Next'}</span>
          {direction === 'next' && <ArrowRight className="w-4 h-4" />}
        </div>
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
      </div>
    </Link>
  )
}

export function ProjectDetail({ project, navigation }: ProjectDetailProps) {
  const heroImage = project.heroImage || project.thumbnail
  const gallery = project.gallery || []

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const nextImage = useCallback(() => {
    if (lightboxIndex < gallery.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }, [lightboxIndex, gallery.length])

  const previousImage = useCallback(() => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }, [lightboxIndex])

  // Distribute gallery images between sections (for interspersed display)
  const getGalleryDistribution = () => {
    const total = gallery.length
    if (total === 0) return { afterProblem: [], afterContext: [], afterSolution: [] }
    if (total <= 2) {
      return {
        afterProblem: gallery.slice(0, 1),
        afterContext: [],
        afterSolution: gallery.slice(1),
      }
    }
    if (total <= 4) {
      return {
        afterProblem: gallery.slice(0, 1),
        afterContext: gallery.slice(1, 2),
        afterSolution: gallery.slice(2),
      }
    }
    // 5+ images
    return {
      afterProblem: gallery.slice(0, 1),
      afterContext: gallery.slice(1, 3),
      afterSolution: gallery.slice(3),
    }
  }

  const galleryDistribution = getGalleryDistribution()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        {heroImage ? (
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0"
          >
            <Image
              src={urlFor(heroImage).width(1920).height(1080).auto('format').url()}
              alt={heroImage.alt || project.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24 px-6 sm:px-8 md:px-12 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-4xl px-6 py-4 bg-primary/70 backdrop-blur-sm rounded-lg"
          >
            {project.title}
          </motion.h1>
        </div>
      </section>

      {/* Metadata Section - Centered */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        className="py-12 md:py-16"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="flex items-center justify-center gap-3 text-sm md:text-base text-muted-foreground">
            <span className="inline-block px-3 py-1.5 bg-foreground/10 border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground capitalize">
              {project.category}
            </span>
            <span className="text-muted-foreground/50">&bull;</span>
            <span>{formatDate(project.date)}</span>
          </div>
        </div>
      </motion.section>

      {/* Description Section - Left-aligned */}
      {project.description && (
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-8 md:py-12"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <p className="font-body text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground max-w-prose">
              {project.description}
            </p>
          </div>
        </motion.section>
      )}

      {/* Problem Section */}
      <ContentSection title="Problem" content={project.problem || []} />
      {galleryDistribution.afterProblem.length > 0 && (
        <InterspersedSection images={galleryDistribution.afterProblem} variant="single" />
      )}

      {/* Context Section */}
      <ContentSection title="Context" content={project.context || []} />
      {galleryDistribution.afterContext.length > 0 && (
        <InterspersedSection
          images={galleryDistribution.afterContext}
          variant={galleryDistribution.afterContext.length > 1 ? 'grid' : 'single'}
        />
      )}

      {/* Solution Section */}
      <ContentSection title="Solution" content={project.solution || []} />
      {galleryDistribution.afterSolution.length > 0 && (
        <InterspersedSection
          images={galleryDistribution.afterSolution}
          variant={galleryDistribution.afterSolution.length > 2 ? 'mixed' : galleryDistribution.afterSolution.length > 1 ? 'grid' : 'single'}
        />
      )}

      {/* Gallery Grid Section - All images, clickable */}
      {gallery.length > 0 && (
        <GalleryGridSection images={gallery} onImageClick={openLightbox} />
      )}

      {/* Website Link Section - Left-aligned */}
      {project.websiteUrl && (
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-12 md:py-16"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-lg text-primary hover:opacity-80 transition-opacity"
            >
              View Live Site
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </motion.section>
      )}

      {/* Previous/Next Navigation */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="border-t border-border pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <NavigationCard project={navigation.previous} direction="previous" />
              <div className="hidden md:block w-px bg-border" />
              <NavigationCard project={navigation.next} direction="next" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Fullscreen Image Viewer */}
      <ImageViewer
        images={gallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </main>
  )
}
