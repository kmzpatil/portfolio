'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#05050A] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          HTTP 404 // NOT_FOUND
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Memory Pointer Null
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            The requested sector address does not exist or has been deallocated from the routing table.
          </p>
        </div>

        <div className="p-3 bg-black/50 border border-white/[0.04] rounded-lg text-left text-xs text-[var(--text-secondary)] space-y-1">
          <div><span className="text-[var(--text-tertiary)]">ERR_SIG:</span> 0x00000194_SECTOR_FAULT</div>
          <div><span className="text-[var(--text-tertiary)]">ACTION:</span> RE_ROUTE_PRIMARY_GATEWAY</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white"
          >
            Return to Base
          </Link>
          <Link
            href="/#contact"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-150 text-xs font-medium focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Launch Terminal
          </Link>
        </div>
      </div>
    </main>
  );
}
