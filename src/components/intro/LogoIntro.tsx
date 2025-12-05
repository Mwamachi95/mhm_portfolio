'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/icons/AnimatedLogo';

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-4 sm:p-6 md:p-8 cursor-pointer"
      onClick={onComplete}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
    >
      <AnimatedLogo className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl" />

      {/* Cursor tooltip */}
      {isHovering && (
        <div
          className="fixed pointer-events-none z-[110] transition-opacity duration-300"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y + 20}px`,
          }}
        >
          <div className="bg-muted/10 backdrop-blur-sm text-muted px-2.5 py-1.5 rounded-md shadow-sm border border-muted/20">
            <p className="font-body text-xs whitespace-nowrap">
              Click to skip to Home page
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
