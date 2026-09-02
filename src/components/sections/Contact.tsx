'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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

    if (lowerText === 'sudo' || lowerText === 'sudo root' || lowerText === 'bypass') {
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

    if (lowerText === 'stats') {
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
      const res = await fetch('/api/chat', { signal: AbortSignal.timeout(12000),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: userText }] 
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      
      setMessages(prev => prev.map(m => 
        m.id === typingId 
          ? { ...m, text: reply || 'System ready. No output returned.', isTyping: false }
          : m
      ));
    } catch (error: any) {
      setMessages(prev => prev.map(m => 
        m.id === typingId 
          ? { ...m, text: `ERR_AGENT_OFFLINE: ${error?.message || 'Connection timed out'}. You can email me directly at kmzpatil@gmail.com`, isTyping: false }
          : m
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center relative py-16 sm:py-20 pb-32">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-subheading mb-5">Contact</p>
            <h2 className="text-heading text-[var(--text-primary)] mb-8">
              Open to new <span className="gradient-text">opportunities</span>.
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-10 max-w-md">
              Whether you have a question, a project idea, or just want to discuss 
              high-performance engineering and quantitative systems, I&apos;m always open to connect.
            </p>
            
            <div className="space-y-6">
              <a href="mailto:kmzpatil@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                  <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <span className="block text-sm text-[var(--text-tertiary)] mb-1 uppercase tracking-widest">Email</span>
                  <span className="text-[15px] text-[var(--text-primary)] font-mono">kmzpatil@gmail.com</span>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/kmzpatil" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                  <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" stroke="none" fill="currentColor" /></svg>
                </div>
                <div>
                  <span className="block text-sm text-[var(--text-tertiary)] mb-1 uppercase tracking-widest">LinkedIn</span>
                  <span className="text-[15px] text-[var(--text-primary)] font-mono">/in/kmzpatil</span>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="glow-card rounded-xl overflow-hidden flex flex-col h-[450px]">
              <div className="bg-[#111] px-4 py-3 border-b border-[var(--border-subtle)] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-[var(--text-tertiary)] font-mono tracking-wider">guest@kartik-sys:~</span>
              </div>
              
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 font-mono text-[13px] sm:text-sm space-y-4 bg-[#0a0a0a] scroll-smooth">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded px-3 py-2 ${
                      msg.sender === 'user' 
                        ? 'bg-[var(--accent)]/10 text-[var(--text-primary)] border border-[var(--accent)]/20' 
                        : 'text-[var(--text-secondary)] whitespace-pre-wrap'
                    }`}>
                      {msg.sender === 'system' && !msg.isTyping && <span className="text-[var(--accent)] mr-2">{'>'}</span>}
                      {msg.isTyping ? (
                        <span className="inline-block animate-pulse">_</span>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-subtle)] bg-[#111] flex items-center">
                <span className="text-[var(--accent)] font-mono mr-3 pl-2">{'$'}</span>
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
          
        </div>
      </div>
    </section>
  );
}
