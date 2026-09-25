'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: "IIT KGP", label: "B.Tech ECE (Hons.) '28" },
  { value: "1620", label: "Codeforces Expert" },
  { value: "529", label: "IMC Prosperity Global" },
  { value: "Gold", label: "Data Analytics GC (IIT KGP)" },
];

export default function About() {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Text — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-3"
          >
            <p className="text-subheading mb-5">About</p>
            <h2 className="text-heading text-[var(--text-primary)] mb-8">
              Engineering at the intersection of{' '}
              <span className="gradient-text">systems performance</span>{' '}
              and financial markets
            </h2>
            <div className="space-y-5 text-body">
              <p>
                I&apos;m an Electronics and Communication Engineering student
                at IIT Kharagpur with a deep focus on building high-performance
                software systems — from sub-microsecond C++ matching engines to
                ML-driven quantitative trading frameworks.
              </p>
              <p>
                My work spans low-latency infrastructure, full-stack platform
                architecture, and applied machine learning. I care about systems
                that are correct, fast, and robust under production pressure.
              </p>
            </div>
          </motion.div>

          {/* Stats — takes 2 cols */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="stat-card rounded-xl p-5"
              >
                <span className="text-mono-metric text-2xl md:text-3xl text-[var(--text-primary)] block mb-2 leading-none">
                  {s.value}
                </span>
                <span className="text-[13px] text-[var(--text-secondary)] leading-snug">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
