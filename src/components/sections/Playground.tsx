'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Order Book Types ---
type Order = {
  price: number;
  size: number;
  id: number;
};

type Trade = {
  id: number;
  price: number;
  size: number;
  type: 'buy' | 'sell';
  time: string;
};

// --- Scraper Types ---
type ScrapedRecord = {
  id: string;
  source: string;
  entity: string;
  metric: string;
  value: string;
  timestamp: string;
  latencyMs: number;
};

type ActiveTab = 'orderbook' | 'scraper' | 'llm' | 'ctf';

export default function Playground() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('orderbook');

  // ==========================================
  // TAB 1: ORDER BOOK STATE & LOGIC
  // ==========================================
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(100.00);
  const [position, setPosition] = useState(0);
  const [realizedPnl, setRealizedPnl] = useState(0);
  const [entryCost, setEntryCost] = useState(0);
  const [isBotActive, setIsBotActive] = useState(true);
  
  const [orderSize, setOrderSize] = useState<number>(250);
  const [orderPrice, setOrderPrice] = useState<string>('');
  const [isLimitType, setIsLimitType] = useState<boolean>(false);

  const orderId = useRef(0);
  const tradeId = useRef(0);

  // Initialize order book
  useEffect(() => {
    const initialBids = [];
    const initialAsks = [];
    let currentBid = 99.99;
    let currentAsk = 100.01;

    for (let i = 0; i < 15; i++) {
      initialBids.push({ id: ++orderId.current, price: Number(currentBid.toFixed(2)), size: Math.floor(Math.random() * 500) + 10 });
      initialAsks.push({ id: ++orderId.current, price: Number(currentAsk.toFixed(2)), size: Math.floor(Math.random() * 500) + 10 });
      currentBid -= 0.01;
      currentAsk += 0.01;
    }
    setBids(initialBids);
    setAsks(initialAsks);
  }, []);

  // Market Maker Bot simulation
  useEffect(() => {
    if (!isBotActive) return;
    const interval = setInterval(() => {
      setBids(prev => {
        let newBids = [...prev];
        if (newBids.length < 10) {
          let p = newBids.length > 0 ? Math.min(...newBids.map(b => b.price)) - 0.01 : (lastPrice - 0.01);
          while (newBids.length < 15) {
            newBids.push({ id: ++orderId.current, price: Number(p.toFixed(2)), size: Math.floor(Math.random() * 350) + 30 });
            p -= 0.01;
          }
        }
        const idx = Math.floor(Math.random() * newBids.length);
        if (newBids[idx]) {
          newBids[idx] = { ...newBids[idx], size: Math.max(15, newBids[idx].size + (Math.random() > 0.5 ? 40 : -30)) };
        }
        return newBids.sort((a, b) => b.price - a.price);
      });

      setAsks(prev => {
        let newAsks = [...prev];
        if (newAsks.length < 10) {
          let p = newAsks.length > 0 ? Math.max(...newAsks.map(a => a.price)) + 0.01 : (lastPrice + 0.01);
          while (newAsks.length < 15) {
            newAsks.push({ id: ++orderId.current, price: Number(p.toFixed(2)), size: Math.floor(Math.random() * 350) + 30 });
            p += 0.01;
          }
        }
        const idx = Math.floor(Math.random() * newAsks.length);
        if (newAsks[idx]) {
          newAsks[idx] = { ...newAsks[idx], size: Math.max(15, newAsks[idx].size + (Math.random() > 0.5 ? 40 : -30)) };
        }
        return newAsks.sort((a, b) => a.price - b.price);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isBotActive, lastPrice]);

  const executeOrder = (type: 'buy' | 'sell', quantity: number, priceStr?: string) => {
    let remaining = quantity;
    let currentPrice = lastPrice;
    const isLimit = isLimitType && priceStr && priceStr.trim() !== '';
    const limitPrice = isLimit ? parseFloat(priceStr!) : 0;
    
    if (type === 'buy') {
      if (isLimit && limitPrice < (asks[0]?.price || 0)) {
        setBids(prev => [...prev, { id: ++orderId.current, price: limitPrice, size: quantity }].sort((a, b) => b.price - a.price));
        return;
      }
      
      setAsks(prev => {
        const newAsks = [...prev].sort((a, b) => a.price - b.price);
        let totalCost = 0;
        let matchedTotal = 0;
        while (remaining > 0 && newAsks.length > 0) {
          const top = newAsks[0];
          if (isLimit && top.price > limitPrice) break;
          
          const matched = Math.min(top.size, remaining);
          top.size -= matched;
          remaining -= matched;
          currentPrice = top.price;
          totalCost += matched * top.price;
          matchedTotal += matched;
          
          if (top.size <= 0) newAsks.shift();
        }
        
        if (matchedTotal > 0) {
          setTrades(t => [{
            id: ++tradeId.current,
            price: currentPrice,
            size: matchedTotal,
            type: 'buy' as const,
            time: new Date().toLocaleTimeString()
          }, ...t].slice(0, 30));
          
          setLastPrice(currentPrice);
          setPosition(pos => pos + matchedTotal);
          setEntryCost(cost => cost + totalCost);
        }

        // Keep asks replenished so ladder never empties
        let topAsk = newAsks.length > 0 ? Math.max(...newAsks.map(a => a.price)) : (currentPrice + 0.01);
        while (newAsks.length < 15) {
          topAsk = Number((topAsk + 0.01).toFixed(2));
          newAsks.push({
            id: ++orderId.current,
            price: topAsk,
            size: Math.floor(Math.random() * 450) + 40
          });
        }
        
        return newAsks.sort((a, b) => a.price - b.price);
      });
      
      if (remaining > 0 && isLimit) {
        setBids(prev => [...prev, { id: ++orderId.current, price: limitPrice, size: remaining }].sort((a, b) => b.price - a.price));
      }
    } else {
      if (isLimit && limitPrice > (bids[0]?.price || 0)) {
        setAsks(prev => [...prev, { id: ++orderId.current, price: limitPrice, size: quantity }].sort((a, b) => a.price - b.price));
        return;
      }
      
      setBids(prev => {
        const newBids = [...prev].sort((a, b) => b.price - a.price);
        let totalRevenue = 0;
        let matchedTotal = 0;
        while (remaining > 0 && newBids.length > 0) {
          const top = newBids[0];
          if (isLimit && top.price < limitPrice) break;
          
          const matched = Math.min(top.size, remaining);
          top.size -= matched;
          remaining -= matched;
          currentPrice = top.price;
          totalRevenue += matched * top.price;
          matchedTotal += matched;
          
          if (top.size <= 0) newBids.shift();
        }
        
        if (matchedTotal > 0) {
          setTrades(t => [{
            id: ++tradeId.current,
            price: currentPrice,
            size: matchedTotal,
            type: 'sell' as const,
            time: new Date().toLocaleTimeString()
          }, ...t].slice(0, 30));
          
          setLastPrice(currentPrice);
          
          setPosition(pos => {
            if (pos > 0) {
              const closedSize = Math.min(pos, matchedTotal);
              const avgCost = entryCost / pos;
              const pnl = (currentPrice - avgCost) * closedSize;
              setRealizedPnl(r => r + pnl);
              setEntryCost(c => Math.max(0, c - (avgCost * closedSize)));
            } else {
              setEntryCost(c => c + totalRevenue);
            }
            return pos - matchedTotal;
          });
        }

        // Keep bids replenished so ladder never empties
        let topBid = newBids.length > 0 ? Math.min(...newBids.map(b => b.price)) : (currentPrice - 0.01);
        while (newBids.length < 15) {
          topBid = Number((topBid - 0.01).toFixed(2));
          newBids.push({
            id: ++orderId.current,
            price: topBid,
            size: Math.floor(Math.random() * 450) + 40
          });
        }
        
        return newBids.sort((a, b) => b.price - a.price);
      });
      
      if (remaining > 0 && isLimit) {
        setAsks(prev => [...prev, { id: ++orderId.current, price: limitPrice, size: remaining }].sort((a, b) => a.price - b.price));
      }
    }
  };

  const formatPrice = (p: number) => p.toFixed(2);
  const maxAskSize = Math.max(...asks.map(a => a.size), 1);
  const maxBidSize = Math.max(...bids.map(b => b.size), 1);
  const avgEntryPrice = position !== 0 ? entryCost / Math.abs(position) : 0;
  const unrealizedPnl = position !== 0 ? (position > 0 ? (lastPrice - avgEntryPrice) * position : (avgEntryPrice - lastPrice) * Math.abs(position)) : 0;

  // ==========================================
  // TAB 2: HIGH-THROUGHPUT WEB SCRAPER STATE & SIMULATOR
  // ==========================================
  const [scraperTarget, setScraperTarget] = useState<'sec' | 'bloomberg' | 'uniswap'>('sec');
  const [concurrency, setConcurrency] = useState(8);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedRecords, setScrapedRecords] = useState<ScrapedRecord[]>([]);
  const [scrapeMetrics, setScrapeMetrics] = useState({ pagesScraped: 0, bytesExtracted: 0, avgLatencyMs: 0 });
  const scraperIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScraper = () => {
    if (isScraping) {
      if (scraperIntervalRef.current) clearInterval(scraperIntervalRef.current);
      setIsScraping(false);
      return;
    }

    setIsScraping(true);
    setScrapedRecords([]);
    let counter = 0;

    const mockFeeds = {
      sec: [
        { entity: 'TSLA', metric: '10-K R&D Spend', value: '$3.99B (Item 7 CapEx)' },
        { entity: 'AAPL', metric: '10-Q Services Margin', value: '74.2% gross margin' },
        { entity: 'NVDA', metric: '8-K Data Center Rev', value: '$26.3B (+154% YoY)' },
        { entity: 'MSFT', metric: '10-K Azure Cloud Run', value: '$31.8B commercial' },
      ],
      bloomberg: [
        { entity: 'US 10Y/2Y', metric: 'Yield Spread', value: '+14.2 bps (Steepening)' },
        { entity: 'CDX NA HY', metric: 'Credit Default Index', value: '312.4 bps (-4 bps)' },
        { entity: 'BRENT', metric: 'Front Month Futures', value: '$74.18/bbl (-1.1%)' },
        { entity: 'SOFR', metric: 'Overnight Rate', value: '4.82% ($1.8T vol)' },
      ],
      uniswap: [
        { entity: 'ETH/USDC (0.05%)', metric: 'Tick 204320', value: '$2,642.10 (Liq: 4.8M)' },
        { entity: 'WBTC/USDC (0.3%)', metric: 'Swap Event', value: '14.2 BTC -> 928,400 USDC' },
        { entity: 'UNI/ETH (0.3%)', metric: 'Tick Crossing', value: 'Crossed tick 18400' },
        { entity: 'ARB/USDC (0.05%)', metric: 'Arbitrage Loop', value: 'Net Profit: +$42.18' },
      ]
    };

    scraperIntervalRef.current = setInterval(() => {
      counter++;
      const pool = mockFeeds[scraperTarget];
      const item = pool[Math.floor(Math.random() * pool.length)];
      const latency = Math.floor(Math.random() * 35) + 12;

      const record: ScrapedRecord = {
        id: `REC-${Date.now().toString().slice(-6)}-${counter}`,
        source: scraperTarget.toUpperCase(),
        entity: item.entity,
        metric: item.metric,
        value: item.value,
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        latencyMs: latency
      };

      setScrapedRecords(prev => [record, ...prev].slice(0, 25));
      setScrapeMetrics(prev => ({
        pagesScraped: prev.pagesScraped + 1,
        bytesExtracted: prev.bytesExtracted + Math.floor(Math.random() * 2400) + 800,
        avgLatencyMs: Math.round((prev.avgLatencyMs * 4 + latency) / 5)
      }));
    }, Math.max(120, 1000 / concurrency));
  };

  useEffect(() => {
    return () => {
      if (scraperIntervalRef.current) clearInterval(scraperIntervalRef.current);
    };
  }, []);

  // ==========================================
  // TAB 3: QUANT & SYSTEMS LLM BENCHMARK STATE
  // ==========================================
  const [llmPrompt, setLlmPrompt] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmLatency, setLlmLatency] = useState<number | null>(null);
  const [llmModelUsed, setLlmModelUsed] = useState<string>('');

  const runLlmBenchmark = async (promptText: string) => {
    if (!promptText.trim() || llmLoading) return;
    setLlmLoading(true);
    setLlmResponse('');
    setLlmLatency(null);

    const startTime = performance.now();
    try {
      const res = await fetch('/api/chat', { signal: AbortSignal.timeout(12000),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }]
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setLlmLatency(elapsed);
      setLlmModelUsed(data.modelUsed || 'openai/gpt-oss-120b');
      setLlmResponse(data.choices?.[0]?.message?.content || 'Execution completed without output.');
    } catch (err: any) {
      setLlmResponse(`Error: ${err?.message || 'Failed to complete LLM inference request.'}`);
    } finally {
      setLlmLoading(false);
    }
  };

  // ==========================================
  // TAB 4: CTF & PACKET CHASER STATE & LOGIC
  // ==========================================
  const [ctfScore, setCtfScore] = useState(0);
  const [packetsCaught, setPacketsCaught] = useState(0);
  const [unlockedFlag1, setUnlockedFlag1] = useState(false);
  const [goldenPacketSpawned, setGoldenPacketSpawned] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [solvedFlags, setSolvedFlags] = useState<string[]>([]);
  const [submissionMsg, setSubmissionMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const packetsRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; isGolden?: boolean; id: number }>>([]);

  // Initialize and run Canvas Packet simulation
  useEffect(() => {
    if (activeTab !== 'ctf') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    if (packetsRef.current.length === 0) {
      const initial = [];
      for (let i = 0; i < 14; i++) {
        initial.push({
          x: Math.random() * (width - 40) + 20,
          y: Math.random() * (height - 40) + 20,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          id: i,
        });
      }
      packetsRef.current = initial;
    }

    const render = () => {
      ctx.fillStyle = 'rgba(7, 8, 12, 0.3)';
      ctx.fillRect(0, 0, width, height);

      // Network grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Packets
      packetsRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 15 || p.x > width - 15) p.vx *= -1;
        if (p.y < 15 || p.y > height - 15) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isGolden ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.isGolden ? '#F59E0B' : '#3B82F6';
        ctx.shadowColor = p.isGolden ? '#F59E0B' : '#3B82F6';
        ctx.shadowBlur = p.isGolden ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.isGolden) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#F59E0B';
          ctx.fillText('0x7F_ENCRYPTED', p.x + 12, p.y + 4);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [activeTab]);

  // Handle canvas clicks to intercept packets
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let hit = false;
    packetsRef.current = packetsRef.current.map((p) => {
      const dist = Math.hypot(p.x - clickX, p.y - clickY);
      if (dist < 26) {
        hit = true;
        if (p.isGolden) {
          setUnlockedFlag1(true);
        }
        return {
          ...p,
          x: Math.random() * (canvas.width - 40) + 20,
          y: Math.random() * (canvas.height - 40) + 20,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
        };
      }
      return p;
    });

    if (hit) {
      setCtfScore((s) => s + 25);
      setPacketsCaught((c) => {
        const next = c + 1;
        if (next >= 4 && !goldenPacketSpawned) {
          setGoldenPacketSpawned(true);
          // Spawn golden packet
          packetsRef.current.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: 1.5,
            vy: 1.2,
            isGolden: true,
            id: 999,
          });
        }
        return next;
      });
    }
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFlag = flagInput.trim();
    if (!cleanFlag) return;

    const validFlags: Record<string, string> = {
      'FLAG{l0w_l4t3ncy_p4ck3t_1nt3rc3pt0r}': 'FLAG #1 (Packet Interceptor)',
      'FLAG{r4d1x_tr1e_sub_millisecond_lookup}': 'FLAG #2 (Memory Dump Base64)',
      'FLAG{k4rt1k_k4lm4n_f1lt3r_c1rcu1t_br34k}': 'FLAG #3 (Terminal Sudo Root)',
    };

    if (validFlags[cleanFlag]) {
      if (solvedFlags.includes(cleanFlag)) {
        setSubmissionMsg({ text: `Already verified: ${validFlags[cleanFlag]}!`, isError: false });
      } else {
        setSolvedFlags((prev) => [...prev, cleanFlag]);
        setSubmissionMsg({ text: `SUCCESS! Verified ${validFlags[cleanFlag]}!`, isError: false });
      }
    } else {
      setSubmissionMsg({ text: 'INVALID FLAG. Check hints and spelling carefully!', isError: true });
    }
    setFlagInput('');
  };

  return (
    <section id="playground" className="min-h-screen relative pt-10 pb-32 sm:pt-14 sm:pb-36">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="section-container w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-subheading mb-2">Live Interactive Environment</p>
            <h2 className="text-heading text-[var(--text-primary)]">
              Interactive Systems Laboratory
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--text-tertiary)] max-w-md">
            Test and benchmark real-time components: sub-microsecond order execution, concurrent stream scrapers, and embedded LLM reasoning.
          </p>
        </div>

        {/* Laboratory Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6 w-fit">
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeTab === 'orderbook'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Order Book Matching Engine
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeTab === 'scraper'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            High-Throughput Scraper Simulator
          </button>

          <button
            onClick={() => setActiveTab('llm')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeTab === 'llm'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Quant &amp; Systems LLM Sandbox
          </button>

          <button
            onClick={() => setActiveTab('ctf')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'ctf'
                ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/[0.05]'
            }`}
          >
            Capture The Flag (CTF)
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ORDER BOOK MATCHING ENGINE */}
        {/* ============================================================== */}
        {activeTab === 'orderbook' && (
          <div>
            {/* Top Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Last Traded Price
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)] tabular-nums">
                  ${formatPrice(lastPrice)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Position Size
                </div>
                <div className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${position > 0 ? 'text-emerald-400' : position < 0 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                  {position > 0 ? `+${position}` : position} units
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Unrealized P&amp;L
                </div>
                <div className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${unrealizedPnl > 0 ? 'text-emerald-400' : unrealizedPnl < 0 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}`}>
                  {unrealizedPnl >= 0 ? `+$${formatPrice(unrealizedPnl)}` : `-$${formatPrice(Math.abs(unrealizedPnl))}`}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Realized P&amp;L
                </div>
                <div className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${realizedPnl > 0 ? 'text-emerald-400' : realizedPnl < 0 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}`}>
                  {realizedPnl >= 0 ? `+$${formatPrice(realizedPnl)}` : `-$${formatPrice(Math.abs(realizedPnl))}`}
                </div>
              </div>
            </div>

            {/* Main Order Book Workbench Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
              
              {/* L2/L3 Order Depth Ladder (7 Cols) */}
              <div className="lg:col-span-7 rounded-xl p-5 bg-white/[0.02] border border-white/[0.08] flex flex-col h-[520px]">
                
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-[var(--text-primary)] tracking-wide">LIVE L3 DEPTH LADDER</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsBotActive(!isBotActive)}
                      className="text-[10px] px-2 py-0.5 rounded border border-white/[0.1] text-[var(--text-secondary)] hover:text-white bg-white/[0.03]"
                    >
                      {isBotActive ? 'Pause Bot Flow' : 'Resume Bot Flow'}
                    </button>
                    <span className="text-[10px] text-[var(--text-tertiary)]">PRICE-TIME PRIORITY</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 text-[10px] font-bold text-[var(--text-tertiary)] px-2 pb-2">
                  <div>PRICE (USD)</div>
                  <div className="text-right">SIZE</div>
                  <div className="text-right">TOTAL DEPTH</div>
                </div>

                {/* Asks (Sell Orders - Red) */}
                <div className="flex-1 flex flex-col-reverse justify-start overflow-hidden">
                  {[...asks].sort((a,b) => a.price - b.price).slice(0, 8).map((ask, i, arr) => {
                    const total = arr.slice(0, i+1).reduce((sum, a) => sum + a.size, 0);
                    const width = `${Math.min(100, (ask.size / maxAskSize) * 100)}%`;
                    return (
                      <div key={ask.id} className="relative grid grid-cols-3 px-2 py-1 hover:bg-white/[0.04] transition-colors">
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 z-0 transition-all pointer-events-none" style={{ width }} />
                        <div className="text-red-400 z-10 font-bold">{formatPrice(ask.price)}</div>
                        <div className="text-right text-[var(--text-primary)] z-10">{ask.size}</div>
                        <div className="text-right text-[var(--text-tertiary)] z-10">{total}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Spread Bar */}
                <div className="py-2.5 my-2 border-y border-white/[0.06] bg-white/[0.01] flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--text-tertiary)]">LAST:</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">${formatPrice(lastPrice)}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)]">
                    SPREAD: <span className="text-[var(--text-secondary)] font-semibold">{asks[0] && bids[0] ? formatPrice(asks[0].price - bids[0].price) : '0.02'}</span>
                  </div>
                </div>

                {/* Bids (Buy Orders - Green) */}
                <div className="flex-1 flex flex-col justify-start overflow-hidden">
                  {[...bids].sort((a,b) => b.price - a.price).slice(0, 8).map((bid, i, arr) => {
                    const total = arr.slice(0, i+1).reduce((sum, b) => sum + b.size, 0);
                    const width = `${Math.min(100, (bid.size / maxBidSize) * 100)}%`;
                    return (
                      <div key={bid.id} className="relative grid grid-cols-3 px-2 py-1 hover:bg-white/[0.04] transition-colors">
                        <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 z-0 transition-all pointer-events-none" style={{ width }} />
                        <div className="text-emerald-400 z-10 font-bold">{formatPrice(bid.price)}</div>
                        <div className="text-right text-[var(--text-primary)] z-10">{bid.size}</div>
                        <div className="text-right text-[var(--text-tertiary)] z-10">{total}</div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Order Placement & Live Execution Tape (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 h-[520px]">
                
                {/* Order Entry Form */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-widest uppercase">
                      ORDER ENTRY DESK
                    </h3>
                    <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.08]">
                      <button 
                        onClick={() => { setIsLimitType(false); setOrderPrice(''); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${!isLimitType ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}
                      >
                        MARKET
                      </button>
                      <button 
                        onClick={() => setIsLimitType(true)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${isLimitType ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}
                      >
                        LIMIT
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label htmlFor="order-size-input" className="text-[10px] text-[var(--text-tertiary)] block mb-1 uppercase font-semibold">
                        ORDER SIZE
                      </label>
                      <input id="order-size-input" aria-label="Order size quantity"
                        type="number" 
                        value={orderSize}
                        onChange={(e) => setOrderSize(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg p-2.5 text-xs text-[var(--text-primary)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="order-price-input" className="text-[10px] text-[var(--text-tertiary)] block mb-1 uppercase font-semibold">
                        {isLimitType ? 'LIMIT PRICE' : 'EXECUTION'}
                      </label>
                      <input id="order-price-input" aria-label="Limit order price"
                        type="number" 
                        step="0.01"
                        disabled={!isLimitType}
                        placeholder={isLimitType ? formatPrice(lastPrice) : 'BEST MARKET'}
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                        className={`w-full bg-white/[0.04] border border-white/[0.1] rounded-lg p-2.5 text-xs text-[var(--text-primary)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-all ${!isLimitType ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button 
                      onClick={() => executeOrder('buy', orderSize, orderPrice)}
                      className="py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      BUY / BID
                    </button>
                    <button 
                      onClick={() => executeOrder('sell', orderSize, orderPrice)}
                      className="py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-bold transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(239,68,68,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      SELL / ASK
                    </button>
                  </div>
                </div>

                {/* Real-time Match Tape */}
                <div className="flex-1 p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      EXECUTION TAPE
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">SUB-MICROSECOND RESOLUTION</span>
                  </div>

                  <div className="grid grid-cols-3 text-[10px] font-bold text-[var(--text-tertiary)] pb-2 border-b border-white/[0.04]">
                    <div>TIME</div>
                    <div className="text-center">PRICE</div>
                    <div className="text-right">SIZE</div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pt-1">
                    {trades.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[var(--text-tertiary)] text-[11px]">
                        Execute an order above to populate tape
                      </div>
                    ) : (
                      trades.map((t) => (
                        <div key={t.id} className="grid grid-cols-3 py-0.5 text-[11px] items-center">
                          <span className="text-[var(--text-tertiary)]">{t.time}</span>
                          <span className={`text-center font-bold ${t.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${formatPrice(t.price)}
                          </span>
                          <span className="text-right text-[var(--text-secondary)]">{t.size}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HIGH-THROUGHPUT WEB SCRAPER SIMULATOR */}
        {/* ============================================================== */}
        {activeTab === 'scraper' && (
          <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs">
            
            {/* Scraper Control Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 mb-6 border-b border-white/[0.06]">
              
              <div className="md:col-span-4">
                <label className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-2 font-bold">
                  TARGET DATA SOURCE
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'sec', label: 'SEC 10-K Filings' },
                    { id: 'bloomberg', label: 'Bond Spreads' },
                    { id: 'uniswap', label: 'Uniswap V3 RPC' }
                  ].map((target) => (
                    <button
                      key={target.id}
                      onClick={() => setScraperTarget(target.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        scraperTarget === target.id
                          ? 'bg-[var(--accent)] text-white font-bold'
                          : 'bg-white/[0.04] text-[var(--text-secondary)] hover:bg-white/[0.08]'
                      }`}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4">
                <label htmlFor="concurrency-slider" className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-2 font-bold">
                  PARALLEL WORKER CONCURRENCY: <span className="text-[var(--accent)]">{concurrency} THREADS</span>
                </label>
                <input
                  id="concurrency-slider"
                  aria-label="Worker concurrency level"
                  type="range"
                  min="2"
                  max="24"
                  step="2"
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={startScraper}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs transition-all ${
                    isScraping
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  }`}
                >
                  {isScraping ? '■ STOP PIPELINE' : '▶ LAUNCH CONCURRENT SCRAPER'}
                </button>
              </div>

            </div>

            {/* Scraper Live Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Extracted Payloads</div>
                <div className="text-xl font-bold text-[var(--text-primary)] mt-1">{scrapeMetrics.pagesScraped} docs</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Processed Payload Size</div>
                <div className="text-xl font-bold text-[var(--accent)] mt-1">{(scrapeMetrics.bytesExtracted / 1024).toFixed(1)} KB</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Average Pipeline Latency</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{scrapeMetrics.avgLatencyMs || 18} ms</div>
              </div>
            </div>

            {/* Live Data Stream Terminal */}
            <div className="rounded-xl border border-white/[0.08] bg-[#07080C] p-4 h-[350px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[11px] text-[var(--text-tertiary)] font-bold">
                <span>ASYNC PIPELINE BUFFER (AST &amp; REGEX EXTRACTOR)</span>
                <span>STATUS: {isScraping ? <span className="text-emerald-400 animate-pulse">STREAMING</span> : 'IDLE'}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {scrapedRecords.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[var(--text-tertiary)]">
                    Click &ldquo;LAUNCH CONCURRENT SCRAPER&rdquo; to start streaming extracted financial records
                  </div>
                ) : (
                  scrapedRecords.map((rec) => (
                    <div key={rec.id} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-[var(--accent)] font-bold">
                          {rec.source}
                        </span>
                        <span className="text-white font-bold">{rec.entity}</span>
                        <span className="text-[var(--text-secondary)]">{rec.metric}:</span>
                        <span className="text-emerald-400">{rec.value}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--text-tertiary)]">
                        <span>{rec.latencyMs}ms</span>
                        <span>{rec.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: QUANT & SYSTEMS LLM SANDBOX */}
        {/* ============================================================== */}
        {activeTab === 'llm' && (
          <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                AI SYSTEMS &amp; QUANT MODEL AUDITOR
              </h3>
              <p className="text-[var(--text-tertiary)] text-xs">
                Direct live inference against high-speed Groq LLMs loaded with full resume context, system architectures, and quant trading knowledge.
              </p>
            </div>

            {/* Quick Benchmark Prompts */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                'How does your C++ order matching engine achieve sub-microsecond latency?',
                'Explain how you used Kalman Filters in your Nifty 50 Quant Framework.',
                'What is the graph algorithm behind your DeFi Arbitrage Bot?',
                'Tell me about your experience at Walmart Global Tech and IIT Kharagpur.'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => { setLlmPrompt(p); runLlmBenchmark(p); }}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[var(--text-secondary)] hover:text-white border border-white/[0.06] text-[11px] transition-colors text-left"
                >
                  ⚡ &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); runLlmBenchmark(llmPrompt); }}
              className="flex gap-3 mb-6"
            >
              <input
                type="text"
                aria-label="Query for quantitative AI sandbox"
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
                placeholder="Ask any question about Kartik's low-latency systems or algorithms..."
                className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={llmLoading || !llmPrompt.trim()}
                className="px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {llmLoading ? 'INFERRING...' : 'QUERY AI'}
              </button>
            </form>

            {/* Response Output Box */}
            <div className="rounded-xl border border-white/[0.08] bg-[#07080C] p-5 min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">
                    INFERENCE STREAM OUTPUT
                  </span>
                  {llmLatency && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      {llmModelUsed} · {llmLatency}ms RESPONSE TIME
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {llmLoading ? (
                    <div className="flex items-center gap-2 text-[var(--accent)] animate-pulse">
                      <span>Computing tokens...</span>
                    </div>
                  ) : llmResponse ? (
                    <div className="space-y-2">
                      {llmResponse.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[var(--text-tertiary)]">
                      Select one of the benchmark queries above or enter a custom question to inspect response output.
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CTF & PACKET CHASER INTERACTIVE GAME */}
        {/* ============================================================== */}
        {activeTab === 'ctf' && (
          <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs">
            
            {/* Header & Objectives */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                    CYBER SYSTEMS CTF // MEMORY &amp; PACKET EXPLOITATION LAB
                  </h3>
                </div>
                <p className="text-[var(--text-tertiary)] text-xs">
                  Catch high-frequency telemetry packets, reverse-engineer memory dumps, and capture all 3 hidden flags.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-right">
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Score</div>
                  <div className="text-base font-bold text-amber-400">{ctfScore} PTS</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-right">
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Flags Captured</div>
                  <div className="text-base font-bold text-emerald-400">{solvedFlags.length} / 3</div>
                </div>
              </div>
            </div>

            {/* Game Canvas Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              <div className="lg:col-span-8 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 text-[11px] text-[var(--text-tertiary)] font-bold">
                  <span>PACKET CHASER // CLICK GLIDING PACKETS TO INTERCEPT</span>
                  <span className="text-amber-400">
                    {goldenPacketSpawned ? '⚡ GOLDEN ENCRYPTED PACKET DETECTED!' : `Catch ${Math.max(0, 4 - packetsCaught)} more to spawn Golden Packet`}
                  </span>
                </div>

                <div className="relative rounded-xl border border-white/[0.1] bg-[#07080C] overflow-hidden h-[300px]">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full h-full cursor-crosshair"
                  />

                  {unlockedFlag1 && (
                    <div className="absolute inset-x-4 bottom-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-sm font-bold">🚩 FLAG #1 UNLOCKED:</span>
                        <code className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-amber-400/20">
                          FLAG&#123;l0w_l4t3ncy_p4ck3t_1nt3rc3pt0r&#125;
                        </code>
                      </div>
                      <span className="text-[10px] text-amber-300">Copy &amp; submit below!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTF Challenge Clues Card */}
              <div className="lg:col-span-4 rounded-xl p-5 bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">
                    Active Challenge Intel
                  </h4>
                  <div className="space-y-3 text-[11px] text-[var(--text-secondary)]">
                    <div className={`p-2.5 rounded border ${solvedFlags.some(f => f.includes('p4ck3t')) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">[01] Packet Interceptor</span>
                        <span>{solvedFlags.some(f => f.includes('p4ck3t')) ? '✔ SOLVED' : 'INCOMPLETE'}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        Intercept 4 normal packets in the canvas to summon the 0x7F Golden Encrypted Packet.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded border ${solvedFlags.some(f => f.includes('r4d1x')) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">[02] Memory Core Dump</span>
                        <span>{solvedFlags.some(f => f.includes('r4d1x')) ? '✔ SOLVED' : 'INCOMPLETE'}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        Open your browser developer tools (F12) and inspect the Console for the base64 string.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded border ${solvedFlags.some(f => f.includes('k4lm4n')) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">[03] Kernel Privilege Escalation</span>
                        <span>{solvedFlags.some(f => f.includes('k4lm4n')) ? '✔ SOLVED' : 'INCOMPLETE'}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        Scroll to the Terminal in the Contact section and execute &lsquo;sudo root&rsquo;.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Flag Submission Desk */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  FLAG VERIFICATION DESK
                </span>
                {submissionMsg && (
                  <span className={`text-xs font-bold ${submissionMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {submissionMsg.text}
                  </span>
                )}
              </div>

              <form onSubmit={handleFlagSubmit} className="flex gap-3">
                <input
                  id="ctf-flag-input"
                  aria-label="Enter captured CTF flag"
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="Paste flag here (e.g. FLAG{...})"
                  className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  VERIFY FLAG
                </button>
              </form>

              {solvedFlags.length === 3 && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-500/40 text-center animate-fade-in">
                  <span className="text-base font-bold text-amber-300 block mb-1">
                    👑 ELITE SYSTEMS ARCHITECT // ALL 3 CTF FLAGS CRACKED!
                  </span>
                  <p className="text-xs text-[var(--text-secondary)]">
                    You have unlocked root authority across Kartik Patil&apos;s systems architecture. Ready to build high-performance software together? Connect via email at <a href="mailto:kmzpatil@gmail.com" className="text-white underline">kmzpatil@gmail.com</a>.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
