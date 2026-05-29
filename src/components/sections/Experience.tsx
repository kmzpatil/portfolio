'use client';

import { motion } from 'framer-motion';
import { experience } from '@/lib/data';

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-subheading mb-3">Experience</p>
          <h2 className="text-heading text-[var(--text-primary)] mb-10">
            Where I&apos;ve worked & built systems
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--border-subtle)] to-transparent" aria-hidden="true" />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 + (i % 3) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative pl-14 md:pl-20"
              >
                {/* Dot with glow */}
                <div className="absolute left-4 md:left-6 top-6 -translate-x-1/2" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]" />
                </div>

                <div className="glow-card rounded-xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                        {exp.company}
                      </h3>
                      <p className="text-[15px] text-[var(--text-secondary)]">{exp.role}</p>
                    </div>
                    <span className="text-mono-metric text-xs text-[var(--text-tertiary)] bg-white/[0.03] px-3 py-1.5 rounded-md shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-[15px] text-[var(--text-secondary)] leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-[var(--accent)]/40">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
