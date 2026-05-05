"use client";

import { useAuthStore } from "@/store/authStore";
import { LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useProjectStore } from "@/store/projectStore";

export function Topbar() {
  const { logout } = useAuthStore();
  const { selectedProject, cycleProject } = useProjectStore();
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/projects")) return "Projects";
    if (pathname.includes("/targets")) return "Targets";
    if (pathname.includes("/audits")) return "Audit History";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/70 px-6 pl-20 backdrop-blur-md z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase leading-none">
            {getBreadcrumb()}
          </span>
        </div>

        <div className="hidden md:flex ml-8 max-w-md flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 focus-within:border-black focus-within:bg-white transition-colors">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search targets, projects, runs..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 sm:inline-block">⌘</kbd>
            <kbd className="hidden rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 sm:inline-block">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4">
          <div
            onDoubleClick={cycleProject}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 border border-blue-200 shadow-sm transition-all hover:bg-blue-100 cursor-pointer select-none"
            title="Double click to change project"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-700 font-medium">
              {selectedProject ? selectedProject.name : "Select Project"}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-black transition-colors group"
        >
          <span className="hidden sm:inline-block font-light">Sign Out</span>
          <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </header>
  );
}
