"use client";

import { TargetCard } from "@/components/dashboard/TargetCard";
import { CreateTargetModal } from "@/components/dashboard/CreateTargetModal";
import { Plus, Settings2, Search } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "@/store/projectStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { TargetDetails } from "@/components/dashboard/TargetDetails";
import { useRef, useEffect } from "react";

const generateSparklineData = (base: number, volatility: number) => {
  return Array.from({ length: 40 }).map(() => ({
    value: Math.max(0, base + (Math.random() * volatility * 2 - volatility)),
  }));
};

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);

  const { projects, selectedProject, fetchProjectDetails, isLoading } = useProjectStore();

  const handleCreateTarget = async () => {
    if (selectedProject) {
      await fetchProjectDetails(selectedProject.id);
    }
  };

  const handleTargetSelect = (id: string) => {
    setSelectedTargetId(id);
  };

  useEffect(() => {
    if (selectedTargetId && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTargetId]);

  useEffect(() => {
    setSelectedTargetId(null);
  }, [selectedProject?.id]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const dashboardTargets = selectedProject?.targets?.map(target => {
    const latestResult = target.results?.[0];
    const sparklineData = (target.results && target.results.length > 1) 
      ? target.results.slice(0, 40).map(r => ({ value: r.totalTime })).reverse() 
      : generateSparklineData(100, 30);
    
    return {
      id: target.id,
      name: target.label,
      url: target.url,
      p95: latestResult ? Math.round(latestResult.p95) : 0,
      p99: latestResult ? Math.round(latestResult.p99) : 0,
      ttfb: latestResult ? Math.round(latestResult.ttfb) : 0,
      region: "us-east-1",
      status: (latestResult ? (latestResult.statusCode >= 200 && latestResult.statusCode < 400 ? "operational" : "degraded") : "operational") as "operational" | "degraded" | "down",
      data: sparklineData,
    };
  }) || [];

  const filteredTargets = dashboardTargets.filter(target => 
    target.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    target.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTarget = dashboardTargets.find(t => t.id === selectedTargetId);

  return (
    <div className="flex flex-col mt-15 gap-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2 flex items-center gap-2">
            <span className="text-blue-500">⚡</span> Network Performance & API Auditing
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-neutral-900 leading-tight max-w-2xl">
            Production telemetry for {selectedProject ? <span className="text-blue-600">{selectedProject.name}</span> : <span className="text-blue-600">your edges</span>}
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl font-light mt-2">
            Continuously probe upstream services, capture handshake-level breakdowns, and surface p99 regressions before users do.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search targets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus size={16} />
            Add Target
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b border-neutral-200 pb-2">
          <h2 className="text-lg font-display font-bold text-neutral-900">Monitored Targets</h2>
          <span className="text-xs text-neutral-500 mt-1">{filteredTargets.length} results · Real-time resolution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTargets.length > 0 ? (
            filteredTargets.map((target) => (
              <TargetCard 
                key={target.id} 
                {...target} 
                onSelect={handleTargetSelect}
                isSelected={selectedTargetId === target.id}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
              <p className="text-neutral-500 text-sm">No targets found for this project.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Add your first target
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedTarget && (
        <div ref={detailsRef} className="pt-10 border-t border-neutral-200 mt-10">
          <TargetDetails 
            id={selectedTarget.id}
            name={selectedTarget.name}
            url={selectedTarget.url}
            onClose={() => setSelectedTargetId(null)}
          />
        </div>
      )}

      <CreateTargetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateTarget}
      />
    </div>
  );
}

