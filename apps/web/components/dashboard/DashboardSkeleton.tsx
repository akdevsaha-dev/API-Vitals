"use client";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col mt-15 gap-10 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-48 bg-neutral-200 rounded mb-2" />
          <div className="h-10 w-full max-w-xl bg-neutral-200 rounded" />
          <div className="h-4 w-full max-w-lg bg-neutral-200 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-neutral-200 rounded shrink-0" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b border-neutral-200 pb-2">
          <div className="h-6 w-40 bg-neutral-200 rounded" />
          <div className="h-4 w-60 bg-neutral-200 rounded mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[280px] rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                    <div className="h-3 w-32 bg-neutral-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-6 rounded bg-neutral-100" />
              </div>
              <div className="space-y-3 mb-6">
                <div className="h-4 w-full bg-neutral-50 rounded" />
                <div className="h-10 w-full bg-neutral-50 rounded" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-neutral-100 rounded" />
                  <div className="h-4 w-16 bg-neutral-200 rounded" />
                </div>
                <div className="h-6 w-20 bg-neutral-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="flex mt-15 flex-col gap-8 animate-pulse">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-neutral-200 rounded" />
          <div className="h-4 w-60 bg-neutral-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-neutral-200 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 h-48">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-100" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-20 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-neutral-50 rounded mb-6 flex-1" />
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <div className="h-8 w-16 bg-neutral-100 rounded" />
              <div className="h-8 w-24 bg-neutral-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
