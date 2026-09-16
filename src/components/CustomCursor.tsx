import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop (>= 1024px) and non-touch fine pointers
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className="fixed pointer-events-none z-50 opacity-0 transition-opacity duration-200 hidden lg:block"
      style={{
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'exclusion',
      }}
      aria-hidden="true"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle with stroke r=22.75, strokeWidth=2.5 */}
        <circle cx="24" cy="24" r="22.75" stroke="white" strokeWidth="2.5" />
        {/* Custom Japanese/decorative glyph path, filled white */}
        <path
          d="M24 11V37M15 19H33M13.5 28H34.5M16.5 35H31.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="2.5" fill="white" />
      </svg>
    </div>
  );
}
