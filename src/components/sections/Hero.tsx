'use client';

import { motion } from 'framer-motion';
import Magnetic from '@/components/ui/Magnetic';

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="section-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Identity & Impact */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Academic & Professional Telemetry Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] w-fit mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-[var(--text-secondary)] tracking-wider uppercase">
                IIT Kharagpur ECE · Incoming SDE @ Walmart Global Tech
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.05] mb-4"
            >
              Kartik Patil<span className="text-[var(--accent)]">.</span>
            </motion.h1>

            {/* Role / Focus */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg sm:text-2xl font-semibold text-[var(--text-secondary)] mb-6 leading-snug"
            >
              High-performance systems engineer &amp; quantitative software developer.
            </motion.p>

            {/* Verified Mission & Technical Capabilities */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-sm sm:text-base text-[var(--text-tertiary)] max-w-xl leading-relaxed mb-8"
            >
              Specializing in sub-microsecond C++ order matching engines, automated statistical arbitrage with recursive Kalman filters, and distributed high-throughput analytics. Max rating of 1620 (Expert) on Codeforces and Global Rank 529 in IMC Prosperity 4.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Magnetic>
                <button
                  onClick={() => scrollTo('playground')}
                  className="px-6 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-mono text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_25px_rgba(59,130,246,0.35)] active:scale-[0.98]"
                >
                  Launch Live Playground →
                </button>
              </Magnetic>

              <Magnetic>
                <button
                  onClick={() => scrollTo('projects')}
                  className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-primary)] border border-white/[0.1] font-mono text-xs sm:text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
                >
                  View Systems &amp; Code
                </button>
              </Magnetic>

              <div className="flex items-center gap-4 pl-2 sm:pl-4 border-l border-white/[0.08]">
                <a
                  href="https://github.com/kmzpatil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://linkedin.com/in/kmzpatil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                >
                  LinkedIn ↗
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Density Technical Telemetry Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-5"
          >
            <div className="surface-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] bg-[#090A10]/80 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] tracking-wider uppercase">
                    SYS_NODE_KPATIL // L3
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  ONLINE · 0.42ms
                </span>
              </div>

              {/* Core Benchmarks Grid */}
              <div className="space-y-4 font-mono">
                
                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[var(--accent)]/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">Matching Engine</span>
                    <span className="text-xs text-emerald-400 font-bold">-40% p99</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Sub-Microsecond Order Serializer
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Thread-safe single-consumer queue · C++ std::map L2/L3
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[var(--accent)]/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">Quant Stat-Arb</span>
                    <span className="text-xs text-[var(--accent)] font-bold">73.8% OOS</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Nifty 50 Recursive Kalman Engine
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Dynamic Z-score estimation · Zero lookahead bias
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[var(--accent)]/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">Core Algorithms</span>
                    <span className="text-xs text-purple-400 font-bold">&lt;1ms Query</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Radix Trie with Top-K Node Caching
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                    1.2M+ key dictionary · 10M+ stress tested lookups
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[var(--accent)]/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">Global Standing</span>
                    <span className="text-xs text-amber-400 font-bold">Rank 529</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    IMC Prosperity 4 &amp; Codeforces Expert
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                    1620 Max Rating (kresol) · AMS Derive Rank 198
                  </div>
                </div>

              </div>

              {/* Terminal Quick Jump */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-tertiary)]">Architecture Telemetry</span>
                <button
                  onClick={() => scrollTo('playground')}
                  className="text-[var(--accent)] hover:underline font-semibold"
                >
                  Enter Interactive Lab →
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
