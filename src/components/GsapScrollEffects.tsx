'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GsapScrollEffects() {
  const [activeSector, setActiveSector] = useState('HERO');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Direct DOM refs to avoid any React re-render overhead during high-speed scroll
  const velValRef = useRef<HTMLSpanElement>(null);
  const velBarRef = useRef<HTMLDivElement>(null);
  const depthValRef = useRef<HTMLSpanElement>(null);
  const statusValRef = useRef<HTMLSpanElement>(null);
  const warpPulseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let scrollEndTimer: NodeJS.Timeout | null = null;
    let isCurrentlyWarp = false;

    // High performance ScrollTrigger for telemetry HUD and laser scrubs
    const mainTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = self.getVelocity();
        const absVel = Math.abs(Math.round(vel));
        const progress = Math.round(self.progress * 100);

        // Update HUD DOM directly without React re-render lag
        if (velValRef.current) {
          velValRef.current.innerText = `${absVel} `;
        }
        if (velBarRef.current) {
          const barWidth = Math.min((absVel / 1500) * 100, 100);
          velBarRef.current.style.width = `${barWidth}%`;
        }
        if (depthValRef.current) {
          depthValRef.current.innerText = `${progress}%`;
        }

        const isWarp = absVel > 1200;
        if (isWarp !== isCurrentlyWarp) {
          isCurrentlyWarp = isWarp;
          if (statusValRef.current) {
            statusValRef.current.innerText = isWarp ? 'WARP_SCRUB' : 'SYNC_OK';
            statusValRef.current.className = `text-[10px] ${isWarp ? 'text-amber-400 font-bold' : 'text-emerald-400'}`;
          }
          if (warpPulseRef.current) {
            warpPulseRef.current.className = `w-2 h-2 rounded-full ${isWarp ? 'bg-amber-400 animate-ping' : 'bg-blue-500 animate-pulse'}`;
          }
        }

        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
          if (velValRef.current) velValRef.current.innerText = '0 ';
          if (velBarRef.current) velBarRef.current.style.width = '0%';
          if (statusValRef.current) {
            statusValRef.current.innerText = 'SYNC_OK';
            statusValRef.current.className = 'text-[10px] text-emerald-400';
          }
          if (warpPulseRef.current) {
            warpPulseRef.current.className = 'w-2 h-2 rounded-full bg-blue-500 animate-pulse';
          }
          isCurrentlyWarp = false;
        }, 120);
      },
    });

    // Laser Line Scrub on Section Dividers
    const dividers = document.querySelectorAll<HTMLElement>('.section-divider');
    const laserTriggers: ScrollTrigger[] = [];

    dividers.forEach((div) => {
      div.style.position = 'relative';
      div.style.overflow = 'hidden';

      let laser = div.querySelector('.gsap-laser-head') as HTMLElement;
      if (!laser) {
        laser = document.createElement('div');
        laser.className = 'gsap-laser-head absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent pointer-events-none';
        laser.style.boxShadow = '0 0 16px rgba(37, 99, 235, 0.9), 0 0 30px rgba(59, 130, 246, 0.6)';
        laser.style.left = '-10%';
        div.appendChild(laser);
      }

      const parentSection = div.closest('section');
      if (parentSection) {
        const trigger = ScrollTrigger.create({
          trigger: parentSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.3,
          onUpdate: (self) => {
            laser.style.transform = `translateX(${self.progress * 115 - 10}%)`;
          },
        });
        laserTriggers.push(trigger);
      }
    });

    // Section Sector Detection
    const sections = ['hero', 'about', 'experience', 'projects', 'playground', 'skills', 'contact'];
    const sectionTriggers: ScrollTrigger[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const trig = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveSector(id.toUpperCase()),
          onEnterBack: () => setActiveSector(id.toUpperCase()),
        });
        sectionTriggers.push(trig);
      }
    });

    return () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      mainTrigger.kill();
      laserTriggers.forEach((t) => t.kill());
      sectionTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none hidden md:block">
      <div className="bg-[#0A0A0F]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden transition-all duration-300">
        {/* HUD Top Bar */}
        <div className="px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span ref={warpPulseRef} className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] font-semibold">
              K-TELEMETRY // {activeSector}
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[10px] font-mono text-[var(--text-tertiary)] hover:text-white px-1 transition-colors"
            title="Toggle telemetry HUD"
            aria-label="Toggle telemetry HUD"
          >
            {isCollapsed ? '[+]' : '[-]'}
          </button>
        </div>

        {/* HUD Metrics (Direct DOM bindings for 120 FPS performance) */}
        {!isCollapsed && (
          <div className="p-3 font-mono text-[11px] space-y-2 min-w-[210px]">
            {/* Velocity Readout */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-tertiary)]">SCROLL VELOCITY</span>
              <span className="font-bold text-[var(--accent)]">
                <span ref={velValRef}>0 </span>
                <span className="text-[9px] font-normal text-[var(--text-tertiary)]">px/s</span>
              </span>
            </div>

            {/* Velocity Micro-Bar */}
            <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                ref={velBarRef}
                className="h-full bg-[var(--accent)] transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>

            {/* Scroll Depth */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-[var(--text-tertiary)]">DEPTH</span>
              <span ref={depthValRef} className="text-[var(--text-primary)] font-medium">0%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-tertiary)]">SYS_STATE</span>
              <span ref={statusValRef} className="text-[10px] text-emerald-400">
                SYNC_OK
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
