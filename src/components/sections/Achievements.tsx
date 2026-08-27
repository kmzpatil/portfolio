'use client';

import { motion } from 'framer-motion';
import { achievements } from '@/lib/data';

export default function Achievements() {
  return (
    <section id="achievements" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-subheading mb-3">Achievements</p>
          <h2 className="text-heading text-[var(--text-primary)] mb-10">
            Competitive programming & hackathons
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="glow-card rounded-xl p-6 md:p-8 flex flex-col justify-between group cursor-default"
            >
              <h3 className="text-[15px] font-medium text-[var(--text-secondary)] mb-8">
                {ach.title}
              </h3>
              <div>
                <span className="text-mono-metric text-4xl text-[var(--text-primary)] block mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {ach.stat}
                </span>
                <span className="text-sm text-[var(--text-tertiary)] leading-tight block">
                  {ach.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
