'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/">
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 612 237.59"
          className="w-16 sm:w-20 md:w-24 h-auto text-[#507579]"
          fill="currentColor"
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <path d="M306.52 203.65v33.94H169.36V135.77h-33.59v-33.95h33.59l.35.35 33.59 33.6.23 67.88z" />
          <path d="M101.48 237.59V135.77h-33.6v-33.94h33.6l33.94 33.94.35 101.82z" />
          <path d="M33.59 237.59V135.77H0v-33.94h33.59l33.94 33.94.35 101.82z" />
          <path d="M169.71 101.82v.35l-.35-.35z" />
          <path d="M577.71 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z" />
          <path d="M476.23 101.82h33.6v33.95h-33.6z" />
          <path d="M544.12 237.59h-34.29V101.82l33.94 33.95z" />
          <path d="M441.94 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z" />
          <path d="M578.06 101.83v.34l-.35-.34z" />
          <path d="M408.35 135.77v101.82h-33.94V135.77h-33.94v101.82h-33.95V33.94h-33.94V0h33.94l33.95 33.94v67.89h33.94z" />
        </motion.svg>

        {/* Mwamachi text and underline */}
        <div className="absolute left-0 top-full overflow-hidden w-16 sm:w-20 md:w-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-[#507579] text-xs sm:text-sm font-bold whitespace-nowrap lowercase w-full"
            style={{ letterSpacing: '0.26em' }}
          >
            Mwamachi
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isHovered ? '100%' : 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="h-[1px] bg-[#507579] mt-1"
            />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { name: 'Websites', href: '/websites' },
    { name: 'Illustrations', href: '/illustrations' },
    { name: 'Ideas', href: '/ideas' },
    { name: 'divider', href: '#' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
          <Logo />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#507579] text-lg sm:text-xl font-medium hover:opacity-80 transition-opacity"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-50 bg-[#C0D5CE]"
          >
            {/* Navigation Links - Pushed to Left */}
            <div className="flex items-center justify-start h-full pl-[8%] sm:pl-[10%] md:pl-[15%]">
              <nav className="space-y-4 sm:space-y-6 md:space-y-8 w-full pr-8 sm:pr-16 md:pr-24 lg:pr-32">
                {navLinks.map((link, index) => {
                  if (link.name === 'divider') {
                    return (
                      <motion.div
                        key="divider"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.6 + index * 0.1,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="h-[1px] bg-[#1B3033] w-[84vw] sm:w-[82vw] md:w-[calc(100vw-15%-10rem)]"
                      />
                    );
                  }

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <Link
                        href={link.href}
                        className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1B3033] transition-opacity duration-300"
                        style={{
                          opacity: hoveredLink === null || hoveredLink === link.name ? 1 : 0.4,
                        }}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Link - Fixed Bottom Right */}
      <Link
        href="/about"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 text-base sm:text-lg text-[#507579] hover:opacity-80 transition-opacity"
      >
        About
      </Link>
    </>
  );
}
