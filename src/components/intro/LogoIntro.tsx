'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/icons/AnimatedLogo';

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 sm:p-6 md:p-8"
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
    >
      <AnimatedLogo className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl" />
    </motion.div>
  );
}
