'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to telemetry if needed, avoiding leaking to client console in prod
  }, [error]);

  return (
    <main className="min-h-screen bg-[#05050A] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          SYSTEM FAULT // EXCEPTION
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Runtime Trap Intercepted
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            An unexpected instruction failure occurred in the execution thread. The state has been captured safely.
          </p>
        </div>

        <div className="p-3 bg-black/50 border border-white/[0.04] rounded-lg text-left text-xs text-[var(--text-secondary)] space-y-1">
          <div><span className="text-[var(--text-tertiary)]">STATUS:</span> THREAD_HALTED</div>
          <div><span className="text-[var(--text-tertiary)]">RECOVERY:</span> HOT_RELOAD_CONTAINER</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white"
          >
            Reset Thread
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-150 text-xs font-medium focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </main>
  );
}
