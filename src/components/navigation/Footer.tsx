'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full min-h-screen bg-dark-bg flex items-end px-6 sm:px-8 md:px-12 lg:px-16 pb-12 sm:pb-16 md:pb-20 pt-12 sm:pt-14 md:pt-16">
      <div className="w-full max-w-fit">
        {/* Two Columns: Contact and Social Media */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            {/* Column 1 - Contact */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h3 className="font-body text-dark-fg text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide">
                Contact
              </h3>
              <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                <a
                  href="mailto:mwamachi.mwamburi@gmail.com"
                  className="link-underline font-body text-dark-fg text-base sm:text-lg md:text-xl lg:text-2xl font-normal"
                >
                  mwamachi.mwamburi@gmail.com
                </a>
                <a
                  href="tel:+254712378654"
                  className="link-underline font-body text-dark-fg text-base sm:text-lg md:text-xl lg:text-2xl font-normal"
                >
                  +254712378654
                </a>
              </div>
            </div>

            {/* Column 2 - Social Media */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h3 className="font-body text-dark-fg text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide">
                Social Media
              </h3>
              <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                <a
                  href="https://www.instagram.com/mhm_design.lab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-body text-dark-fg text-base sm:text-lg md:text-xl lg:text-2xl font-normal"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/in/heinz-mwamburi-6a5238229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-body text-dark-fg text-base sm:text-lg md:text-xl lg:text-2xl font-normal"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        {/* Logo */}
        <div className="mt-6 sm:mt-8 md:mt-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 612 237.59"
              className="w-full h-auto text-dark-fg"
              fill="currentColor"
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
            </svg>
        </div>

        {/* Copyright */}
        <div className="mt-4 sm:mt-5 md:mt-6">
          <p className="font-body text-dark-fg text-xs sm:text-sm">© {currentYear} Mwamachi</p>
        </div>
      </div>
    </footer>
  );
}
