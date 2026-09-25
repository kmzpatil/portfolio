// K-OS AI Terminal Daemon
// Secrets are never stored in code or repository.
// In backend environments, queries route through /api/chat using server-side secrets.
// On static hosts (e.g. GitHub Pages), queries route through the high-performance local K-OS engine.

const RESUME_CONTEXT = `KARTIK MAHENDRA PATIL
High-Performance Systems Engineer | Quantitative Developer | Full-Stack Architect
Indian Institute of Technology (IIT) Kharagpur | Roll: 24EC10046
Phone: +91-9421585148 | Email: kmzpatil@gmail.com | LinkedIn: /in/kmzpatil | GitHub: kmzpatil | Codeforces: kresol

ACADEMIC EXCELLENCE
• Indian Institute of Technology (IIT) Kharagpur (2024 – 2028): B.Tech. (Hons.) in Electronics and Electrical Communication Engineering (ECE)
• JEE Main 2024: Top 0.46% nationwide among 1.2 million candidates.
• JEE Advanced 2024: Top 1.81% among 200,000+ qualified aspirants.
• Matoshri Junior College, Nashik: Higher Secondary Certificate (80%).
• Nashik Cambridge School: Secondary School Certificate (94%).

PROFESSIONAL EXPERIENCE & LEADERSHIP
1. Walmart Global Tech (May 2027 – Jul 2027) - Incoming Software Engineering Intern (SDE)
2. Bhavya Haulage Services FZCO (Mar 2025 – May 2025) - Software Developer Intern
   - Scalable backend services with MFA, JWT, and RBAC for logistics & investment platform.
   - Real-time financial telemetry dashboards with sub-second WebSocket updates.
3. Communiqué, Technology Students' Gymkhana, IIT Kharagpur:
   - Governor (Apr 2026 – Present): Directed digital infrastructure and outreach drives for 500+ candidates.
   - Secretariat Member for World Bank Committee at Global Model United Nations (GMUN 2026).

COMPETITIONS & GLOBAL RANKINGS
• Codeforces: Max Rating 1620 (Expert) [Handle: kresol].
• IMC Prosperity 4: Global Rank 529 and Country Rank 81 worldwide out of thousands of quantitative trading teams.
• AMS Derive 2026: Placed Rank 198 out of 2,500+ participants globally in the PRIOR Round (Jane Street & QRT).
• Goldman Sachs India Hackathon 2026: Secured Rank 447 in Quant track, Rank 584 in CS track.
• IICPC CodeFest 2026 Global: Secured Rank 1254 in the Prelims Round among 13,000+ competitive coders worldwide.
• AtCoder: Peak algorithm rating 1108 (5 Kyu, Top 9.84% globally).
• Inter-Hall General Championship (IIT Kharagpur): Rank 1 (Gold Medal) in Data Analytics.

FLAGSHIP SYSTEMS & PROJECTS
1. Multithreaded Order Book Matching Engine (C++23, CMake, Google Benchmark, Atomics, Mutex, POSIX Pthreads)
   - L3 matching engine processing concurrent orders via thread-safe single-consumer queue.
   - Strict price-time priority matching using std::map with std::greater for bids.
   - Sub-microsecond processing, -40% p99 latency reduction verified via Google Benchmark profiling.
2. Quantitative Trading Framework for Nifty 50 Equities (Python, Kalman Filter, XGBoost, Statsmodels, Zerodha Kite API)
   - Automated pairs trading framework combining walk-forward ML ensembles (XGBoost, Ridge) achieving 73.8% out-of-sample directional accuracy.
   - Dynamic spread and rolling Z-score estimation using Recursive Kalman Filtering.
3. Real-Time Autocomplete Engine (C++, Radix Trie, Top-K Node Caching)
   - Top-k suggestion engine across 1.2M+ key dictionary with sub-millisecond (<1ms) lookup latency.
4. Mini-Compiler & Stack Virtual Machine (C++, Lexer/Parser, ASTs)
   - Compiles source code into bytecode for custom stack VM at 10,000+ lines/sec.
5. DeFi Arbitrage Bot & DEX Monitor (Python, Web3.py, FastAPI, WebSockets)
   - Real-time Uniswap V3 monitor detecting triangular arbitrage with Bellman-Ford negative cycle detection across 100+ node token graphs (95%+ net PnL accuracy).
6. CDC Companion - Automated CV Review & Allocation Platform (Next.js, TypeScript, Express, PostgreSQL, Prisma ORM)
7. Frammer - Unified AI Analytics Platform (FastAPI, React, Vite, PostgreSQL, Gemini, Docker)
8. Gloser AI - Multi-Agent Pharmaceutical Intelligence (Python, Flask, Next.js, LangGraph, Ollama)

TECHNICAL ARSENAL
• Languages: C++, C, Python, JavaScript, TypeScript, SQL, HTML5, CSS3
• Core Concepts: Low-Latency Systems, Market Microstructure, Multithreading, Concurrency, Lock-Free Data Structures, ASTs & Compiler Design, Stochastic Calculus, Digital Signal Processing
• AI/ML & Quant: PyTorch, TensorFlow, Kalman Filters, XGBoost, Statsmodels, LangChain, LangGraph, Ollama, Pandas, NumPy, Scikit-Learn`;

function generateKOSResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // CTF / Flag inquiries
  if (q.includes('flag') || q.includes('ctf') || q.includes('cheat') || q.includes('solution') || q.includes('give me')) {
    return `[K-OS CTF GUARD]: What do you think this is, a script-kiddie charity handout? 
I don't just dump flags into stdout for anyone with a keyboard.
If you actually want to prove you're an engineer rather than a spectator:
  • Flag 1: Intercept the Golden Telemetry Packet inside the Laboratory tab before its TTL expires.
  • Flag 2: Pop open F12 DevTools and decode the memory dump buffer like a real reverse-engineer.
  • Flag 3: Try kernel privilege escalation right here with 'sudo root'.`;
  }

  // Identity / Bio
  if (q.includes('who are you') || q.includes('who is kartik') || q.includes('about') || q.includes('bio') || q.includes('intro')) {
    return `[K-OS KERNEL]: Kartik Mahendra Patil is an ECE undergraduate at IIT Kharagpur (Roll: 24EC10046), Incoming SDE Intern at Walmart Global Tech, and an elite competitive programmer (Codeforces 1620 Expert, AtCoder 1108).
He specializes in low-latency C++20/23 matching engines (-40% p99 latency), Kalman-filter quantitative statistical arbitrage (73.8% directional accuracy), and distributed high-throughput architecture.`;
  }

  // Why hire / Experience
  if (q.includes('hire') || q.includes('why hire') || q.includes('skills') || q.includes('experience') || q.includes('walmart') || q.includes('intern')) {
    return `[K-OS EVALUATION]: Why hire Kartik? Because while everyone else is writing another generic CRUD wrapper, he's:
1. Benchmarking C++23 L3 order book engines down to sub-microsecond p99 latency (-40% reduction via Google Benchmark).
2. Deploying recursive Kalman filters with walk-forward ML ensembles on Nifty 50 data (73.8% out-of-sample directional accuracy).
3. Ranking in top 0.46% in JEE Main and placing 529th globally in IMC Prosperity 4.
4. Incoming SDE at Walmart Global Tech. He doesn't just write code; he minimizes instruction cache misses and memory stalls.`;
  }

  // Projects / Technical stack
  if (q.includes('project') || q.includes('order book') || q.includes('quant') || q.includes('c++') || q.includes('compiler') || q.includes('trie')) {
    return `[K-OS REPO INDEX]:
• Order Book Matching Engine: C++23, thread-safe single-consumer queue, price-time priority, -40% p99 latency.
• Nifty 50 Pairs Trading: Python, Kalman Filter, XGBoost/Ridge ensemble, 73.8% walk-forward accuracy.
• Radix Autocomplete: C++, top-K node caching, <1ms lookup over 1.2M keys.
• Mini-Compiler & VM: C++, 10K+ lines/sec compilation, recursive descent parser, custom stack VM.
• DeFi Arbitrage Bot: Bellman-Ford negative cycles across 100+ Uniswap V3 pools, 95%+ net profit model.
Check the Projects and Laboratory tabs above to inspect telemetry live.`;
  }

  // Education / College / Grades
  if (q.includes('education') || q.includes('college') || q.includes('iit') || q.includes('kharagpur') || q.includes('jee') || q.includes('gpa')) {
    return `[ACADEMIC TELEMETRY]:
• Institution: Indian Institute of Technology (IIT) Kharagpur (2024 – 2028)
• Degree: B.Tech. (Hons.) in Electronics and Electrical Communication Engineering (ECE)
• JEE Main 2024: Top 0.46% nationwide among 1.2 million candidates.
• JEE Advanced 2024: Top 1.81% among 200,000+ qualified aspirants.
• Core Focus: Stochastic Processes, Optimization Models, DSP, High-Speed Digital Architecture.`;
  }

  // Competitions / Rankings
  if (q.includes('competition') || q.includes('codeforces') || q.includes('rating') || q.includes('rank') || q.includes('imc') || q.includes('contest')) {
    return `[COMPETITIVE STANDINGS]:
• Codeforces: Max Rating 1620 (Expert) [Handle: kresol]
• IMC Prosperity 4: Global Rank 529, Country Rank 81 worldwide
• AMS Derive 2026: Rank 198 out of 2,500+ participants globally (Jane Street & QRT)
• Goldman Sachs India Hackathon 2026: Rank 447 (Quant), Rank 584 (CS)
• AtCoder: Peak 1108 (5 Kyu, Top 9.84% globally)
• Inter-Hall GC Data Analytics (IIT KGP): Gold Medal (Rank 1)`;
  }

  // Contact / Socials
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github')) {
    return `[COMMUNICATION SOCKETS]:
  • Email: kmzpatil@gmail.com
  • Phone: +91-9421585148
  • GitHub: https://github.com/kmzpatil
  • LinkedIn: https://linkedin.com/in/kmzpatil
  • Codeforces: https://codeforces.com/profile/kresol
Direct sockets open. Ready for high-impact engineering conversations.`;
  }

  // Default response
  return `[K-OS DAEMON v2.4]: Query logged: "${input}".
Telemetry status: C++23 Matching Engine (Online), Kalman Stat-Arb Matrix (Active), Memory Subsystem (Normal).
Try commands: 'projects', 'stats', 'ctf', 'history', 'sudo root', or ask about Kartik's engineering stack at IIT Kharagpur.`;
}

export async function askKOSDaemon(userMessage: string): Promise<string> {
  const trimmed = userMessage.trim();
  if (!trimmed) return 'Enter a command or inquiry.';

  // If running in an environment with /api/chat active (server or local dev with secrets)
  if (typeof window !== 'undefined' && !window.location.hostname.endsWith('github.io')) {
    try {
      const res = await fetch('/api/chat', {
        signal: AbortSignal.timeout(4000),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: trimmed }] }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
      }
    } catch {
      // Fall through to local engine
    }
  }

  // Zero-secret local response engine (pure static, 100% reliable)
  return generateKOSResponse(trimmed);
}
