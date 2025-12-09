'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  image?: string;
}

const PLACEHOLDER_PROJECTS: ProjectCard[] = [
  {
    id: '1',
    title: 'Project 1',
    category: 'Websites',
  },
  {
    id: '2',
    title: 'Project 2',
    category: 'Mobile Apps',
  },
];

// Simplified fallback layout for mobile/tablet
function ProjectsShowcaseFallback() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="w-full px-8">
        {/* Section title */}
        <h2 className="font-display text-[12vw] md:text-[10vw] font-bold text-foreground leading-none mb-8 md:mb-12">
          projects
        </h2>

        {/* Project Card */}
        <div className="w-full max-w-lg h-[60vh] bg-muted/20 rounded-lg overflow-hidden border border-border/50 relative">
          {/* Placeholder image area */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
            <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
              {PLACEHOLDER_PROJECTS[0].title}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground">
              {PLACEHOLDER_PROJECTS[0].category}
            </span>
          </div>

          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/90 to-transparent">
            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
              {PLACEHOLDER_PROJECTS[0].title}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop animated version
function ProjectsShowcaseDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Phase 1 (0 - 0.33): Scale down "projects" word until it disappears
  const projectsScale = useTransform(scrollYProgress, [0, 0.33], [1, 0]);

  // Card position: moves from right to left edge
  const cardLeftValue = useTransform(scrollYProgress, [0, 0.33], [75, 0]);
  const cardLeft = useMotionTemplate`${cardLeftValue}vw`;

  // Phase 2 (0.33 - 0.5): Viewport width expands
  const viewportWidthValue = useTransform(scrollYProgress, [0.33, 0.5], [35, 50]);
  const viewportWidth = useMotionTemplate`${viewportWidthValue}vw`;

  // Phase 3 (0.5 - 1): Content slides inside the fixed viewport
  // Content strip is 300% wide (3 panels), so -33.33% moves by one panel
  const contentSlidePercent = useTransform(scrollYProgress, [0.5, 1], [0, -33.33]);
  const contentSlideTransform = useMotionTemplate`${contentSlidePercent}%`;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[400vh] bg-background"
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

            {/* Fixed viewport card - moves to left edge, expands, then content slides through it */}
            <motion.div
              className="absolute bottom-0 h-[70vh] rounded-lg overflow-hidden border border-border/50"
              style={{
                left: cardLeft,
                width: viewportWidth,
              }}
            >
              {/* Content strip - slides horizontally through the viewport */}
              <motion.div
                className="flex h-full"
                style={{
                  width: '300%', // 3 panels: Project 1, Project 2, Project 1 (for cyclical)
                  x: contentSlideTransform
                }}
              >
                {/* Project 1 content panel */}
                <div className="relative w-1/3 h-full flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
                      {PLACEHOLDER_PROJECTS[0].title}
                    </span>
                  </div>
                </div>

                {/* Project 2 content panel */}
                <div className="relative w-1/3 h-full flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                    <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
                      {PLACEHOLDER_PROJECTS[1].title}
                    </span>
                  </div>
                </div>

                {/* Project 1 again (for cyclical loop) */}
                <div className="relative w-1/3 h-full flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
                      {PLACEHOLDER_PROJECTS[0].title}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Category badge - stays fixed on viewport */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground">
                  {PLACEHOLDER_PROJECTS[0].category}
                </span>
              </div>

              {/* Title overlay at bottom - stays fixed on viewport */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/90 to-transparent z-10">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  {PLACEHOLDER_PROJECTS[0].title}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main export - switches between fallback and desktop based on screen size
export function ProjectsShowcase() {
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

  return isDesktop ? <ProjectsShowcaseDesktop /> : <ProjectsShowcaseFallback />;
}
