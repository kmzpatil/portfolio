'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'playground', label: 'Laboratory' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionScroller() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSnapEnabled, setIsSnapEnabled] = useState(true);
  const isTransitioningRef = useRef(false);
  const touchStartY = useRef(0);

  // Determine current active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (isAtBottom) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id);
        return;
      }

      const checkPoint = window.innerHeight * 0.4;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= checkPoint && rect.bottom > checkPoint) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSectionIndex = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    const targetSection = SECTIONS[index];
    const el = document.getElementById(targetSection.id);
    if (!el) return;

    isTransitioningRef.current = true;
    setActiveSection(targetSection.id);

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 750);
  }, []);

  // One-stroke wheel listener with section boundary awareness
  useEffect(() => {
    if (!isSnapEnabled) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if user is scrolling inside an internal scrollable container
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (
          target.classList.contains('overflow-y-auto') ||
          target.classList.contains('overflow-auto') ||
          target.getAttribute('data-no-snap') === 'true'
        ) {
          // If the element has scrollable room in this direction, let it scroll naturally
          const hasScrollRoomDown = target.scrollHeight > target.clientHeight && target.scrollTop + target.clientHeight < target.scrollHeight - 4;
          const hasScrollRoomUp = target.scrollTop > 4;

          if ((e.deltaY > 0 && hasScrollRoomDown) || (e.deltaY < 0 && hasScrollRoomUp)) {
            return; // Don't snap, let inner container scroll!
          }
        }
        target = target.parentElement;
      }

      // Ignore micro-jitter
      if (Math.abs(e.deltaY) < 18) return;

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
      if (currentIndex === -1) return;

      const currentEl = document.getElementById(activeSection);
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      const isDown = e.deltaY > 0;

      if (isDown) {
        // User is scrolling DOWN
        // If the current section still has content below the fold, let the user browse it!
        const remainingBelow = rect.bottom - window.innerHeight;
        if (remainingBelow > 30) {
          return; // Allow natural browsing through the section
        }

        // Section boundary reached: snap to next section
        if (currentIndex < SECTIONS.length - 1) {
          e.preventDefault();
          scrollToSectionIndex(currentIndex + 1);
        }
      } else {
        // User is scrolling UP
        // If the user has scrolled down into this section, let them browse back up
        const scrollAbove = -rect.top;
        if (scrollAbove > 30) {
          return; // Allow natural browsing back up through the section
        }

        // Section top reached: snap to previous section
        if (currentIndex > 0) {
          e.preventDefault();
          scrollToSectionIndex(currentIndex - 1);
        }
      }
    };

    // Keyboard navigation (PageUp / PageDown / Arrows)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
      if (currentIndex === -1) return;

      const currentEl = document.getElementById(activeSection);
      if (!currentEl) return;
      const rect = currentEl.getBoundingClientRect();

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const remainingBelow = rect.bottom - window.innerHeight;
        if (remainingBelow > 30) return;

        if (currentIndex < SECTIONS.length - 1) {
          e.preventDefault();
          scrollToSectionIndex(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const scrollAbove = -rect.top;
        if (scrollAbove > 30) return;

        if (currentIndex > 0) {
          e.preventDefault();
          scrollToSectionIndex(currentIndex - 1);
        }
      }
    };

    // Touch swipe support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY.current - touchEndY;

      if (Math.abs(diffY) > 50 && !isTransitioningRef.current) {
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
        if (currentIndex === -1) return;

        const currentEl = document.getElementById(activeSection);
        if (!currentEl) return;
        const rect = currentEl.getBoundingClientRect();

        if (diffY > 0) {
          const remainingBelow = rect.bottom - window.innerHeight;
          if (remainingBelow > 40) return;

          if (currentIndex < SECTIONS.length - 1) {
            scrollToSectionIndex(currentIndex + 1);
          }
        } else if (diffY < 0) {
          const scrollAbove = -rect.top;
          if (scrollAbove > 40) return;

          if (currentIndex > 0) {
            scrollToSectionIndex(currentIndex - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, isSnapEnabled, scrollToSectionIndex]);

  return (
    <>
      {/* Floating Right-Side Section Rail (GSAP / Apple style) */}
      <nav
        aria-label="Section navigation"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 p-2 rounded-full bg-[#05050A]/70 backdrop-blur-md border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSectionIndex(idx)}
              aria-label={`Jump to ${sec.label} section`}
              className="relative group p-1 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-full"
            >
              {/* Dot */}
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 bg-[var(--accent)] shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                    : 'w-2 h-2 bg-white/30 group-hover:bg-white/70 group-hover:scale-125'
                }`}
              />

              {/* Tooltip on Hover */}
              <span className="absolute right-8 px-2.5 py-1 rounded bg-[#111] text-[11px] font-mono text-[var(--text-primary)] border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                {sec.label}
              </span>
            </button>
          );
        })}

        {/* Snap Toggle Switch */}
        <div className="pt-2 border-t border-white/[0.08] flex flex-col items-center">
          <button
            onClick={() => setIsSnapEnabled(!isSnapEnabled)}
            aria-label={`Toggle section snap scroll (Currently ${isSnapEnabled ? 'enabled' : 'disabled'})`}
            className="group relative p-1 text-[9px] font-mono text-[var(--text-tertiary)] hover:text-white"
            title={isSnapEnabled ? 'Section Snap: ON (One stroke = next section)' : 'Free Scroll: ON'}
          >
            <span className={`text-[10px] block ${isSnapEnabled ? 'text-[var(--accent)]' : 'text-neutral-500'}`}>
              {isSnapEnabled ? '⤓' : '↕'}
            </span>
            <span className="absolute right-8 px-2 py-0.5 rounded bg-[#111] text-[10px] font-mono text-[var(--text-secondary)] border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isSnapEnabled ? 'One-Stroke Snap: ON' : 'Free Scroll: ON'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
