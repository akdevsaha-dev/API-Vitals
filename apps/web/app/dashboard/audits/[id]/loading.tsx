"use client";

import { ArrowLeft } from "lucide-react";

export default function AuditDetailLoading() {
  return (
    <div className="flex flex-col gap-8 mt-15 max-w-5xl mx-auto w-full pb-20">
      <button 
        disabled
        className="flex items-center gap-2 text-sm text-neutral-400 w-fit cursor-not-allowed"
      >
        <ArrowLeft size={16} />
        Back to Audit History
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="h-5 w-16 bg-neutral-200 animate-pulse rounded-full"></div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="h-4 w-3/4 bg-neutral-100 animate-pulse rounded-md"></div>
            <div className="h-4 w-1/2 bg-neutral-100 animate-pulse rounded-md"></div>
            <div className="h-4 w-2/3 bg-neutral-100 animate-pulse rounded-md"></div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 bg-neutral-50 p-4 rounded-xl border border-neutral-200 min-w-[150px]">
          <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="h-10 w-20 bg-neutral-200 animate-pulse rounded-md my-1"></div>
          <div className="h-4 w-28 bg-neutral-200 animate-pulse rounded-md"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col p-5 rounded-xl border border-neutral-200 bg-white shadow-sm h-[104px]">
            <div className="h-3 w-20 bg-neutral-100 animate-pulse rounded-md mb-auto"></div>
            <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded-md mt-auto"></div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
          <div className="h-5 w-5 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="h-6 w-40 bg-neutral-200 animate-pulse rounded-md"></div>
        </div>
        
        <div className="h-80 w-full flex flex-col justify-between py-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded-md"></div>
              <div 
                className="h-8 bg-neutral-100 animate-pulse rounded-r-md" 
                style={{ width: `${Math.random() * 60 + 20}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
