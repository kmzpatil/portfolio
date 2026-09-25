export type Project = {
  title: string;
  subtitle: string;
  tech: string;
  metric: string;
  metricLabel: string;
  bullets: string[];
  github?: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type Achievement = {
  title: string;
  stat: string;
  detail: string;
};

export const projects: Project[] = [
  {
    title: "Multithreaded Order Book Matching Engine",
    subtitle: "A software simulation of the core engine used in financial exchanges (NASDAQ, NYSE) to match buy and sell orders. Processes concurrent orders with sub-microsecond latency using lock-based concurrency and price-time priority matching on Red-Black Trees.",
    tech: "C++ · std::map · Mutex · Condition Variables · Atomics · Google Benchmarks",
    metric: "40%",
    metricLabel: "p99 latency reduction",
    bullets: [
      "Architected matching engine with thread-safe mutex-protected single-consumer queue — multiple producer threads push orders while a single consumer serializes matching to guarantee price-time priority correctness.",
      "Implemented price-time priority order matching using std::map (Red-Black Tree) with std::greater for bids (highest first) and default ordering for asks (lowest first). Each price level uses a FIFO queue for time priority.",
      "Engineered concurrent state management using std::condition_variable for blocking pops and std::atomic<bool> engine flag for graceful teardown — eliminates busy-waiting and ensures safe shutdown.",
      "Optimized critical path with pre-allocated memory pools (eliminating heap allocations), cached begin() iterators, move semantics, and off-thread logging — achieving sub-microsecond processing per order.",
    ],
    github: "https://github.com/kmzpatil/Order-Book-Matching-Engine",
  },
  {
    title: "Quantitative Trading Framework",
    subtitle: "Automated statistical arbitrage system for Nifty 50 equities. ML ensemble combines XGBoost and Ridge with walk-forward validation, Kalman Filter dynamic spread estimation, and SEBI-compliant execution via Zerodha Kite API.",
    tech: "Python · XGBoost · Ridge · Statsmodels · Kalman Filter · FastAPI · Zerodha Kite",
    metric: "73.8%",
    metricLabel: "OOS accuracy",
    bullets: [
      "ML ensemble (XGBoost gradient boosting + Ridge regression) with strict walk-forward cross-validation achieving 73.8% out-of-sample directional accuracy — no lookahead bias in train/test splits.",
      "Recursive Kalman Filter for real-time dynamic spread and Z-score estimation, replacing static OLS regression that would introduce lookahead bias from using future data in coefficient estimation.",
      "High-frequency microstructure sandbox simulating trade expectancy against real-world slippage models, bid-ask spread dynamics, and market impact cost.",
      "SEBI-compliant execution wrapper integrating Zerodha Kite API with asynchronous margin locking, position limits, and circuit-breaker compliance.",
    ],
  },
  {
    title: "DeFi Arbitrage Bot",
    subtitle: "Real-time arbitrage detection engine monitoring 50+ Uniswap V3 liquidity pools. Uses Bellman-Ford negative cycle detection on a 100+ node token graph to identify triangular arbitrage paths, with precise profit calculations accounting for gas, slippage, and pool fee tiers.",
    tech: "Python · Web3.py · Infura · Bellman-Ford · FastAPI · WebSocket",
    metric: "95%+",
    metricLabel: "net PnL accuracy",
    bullets: [
      "Real-time pool monitoring via Multicall contracts (batching 50+ eth_call requests into single RPC calls) and WebSocket event subscriptions for Sync/Swap events — eliminates per-pool rate limiting.",
      "Bellman-Ford negative cycle detection on token graph with edge weights w(u,v) = -ln(rate), where any negative-weight cycle mathematically proves a profitable arbitrage loop.",
      "Precise profit simulation accounting for Uniswap V3 concentrated liquidity tick boundaries, pool fee tiers (0.01%–1.0%), non-linear slippage from reserve depletion, and EIP-1559 gas cost modeling.",
      "FastAPI dashboard with WebSocket feeds streaming live arbitrage opportunities, achieving sub-second detection latency using asyncio event loop and ProcessPoolExecutor for CPU-heavy graph computation.",
    ],
    github: "https://github.com/kmzpatil/DeFi-Arbitrage-Bot",
  },
  {
    title: "Frammer — Unified AI Analytics Platform",
    subtitle: "Full-stack AI analytics platform with ATLAS engine processing 100K+ data points daily. Features a custom DSL parser for 19+ KPI definitions, Chronos transformer-based time-series forecasting, and mathematically enforced multi-tenant isolation via row-level CTE security.",
    tech: "FastAPI · React · PostgreSQL · Docker · Google Gemini · Chronos · MCP",
    metric: "100K+",
    metricLabel: "data points/day",
    bullets: [
      "ATLAS AI engine with custom DSL parser (lexer → AST → SQL compiler) for 19+ complex KPI definitions — prevents arbitrary code execution risks of Python eval() while enabling user-defined analytics.",
      "Secure virtual partitioning layer wrapping all base tables in tenant-filtered CTEs driven by JWT claims — mathematically enforces tenant isolation at the query compilation layer, not developer memory.",
      "Optimized PostgreSQL queries with partial indexes and covering B-tree indexes (INCLUDE clause), cutting data retrieval delays by 35% across 1M+ row analytical operations via Index-Only Scans.",
      "Docker multi-stage builds reducing production image size by 60%. Integrated Google Gemini for natural language analytics and Amazon Chronos for zero-shot time-series forecasting.",
    ],
    github: "https://github.com/kmzpatil/Agentic-Dashboard",
  },
  {
    title: "CDC Companion — CV Review Platform",
    subtitle: "Enterprise-grade REST API automating IIT Kharagpur's placement CV review workflow. Matches 500+ candidates with senior reviewers via rule-based allocation with seniority guards, generates AI-driven feedback from 1,000+ PDFs using structured LLM prompting.",
    tech: "Node.js · TypeScript · Prisma ORM · PostgreSQL · JWT · Groq/Gemini",
    metric: "1,000+",
    metricLabel: "PDFs processed",
    bullets: [
      "Auto-allocation pipeline using Min-Heap workload balancing with seniority guards (reviewer.year > candidate.year) and department alignment — achieves 100% CV assignment without manual intervention.",
      "AI review agent with few-shot structured prompting: extracts text from PDFs, evaluates against 5 axes (quantified impact, action verbs, formatting, relevance, conciseness), returns strict JSON schema with scores and actionable feedback.",
      "Dependency-free memory rate limiter using JavaScript Map with sliding-window log pattern and periodic cleanup via setInterval — protects against DoS without Redis dependency.",
      "JWT role-based authorization (CANDIDATE | REVIEWER | ADMIN) with stateless HMAC-SHA256 verification and automated Nodemailer workflows achieving <2s delivery latency.",
    ],
    github: "https://github.com/kmzpatil/Cdc-Companion",
  },
  {
    title: "Real-Time Autocomplete Engine",
    subtitle: "Sub-millisecond suggestion system for 1.2M+ word datasets. Radix Trie with per-node top-K caching eliminates deep DFS traversals, converting O(V+E) lookups to O(L) prefix-length reads — a 100,000x improvement for short prefixes.",
    tech: "C++ · Radix Tries · Top-K Caching · Fuzzy Search · termios",
    metric: "<1ms",
    metricLabel: "lookup latency",
    bullets: [
      "Radix Trie (Patricia Trie) compressing shared prefix chains into single multi-character nodes — reduces memory by 60–80% vs standard Trie while maintaining O(L) lookup complexity with better cache locality.",
      "Per-node top-K caching storing pre-computed sorted arrays of highest-frequency completions at every internal node. Short prefix 'a' returns results in 50–200ns instead of DFS through 200K+ descendants (5–50ms).",
      "Fuzzy search via bounded Levenshtein distance DFS — handles typos by traversing branches within edit distance threshold, pruning impossible paths early.",
      "Memory optimizations: std::string_view for zero-copy prefix comparisons, arena allocator for Trie nodes eliminating heap fragmentation, edge labels stored as (start_index, length) into shared character buffer.",
    ],
    github: "https://github.com/kmzpatil/AutoComplete-Engine",
  },
  {
    title: "Mini-Compiler",
    subtitle: "Complete compiler pipeline translating a custom programming language into bytecode executed on a stack-based virtual machine. Recursive descent parser, AST code generation via Visitor pattern, 18+ operators, and NaN-boxing for type-efficient VM execution.",
    tech: "C++ · Lexer · Recursive Descent Parser · ASTs · Visitor Pattern · Stack VM",
    metric: "10K+",
    metricLabel: "lines/sec compiled",
    bullets: [
      "Full pipeline: Lexer (LL(1) scanning with lookahead) → Recursive Descent Parser (precedence encoded in function call hierarchy) → AST → Bytecode Generator (Visitor pattern with backpatching for control flow) → Stack-based VM.",
      "Comprehensive support for 18+ operators (arithmetic, bitwise, comparison, logical) and if-then-else control flow with jump backpatching — emits JUMP_IF_FALSE with placeholder, patches destination after compiling branches.",
      "VM optimized with pre-allocated stack array, computed goto (GCC &&label) replacing switch dispatch for 15–25% speedup, and NaN-boxing encoding all value types into 64-bit doubles for cache-friendly execution.",
      "Panic mode error recovery: reports syntax errors with exact line/column traceability, discards tokens to synchronization points, resumes parsing to detect multiple errors in a single compilation pass.",
    ],
    github: "https://github.com/kmzpatil/Mini-Compilor",
  },
  {
    title: "Chernobyl Prevention System",
    subtitle: "Deep sequence classification model for industrial safety monitoring. LSTM network predicts 4 nuclear risk levels from 27-dimensional continuous sensor streams, with engineered features (rolling volatility, IQR, cubic transforms) and Optuna Bayesian hyperparameter optimization.",
    tech: "PyTorch · LSTM · Optuna · Feature Engineering · NumPy · Pandas",
    metric: "0.94",
    metricLabel: "F1-score",
    bullets: [
      "LSTM with gating mechanisms (input, forget, output gates) processing 27 simultaneous sensor channels — additive cell state acts as gradient highway, preserving long-term temporal dependencies across hundreds of timesteps.",
      "Engineered features: rolling volatility (windowed σ), interquartile ranges (robust dispersion), and cubic transforms (x³) preserving sign while amplifying extreme anomaly tails for easier neural network isolation.",
      "Dynamic batch size schedule: large batches (256) for stable initial convergence → small batches (32) inducing gradient noise that kicks optimizer out of narrow sharp minima into wide flat minima for better generalization.",
      "Optuna TPE (Tree-structured Parzen Estimator) Bayesian search over learning rate, hidden dimensions, and dropout — converges to optimal F1=0.94 in 30% fewer iterations than grid search.",
    ],
  },
];

export const experience: Experience[] = [
  {
    company: "Walmart Global Tech",
    role: "Software Engineering Intern (SDE)",
    period: "May 2027 — Jul 2027",
    bullets: [
      "Incoming Software Engineering Intern at one of the world's largest enterprise retail technology divisions, focusing on high-scale distributed backend infrastructure.",
    ],
  },
  {
    company: "Bhavya Haulage Services FZCO",
    role: "Software Developer Intern",
    period: "Mar 2025 — May 2025",
    bullets: [
      "Engineered high-performance backend microservices with multi-factor authentication (MFA) and stateless JWT role authorization for freight logistics & investment operations.",
      "Developed real-time financial telemetry dashboards streaming fleet metrics, revenue yield, and transaction throughput via WebSockets.",
    ],
  },
  {
    company: "Communiqué, IIT Kharagpur (TSG)",
    role: "Governor & Software Team Lead",
    period: "Apr 2026 — Present",
    bullets: [
      "Facilitated career development drives for 500+ students, leading CV review clinics and technical interview bootcamps.",
      "Directed the Software Team of 40+ members across digital platforms, automated candidate allocation pipelines, and outreach initiatives.",
      "Orchestrated Secretariat operations for the World Bank Committee at Global Model United Nations (GMUN 2026); architected the official conference portal serving 300+ international delegates.",
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: "IMC Prosperity 4",
    stat: "Rank 529",
    detail: "Global Rank / Country Rank 81",
  },
  {
    title: "Codeforces",
    stat: "1620",
    detail: "Expert Rank (Handle: kresol)",
  },
  {
    title: "Data Analytics GC",
    stat: "Gold Medal",
    detail: "Rank 1 representing RK Hall (IIT KGP)",
  },
  {
    title: "AMS Derive 2026",
    stat: "Rank 198",
    detail: "Top 2,500+ (Jane Street & QRT)",
  },
];

export const skillGroups = [
  {
    label: "Systems & Languages",
    skills: ["C/C++", "Python", "JavaScript/TypeScript", "SQL", "Multithreading", "REST APIs"],
  },
  {
    label: "Quant & Finance",
    skills: ["Statistical Arbitrage", "HFT", "Algorithmic Trading", "Time Series Analysis", "Market Microstructure", "Low-Latency Systems"],
  },
  {
    label: "Frameworks & Infrastructure",
    skills: ["React", "Next.js", "Node.js", "Express", "FastAPI", "PyTorch", "TensorFlow", "XGBoost", "Docker", "PostgreSQL", "MongoDB"],
  },
];

export const links = {
  email: "kmzpatil@gmail.com",
  github: "https://github.com/kmzpatil",
  linkedin: "https://linkedin.com/in/kmzpatil",
  codeforces: "https://codeforces.com/profile/kresol",
};
