"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Folder, History, Target, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: Folder },
  { name: "Audit History", href: "/dashboard/audits", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-16 flex-col items-center border-r border-neutral-200 bg-white/70 py-4 z-50 transition-all duration-300 backdrop-blur-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white mb-8 shadow-sm shadow-black-600/20">
        <span className="font-display font-black text-xl tracking-tighter">Lu</span>
      </div>

      <nav className="flex flex-1 flex-col gap-y-4 w-full px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <div key={item.name} className="relative flex justify-center group">
              <Link
                href={item.href}
                className={cn(
                  "flex w-full flex-col items-center rounded-md p-2 text-xs font-medium transition-colors relative",
                  isActive
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}
                  aria-hidden="true"
                />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -mt-3 h-6 w-1 rounded-r-md bg-blue-600" />
                )}
              </Link>
              <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-100 pointer-events-none">
                <div className="bg-neutral-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded shadow-md whitespace-nowrap ml-2">
                  {item.name}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
