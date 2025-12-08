'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
    category: 'Illustrations',
  },
  {
    id: '3',
    title: 'Project 3',
    category: 'Ideas',
  },
];

export function ProjectsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const LETTERS = ['p', 'r', 'o', 'j', 'e', 'c', 't', 's'];

  // Horizontal card translation
  // Card width ~400px + spacing ~80px = ~480px per card
  // Start with first card 25% visible (75% offscreen = ~300px to the right)
  // Delay the animation start until section is in view
  const cardTranslateX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 1], // No movement for first 15%, then move, freeze at 30%
    [300, 300, -900, -900] // Hold position, then move left, stop at -900px and HOLD
  );

  // Corner-turning animation for letters
  // "p" then "r" - each topples & shrinks first, then pulls upward

  // Animation for "p" (index 0)
  // Step 1: Rotate and scale
  // Step 2: Then pull upward
  const pRotation = useTransform(scrollYProgress, [0.15, 0.18, 1], [0, 90, 90]);
  const pScale = useTransform(scrollYProgress, [0.15, 0.18, 1], [1, 0.45, 0.45]);
  const pYPosition = useTransform(scrollYProgress, [0.15, 0.18, 0.22, 1], [0, 0, -575, -575]);
  const pXPosition = useTransform(scrollYProgress, [0.15, 0.22, 1], [0, 0, 0]);

  // Animation for "r" (index 1)
  const rRotation = useTransform(scrollYProgress, [0.198, 0.223, 1], [0, 90, 90]);
  const rScale = useTransform(scrollYProgress, [0.198, 0.223, 1], [1, 0.45, 0.45]);
  const rYPosition = useTransform(scrollYProgress, [0.198, 0.223, 0.24, 1], [0, 0, -490, -490]);
  const rXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.188, 0.198, 1],
    [0, -100, -100, -200, -200]
  );

  // Animation for "o" (index 2)
  const oRotation = useTransform(scrollYProgress, [0.24, 0.258, 1], [0, 90, 90]);
  const oScale = useTransform(scrollYProgress, [0.24, 0.258, 1], [1, 0.45, 0.45]);
  const oYPosition = useTransform(scrollYProgress, [0.24, 0.258, 0.268, 1], [0, 0, -450, -450]);
  const oXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 1],
    [0, -100, -100, -200, -200, -300, -300]
  );

  // Progressive pull effects for remaining letters
  const rojectsPullX = useTransform(scrollYProgress, [0.15, 0.18, 1], [0, -100, -100]);
  const ojectsPullX = useTransform(scrollYProgress, [0.15, 0.18, 0.198, 0.223, 1], [0, -100, -100, -200, -200]);

  // Animation for "j" (index 3)
  const jRotation = useTransform(scrollYProgress, [0.275, 0.293, 1], [0, 90, 90]);
  const jScale = useTransform(scrollYProgress, [0.275, 0.293, 1], [1, 0.45, 0.45]);
  const jYPosition = useTransform(scrollYProgress, [0.275, 0.293, 0.31, 1], [0, 0, -370, -370]);
  const jXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 0.258, 0.275, 1],
    [0, -100, -100, -200, -200, -300, -300, -475, -475]
  );

  // Animation for "e" (index 4)
  const eRotation = useTransform(scrollYProgress, [0.317, 0.335, 1], [0, 90, 90]);
  const eScale = useTransform(scrollYProgress, [0.317, 0.335, 1], [1, 0.45, 0.45]);
  const eYPosition = useTransform(scrollYProgress, [0.317, 0.335, 0.352, 1], [0, 0, -340, -340]);
  const eXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 0.258, 0.275, 0.3, 0.317, 1],
    [0, -100, -100, -200, -200, -300, -300, -400, -400, -540, -540]
  );

  // Animation for "c" (index 5)
  const cRotation = useTransform(scrollYProgress, [0.359, 0.377, 1], [0, 90, 90]);
  const cScale = useTransform(scrollYProgress, [0.359, 0.377, 1], [1, 0.45, 0.45]);
  const cYPosition = useTransform(scrollYProgress, [0.359, 0.377, 0.394, 1], [0, 0, -255, -255]);
  const cXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 0.258, 0.275, 0.3, 0.317, 0.342, 0.359, 1],
    [0, -100, -100, -200, -200, -300, -300, -400, -400, -550, -550, -710, -710]
  );

  // Animation for "t" (index 6)
  const tRotation = useTransform(scrollYProgress, [0.401, 0.419, 1], [0, 90, 90]);
  const tScale = useTransform(scrollYProgress, [0.401, 0.419, 1], [1, 0.45, 0.45]);
  const tYPosition = useTransform(scrollYProgress, [0.401, 0.419, 0.436, 1], [0, 0, -175, -175]);
  const tXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 0.258, 0.275, 0.3, 0.317, 0.342, 0.359, 0.377, 0.387, 0.401, 1],
    [0, -100, -100, -200, -200, -300, -300, -400, -400, -550, -550, -690, -690, -750, -880, -880]
  );

  // Animation for "s" (index 7)
  const sRotation = useTransform(scrollYProgress, [0.443, 0.445, 1], [0, 90, 90]);
  const sScale = useTransform(scrollYProgress, [0.443, 0.445, 1], [1, 0.45, 0.45]);
  const sYPosition = useTransform(scrollYProgress, [0.443, 0.445, 0.448, 1], [0, 0, -120, -120]);
  const sXPosition = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.198, 0.223, 0.233, 0.24, 0.258, 0.275, 0.3, 0.317, 0.342, 0.359, 0.377, 0.387, 0.401, 0.443, 1],
    [0, -100, -100, -200, -200, -300, -300, -400, -400, -550, -550, -690, -690, -740, -870, -990, -990]
  );

  const staticRotation = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const staticScale = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const staticY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const letterTransforms = LETTERS.map((_, index) => {
    if (index === 0) {
      return { rotation: pRotation, scale: pScale, yPosition: pYPosition, xPosition: pXPosition };
    } else if (index === 1) {
      return { rotation: rRotation, scale: rScale, yPosition: rYPosition, xPosition: rXPosition };
    } else if (index === 2) {
      return { rotation: oRotation, scale: oScale, yPosition: oYPosition, xPosition: oXPosition };
    } else if (index === 3) {
      return { rotation: jRotation, scale: jScale, yPosition: jYPosition, xPosition: jXPosition };
    } else if (index === 4) {
      return { rotation: eRotation, scale: eScale, yPosition: eYPosition, xPosition: eXPosition };
    } else if (index === 5) {
      return { rotation: cRotation, scale: cScale, yPosition: cYPosition, xPosition: cXPosition };
    } else if (index === 6) {
      return { rotation: tRotation, scale: tScale, yPosition: tYPosition, xPosition: tXPosition };
    } else if (index === 7) {
      return { rotation: sRotation, scale: sScale, yPosition: sYPosition, xPosition: sXPosition };
    } else {
      // Fallback (shouldn't reach here with current LETTERS array)
      return {
        rotation: staticRotation,
        scale: staticScale,
        yPosition: staticY,
        xPosition: rojectsPullX,
      };
    }
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[1000vh] bg-background"
    >
      {/* Sticky container for the content */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-end">
        {/* Bottom-left layout: "projects" text with cards starting at the end */}
        <div className="w-full px-8 pb-16 md:pb-20 lg:pb-24 pt-32 md:pt-40 lg:pt-48 overflow-x-hidden">
          <div className="flex items-end">
            {/* "projects" text */}
            <div className="flex items-end flex-shrink-0">
              {LETTERS.map((letter, index) => (
                <motion.span
                  key={index}
                  className="font-display text-[12vw] md:text-[14vw] lg:text-[16vw] font-bold text-foreground inline-block leading-none origin-bottom-left"
                  style={{
                    rotate: letterTransforms[index].rotation,
                    y: letterTransforms[index].yPosition,
                    x: letterTransforms[index].xPosition,
                    scale: letterTransforms[index].scale,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Horizontal scrolling cards - starting at end of "projects" */}
            <motion.div
              className="flex items-end gap-8 md:gap-12 lg:gap-16 ml-8 md:ml-12 lg:ml-16 flex-shrink-0"
              style={{
                x: cardTranslateX,
              }}
            >
              {PLACEHOLDER_PROJECTS.map((project, index) => (
                <ProjectCardComponent
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProjectCardComponentProps {
  project: ProjectCard;
  index: number;
}

function ProjectCardComponent({ project, index }: ProjectCardComponentProps) {
  return (
    <div
      className="relative flex-shrink-0 w-[70vw] md:w-[50vw] lg:w-[400px] h-[50vh] md:h-[55vh] lg:h-[60vh] bg-muted/20 rounded-lg overflow-hidden border border-border/50"
      style={{ willChange: 'transform' }}
    >
      {/* Placeholder image area */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
        <span className="font-display text-4xl md:text-5xl font-semibold text-muted-foreground/30">
          {project.title}
        </span>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm font-medium text-foreground">
          {project.category}
        </span>
      </div>

      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/90 to-transparent">
        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
          {project.title}
        </h3>
      </div>
    </div>
  );
}
