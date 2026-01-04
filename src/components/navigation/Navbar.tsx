'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoProps {
  color: string;
  onClick?: () => void;
}

const Logo = ({ color, onClick }: LogoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Link href="/" onClick={onClick}>
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 612 237.59"
          className="w-12 sm:w-20 md:w-24 h-auto"
          animate={{ y: isHovered ? (isMobile ? -10 : -15) : 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <path d="M306.52 203.65v33.94H169.36V135.77h-33.59v-33.95h33.59l.35.35 33.59 33.6.23 67.88z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M101.48 237.59V135.77h-33.6v-33.94h33.6l33.94 33.94.35 101.82z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M33.59 237.59V135.77H0v-33.94h33.59l33.94 33.94.35 101.82z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M169.71 101.82v.35l-.35-.35z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M577.71 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M476.23 101.82h33.6v33.95h-33.6z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M544.12 237.59h-34.29V101.82l33.94 33.95z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M441.94 237.59V135.77h-33.59v-33.94h33.59l33.94 33.94.35 101.82z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M578.06 101.83v.34l-.35-.34z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
          <path d="M408.35 135.77v101.82h-33.94V135.77h-33.94v101.82h-33.95V33.94h-33.94V0h33.94l33.95 33.94v67.89h33.94z" fill={color} style={{ transition: 'fill 0.3s ease' }} />
        </motion.svg>

        {/* Mwamachi text and underline */}
        <div className="absolute left-0 top-full overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? (isMobile ? -3 : -5) : 20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-[10px] sm:text-sm font-bold whitespace-nowrap lowercase"
            style={{ letterSpacing: '0.26em', color, transition: 'color 0.3s ease' }}
          >
            Mwamachi
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isHovered ? '100%' : 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="h-[1px] mt-1"
              style={{ backgroundColor: color, transition: 'background-color 0.3s ease' }}
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
  const [navColor, setNavColor] = useState('rgb(80, 117, 121)'); // primary
  const [aboutColor, setAboutColor] = useState('rgb(80, 117, 121)'); // primary
  const [isNavOverFooter, setIsNavOverFooter] = useState(false);
  const [isAboutOverFooter, setIsAboutOverFooter] = useState(false);

  const navLinks = [
    { name: 'Projects', href: '/projects', isParent: true },
    { name: 'Websites', href: '/projects?category=websites', isChild: true },
    { name: 'Illustration', href: '/projects?category=illustration', isChild: true },
    { name: 'Branding', href: '/projects?category=branding', isChild: true },
    { name: 'Ideas', href: '/projects?category=ideas' },
    { name: 'divider', href: '#' },
    { name: 'Contact', href: '/contact' },
  ];

  // Handle menu open/close color changes for top navbar
  useEffect(() => {
    if (isMenuOpen) {
      setNavColor('rgb(27, 48, 51)'); // foreground
    } else if (isNavOverFooter) {
      setNavColor('rgb(192, 213, 206)'); // dark-fg
    } else {
      setNavColor('rgb(80, 117, 121)'); // primary
    }
  }, [isMenuOpen, isNavOverFooter]);

  // Handle color changes for About link (bottom-right)
  useEffect(() => {
    if (isMenuOpen) {
      setAboutColor('rgb(27, 48, 51)'); // foreground
    } else if (isAboutOverFooter) {
      setAboutColor('rgb(192, 213, 206)'); // dark-fg
    } else {
      setAboutColor('rgb(80, 117, 121)'); // primary
    }
  }, [isMenuOpen, isAboutOverFooter]);

  // Use RAF to continuously check footer position (works with Lenis)
  useEffect(() => {
    let rafId: number;

    const checkFooterPosition = () => {
      const footer = document.querySelector('footer');
      const aboutLink = document.querySelector('a[href="/about"]');

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if top navbar (logo, menu) is over footer
        // This happens when footer's top edge reaches near the top of viewport
        if (footerRect.top <= 100) {
          setIsNavOverFooter(true);
        } else {
          setIsNavOverFooter(false);
        }

        // Check if About link (bottom-right) is over footer
        // This happens when footer enters the bottom area of viewport
        if (aboutLink) {
          const aboutRect = aboutLink.getBoundingClientRect();
          // Check if footer has reached the About link position
          if (footerRect.top <= aboutRect.top + aboutRect.height) {
            setIsAboutOverFooter(true);
          } else {
            setIsAboutOverFooter(false);
          }
        }
      }

      rafId = requestAnimationFrame(checkFooterPosition);
    };

    rafId = requestAnimationFrame(checkFooterPosition);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed z-[60] transition-all duration-300 ease-out ${
          isMenuOpen || isNavOverFooter
            ? 'top-0 left-0 right-0 px-6 py-4 sm:px-8 sm:py-5 md:px-12 md:py-6 lg:px-16'
            : 'top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 md:top-5 md:left-6 md:right-6 lg:top-6 lg:left-8 lg:right-8 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-10 rounded-2xl sm:rounded-3xl bg-background/70 backdrop-blur-md border border-primary/10 shadow-lg shadow-primary/5'
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo color={navColor} onClick={() => setIsMenuOpen(false)} />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="font-body text-lg sm:text-xl font-medium hover:opacity-80"
            style={{ color: navColor, transition: 'color 0.3s ease, opacity 0.3s ease' }}
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
            className="fixed inset-0 z-50 bg-accent"
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
                        className="h-[1px] bg-foreground w-[84vw] sm:w-[82vw] md:w-[calc(100vw-15%-10rem)]"
                      />
                    );
                  }

                  const isChild = 'isChild' in link && link.isChild;

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
                      className={isChild ? 'pl-6 sm:pl-8 md:pl-10' : ''}
                    >
                      <Link
                        href={link.href}
                        className={`block font-display font-semibold text-foreground transition-opacity duration-300 ${isChild ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'}`}
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
        className={`fixed z-50 font-body text-base sm:text-lg hover:opacity-80 transition-all duration-300 ease-out ${
          isMenuOpen || isAboutOverFooter
            ? 'bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-12 lg:right-16'
            : 'bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-6 lg:bottom-6 lg:right-10 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-background/70 backdrop-blur-md border border-primary/10 shadow-lg shadow-primary/5'
        }`}
        style={{ color: aboutColor, transition: 'color 0.3s ease, opacity 0.3s ease' }}
        onClick={() => setIsMenuOpen(false)}
      >
        About
      </Link>
    </>
  );
}
