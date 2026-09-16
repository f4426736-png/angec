import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { GALLERY_ITEMS } from '../data/prmptData';

const SYMBOLS = ['8', '$', '^^', '%', '/'];

// Layout algorithm function specified in technical prompt:
// buildLayout(count, cols) creates rows with primary column a = (r * 2 + (r % 2)) % cols
// and second image every 3rd row at b = (a + 2) % cols (or (a + 1) % cols if same as a)
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (placed < count && r % 3 === 0) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

export default function GalleryGrid() {
  const [cols, setCols] = useState(4);
  const [gridRows, setGridRows] = useState<number[][]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const innerWrapRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const outroOverlayRef = useRef<HTMLDivElement>(null);
  const outroInfoRef = useRef<HTMLDivElement>(null);
  const outroBuyRef = useRef<HTMLDivElement>(null);
  const outroFooterRef = useRef<HTMLElement>(null);
  const circleSymbolRef = useRef<HTMLSpanElement>(null);

  const lastSymbolTimeRef = useRef<number>(0);

  // Responsive columns calculation
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      let c = 4;
      if (w < 640) {
        c = 2;
      } else if (w < 1024) {
        c = 3;
      } else {
        c = 4;
      }
      setCols(c);
      setGridRows(buildLayout(GALLERY_ITEMS.length, c));
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Main Scroll & RAF Animation Loop
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const wrapHeight = innerWrapRef.current ? innerWrapRef.current.scrollHeight : vh * 2;
      const maxScroll = Math.max(0, wrapHeight - vh);

      // Dynamically calculate root spacer height: vh + maxScroll + 2 * vh
      const rootSpacer = document.getElementById('scroll-spacer');
      if (rootSpacer) {
        const targetSpacerHeight = vh + maxScroll + 2 * vh;
        rootSpacer.style.height = `${targetSpacerHeight}px`;
      }

      // PHASE 1 (scrollY 0 to vh): Black panel slides up from 100vh to 0
      // PHASE 2 (scrollY > vh): Panel fixed at top, inner wrapper translates up
      if (panelRef.current && innerWrapRef.current) {
        if (scrollY <= vh) {
          panelRef.current.style.transform = `translate3d(0, ${vh - scrollY}px, 0)`;
          innerWrapRef.current.style.transform = `translate3d(0, 0px, 0)`;
        } else {
          panelRef.current.style.transform = `translate3d(0, 0px, 0)`;
          const phase2Offset = -(scrollY - vh);
          innerWrapRef.current.style.transform = `translate3d(0, ${phase2Offset}px, 0)`;
        }
      }

      // Card Behavior: Scale computed per-frame in RAF based on vertical position
      cardElementsRef.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const top = rect.top;
        const bottom = rect.bottom;

        if (bottom <= 0 || top >= vh) {
          card.style.transform = 'scale(0)';
          return;
        }

        // Enter: scales from 0 to 1 as it enters viewport
        const enter = Math.min(1, (vh - top) / (vh * 0.6));
        // Exit: scales from 1 to 0 as it exits top
        const exit = Math.min(1, bottom / (vh * 0.4));
        const scale = Math.max(0, Math.min(enter, exit));
        card.style.transform = `scale(${scale.toFixed(4)})`;
      });

      // OUTRO (scrollY > vh + maxScroll)
      const outroStart = vh + maxScroll;
      const outroRange = Math.max(100, vh - 100);
      const isOutro = scrollY > outroStart;
      const outroProgress = isOutro
        ? Math.max(0, Math.min(1, (scrollY - outroStart) / outroRange))
        : 0;

      // 1I. White overlay fades in
      if (outroOverlayRef.current) {
        outroOverlayRef.current.style.opacity = `${outroProgress}`;
      }

      // 1E. Product info slides up by outroOffset px
      if (outroInfoRef.current) {
        const isDesktop = window.innerWidth >= 1024;
        const outroOffset = isDesktop ? 166 : 132;
        outroInfoRef.current.style.transform = `translate3d(0, -${outroOffset * outroProgress}px, 0)`;
      }

      // 1F. "View" button scales from 0 to 1
      if (outroBuyRef.current) {
        outroBuyRef.current.style.transform = `scale(${outroProgress})`;
      }

      // 1J. Footer fades in
      if (outroFooterRef.current) {
        outroFooterRef.current.style.opacity = `${outroProgress}`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gridRows]);

  // Throttled random symbol change on scroll (80ms)
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSymbolTimeRef.current >= 80) {
        lastSymbolTimeRef.current = now;
        if (circleSymbolRef.current) {
          const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
          circleSymbolRef.current.textContent = SYMBOLS[randomIndex];
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* SECTION 2: Black Panel (Gallery) */}
      <div
        ref={panelRef}
        id="gallery-panel"
        className="fixed inset-0 w-full h-full bg-black z-10 overflow-hidden pointer-events-none"
        style={{
          transform: 'translate3d(0, 100vh, 0)',
          willChange: 'transform',
        }}
      >
        {/* Inner Wrapper: width 100%, padding-top min(400px, 40vh) */}
        <div
          ref={innerWrapRef}
          className="w-full pt-[min(400px,40vh)] pb-[40vh] px-2 sm:px-4 lg:px-6"
          style={{ willChange: 'transform' }}
        >
          <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {gridRows.map((row, rowIdx) => (
              <div
                key={`row-${rowIdx}`}
                className="grid gap-2 sm:gap-4 lg:gap-6 w-full"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {row.map((imgIdx, colIdx) => {
                  if (imgIdx === -1) {
                    // Empty cell spacer
                    return (
                      <div
                        key={`spacer-${rowIdx}-${colIdx}`}
                        className="aspect-[2/3] w-full"
                        aria-hidden="true"
                      />
                    );
                  }

                  const item = GALLERY_ITEMS[imgIdx];
                  if (!item) return null;

                  const isLeftHalf = colIdx < cols / 2;

                  return (
                    <div
                      key={`card-cell-${item.id}`}
                      className="aspect-[2/3] w-full relative flex items-center justify-center overflow-hidden"
                    >
                      <div
                        ref={(el) => {
                          cardElementsRef.current[imgIdx] = el;
                        }}
                        className="bp-card w-full h-full"
                        style={{
                          transform: 'scale(0)',
                          transformOrigin: isLeftHalf ? 'right bottom' : 'left bottom',
                          willChange: 'transform',
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1I. White Overlay */}
      <div
        ref={outroOverlayRef}
        id="outro-overlay"
        className="fixed inset-0 pointer-events-none z-12 bg-[#ffffff] opacity-0"
      />

      {/* 1E. Product Info (Bottom Right) */}
      <motion.div
        ref={outroInfoRef}
        id="outro-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.45 }}
        data-outro-offset="166"
        className="fixed pointer-events-none z-20 flex flex-col items-center bottom-[48px] left-0 right-0 lg:left-auto lg:right-[32px] lg:bottom-[80px] lg:w-[330px]"
        style={{ mixBlendMode: 'exclusion' }}
      >
        {/* Top block */}
        <div className="flex flex-col items-start w-[252px] lg:w-full mb-[12px] lg:mb-[32px]">
          {/* Circle icon (30x30 desktop, 20x20 mobile) */}
          <div className="relative w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] flex items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle
                cx="20"
                cy="20"
                r="18.75"
                stroke="white"
                strokeWidth="2.5"
                className="stroke-[2px] lg:stroke-[2.5px]"
              />
            </svg>
            <span
              ref={circleSymbolRef}
              id="circle-symbol"
              className="absolute inset-0 flex items-center justify-center font-inter-tight font-medium text-[10px] lg:text-[15px] tracking-[-0.04em] uppercase text-white"
            >
              8
            </span>
          </div>

          {/* Collection label */}
          <div className="font-inter-tight font-medium text-[20px] lg:text-[30px] leading-[100%] tracking-[-0.04em] uppercase text-white mt-4 sm:mt-6 text-left">
            ARCHIVE COLLECTION
            <br />
            "COOKIE PLANET"
          </div>
        </div>

        {/* Price: 80px desktop, 60px mobile, Inter Tight 500, #FFFFFF */}
        <div className="font-inter-tight font-medium text-[60px] lg:text-[80px] leading-[100%] text-center tracking-[-0.04em] text-white">
          S/ 25
        </div>
      </motion.div>

      {/* 1F. "View" Button (Bottom Right, Initially Hidden) */}
      <div
        ref={outroBuyRef}
        id="outro-buy"
        className="fixed pointer-events-none z-20 flex items-center justify-center bg-[#ffffff] rounded-[1335px] bottom-[60px] left-[16px] right-[16px] h-[100px] lg:left-auto lg:right-[32px] lg:bottom-[32px] lg:w-[330px] lg:h-[174px]"
        style={{
          transformOrigin: 'right bottom',
          transform: 'scale(0)',
          mixBlendMode: 'exclusion',
        }}
      >
        <span
          className="font-inter-tight font-medium text-[72px] lg:text-[110px] tracking-[-0.04em] text-white select-none leading-none"
          style={{ mixBlendMode: 'exclusion' }}
        >
          view
        </span>
      </div>

      {/* 1J. Footer */}
      <footer
        ref={outroFooterRef}
        id="outro-footer"
        className="fixed pointer-events-none z-20 flex items-center justify-between lg:justify-start lg:gap-[80px] left-[16px] right-[16px] lg:right-auto bottom-[24px] lg:bottom-[32px] opacity-0"
        style={{ mixBlendMode: 'exclusion' }}
      >
        <span className="font-inter-tight font-medium text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white">
          COOKIE PLANET (R) 2026
        </span>
        <span className="font-inter-tight font-medium text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white">
          PRIVACY POLICY
        </span>
      </footer>
    </>
  );
}
