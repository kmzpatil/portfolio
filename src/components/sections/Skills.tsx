'use client';

import { motion } from 'framer-motion';
import { skillGroups, achievements } from '@/lib/data';

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <p className="text-subheading mb-2">Capabilities &amp; Track Record</p>
          <h2 className="text-heading text-[var(--text-primary)]">
            Skills &amp; Achievements
          </h2>
        </motion.div>

        {/* Top: 4 Key Achievements / Competitive Ranks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="glow-card rounded-xl p-5 flex flex-col justify-between group cursor-default bg-white/[0.02]"
            >
              <h3 className="text-xs font-mono text-[var(--text-secondary)] mb-3">
                {ach.title}
              </h3>
              <div>
                <span className="text-mono-metric text-2xl sm:text-3xl font-bold text-[var(--text-primary)] block mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {ach.stat}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)] font-mono leading-tight block">
                  {ach.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom: 3 Core Technical Arsenal Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="glow-card rounded-xl p-6 flex flex-col justify-between bg-white/[0.02]"
            >
              <div>
                <h3 className="text-sm font-semibold font-mono text-[var(--text-primary)] mb-4 pb-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <span>{group.label}</span>
                  <span className="text-[10px] text-[var(--accent)] font-normal">0{i+1}</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {group.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.03] text-[var(--text-secondary)] border border-white/[0.06] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
