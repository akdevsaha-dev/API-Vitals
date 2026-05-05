"use client";

import { useEffect, useState } from "react";
import { Play, AlertTriangle } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

// Mock Data
const TERMINAL_LOGS = [
  "Initializing Go Engine (Prober v1.2.0)...",
  "Resolving DNS via 1.1.1.1 (UDP/53)...",
  "✓ A record acquired in 9.4ms",
  "Performing 3-way TCP Handshake...",
  "✓ SYN -> SYN-ACK -> ACK (24.8ms RTT)",
  "TLS 1.3 Negotiated (X25519, AES_256_GCM)...",
  "✓ Certificate chain validated (Let's Encrypt R3)",
  "Commencing 100-request concurrency burst...",
  "  25/100 complete · p50 118ms",
  "  50/100 complete · p50 121ms",
  "! Detected jitter spike on request #67 (+220ms)",
  "  100/100 complete · 0 failures",
  "Audit finalized. Generating telemetry breakdown...",
];

const DISTRIBUTION_DATA = [
  { range: "0-50", density: 10, p95: 0 },
  { range: "50-100", density: 18, p95: 0 },
  { range: "100-150", density: 41, p95: 0 },
  { range: "150-200", density: 22, p95: 0 },
  { range: "200-250", density: 8, p95: 0 },
  { range: "250-350", density: 2, p95: 1 },
  { range: "350-500", density: 0, p95: 2 },
];

export default function TargetDetailsPage({ params }: { params: { id: string } }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const runTest = () => {
    setIsRunning(true);
    setShowResults(false);
    setLogs([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < TERMINAL_LOGS.length) {
        setLogs((prev) => [...prev, TERMINAL_LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setShowResults(true);
      }
    }, 200);
  };

  useEffect(() => {
    setLogs(TERMINAL_LOGS);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-bold text-neutral-900">The Prober</h1>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Burst-test any endpoint with 100 concurrent requests · live engine logs
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-900 shadow-xl overflow-hidden font-mono flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 text-xs tracking-widest uppercase">&gt;_ Audit Terminal</span>
            <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              {isRunning ? "Running" : "Complete"}
            </div>
            <span className="text-neutral-300 text-sm ml-2">https://api.acme.io/v2/health</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={runTest}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-black bg-white hover:bg-neutral-200 rounded transition-colors disabled:opacity-50"
            >
              <Play size={12} />
              Start Burst Test
            </button>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <AlertTriangle size={16} />
            </button>
          </div>
        </div>
        <div className="p-4 h-64 overflow-y-auto text-sm">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 py-0.5">
              <span className="text-neutral-600 shrink-0 select-none">
                {new Date().toISOString().substring(11, 19)}
              </span>
              <span className={cn(
                "break-all",
                log.startsWith("✓") ? "text-green-400" :
                log.startsWith("!") ? "text-yellow-400" :
                log.startsWith("Audit") ? "text-blue-400" :
                "text-neutral-300"
              )}>
                {log}
              </span>
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-2 mt-2 text-neutral-500">
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-display font-bold text-neutral-900">Telemetry Breakdown</h2>
              <span className="text-xs font-mono text-neutral-500 tracking-tight">
                run_id <span className="text-neutral-900">aud_1777929166072</span> · 100 req · 100 ok · 0 failed · 4.98s
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-mono tracking-widest uppercase bg-green-50 text-green-700 border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Complete
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "P50 Latency", value: "120", unit: "ms", subtitle: "last 100 samples", color: "text-blue-600" },
              { label: "P95 Latency", value: "185", unit: "ms", subtitle: "last 100 samples", color: "text-purple-600" },
              { label: "P99 Latency", value: "450", unit: "ms", subtitle: "last 100 samples", color: "text-orange-500" },
              { label: "Std. Deviation", value: "12", unit: "ms", subtitle: "last 100 samples", color: "text-neutral-900" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">{stat.label}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={cn("text-4xl font-mono font-medium", stat.color)}>{stat.value}</span>
                  <span className="text-sm font-mono text-neutral-400">{stat.unit}</span>
                </div>
                <span className="text-xs text-neutral-500">{stat.subtitle}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-neutral-900">Handshake Latency</h3>
                <span className="text-xs font-mono text-neutral-500">Total <strong className="text-neutral-900">285ms</strong></span>
              </div>
              
              <div className="flex h-4 w-full rounded-full overflow-hidden mt-2">
                <div className="bg-blue-400 h-full" style={{ width: '3.5%' }}></div>
                <div className="bg-purple-400 h-full" style={{ width: '8.8%' }}></div>
                <div className="bg-orange-400 h-full" style={{ width: '17.5%' }}></div>
                <div className="bg-green-400 h-full" style={{ width: '70.2%' }}></div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {[
                  { label: "DNS", value: "10ms", pct: "3.5%", color: "bg-blue-400" },
                  { label: "TCP", value: "25ms", pct: "8.8%", color: "bg-purple-400" },
                  { label: "TLS", value: "50ms", pct: "17.5%", color: "bg-orange-400" },
                  { label: "Processing", value: "200ms", pct: "70.2%", color: "bg-green-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                      <span className="text-neutral-600 font-mono text-xs">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      <span className="text-neutral-900 font-medium">{item.value}</span>
                      <span className="text-neutral-400 w-10 text-right">{item.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-neutral-900">Latency Distribution</h3>
                  <span className="text-xs text-neutral-500">Request density per bucket (ms)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Density</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">P95+</span>
                  </div>
                </div>
              </div>

              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DISTRIBUTION_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="range" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#737373', fontFamily: 'monospace' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#737373', fontFamily: 'monospace' }}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f5f5f5' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Bar dataKey="density" radius={[2, 2, 0, 0]} maxBarSize={40}>
                      {DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.density > 0 ? "#3b82f6" : "#f97316"} />
                      ))}
                    </Bar>
                    <Bar dataKey="p95" radius={[2, 2, 0, 0]} maxBarSize={40}>
                       {DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#f97316" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
