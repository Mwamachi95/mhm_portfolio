'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  thumbnail?: SanityImage;
}

interface ProjectsShowcaseProps {
  projects: ProjectCard[];
}

// Card colors for visual distinction
const CARD_COLORS = [
  'from-blue-500/20 to-purple-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-pink-500/20 to-purple-500/20',
];

// Improved fallback layout for mobile/tablet with swipeable carousel
function ProjectsShowcaseFallback({ projects }: { projects: ProjectCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle scroll to update active index for pagination dots
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth * 0.85; // 85vw card width
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, projects.length - 1));
    }
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="w-full">
        {/* Section title */}
        <h2 className="font-display text-[14vw] sm:text-[12vw] md:text-[10vw] font-bold text-foreground leading-none mb-6 md:mb-10 px-6 sm:px-8">
          projects
        </h2>

        {/* Swipeable Carousel */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-6 sm:px-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex-shrink-0 snap-center w-[85vw] sm:w-[85vw] md:w-[80vw] h-[55vh] sm:h-[60vh] md:h-[65vh] bg-muted/20 rounded-xl overflow-hidden border border-border/50 relative"
            >
              {/* Image area - real image for first card if available, gradient placeholder otherwise */}
              {project.thumbnail ? (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={urlFor(project.thumbnail).width(1200).height(800).auto('format').url()}
                    alt={project.thumbnail.alt || project.title}
                    fill
                    className="object-cover"
                    sizes="85vw"
                    unoptimized
                  />
                </div>
              ) : (
                <div className={`absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br ${CARD_COLORS[index]}`}>
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-muted-foreground/30">
                    {project.title}
                  </span>
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-10">
                <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground">
                  {project.category}
                </span>
              </div>

              {/* Title overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-background/90 to-transparent z-10">
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6 px-6 sm:px-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (carouselRef.current) {
                  const cardWidth = carouselRef.current.offsetWidth * 0.85;
                  carouselRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                activeIndex === index ? 'bg-foreground' : 'bg-border'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Projects Button (visible below carousel) */}
        <div className="flex justify-start mt-8 px-6 sm:px-8">
          <Link
            href="/websites"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border/50 bg-background hover:bg-muted/20 transition-colors group"
          >
            <span className="font-medium text-sm text-foreground">
              View All Projects
            </span>
            <svg
              className="w-4 h-4 text-foreground/60 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Desktop animated version with carousel
function ProjectsShowcaseDesktop({ projects }: { projects: ProjectCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Phase 1 (0 - 0.33): Scale down "projects" word until it disappears
  const projectsScale = useTransform(scrollYProgress, [0, 0.33], [1, 0]);

  // Viewport position: moves from right to left edge during Phase 1
  const viewportLeftValue = useTransform(scrollYProgress, [0, 0.33], [75, 0]);
  const viewportLeft = useMotionTemplate`${viewportLeftValue}vw`;

  // Card dimensions
  const cardWidth = 35; // vw - standard card width
  const expandedWidth = 75; // vw - expanded card in focus
  const gap = 4; // vw - gap between cards
  const numCards = projects.length;

  // Timeline: Each card gets equal time for its expand/retract/exit cycle
  // Phase 2 starts at 0.33, ends at 1.0 (0.67 duration)
  const phase2Start = 0.33;
  const phase2Duration = 0.67;
  const cardCycleDuration = phase2Duration / numCards; // ~0.17 per card

  // Helper to calculate card timing
  const getCardTiming = (index: number) => {
    const start = phase2Start + index * cardCycleDuration;
    const end = start + cardCycleDuration;
    return { start, end };
  };

  // Timing within each card cycle (more gradual transitions)
  const expandDuration = 0.06; // Time to expand
  const retractDuration = 0.04; // Time to retract
  const slideBuffer = 0.03; // Buffer after slide completes before next card expands

  // Card 1: expand → hold → retract (starts immediately at phase 2)
  const card1Timing = getCardTiming(0);
  const card1Width = useTransform(
    scrollYProgress,
    [
      card1Timing.start,
      card1Timing.start + expandDuration,
      card1Timing.end - retractDuration - 0.02,
      card1Timing.end - 0.02
    ],
    [cardWidth, expandedWidth, expandedWidth, cardWidth]
  );

  // Card 2: expand AFTER row slide brings it to position 0
  const card2Timing = getCardTiming(1);
  const card2ExpandStart = card1Timing.end + slideBuffer; // Wait for slide to complete
  const card2Width = useTransform(
    scrollYProgress,
    [
      card2ExpandStart,
      card2ExpandStart + expandDuration,
      card2Timing.end - retractDuration - 0.02,
      card2Timing.end - 0.02
    ],
    [cardWidth, expandedWidth, expandedWidth, cardWidth]
  );

  // Card 3: expand AFTER row slide brings it to position 0
  const card3Timing = getCardTiming(2);
  const card3ExpandStart = card2Timing.end + slideBuffer; // Wait for slide to complete
  const card3Width = useTransform(
    scrollYProgress,
    [
      card3ExpandStart,
      card3ExpandStart + expandDuration,
      card3Timing.end - retractDuration - 0.02,
      card3Timing.end - 0.02
    ],
    [cardWidth, expandedWidth, expandedWidth, cardWidth]
  );

  // Card 4: expand AFTER row slide brings it to position 0 (stays expanded)
  const card4Timing = getCardTiming(3);
  const card4ExpandStart = card3Timing.end + slideBuffer; // Wait for slide to complete
  const card4Width = useTransform(
    scrollYProgress,
    [card4ExpandStart, card4ExpandStart + expandDuration],
    [cardWidth, expandedWidth]
  );

  // Convert widths to motion templates
  const card1WidthVw = useMotionTemplate`${card1Width}vw`;
  const card2WidthVw = useMotionTemplate`${card2Width}vw`;
  const card3WidthVw = useMotionTemplate`${card3Width}vw`;
  const card4WidthVw = useMotionTemplate`${card4Width}vw`;

  const cardWidths = [card1WidthVw, card2WidthVw, card3WidthVw, card4WidthVw];

  // Row translation: slides left gradually after each card's cycle
  // Slower transition - spread over more scroll distance
  const slideUnit = cardWidth + gap; // 39vw per card
  const rowTranslateValue = useTransform(
    scrollYProgress,
    [
      card1Timing.end - 0.04, card1Timing.end + 0.02,  // Card 1 exits (slower)
      card2Timing.end - 0.04, card2Timing.end + 0.02,  // Card 2 exits (slower)
      card3Timing.end - 0.04, card3Timing.end + 0.02   // Card 3 exits (slower)
    ],
    [
      0, -slideUnit,                    // -39vw after Card 1
      -slideUnit, -2 * slideUnit,       // -78vw after Card 2
      -2 * slideUnit, -3 * slideUnit    // -117vw after Card 3
    ]
  );
  const rowTranslate = useMotionTemplate`${rowTranslateValue}vw`;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[800vh] bg-background"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex items-end overflow-hidden">
        <div className="w-full px-8 pb-24">
          <div className="relative overflow-x-clip overflow-y-visible">
            {/* "projects" text - scales down */}
            <motion.h2
              className="font-display text-[16vw] font-bold text-foreground leading-none"
              style={{
                scale: projectsScale,
                transformOrigin: 'left bottom'
              }}
            >
              projects
            </motion.h2>

            {/* Cards row - all cards visible, flex row with gaps */}
            <motion.div
              className="absolute bottom-0 flex h-[70vh]"
              style={{
                left: viewportLeft,
                gap: `${gap}vw`,
                x: rowTranslate
              }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="relative h-full flex-shrink-0 rounded-lg overflow-hidden border border-border/50"
                  style={{
                    width: cardWidths[index]
                  }}
                >
                  {/* Card background - real image if available, gradient placeholder otherwise */}
                  {project.thumbnail ? (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={urlFor(project.thumbnail).width(1200).height(900).auto('format').url()}
                        alt={project.thumbnail.alt || project.title}
                        fill
                        className="object-cover"
                        sizes="75vw"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br ${CARD_COLORS[index]}`}>
                      <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
                        {project.title}
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground">
                      {project.category}
                    </span>
                  </div>

                  {/* Title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/90 to-transparent z-10">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {/* View All Projects button */}
              <div className="flex-shrink-0 h-full flex items-end">
                <Link
                  href="/websites"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-muted/20 transition-colors group"
                >
                  <span className="font-medium text-sm text-foreground">
                    View All Projects
                  </span>
                  <svg
                    className="w-4 h-4 text-foreground/60 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main export - switches between fallback and desktop based on screen size
export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent hydration mismatch by showing nothing until mounted
  if (!mounted) {
    return null;
  }

  return isDesktop ? <ProjectsShowcaseDesktop projects={projects} /> : <ProjectsShowcaseFallback projects={projects} />;
}
