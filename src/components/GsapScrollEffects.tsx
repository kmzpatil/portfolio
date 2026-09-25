'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GsapScrollEffects() {
  const [velocity, setVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSector, setActiveSector] = useState('HERO');
  const [isWarp, setIsWarp] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Velocity-driven 3D Card Skew
    const cards = gsap.utils.toArray<HTMLElement>('.glow-card, .stat-card');
    
    // Set transform origin for natural tilt
    cards.forEach((card) => {
      gsap.set(card, { transformOrigin: 'center center', force3D: true });
    });

    let skewSetter = gsap.quickSetter(cards, 'skewY', 'deg');
    let clamp = gsap.utils.clamp(-4.5, 4.5);

    const mainTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = self.getVelocity();
        const clampedSkew = clamp(vel / -350);
        skewSetter(clampedSkew);
        
        const absVel = Math.abs(Math.round(vel));
        setVelocity(absVel);
        setScrollProgress(Math.round(self.progress * 100));
        setIsWarp(absVel > 1200);

        // Reset skew with spring tension
        gsap.to(cards, {
          skewY: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      },
    });

    // 2. Laser Line Scrub on Section Dividers
    const dividers = document.querySelectorAll<HTMLElement>('.section-divider');
    const laserTriggers: ScrollTrigger[] = [];

    dividers.forEach((div) => {
      // Ensure relative positioning
      div.style.position = 'relative';
      div.style.overflow = 'hidden';

      // Create laser bead element if not already present
      let laser = div.querySelector('.gsap-laser-head') as HTMLElement;
      if (!laser) {
        laser = document.createElement('div');
        laser.className = 'gsap-laser-head absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent pointer-events-none';
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
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(laser, { left: `${self.progress * 110 - 5}%` });
          },
        });
        laserTriggers.push(trigger);
      }
    });

    // 3. Section Sector Detection for Telemetry HUD
    const sections = ['hero', 'about', 'experience', 'projects', 'playground', 'skills', 'contact'];
    const sectionTriggers: ScrollTrigger[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const trig = ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSector(id.toUpperCase()),
          onEnterBack: () => setActiveSector(id.toUpperCase()),
        });
        sectionTriggers.push(trig);
      }
    });

    return () => {
      mainTrigger.kill();
      laserTriggers.forEach((t) => t.kill());
      sectionTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={hudRef}
      className="fixed bottom-5 left-5 z-40 select-none hidden md:block"
    >
      <div className="bg-[#0A0A0F]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden transition-all duration-300">
        {/* HUD Top Bar */}
        <div className="px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isWarp ? 'bg-amber-400 animate-ping' : 'bg-blue-500 animate-pulse'}`} />
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

        {/* HUD Expanded Metrics */}
        {!isCollapsed && (
          <div className="p-3 font-mono text-[11px] space-y-2 min-w-[210px]">
            {/* Velocity Readout */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-tertiary)]">SCROLL VELOCITY</span>
              <span className={`font-bold ${isWarp ? 'text-amber-400' : 'text-[var(--accent)]'}`}>
                {velocity} <span className="text-[9px] font-normal text-[var(--text-tertiary)]">px/s</span>
              </span>
            </div>

            {/* Velocity Micro-Bar */}
            <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  isWarp ? 'bg-gradient-to-r from-blue-500 to-amber-400' : 'bg-[var(--accent)]'
                }`}
                style={{ width: `${Math.min((velocity / 1500) * 100, 100)}%` }}
              />
            </div>

            {/* Scroll Depth & Memory Buffer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-[var(--text-tertiary)]">DEPTH</span>
              <span className="text-[var(--text-primary)] font-medium">{scrollProgress}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-tertiary)]">SYS_STATE</span>
              <span className={`text-[10px] ${isWarp ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                {isWarp ? 'WARP_SCRUB' : 'SYNC_OK'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
