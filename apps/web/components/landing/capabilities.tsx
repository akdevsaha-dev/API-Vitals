import { Cpu, Database, Gauge, Layers, Terminal, Workflow } from "lucide-react";

export const Capabilities = () => {
  return (
    <div className="pt-40 bg-neutral-50">
      <div id="cap">
        <div className="col w-full">
          <div className="flex w-full items-center tracking-widest font-mono text-sm  uppercase text-neutral-500 gap-2">
            <div className="w-0.5 h-0.5 rounded bg-black "></div>
            <div>03</div>
            <div>-</div>
            <div>capabilities</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="font-display mt-5 [word-spacing:0.5rem] -tracking-widest text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-155">
              Built like a infrastructure,{" "}
              <span className="font-sans tracking-tighter italic text-neutral-500 font-light">
                Not a side project.
              </span>
            </div>
            <div className="text-neutral-600 mt-6 md:mt-20 md:max-w-100">
              Six primitives, one runtime. Every layer chosen for the worst-case
              on-call night.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 mt-14">
            <div className="border col group hover:border-neutral-600 border-neutral-300 p-8  min-h-120">
              <div className="flex-between">
                <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                  <Cpu
                    strokeWidth={1.5}
                    className="group-hover:text-white"
                    size={18}
                  />
                </div>
                <div className="font-mono text-xs text-neutral-500">01</div>
              </div>
              <div className="col mt-10 font-display text-2xl font-extrabold">
                A Go engine, not a wrapper.
              </div>
              <div className="mt-5 w-120 text-neutral-500 text-sm">
                Our CLI is purpose-built around net/http/httptrace — every
                connect, write, and read is timestamped at the kernel boundary.
              </div>
              <div className="mt-50 w-60 font-mono text-xs font-light text-neutral-900">
                <div>lumen burst api.example.com \</div>
                <div>--concurrency 100 \</div>
                <div>--duration 30s \</div>
                <div>--emit json</div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="border group hover:border-neutral-600 border-neutral-300 p-6  min-h-60">
                <div className="flex-between">
                  <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                    <Workflow
                      strokeWidth={1.5}
                      className="group-hover:text-white"
                      size={18}
                    />
                  </div>
                  <div className="font-mono text-xs text-neutral-500">02</div>
                </div>
                <div className="col mt-10 font-display text-2xl font-extrabold">
                  Async by design.
                </div>
                <div className="mt-5 w-120 text-neutral-500 text-sm">
                  BullMQ + Upstash Redis schedule, deduplicate, and retry
                  probes. Your dashboard never blocks on a long check.
                </div>
              </div>

              <div className="border group hover:border-neutral-600 border-neutral-300 p-6  min-h-60">
                <div className="flex-between">
                  <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                    <Database
                      strokeWidth={1.5}
                      className="group-hover:text-white"
                      size={18}
                    />
                  </div>
                  <div className="font-mono text-xs text-neutral-500">03</div>
                </div>
                <div className="col mt-10 font-display text-2xl font-extrabold">
                  Type-safe data layer.
                </div>
                <div className="mt-5 w-120 text-neutral-500 text-sm">
                  Drizzle ORM against Postgres. Migrations stay honest, queries
                  stay fast.
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="border group hover:border-neutral-600 border-neutral-300 p-6 min-h-50">
              <div className="flex-between">
                <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                  <Layers
                    strokeWidth={1.5}
                    className="group-hover:text-white"
                    size={18}
                  />
                </div>
                <div className="font-mono text-xs text-neutral-500">04</div>
              </div>

              <div className="col mt-6 font-display text-2xl font-extrabold">
                Polyglot monorepo.
              </div>

              <div className="mt-2 text-neutral-500 text-sm">
                Turborepo + pnpm workspaces. Go binary, Node workers, Next.js
                dashboard — one push, one pipeline.
              </div>
            </div>

            <div className="border group hover:border-neutral-600 border-neutral-300 p-6 min-h-50">
              <div className="flex-between">
                <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                  <Gauge
                    strokeWidth={1.5}
                    className="group-hover:text-white"
                    size={18}
                  />
                </div>
                <div className="font-mono text-xs text-neutral-500">05</div>
              </div>

              <div className="col mt-6 font-display text-2xl font-extrabold">
                P95 / P99, in your face.
              </div>

              <div className="mt-2 text-neutral-500 text-sm">
                Percentiles aren&apos;t a tooltip — they&apos;re the headline.
                Set SLOs and lumen burns when they break.
              </div>
            </div>

            <div className="border group hover:border-neutral-600 border-neutral-300 p-6 min-h-50 ">
              <div className="flex-between">
                <div className="h-10 w-10 flex-center border group-hover:bg-black border-neutral-200">
                  <Terminal
                    strokeWidth={1.5}
                    className="group-hover:text-white"
                    size={18}
                  />
                </div>
                <div className="font-mono text-xs text-neutral-500">06</div>
              </div>

              <div className="col mt-6 font-display text-2xl font-extrabold">
                CI-native CLI.
              </div>

              <div className="mt-3 text-neutral-500 text-sm">
                Drop the binary in any pipeline. JSON, Prometheus, OTel
                exporters out of the box.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
