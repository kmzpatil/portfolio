'use client';

import { useEffect } from 'react';

export default function CtfConsoleEasterEgg() {
  useEffect(() => {
    // Only run in client browser
    if (typeof window === 'undefined') return;

    const printBanner = typeof window !== 'undefined' ? (window.console?.info || window.console?.log) : null;
    if (!printBanner) return;

    printBanner.call(
      window.console,
      '%c⚡ KARTIK PATIL // HIGH-PERFORMANCE SYSTEMS LAB ⚡',
      'color: #3B82F6; font-size: 16px; font-weight: bold; background: #05050A; padding: 6px 12px; border-radius: 4px; border: 1px solid #1E40AF;'
    );

    printBanner.call(
      window.console,
      '%cWelcome, fellow engineer! Looking for flags? 🚩\n' +
      'CTF CHALLENGE #2 (Memory Reverse Engineering):\n' +
      'Decode this Base64 payload to retrieve the kernel flag:\n' +
      '%cRkxBR3tyNGQxeF90cjFlX3N1Yl9taWxsaXNlY29uZF9sb29rdXB9\n' +
      '%cSubmit your captured flags in the Interactive Laboratory under the "CTF & Packet Chaser" tab!',
      'color: #94A3B8; font-size: 12px;',
      'color: #10B981; font-weight: bold; font-family: monospace; font-size: 13px; background: rgba(16, 185, 129, 0.1); padding: 2px 6px;',
      'color: #38BDF8; font-size: 11px; font-style: italic;'
    );
  }, []);

  return null;
}
