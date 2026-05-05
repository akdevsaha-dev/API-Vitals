"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useProjectStore } from "@/store/projectStore";
import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";
import { useState } from "react";

interface TargetCardProps {
  id: string;
  name: string;
  url: string;
  p95: number;
  p99: number;
  ttfb: number;
  region: string;
  status: "operational" | "degraded" | "down";
  data: { value: number }[];
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function TargetCard({
  id,
  name,
  url,
  p95,
  p99,
  ttfb,
  region,
  status,
  data,
  onSelect,
  isSelected,
}: TargetCardProps) {
  const { deleteTarget, isLoading } = useProjectStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-50 border-green-200";
      case "degraded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "down":
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
    }
  };

  const strokeColor = status === "operational" ? "#2563eb" : status === "degraded" ? "#eab308" : "#ef4444";
  const fillColor = status === "operational" ? "#3b82f6" : status === "degraded" ? "#facc15" : "#f87171";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteTarget(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(id);
    }
  };

  const containerClassName = cn(
    "group flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all relative overflow-hidden",
    onSelect ? "cursor-pointer" : "",
    isSelected ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-neutral-200 hover:shadow-md hover:border-neutral-300"
  );

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", getStatusDot())}></div>
            <h3 className="font-display font-bold text-neutral-900">{name}</h3>
          </div>
          <p className="text-xs font-mono text-neutral-500 truncate max-w-[150px]">{url}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDeleteClick}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-100 bg-neutral-50 text-neutral-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete target"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-100 bg-neutral-50 text-neutral-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">P95</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-mono font-medium text-neutral-900">{p95 || "-"}</span>
            <span className="text-xs text-neutral-500">ms</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">P99</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-mono font-medium text-neutral-900">{p99 || "-"}</span>
            <span className="text-xs text-neutral-500">ms</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">TTFB</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-mono font-medium text-neutral-900">{ttfb || "-"}</span>
            <span className="text-xs text-neutral-500">ms</span>
          </div>
        </div>
      </div>

      <div className="h-20 w-full mt-auto pt-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#gradient-${id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-neutral-100">
        <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border", getStatusColor())}>
          {status === "operational" ? "Operational" : status === "degraded" ? "Degraded" : "Down"}
        </div>
        <span className="text-[10px] font-mono text-neutral-400">{region}</span>
      </div>
    </>
  );

  return (
    <>
      {onSelect ? (
        <div onClick={handleClick} className={containerClassName}>
          {cardContent}
        </div>
      ) : (
        <Link href={`/dashboard/targets/${id}`} onClick={handleClick} className={containerClassName}>
          {cardContent}
        </Link>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Target"
        description="You are about to delete this monitored target. This will stop all probes and delete historical telemetry data."
        confirmText="confirm"
        itemName={name}
        confirmPlaceholder="Type 'confirm' to delete..."
        isLoading={isLoading}
      />
    </>
  );
}
