'use client';

import { motion } from 'framer-motion';
import { skillGroups } from '@/lib/data';

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-subheading mb-3">Skills</p>
          <h2 className="text-heading text-[var(--text-primary)] mb-10">
            Technical arsenal
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {skillGroups.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="glow-card rounded-xl p-6 md:p-8 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 pb-4 border-b border-[var(--border-subtle)]">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2.5 mt-auto">
                {group.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="text-sm px-3 py-1.5 rounded bg-white/[0.03] text-[var(--text-secondary)] border border-white/[0.05] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 transition-colors cursor-default"
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
