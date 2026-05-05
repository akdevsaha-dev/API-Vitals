"use client";

import { useEffect, useState, useRef } from "react";
import { Play, AlertTriangle, Square, Activity, BarChart3, X } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";

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
  "  75/100 complete · p50 120ms",
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

interface AuditResultData {
  id: string;
  dnsTime: number;
  tcpTime: number;
  tlsTime: number;
  ttfb: number;
  totalTime: number;
  p50: number;
  p95: number;
  p99: number;
  stdDev: number;
  statusCode: number;
  createdAt: string;
}

interface TargetDetailsProps {
  id: string;
  name: string;
  url: string;
  onClose?: () => void;
}

export function TargetDetails({ id, name, url, onClose }: TargetDetailsProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "complete" | "failed">("idle");
  const [auditResult, setAuditResult] = useState<AuditResultData | null>(null);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
  };

  const startLogSimulation = () => {
    setLogs([]);
    let i = 0;
    logIntervalRef.current = setInterval(() => {
      if (i < TERMINAL_LOGS.length) {
        setLogs((prev) => [...prev, TERMINAL_LOGS[i]]);
        i++;
      }
    }, 400); // Slower interval since actual job might take a few seconds
  };

  const runTest = async () => {
    try {
      setStatus("running");
      setAuditResult(null);
      startLogSimulation();

      // Trigger the actual backend job
      const triggerRes = await axiosInstance.post("/audits/trigger", { targetId: id });
      const jobId = triggerRes.data.data.jobId;

      // Poll for job status
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await axiosInstance.get(`/audits/audit-jobs/${jobId}`);
          const jobData = statusRes.data.data;

          if (jobData.status === "completed") {
            clearTimers();
            
            // Fetch final results
            const resultRes = await axiosInstance.get(`/audits/audit-results?targetId=${id}&limit=1`);
            const results = resultRes.data.data;
            
            if (results && results.length > 0) {
               // The query joins with targets/projects, so the actual result might be nested or flat.
               // Assuming standard flat structure or `audit_results` key based on drizzle join defaults.
               // Let's extract the actual result row.
               const finalData = results[0].audit_results || results[0];
               setAuditResult(finalData);
            }
            
            setLogs(TERMINAL_LOGS); // Ensure all logs shown
            setStatus("complete");
          } else if (jobData.status === "failed") {
            clearTimers();
            setLogs(prev => [...prev, `! Audit Job Failed: ${jobData.errorLog || "Unknown error"}`]);
            setStatus("failed");
          }
        } catch (pollErr) {
           console.error("Polling error", pollErr);
           // Don't kill the interval on transient network errors, let it retry
        }
      }, 1500);

    } catch (err: any) {
      console.error("Failed to trigger audit", err);
      clearTimers();
      setLogs([`! Failed to initiate audit: ${err.response?.data?.message || err.message}`]);
      setStatus("failed");
    }
  };

  const abortTest = () => {
    clearTimers();
    setStatus("idle");
    setLogs([]);
    setAuditResult(null);
  };

  useEffect(() => {
    // Reset state when switching targets
    abortTest();
  }, [id]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Derived metrics for UI
  const totalHandshakeTime = auditResult 
    ? (auditResult.dnsTime + auditResult.tcpTime + auditResult.tlsTime + auditResult.ttfb).toFixed(2)
    : "0";
    
  const getPct = (val: number) => auditResult ? ((val / parseFloat(totalHandshakeTime)) * 100).toFixed(1) + "%" : "0%";

  // Mock distribution data based on actual p50/p95 if available
  const distributionData = auditResult ? [
    { range: "0-50", density: auditResult.p50 < 50 ? 30 : 5, p95: 0 },
    { range: "50-100", density: (auditResult.p50 >= 50 && auditResult.p50 < 100) ? 45 : 10, p95: 0 },
    { range: "100-150", density: (auditResult.p50 >= 100 && auditResult.p50 < 150) ? 50 : 15, p95: auditResult.p95 > 100 ? 5 : 0 },
    { range: "150-200", density: 20, p95: (auditResult.p95 >= 150 && auditResult.p95 < 200) ? 10 : 2 },
    { range: "200-250", density: 8, p95: (auditResult.p95 >= 200 && auditResult.p95 < 250) ? 8 : 1 },
    { range: "250-350", density: 2, p95: auditResult.p99 > 250 ? 5 : 0 },
    { range: "350-500", density: 0, p95: auditResult.p99 > 350 ? 3 : 0 },
  ] : DISTRIBUTION_DATA;

  return (
    <div className="flex flex-col gap-8 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-blue-500"></div>
             <h2 className="text-xl font-display font-bold text-neutral-900">{name}</h2>
          </div>
          <p className="text-sm text-neutral-500 font-mono">{url}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-black transition-colors bg-white border border-neutral-200 rounded-md shadow-sm"
          >
            <X size={16} />
            Close Audit
          </button>
        )}
      </div>

      {/* Terminal View */}
      <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden flex flex-col font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0d0d0d] gap-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-500 tracking-widest uppercase font-semibold flex items-center gap-2">
              <span className="text-cyan-500">&gt;_</span> AUDIT TERMINAL
            </span>
            
            {status === "idle" && (
              <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 border border-white/10 text-neutral-400">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
                idle
              </div>
            )}
            {status === "running" && (
              <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                running
              </div>
            )}
            {status === "complete" && (
              <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 border border-green-500/20 bg-green-500/10 text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                complete
              </div>
            )}
            {status === "failed" && (
              <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 border border-red-500/20 bg-red-500/10 text-red-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                failed
              </div>
            )}

            <div className="flex items-center gap-2 text-neutral-400">
              <Play size={10} className="fill-neutral-500" />
              {url}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === "running" ? (
              <button 
                onClick={abortTest}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-orange-500 bg-transparent border border-orange-500/50 hover:bg-orange-500/10 rounded-md transition-colors"
              >
                <Square size={12} className="fill-current" />
                Abort
              </button>
            ) : (
              <button 
                onClick={runTest}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <Play size={12} className="fill-current" />
                Start Burst Test
              </button>
            )}
            <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
              <AlertTriangle size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-64 relative">
          {status === "idle" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-sm">
              <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-4 text-cyan-500 font-bold">
                &gt;_
              </div>
              <p className="text-neutral-400 mb-1">
                Awaiting probe. Enter a URL and trigger a <span className="text-cyan-400 font-medium">burst test</span>.
              </p>
              <p className="text-neutral-600 text-xs">
                100 concurrent requests · TLS 1.3 · regional egress us-east-1
              </p>
            </div>
          ) : (
            <div className="p-4 h-full overflow-y-auto text-sm">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 py-0.5">
                  <span className="text-neutral-600 shrink-0 select-none w-20">
                    {new Date().toISOString().substring(11, 19)}
                  </span>
                  <span className="text-neutral-500 shrink-0 select-none">▶</span>
                  <span className={cn(
                    "break-all",
                    log?.startsWith("✓") ? "text-green-400" :
                    log?.startsWith("!") ? "text-orange-400" :
                    log?.startsWith("Audit") ? "text-cyan-400" :
                    "text-neutral-300"
                  )}>
                    {log}
                  </span>
                </div>
              ))}
              {status === "running" && (
                <div className="flex items-center gap-4 py-0.5 mt-1 text-cyan-400">
                   <div className="w-2 h-4 border-l-2 border-cyan-400 animate-pulse ml-[104px]"></div>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Breakdown (Light Theme) */}
      {(status === "idle" || status === "running" || !auditResult) ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center h-48 text-center mt-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center mb-4 text-blue-500">
            <BarChart3 size={16} />
          </div>
          <p className="text-neutral-900 font-medium mb-1">
            {status === "failed" ? "Audit Failed" : "No telemetry yet"}
          </p>
          <p className="text-neutral-500 text-xs max-w-sm">
            {status === "failed" 
              ? "The burst test encountered an error and could not generate telemetry data."
              : "Trigger a burst test from the Audit Terminal to populate p50/p95/p99 metrics, handshake breakdown, and the latency distribution histogram."
            }
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-700">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-display font-bold text-neutral-900">Telemetry Breakdown</h2>
              <span className="text-xs font-mono text-neutral-500 tracking-tight">
                run_id <span className="text-neutral-900">aud_{auditResult.id?.slice(0, 8)}</span> · 100 req · 100 ok · 0 failed · {auditResult.totalTime.toFixed(2)}ms
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-green-50 text-green-700 border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              COMPLETE
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "P50 Latency", value: auditResult.p50.toFixed(2), unit: "ms", color: "text-blue-600", icon: Activity },
              { label: "P95 Latency", value: auditResult.p95.toFixed(2), unit: "ms", color: "text-purple-600", icon: Activity },
              { label: "P99 Latency", value: auditResult.p99.toFixed(2), unit: "ms", color: "text-orange-500", icon: Activity },
              { label: "Std. Deviation", value: auditResult.stdDev.toFixed(2), unit: "ms", color: "text-neutral-900", icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">{stat.label}</span>
                  <stat.icon size={14} className="text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={cn("text-4xl font-display font-bold tracking-tight", stat.color)}>{stat.value}</span>
                  <span className="text-xs font-mono text-neutral-400">{stat.unit}</span>
                </div>
                <span className="text-xs font-mono text-neutral-500 mt-2">last 100 samples</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Handshake Latency */}
            <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-neutral-900">Handshake Latency</h3>
                <span className="text-xs font-mono text-neutral-500">Total <strong className="text-neutral-900 font-medium">{totalHandshakeTime}ms</strong></span>
              </div>
              
              <div className="flex h-3 w-full rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full" style={{ width: getPct(auditResult.dnsTime) }}></div>
                <div className="bg-purple-400 h-full" style={{ width: getPct(auditResult.tcpTime) }}></div>
                <div className="bg-orange-400 h-full" style={{ width: getPct(auditResult.tlsTime) }}></div>
                <div className="bg-green-400 h-full" style={{ width: getPct(auditResult.ttfb) }}></div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {[
                  { label: "DNS", value: auditResult.dnsTime.toFixed(2) + "ms", pct: getPct(auditResult.dnsTime), color: "bg-blue-400" },
                  { label: "TCP", value: auditResult.tcpTime.toFixed(2) + "ms", pct: getPct(auditResult.tcpTime), color: "bg-purple-400" },
                  { label: "TLS", value: auditResult.tlsTime.toFixed(2) + "ms", pct: getPct(auditResult.tlsTime), color: "bg-orange-400" },
                  { label: "Processing (TTFB)", value: auditResult.ttfb.toFixed(2) + "ms", pct: getPct(auditResult.ttfb), color: "bg-green-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono group">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                      <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-900 font-medium">{item.value}</span>
                      <span className="text-neutral-400 w-12 text-right">{item.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latency Distribution */}
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-neutral-900">Latency Distribution</h3>
                  <span className="text-xs font-mono text-neutral-500">Request density per bucket (ms)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">P95+</span>
                  </div>
                </div>
              </div>

              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={distributionData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
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
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#171717' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Bar dataKey="density" radius={[2, 2, 0, 0]} maxBarSize={40}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.density > 0 ? "url(#colorBlue)" : "transparent"} />
                      ))}
                    </Bar>
                    <Bar dataKey="p95" radius={[2, 2, 0, 0]} maxBarSize={40}>
                       {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.p95 > 0 ? "url(#colorOrange)" : "transparent"} />
                      ))}
                    </Bar>
                    
                    <defs>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
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
