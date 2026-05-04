"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#fcfcfc] font-sans">
      <div className="grid-triangle absolute inset-0 z-0 opacity-40"></div>
      
      <header className="fixed top-0 left-0 w-full h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="font-display font-extrabold text-lg tracking-tight">Lumen</div>
          <div className="h-4 w-[1px] bg-neutral-300 mx-2"></div>
          <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">Dashboard</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-600">Engine Online</span>
          </div>
          <Link href="/signin" className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors">
            <span className="font-light">Sign Out</span>
            <LogOut size={14} />
          </Link>
        </div>
      </header>

      <div className="relative z-10 pt-32 px-6 sm:px-12 md:px-24 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-neutral-900 leading-tight">
            Hi.
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl font-light">
            Welcome to your dashboard. This is where you'll monitor your endpoint vitals, orchestrate bursts, and analyze telemetry.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Endpoints", value: "0", desc: "No endpoints configured yet." },
            { label: "Bursts Today", value: "0", desc: "Start a burst to see data." },
            { label: "Avg P95 Latency", value: "-", desc: "Waiting for telemetry." }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-neutral-200 p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">{stat.label}</span>
              <span className="text-4xl font-mono text-black font-medium">{stat.value}</span>
              <span className="text-xs text-neutral-400 font-light">{stat.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
