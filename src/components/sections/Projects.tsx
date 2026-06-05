'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/lib/data';

type Category = 'All' | 'Low-Latency & Quant' | 'AI & Distributed' | 'Systems & Compilers';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className="glow-card rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_4px_30px_rgba(59,130,246,0.08)] bg-white/[0.02]"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded border border-[var(--accent)]/20 font-semibold">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-mono tracking-widest text-[var(--text-tertiary)] uppercase">
              Production System
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono text-2xl sm:text-3xl font-bold gradient-text block leading-none tabular-nums">
              {project.metric}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider font-mono mt-1 block">
              {project.metricLabel}
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 leading-snug">
          {project.title}
        </h3>

        <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed mb-5">
          {project.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.split('·').map((t, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[var(--text-secondary)] border border-white/[0.06]"
            >
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      <div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden border-t border-[var(--border-subtle)] pt-4 mb-4"
            >
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] mb-3 font-semibold">
                Architecture & Implementation Details
              </h4>
              <ul className="space-y-2.5 mb-4 text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {project.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--accent)]/60">
                    {bullet}
                  </li>
                ))}
              </ul>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent)] hover:underline pt-1"
                >
                  <span>Inspect Source on GitHub</span>
                  <span>→</span>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-3 border-t border-[var(--border-subtle)]/60 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="text-xs font-mono tracking-wider text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 py-1"
          >
            <span>{isExpanded ? '[-]' : '[+]'}</span>
            <span>{isExpanded ? 'COLLAPSE SPECS' : 'VIEW TECHNICAL SPECS'}</span>
          </button>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'All') return true;
      if (activeCategory === 'Low-Latency & Quant') {
        return p.title.includes('Order Book') || p.title.includes('Quantitative') || p.title.includes('DeFi');
      }
      if (activeCategory === 'AI & Distributed') {
        return p.title.includes('Frammer') || p.title.includes('CDC') || p.title.includes('Chernobyl');
      }
      if (activeCategory === 'Systems & Compilers') {
        return p.title.includes('Autocomplete') || p.title.includes('Compiler') || p.title.includes('Order Book');
      }
      return true;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <section id="projects" className="min-h-screen relative pt-10 pb-32 sm:pt-14 sm:pb-36">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="section-container w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-subheading mb-2">Engineered Systems</p>
            <h2 className="text-heading text-[var(--text-primary)]">
              Selected Projects & Architecture
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--text-tertiary)] max-w-sm">
            Production-grade systems benchmarked for sub-microsecond latency, statistical edge, and fault-tolerant concurrency.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Low-Latency & Quant', 'AI & Distributed', 'Systems & Compilers'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--accent)] text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                    : 'bg-white/[0.03] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              aria-label="Filter projects by technology or title"
              placeholder="Search tech (C++, Python, AST...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3.5 py-1.5 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] focus:border-[var(--accent)]/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-tertiary)] hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[var(--border-subtle)] rounded-xl">
            <p className="font-mono text-sm text-[var(--text-secondary)] mb-2">No systems match your filter criteria.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="text-xs font-mono text-[var(--accent)] underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
