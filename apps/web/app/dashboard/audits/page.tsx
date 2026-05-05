"use client";

import { cn } from "@/lib/utils";
import { Search, Filter, MoreHorizontal, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { useProjectStore } from "@/store/projectStore";

type AuditHistoryItem = {
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
    totalTime: number;
    p95: number;
  } | null;
};

export default function AuditsPage() {
  const [audits, setAudits] = useState<AuditHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { selectedProject } = useProjectStore();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/audits/history", {
          params: {
            projectId: selectedProject?.id
          }
        });
        setAudits(res.data.data || []);
      } catch (err: any) {
        console.error("Failed to fetch audit history", err);
        setError("Failed to load audit history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [selectedProject?.id]);

  const filteredAudits = audits.filter(audit => 
    audit.job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.target.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.target.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col mt-15 gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Audit History</h1>
          <p className="text-sm text-neutral-500 mt-1">Review past burst tests and historical telemetry data.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID or URL"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-black transition-colors shadow-sm">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-black transition-colors shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-neutral-400">
            <Loader2 size={24} className="animate-spin mb-4" />
            <p className="text-sm">Loading audit history...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        ) : audits.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-neutral-500">
            <p className="text-sm">No audits found. Run a burst test from the dashboard.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50/80 text-[10px] font-mono tracking-widest uppercase text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Run ID</th>
                    <th className="px-6 py-4 font-medium">Target</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Duration</th>
                    <th className="px-6 py-4 font-medium text-right">P95 Latency</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredAudits.map((audit) => {
                    let dateDisplay = "Unknown";
                    try {
                      dateDisplay = formatDistanceToNow(new Date(audit.job.createdAt), { addSuffix: true });
                    } catch (e) {}

                    return (
                      <tr 
                        key={audit.job.id} 
                        onClick={() => router.push(`/dashboard/audits/${audit.job.id}`)}
                        className="hover:bg-neutral-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-neutral-900">aud_{audit.job.id.substring(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-neutral-900">{audit.target.label || "Unnamed"}</span>
                            <span className="text-xs text-neutral-500">{audit.target.url}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border",
                            audit.job.status === "completed" ? "text-green-700 bg-green-50 border-green-200" :
                              audit.job.status === "failed" ? "text-red-700 bg-red-50 border-red-200" :
                                "text-amber-700 bg-amber-50 border-amber-200"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full",
                              audit.job.status === "completed" ? "bg-green-500" :
                                audit.job.status === "failed" ? "bg-red-500" :
                                  "bg-amber-500 animate-pulse"
                            )}></div>
                            {audit.job.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{dateDisplay}</td>
                        <td className="px-6 py-4 font-mono text-right text-neutral-900">
                          {audit.result ? `${audit.result.totalTime.toFixed(2)}ms` : "-"}
                        </td>
                        <td className="px-6 py-4 font-mono text-right text-neutral-900">
                          {audit.result ? `${audit.result.p95.toFixed(2)}ms` : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500 mt-auto">
              <span>Showing 1 to {filteredAudits.length} of {audits.length} results</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 bg-neutral-100 font-medium text-black">1</button>
                <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
