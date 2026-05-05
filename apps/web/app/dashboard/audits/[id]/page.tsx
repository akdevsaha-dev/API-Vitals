"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { ArrowLeft, Loader2, Clock, Globe, Shield, Activity, BarChart2, AlertCircle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { generateInsights } from "@/lib/insights";

type AuditDetail = {
  job: {
    id: string;
    targetId: string;
    status: "pending" | "processing" | "completed" | "failed";
    errorLog: string | null;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
  };
  target: {
    id: string;
    projectId: string;
    url: string;
    label: string | null;
  };
  project: {
    id: string;
    name: string;
  };
  result: {
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
  } | null;
};

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAuditDetail = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/audits/history/${id}`);
        setAudit(res.data.data);
      } catch (err: any) {
        console.error("Failed to fetch audit details", err);
        setError("Failed to load audit report. It may have been deleted or you don't have access.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 mt-15 max-w-5xl mx-auto w-full">
        <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded-md mb-2"></div>
        <div className="h-10 w-1/3 bg-neutral-200 animate-pulse rounded-md"></div>
        <div className="h-6 w-1/4 bg-neutral-200 animate-pulse rounded-md mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-xl border border-neutral-200"></div>
          ))}
        </div>
        
        <div className="h-96 bg-neutral-100 animate-pulse rounded-xl border border-neutral-200"></div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <Activity size={24} />
        </div>
        <h2 className="text-xl font-display font-bold text-neutral-900">Report Not Found</h2>
        <p className="text-neutral-500 text-center max-w-md">{error}</p>
        <button 
          onClick={() => router.push('/dashboard/audits')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-neutral-800 transition-colors"
        >
          Back to Audits
        </button>
      </div>
    );
  }

  const { job, target, result } = audit;

  const chartData = result ? [
    { name: 'DNS Lookup', value: result.dnsTime, color: '#3b82f6', icon: Globe },
    { name: 'TCP Handshake', value: result.tcpTime, color: '#8b5cf6', icon: Activity },
    { name: 'TLS Negotiation', value: result.tlsTime, color: '#10b981', icon: Shield },
    { name: 'TTFB', value: result.ttfb, color: '#f59e0b', icon: Clock },
  ] : [];

  const insights = result ? generateInsights(result) : [];

  return (
    <div className="flex flex-col gap-8 mt-15 max-w-5xl mx-auto w-full pb-20">
      <button 
        onClick={() => router.push('/dashboard/audits')}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black w-fit transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Audit History
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-neutral-900">
              Audit Report
            </h1>
            <div className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border",
              job.status === "completed" ? "bg-green-50 text-green-700 border-green-200" :
              job.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
              "bg-amber-50 text-amber-700 border-amber-200"
            )}>
              {job.status}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-neutral-500">
            <p>Target: <span className="font-mono text-neutral-900">{target.url}</span> {target.label && `(${target.label})`}</p>
            <p>Run ID: <span className="font-mono text-neutral-900">aud_{job.id.substring(0, 8)}</span></p>
            <p>Date: {format(new Date(job.createdAt), "PPpp")}</p>
          </div>
        </div>
        
        {result && (
          <div className="flex flex-col items-end gap-1 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Total Latency</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-mono font-medium text-neutral-900">{result.totalTime.toFixed(1)}</span>
              <span className="text-neutral-500">ms</span>
            </div>
            <span className="text-xs text-neutral-500">Status Code: <span className={cn("font-mono font-medium", result.statusCode < 400 ? "text-green-600" : "text-red-600")}>{result.statusCode}</span></span>
          </div>
        )}
      </div>

      {job.errorLog && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-800">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Activity size={18} />
            Audit Failed
          </h3>
          <p className="font-mono text-sm break-all">{job.errorLog}</p>
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="P50 Latency" value={result.p50} unit="ms" />
            <MetricCard title="P95 Latency" value={result.p95} unit="ms" />
            <MetricCard title="P99 Latency" value={result.p99} unit="ms" highlight={result.p99 > 500} />
            <MetricCard title="Std Deviation" value={result.stdDev} unit="ms" />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8 border-b border-neutral-100 pb-4">
              <BarChart2 className="text-blue-500" />
              <h2 className="text-lg font-display font-bold text-neutral-900">Latency Breakdown</h2>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                  <XAxis type="number" unit="ms" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" width={120} stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f5f5f5'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)} ms`, 'Duration']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {insights.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm mt-8">
              <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4">
                <Lightbulb className="text-amber-500" />
                <h2 className="text-lg font-display font-bold text-neutral-900">AI Performance Insights</h2>
              </div>
              <div className="flex flex-col gap-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className={cn(
                    "flex gap-4 p-4 rounded-lg border",
                    insight.severity === "critical" ? "bg-red-50/50 border-red-100" :
                    insight.severity === "warning" ? "bg-amber-50/50 border-amber-100" :
                    "bg-blue-50/50 border-blue-100"
                  )}>
                    <div className="mt-0.5 flex-shrink-0">
                      {insight.severity === "critical" ? <AlertCircle className="text-red-500" size={20} /> :
                       insight.severity === "warning" ? <AlertCircle className="text-amber-500" size={20} /> :
                       <CheckCircle2 className="text-blue-500" size={20} />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className={cn(
                        "font-bold text-sm",
                        insight.severity === "critical" ? "text-red-900" :
                        insight.severity === "warning" ? "text-amber-900" :
                        "text-blue-900"
                      )}>{insight.title}</h3>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        insight.severity === "critical" ? "text-red-800" :
                        insight.severity === "warning" ? "text-amber-800" :
                        "text-blue-800"
                      )}>{insight.actionable_advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, unit, highlight = false }: { title: string, value: number, unit: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "flex flex-col p-5 rounded-xl border bg-white shadow-sm",
      highlight ? "border-amber-200 ring-1 ring-amber-200 bg-amber-50/30" : "border-neutral-200"
    )}>
      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">{title}</span>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className={cn("text-3xl font-mono font-medium", highlight ? "text-amber-700" : "text-neutral-900")}>
          {value.toFixed(1)}
        </span>
        <span className={cn("text-sm", highlight ? "text-amber-500" : "text-neutral-500")}>{unit}</span>
      </div>
    </div>
  );
}
