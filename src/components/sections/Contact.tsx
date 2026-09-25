'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { askKOSDaemon } from '@/lib/inference';

type Message = {
  id: string;
  sender: 'user' | 'system';
  text: string;
  isTyping?: boolean;
};

export default function Contact() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', text: 'CONNECTION ESTABLISHED. KARTIK_PATIL_SYS_TERMINAL v2.4.1\nType "help" to see available commands or just send a message.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput('');
    setIsProcessing(true);

    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), sender: 'user', text: userText }
    ];

    const lowerText = userText.toLowerCase().trim();

    // Fast local terminal commands
    if (lowerText === 'clear') {
      setMessages([]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'help') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `AVAILABLE TERMINAL COMMANDS:\n  • projects   - List core high-performance repositories\n  • stats      - Show real system benchmark telemetry\n  • ctf        - View Capture The Flag instructions & hints\n  • sudo root  - Attempt kernel privilege escalation\n  • clear      - Clear terminal screen\n  • Or type any custom question to chat with the AI assistant.`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'ctf' || lowerText === 'flag' || lowerText === 'flags') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `🚩 KARTIK PATIL CTF // CAPTURE THE FLAG PROTOCOL\n\nThere are 3 secret flags hidden across this portfolio:\n[1] PACKET CHASER: Catch the Golden Telemetry Packet in the Laboratory tab.\n[2] MEMORY DUMP: Inspect your browser developer console (F12) for the Base64 key.\n[3] KERNEL OVERRIDE: Run 'sudo root' right here in this terminal.\n\nSubmit captured flags in the Laboratory CTF Desk to unlock root status!`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'projects' || lowerText === 'repos' || lowerText === 'ls' || lowerText === 'ls projects') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `CORE SYSTEMS & PRODUCTION REPOSITORIES:\n\n[01] C++ ORDER BOOK MATCHING ENGINE\n     - Sub-microsecond deterministic L3 engine (-40% p99 latency)\n     - Lock-free SPSC queues, cache-aligned order book ladder\n     - Tech: C++20, POSIX Pthreads, Google Benchmark\n     - GitHub: https://github.com/kmzpatil/OrderBook-Engine\n\n[02] RECURSIVE KALMAN STAT-ARB ENGINE\n     - Nifty 50 cointegrated pairs trading with rolling Z-score\n     - 73.8% out-of-sample directional accuracy, zero lookahead\n     - Tech: Python, NumPy, Numba JIT, Statsmodels, FastAPI\n     - GitHub: https://github.com/kmzpatil/Pairtrading\n\n[03] RADIX TRIE WITH TOP-K NODE CACHING\n     - <1ms sub-millisecond lookup across 1.2M+ key dictionary\n     - Stress tested across 10M+ concurrent queries\n     - Tech: C++, STL, Custom Trie Allocator\n\n[04] DEFI ARBITRAGE BOT & DEX MONITOR\n     - Real-time Uniswap V3 cross-pool triangular arbitrage\n     - 95%+ net PnL accuracy accounting for dynamic gas & slippage\n     - Tech: Python, Web3.py, FastAPI, WebSockets\n     - GitHub: https://github.com/kmzpatil/DeFi-Arbitrage-Bot`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'whoami') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `kartik@hft-box (IIT Kharagpur ECE // Incoming SDE Intern @ Walmart Global Tech)`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'pwd') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `/home/kartik/portfolio-app/src/systems`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText.startsWith('uname')) {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `Linux hft-node-01 6.8.0-lowlatency #42-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText.startsWith('cat')) {
      if (lowerText.includes('flag') || lowerText.includes('shadow')) {
        setMessages(prev => [
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: 'system',
            text: `cat: Permission denied. Privilege escalation required. Try 'sudo root'.`
          }
        ]);
      } else {
        setMessages(prev => [
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: 'system',
            text: `// Kartik Patil Portfolio v2.4 (Production Ready)\n// Specialization: Low-Latency C++20 Systems, Quantitative Finance & Distributed Networks.`
          }
        ]);
      }
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'top' || lowerText === 'htop') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `PID  USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n  1  root      20   0   12.4M   4.1M   2.8M S   0.0   0.0   0:01.12 init\n402  kartik   -51   0  512.0M  98.4M  32.0M R  99.8   1.2   4:21.08 orderbook_engine\n405  kartik    20   0  256.0M  64.2M  24.1M S   2.4   0.8   1:12.44 kalman_stat_arb\n410  kartik    20   0  128.0M  32.1M  16.0M S   0.8   0.4   0:45.19 defi_arb_monitor`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'history') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `1  git clone https://github.com/kmzpatil/OrderBook-Engine.git\n2  cmake -B build -DCMAKE_BUILD_TYPE=Release\n3  cmake --build build -j8 && ./build/benchmarks\n4  python3 -m stat_arb.kalman_filter --backtest\n5  ctf\n6  sudo root`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText.startsWith('sudo') || lowerText === 'root' || lowerText === 'su' || lowerText === 'bypass') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `ACCESS GRANTED // PRIVILEGE LEVEL: ROOT_OPERATOR\n\n🚩 FLAG #3 CAPTURED:\nFLAG{k4rt1k_k4lm4n_f1lt3r_c1rcu1t_br34k}\n\nPaste this flag into the CTF Flag Submission Desk in the Laboratory section!`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerText === 'stats' || lowerText === 'metrics') {
      setMessages(prev => [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: `KARTIK_PATIL TELEMETRY METRICS:\n  • Order Book Matching Engine: -40% p99 Latency Reduction (sub-microsecond)\n  • Quant Trading Ensemble: 73.8% Out-of-Sample Accuracy (Kalman + Ridge)\n  • Radix Autocomplete Engine: <1ms for 1.2M+ Dictionary\n  • DeFi Arbitrage Bot: 95%+ Net PnL Accuracy on Uniswap V3\n  • Codeforces Max Rating: 1620 (Expert) [Handle: kresol]\n  • IMC Prosperity 4: Global Rank 529, Country Rank 81`
        }
      ]);
      setIsProcessing(false);
      return;
    }

    const typingId = (Date.now() + 1).toString();
    setMessages([...newMessages, { id: typingId, sender: 'system', text: '...', isTyping: true }]);

    try {
      const reply = await askKOSDaemon(userText);
      setMessages(prev => prev.map(m => 
        m.id === typingId 
          ? { ...m, text: reply || 'System ready. No output returned.', isTyping: false }
          : m
      ));
    } catch {
      setMessages(prev => prev.map(m => 
        m.id === typingId 
          ? { ...m, text: `[K-OS RECOVERY]: Telemetry socket active. You can reach Kartik directly at kmzpatil@gmail.com or explore available commands via 'help'.`, isTyping: false }
          : m
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20 pb-32">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8 max-w-2xl mx-auto"
        >
          <p className="text-subheading mb-2">Direct Interface</p>
          <h2 className="text-heading text-[var(--text-primary)]">
            Command Center <span className="gradient-text">&amp; Connect</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-3 font-mono">
            Execute terminal commands or consult the K-OS AI daemon directly.
          </p>
        </motion.div>

        {/* Expanded Width Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-4xl mx-auto mb-8"
        >
          <div className="glow-card rounded-xl overflow-hidden flex flex-col h-[490px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.08]">
            {/* Terminal Window Bar */}
            <div className="bg-[#111] px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-[var(--text-tertiary)] font-mono tracking-wider">
                  guest@kartik-hft-kernel:~
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-tertiary)]">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="hidden sm:inline">RTT: 14ms</span>
              </div>
            </div>
            
            {/* Terminal Scroll Stream */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 font-mono text-[13px] sm:text-sm space-y-4 bg-[#0a0a0a] scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded px-3.5 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-[var(--accent)]/15 text-[var(--text-primary)] border border-[var(--accent)]/30' 
                      : 'text-[var(--text-secondary)] leading-relaxed'
                  }`}>
                    {msg.sender === 'system' && !msg.isTyping && <span className="text-[var(--accent)] mr-2">{'>'}</span>}
                    {msg.isTyping ? (
                      <span className="inline-block animate-pulse">_</span>
                    ) : (
                      <div className="space-y-1.5">
                        {msg.text.split('\n').map((line, lIdx) => {
                          if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                          if (line.startsWith('•') || line.startsWith('- ') || line.startsWith('* ')) {
                            return (
                              <div key={lIdx} className="flex items-start gap-2 pl-2">
                                <span className="text-[var(--accent)] select-none">›</span>
                                <span>{line.replace(/^[•\-*]\s*/, '')}</span>
                              </div>
                            );
                          }
                          if (line.startsWith('//')) {
                            return <div key={lIdx} className="text-[var(--text-tertiary)] italic">{line}</div>;
                          }
                          return <div key={lIdx}>{line}</div>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-subtle)] bg-[#111] flex items-center">
              <span className="text-[var(--accent)] font-mono mr-3 pl-2 font-bold">{'$'}</span>
              <input
                type="text"
                aria-label="Terminal command or question for AI agent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                placeholder="Ask about my systems, quant models, or stack..."
                className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-sm placeholder-[var(--text-tertiary)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded px-2 py-1"
              />
            </form>
          </div>
        </motion.div>

        {/* Quick Connect Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono text-[var(--text-secondary)]"
        >
          <a
            href="mailto:kmzpatil@gmail.com"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            kmzpatil@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/kmzpatil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" stroke="none" fill="currentColor" /></svg>
            linkedin.com/in/kmzpatil
          </a>
          <a
            href="https://github.com/kmzpatil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:text-white transition-all duration-200"
          >
            <span className="text-[var(--accent)]">#</span>
            github.com/kmzpatil
          </a>
          <a
            href="https://codeforces.com/profile/kresol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:text-white transition-all duration-200"
          >
            <span className="text-[var(--accent)]">CF:</span>
            kresol (1620)
          </a>
        </motion.div>

      </div>
    </section>
  );
}
