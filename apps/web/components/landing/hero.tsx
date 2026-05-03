import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative h-screen w-full bg-[#ffffff] overflow-hidden">
      <div className="dots absolute inset-0 z-0"></div>
      <div className="grid-triangle absolute inset-0 z-0"></div>

      <div className="hero relative z-10 h-full">
        <div>
          <div className="border border-neutral-300 w-105 flex mt-14 font-mono h-8 rounded-full font-light items-center justify-center text-sm gap-3">
            <div className="w-1.5 h-1.5 animate-pulse rounded-full bg-blue-600"></div>
            <div>lumen</div>
            <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
            <div>100-request burst engine, now public</div>
          </div>
          <div>
            <div className="dialog mt-5 tracking-tighter text-8xl font-display font-extrabold max-w-150">
              The{" "}
              <span className="font-sans text-neutral-500 italic font-light">
                truth
              </span>{" "}
              about your{" "}
              <span className="underline underline-offset-18 decoration-blue-600 decoration-7">
                endpoints.
              </span>
            </div>
            <div className="mt-10 w-150 text-lg text-neutral-600">
              lumen fires{" "}
              <span className="font-semibold text-black">100 concurrent</span>{" "}
              probes at any HTTP target, then unpacks the timeline — DNS, TCP,
              TLS, TTFB and percentile latency in microseconds. Built on a Go
              engine, orchestrated through BullMQ, persisted with Drizzle.
            </div>
            <div className="flex gap-5 mt-10">
              <div className="bg-black group hover:bg-blue-700 hover:border-blue-900 text-white px-4 py-3 flex-center gap-2">
                <div className="font-light text-sm">Run your first burst</div>
                <ArrowRight
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  size={16}
                />
              </div>
              <div className="px-4 py-3 text-sm font-light border border-neutral-400">
                See how it works
              </div>
            </div>
          </div>
        </div>
        {/* Right side content (you can add anything here) */}
        <div>hel</div>
      </div>
    </section>
  );
};
