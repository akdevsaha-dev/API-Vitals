import { TrendingDown, TrendingUp } from "lucide-react";

export const Observability = () => {
  return (
    <div id="obs" className="">
      <div className="col">
        <div className="flex w-full items-center tracking-widest font-mono text-sm  uppercase text-neutral-500 gap-2">
          <div className="w-0.5 h-0.5 rounded bg-black "></div>
          <div>02</div>
          <div>-</div>
          <div>Observability</div>
        </div>
        <div className="font-display mt-5 [word-spacing:0.5rem] -tracking-widest text-6xl font-extrabold w-150">
          Microsecond truth,{" "}
          <span className="font-sans tracking-tighter italic text-neutral-500 font-light">
            stitched together
          </span>{" "}
          live.
        </div>
        <div className="w-125 tracking-wider mt-8 text-neutral-600">
          Every probe is captured, queued, and fanned-out across workers. The
          result lands on a dashboard built for operators — no toy graphs, no
          vanity numbers.
        </div>
        <div className="w-130 h-70 mt-10 border border-neutral-300 grid grid-cols-2 grid-rows-2">
          <div className="col border-r px-5 border-b border-neutral-300">
            <div className="uppercase text-xs font-light text-neutral-500 tracking-wider">
              Request probed
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              2,840,372
            </div>
            <div className="flex items-center text-sm gap-2 mt-2 font-mono">
              <TrendingUp strokeWidth={1} size={16} className="text-blue-600" />
              <div className="text-neutral-500 text-xs">+12.4%</div>
            </div>
          </div>

          <div className="col px-5 border-b border-neutral-300">
            <div className="uppercase text-xs font-light text-neutral-500 tracking-wider">
              Endpoints monitored
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              184
            </div>
            <div className="flex items-center text-sm gap-2 mt-2 font-mono">
              <TrendingUp strokeWidth={1} size={16} className="text-blue-600" />
              <div className="text-neutral-500 text-xs">+8</div>
            </div>
          </div>

          <div className="col border-r px-5 border-neutral-300">
            <div className="uppercase text-xs font-light text-neutral-500 tracking-wider">
              Median P95 (ms)
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              146
            </div>
            <div className="flex items-center text-sm gap-2 mt-2 font-mono">
              <TrendingDown
                strokeWidth={1}
                size={16}
                className="text-neutral-600"
              />
              <div className="text-neutral-500 text-xs">−4ms</div>
            </div>
          </div>

          <div className="col px-5 border-neutral-300">
            <div className="uppercase text-xs font-light text-neutral-500 tracking-wider">
              Regressions caught
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              38
            </div>
            <div className="text-sm mt-2 font-mono">
              <div className="text-neutral-500 text-xs">- this week</div>
            </div>
          </div>
        </div>
      </div>
      <div>hello</div>
    </div>
  );
};
