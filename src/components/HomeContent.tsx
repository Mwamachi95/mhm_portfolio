'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoIntro } from '@/components/intro/LogoIntro';
import { ContactCTA } from '@/components/sections/ContactCTA';

const ROTATING_WORDS = ['experience', 'websites', 'illustration', 'brands'];
const WORD_DISPLAY_TIME = 2500; // 2.5 seconds per word
const TRANSITION_DURATION = 0.6; // 0.6 seconds for transition

interface AnimatedWordProps {
  word: string;
}

const AnimatedWord = ({ word }: AnimatedWordProps) => {
  return (
    <motion.span
      key={word}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{
        duration: TRANSITION_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="absolute left-0 bottom-0 inline-block"
    >
      {word}
    </motion.span>
  );
};

interface HomeContentProps {
  projectsShowcase: ReactNode;
}

export function HomeContent({ projectsShowcase }: HomeContentProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Memoize the callback to prevent useEffect in LogoIntro from restarting
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    // Delay hero appearance to allow white background to show
    setTimeout(() => {
      setShowHero(true);
    }, 1500); // 1.5s gap for white background pause
  }, []);

  // Auto-rotate words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, WORD_DISPLAY_TIME);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && <LogoIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* White background pause between intro and hero */}
      {!showIntro && !showHero && (
        <div className="fixed inset-0 bg-background z-[99]" />
      )}

      {/* Main content */}
      {showHero && (
        <>
          {/* Hero section */}
          <motion.section
            className="flex min-h-screen items-end justify-center px-6 sm:px-8 md:px-12 lg:px-16 pb-32 sm:pb-40 md:pb-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-left">
              {/* Line 1: Greeting */}
              <p className="font-body text-2xl md:text-3xl lg:text-4xl font-medium text-muted">
                Hey, I'm Heinz
              </p>

              {/* Line 2: Hero statement with rotating text */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-8xl font-semibold text-foreground mt-3">
                A designer of{' '}
                <span
                  className="inline-block relative min-w-[280px] md:min-w-[420px] lg:min-w-[600px] text-left align-bottom"
                  style={{ minHeight: '1.2em' }}
                >
                  <AnimatePresence>
                    <AnimatedWord word={ROTATING_WORDS[currentWordIndex]} />
                  </AnimatePresence>
                </span>
              </h1>

              {/* Line 3: Supporting text */}
              <p className="font-body text-base md:text-lg lg:text-xl font-normal text-muted opacity-80 mt-6">
                Connecting strategy, design, and digital craft
              </p>
            </div>
          </motion.section>

          {/* Projects showcase section */}
          {projectsShowcase}

          {/* Contact CTA section */}
          <ContactCTA />
        </>
      )}
    </>
  );
}
