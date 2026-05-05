"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useEffect } from "react";
import { useProjectStore } from "@/store/projectStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="flex h-screen w-full bg-[#fcfcfc] overflow-hidden font-sans text-neutral-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 relative">
          <div className="grid-triangle absolute inset-0 z-0 opacity-40 pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

