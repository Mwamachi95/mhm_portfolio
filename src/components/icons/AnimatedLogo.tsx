'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const colorPalette = [
  '#C0D5CE',
  '#1B3033',
  '#304544',
  '#284652',
  '#507579',
  '#A0C8C4',
  '#577275',
  '#C3CFD6',
  '#658590',
];

const baseColorSequence = [
  '#C0D5CE',
  '#1B3033',
  '#304544',
  '#284652',
  '#507579',
  '#A0C8C4',
  '#577275',
  '#C3CFD6',
];

const paths = [
  'M306.52 203.65v33.94H169.36V135.77h-33.59v-33.95h33.59l.35.35 33.59 33.6.23 67.88z',
  'M101.48 237.59V135.77h-33.6v-33.94h33.6l33.94 33.94.35 101.82z',
  'M33.59 237.59V135.77H0v-33.94h33.59l33.94 33.94.35 101.82z',
  'M169.71 101.82v.35l-.35-.35z',
  'M577.71 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z',
  'M476.23 101.82h33.6v33.95h-33.6z',
  'M544.12 237.59h-34.29V101.82l33.94 33.95z',
  'M441.94 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z',
  'M578.06 101.83v.34l-.35-.34z',
  'M408.35 135.77v101.82h-33.94V135.77h-33.94v101.82h-33.95V33.94h-33.94V0h33.94l33.95 33.94v67.89h33.94z',
];

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  // Generate random final colors for each path (memoized to prevent re-randomization on re-renders)
  const pathColorSequences = useMemo(() => {
    return paths.map(() => {
      const randomFinalColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      return [...baseColorSequence, randomFinalColor];
    });
  }, []);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 612 237.59"
      className={cn('w-64', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {paths.map((pathData, index) => (
        <motion.path
          key={index}
          d={pathData}
          initial={{ fill: colorPalette[0] }}
          animate={{ fill: pathColorSequences[index] }}
          transition={{
            duration: 6.5,
            delay: 0.8 + index * 0.08,
            ease: [0.33, 1, 0.68, 1],
            repeat: 0,
          }}
        />
      ))}
    </motion.svg>
  );
}
