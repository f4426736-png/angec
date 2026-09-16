import { useEffect, useRef, useState } from 'react';
import { VIDEO_LEFT_URL, VIDEO_RIGHT_URL } from '../data/prmptData';

export default function HeroVideoScrubber() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);

  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);

  const activeSideRef = useRef<'left' | 'right'>('right');
  const targetTimeLeftRef = useRef(0);
  const targetTimeRightRef = useRef(0);
  const inDeadZoneRef = useRef(true);

  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      window.innerWidth < 1024;

    const leftVideo = leftVideoRef.current;
    const rightVideo = rightVideoRef.current;
    if (!leftVideo || !rightVideo) return;

    // Track scroll to hide videos once scroll passes first viewport height
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      if (containerRef.current) {
        if (scrollY >= vh) {
          containerRef.current.style.visibility = 'hidden';
        } else {
          containerRef.current.style.visibility = 'visible';
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (isTouch) {
      // Mobile/Tablet (touch): Alternating auto-play loop
      leftVideo.style.display = 'block';
      rightVideo.style.display = 'none';

      leftVideo.muted = true;
      leftVideo.playsInline = true;
      rightVideo.muted = true;
      rightVideo.playsInline = true;

      leftVideo.play().catch(() => {});

      const onLeftEnded = () => {
        leftVideo.style.display = 'none';
        rightVideo.style.display = 'block';
        rightVideo.currentTime = 0;
        rightVideo.play().catch(() => {});
      };

      const onRightEnded = () => {
        rightVideo.style.display = 'none';
        leftVideo.style.display = 'block';
        leftVideo.currentTime = 0;
        leftVideo.play().catch(() => {});
      };

      leftVideo.addEventListener('ended', onLeftEnded);
      rightVideo.addEventListener('ended', onRightEnded);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        leftVideo.removeEventListener('ended', onLeftEnded);
        rightVideo.removeEventListener('ended', onRightEnded);
      };
    }

    // Desktop: Non-touch scrubbing
    leftVideo.pause();
    rightVideo.pause();
    leftVideo.style.display = 'none';
    rightVideo.style.display = 'block';

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const centerX = width / 2;
      const mouseX = e.clientX;
      const deadZone = Math.max(30, width * 0.05);

      if (Math.abs(mouseX - centerX) <= deadZone) {
        // In dead zone: keep current video at currentTime = 0
        inDeadZoneRef.current = true;
        targetTimeLeftRef.current = 0;
        targetTimeRightRef.current = 0;
        return;
      }

      inDeadZoneRef.current = false;

      if (mouseX < centerX - deadZone) {
        // Cursor moves left of dead zone: show RIGHT video
        activeSideRef.current = 'right';
        leftVideo.style.display = 'none';
        rightVideo.style.display = 'block';

        const availableRange = centerX - deadZone;
        const progress = Math.max(0, Math.min(1, (centerX - deadZone - mouseX) / availableRange));
        if (rightVideo.duration) {
          targetTimeRightRef.current = progress * rightVideo.duration;
        }
      } else {
        // Cursor moves right of dead zone: show LEFT video
        activeSideRef.current = 'left';
        rightVideo.style.display = 'none';
        leftVideo.style.display = 'block';

        const availableRange = width - (centerX + deadZone);
        const progress = Math.max(0, Math.min(1, (mouseX - (centerX + deadZone)) / availableRange));
        if (leftVideo.duration) {
          targetTimeLeftRef.current = progress * leftVideo.duration;
        }
      }
    };

    // CRITICAL: Only update currentTime when !video.seeking
    const scrubLoop = () => {
      const active = activeSideRef.current;
      if (active === 'left' && leftVideo && leftVideo.readyState >= 2 && !leftVideo.seeking) {
        const target = inDeadZoneRef.current ? 0 : targetTimeLeftRef.current;
        if (Math.abs(leftVideo.currentTime - target) > 0.02) {
          leftVideo.currentTime = target;
        }
      } else if (active === 'right' && rightVideo && rightVideo.readyState >= 2 && !rightVideo.seeking) {
        const target = inDeadZoneRef.current ? 0 : targetTimeRightRef.current;
        if (Math.abs(rightVideo.currentTime - target) > 0.02) {
          rightVideo.currentTime = target;
        }
      }

      rafId = requestAnimationFrame(scrubLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(scrubLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const bothLoaded = leftLoaded && rightLoaded;

  return (
    <div
      ref={containerRef}
      id="main-canvas"
      className="pointer-events-none overflow-hidden transition-opacity duration-300 ease-out fixed z-0 inset-0 w-full h-full"
      style={{
        opacity: bothLoaded ? 1 : 0,
      }}
    >
      {/* Left video */}
      <video
        ref={leftVideoRef}
        src={VIDEO_LEFT_URL}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setLeftLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'none' }}
      />

      {/* Right video */}
      <video
        ref={rightVideoRef}
        src={VIDEO_RIGHT_URL}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setRightLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
}
