'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ContactCTA } from '@/components/sections/ContactCTA';

// Bio sections - each section triggers a new image and background color
const BIO_SECTIONS = [
  {
    id: 1,
    text: "I'm Heinz Mwamachi, a multidisciplinary designer based in Nairobi, Kenya. My journey began in architecture, where I learned to think about space, structure, and how design shapes human experience.",
  },
  {
    id: 2,
    text: "I've recently transitioned into brand experience and website design, bringing my architectural sensibility—attention to detail, systematic thinking, and spatial awareness—into the digital realm. Each project is a new opportunity to learn and push my craft forward.",
  },
  {
    id: 3,
    text: "My approach blends strategic thinking with creative intuition. I believe great design isn't just about aesthetics—it's about solving problems and creating meaningful connections between brands and their audiences.",
  },
  {
    id: 4,
    text: "When I'm not designing, you'll find me drawing, reading, playing football, or walking my dog, Magnolia. These moments away from the screen often bring the best ideas.",
  },
  {
    id: 5,
    text: "I'm always open to new collaborations and conversations. Whether you have a project in mind or just want to connect, I'd love to hear from you.",
  },
];

// Background colors for transitions (matching brand palette)
const BACKGROUND_COLORS = [
  '#C0D5CE', // jet-stream
  '#1B3033', // jungle-green
  '#304544', // indigo-dark
  '#507579', // electric-blue
  '#A0C8C4', // opal
];

// Text colors that contrast with backgrounds
const TEXT_COLORS = [
  '#1B3033', // dark text on jet-stream
  '#C0D5CE', // light text on jungle-green
  '#C0D5CE', // light text on indigo-dark
  '#C0D5CE', // light text on electric-blue
  '#1B3033', // dark text on opal
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background color interpolation
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    BACKGROUND_COLORS
  );

  // Text color interpolation
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    TEXT_COLORS
  );

  // Image opacities - very slow, smooth transitions spread across entire scroll
  // 5 images, each visible for ~25%, with very long 12% crossfades
  const image1Opacity = useTransform(scrollYProgress, [0, 0.20, 0.32], [1, 1, 0]);
  const image2Opacity = useTransform(scrollYProgress, [0.20, 0.32, 0.44, 0.56], [0, 1, 1, 0]);
  const image3Opacity = useTransform(scrollYProgress, [0.44, 0.56, 0.68, 0.80], [0, 1, 1, 0]);
  const image4Opacity = useTransform(scrollYProgress, [0.68, 0.80, 0.88, 0.95], [0, 1, 1, 0]);
  const image5Opacity = useTransform(scrollYProgress, [0.88, 0.95, 1], [0, 1, 1]); // Stays visible through end

  const imageOpacities = [image1Opacity, image2Opacity, image3Opacity, image4Opacity, image5Opacity];

  return (
    <>
    <motion.div
      ref={containerRef}
      className="relative"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Scrollable Content */}
        <div className="w-full lg:w-1/2 px-6 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 lg:pt-36 relative z-10">
          {/* Info Label */}
          <motion.span
            className="font-body text-sm uppercase tracking-widest mb-12 block opacity-60"
            style={{ color: textColor }}
          >
            Info
          </motion.span>

          {/* Bio Sections - these scroll naturally */}
          <div>
            {BIO_SECTIONS.map((section, index) => (
              <motion.div
                key={section.id}
                className="min-h-[45vh] sm:min-h-[55vh] lg:min-h-[80vh] flex items-start pb-16 sm:pb-20 lg:pb-24"
              >
                <motion.p
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed max-w-xl drop-shadow-sm lg:drop-shadow-none"
                  style={{ color: textColor }}
                >
                  {section.text}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Bottom spacer - larger on mobile to keep image visible longer */}
          <div className="h-[25vh] sm:h-[20vh] lg:h-[20vh]" />
        </div>

        {/* Right Column - Fixed Image Frame */}
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 items-start justify-center p-12 pt-36">
          {/* Fixed dimension frame */}
          <div className="relative w-[40vw] h-[70vh] rounded-2xl overflow-hidden">
            {/* Images with crossfade */}
            {[1, 2, 3, 4, 5].map((num, index) => (
              <motion.div
                key={num}
                className="absolute inset-0"
                style={{ opacity: imageOpacities[index] }}
              >
                <Image
                  src={`/images/about/heinz_${num}.png`}
                  alt={`About photo ${num}`}
                  fill
                  className="object-cover object-top"
                  priority={num === 1}
                />
              </motion.div>
            ))}

            {/* Fallback gradient if images don't exist */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 -z-10" />
          </div>
        </div>

        {/* Mobile/Tablet: Fixed image at top-right */}
        <motion.div
          className="lg:hidden fixed top-24 right-4 sm:right-6 md:right-8 z-0 flex items-start justify-end"
          style={{
            opacity: useTransform(scrollYProgress, [0.97, 1], [0.7, 0])
          }}
        >
          <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[360px] md:h-[360px] rounded-2xl overflow-hidden">
            {[1, 2, 3, 4, 5].map((num, index) => (
              <motion.div
                key={num}
                className="absolute inset-0"
                style={{ opacity: imageOpacities[index] }}
              >
                <Image
                  src={`/images/about/heinz_${num}.png`}
                  alt={`About photo ${num}`}
                  fill
                  className="object-cover object-top"
                  priority={num === 1}
                />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 -z-10" />
          </div>
        </motion.div>
      </div>

    </motion.div>

      {/* Contact CTA Section */}
      <ContactCTA />
    </>
  );
}
