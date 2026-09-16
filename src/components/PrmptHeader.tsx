import { motion } from 'motion/react';

interface PrmptHeaderProps {
  onBackToHome?: () => void;
}

export default function PrmptHeader({ onBackToHome }: PrmptHeaderProps) {
  const easeTransition = [0.25, 0.1, 0.25, 1] as const;

  return (
    <>
      {/* 1B. Logo (Top Left): Responsive bold editorial branding */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeTransition, delay: 0 }}
        onClick={onBackToHome}
        className="fixed z-20 top-4 left-4 md:top-8 md:left-8 cursor-pointer select-none"
        style={{ mixBlendMode: 'exclusion' }}
        title="Cookie Planet®"
      >
        <div className="flex items-baseline gap-1">
          <span className="font-inter-tight tracking-[-0.05em] font-extrabold uppercase text-white text-[24px] sm:text-[34px] lg:text-[44px] leading-none">
            Cookie Planet
          </span>
          <span className="font-inter-tight text-[11px] sm:text-[14px] lg:text-[18px] font-bold text-white tracking-tight">
            ®
          </span>
        </div>
      </motion.div>

      {/* 1D. Header Navigation (Top Right) */}
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeTransition, delay: 0.15 }}
        className="fixed z-20 pointer-events-none top-4 right-4 lg:top-8 lg:right-8 w-auto lg:w-[330px] h-[30px] flex items-center justify-between"
        style={{ mixBlendMode: 'exclusion' }}
      >
        {/* "ABOUT" (hidden on mobile < 640px) */}
        <span className="hidden sm:inline font-inter-tight font-medium text-[15px] uppercase tracking-[-0.02em] text-white">
          ABOUT
        </span>

        {/* Hamburger + [ CART ] */}
        <div className="flex items-center gap-[20px] lg:gap-[50px]">
          {/* Hamburger SVG icon: 30x30 desktop, 24x24 mobile, stroke white, strokeWidth 2.5 */}
          <svg
            viewBox="0 0 40 40"
            className="w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="square"
            aria-label="Menu"
          >
            <path d="M0 14H40" />
            <path d="M0 26H40" />
          </svg>

          {/* [ CART ] text */}
          <span className="font-inter-tight font-medium text-[13px] lg:text-[15px] text-white tracking-[-0.02em]">
            [ CART ]
          </span>
        </div>
      </motion.nav>
    </>
  );
}
