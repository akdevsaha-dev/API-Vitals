"use client";

import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BurstProbe = () => {
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [metrics, setMetrics] = useState({
    dns: "-",
    tcp: "-",
    tls: "-",
    ttfb: "-",
  });
  const [pValues, setPValues] = useState({
    p50: "-",
    p95: "-",
    p99: "-",
  });

  const containerRef = useRef(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    if (status === "complete" && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out", delay: 0.2 });
    }
  }, [status]);

  const runBurst = contextSafe(() => {
    if (status === "running") return;

    setStatus("running");
    setMetrics({ dns: "...", tcp: "-", tls: "-", ttfb: "-" });
    setPValues({ p50: "-", p95: "-", p99: "-" });

    const tl = gsap.timeline({
      onComplete: () => setStatus("complete"),
    });

    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setMetrics((m) => ({ ...m, dns: "ok", tcp: "..." }));
    });

    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setMetrics((m) => ({ ...m, tcp: "ok", tls: "..." }));
    });

    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setMetrics((m) => ({ ...m, tls: "ok", ttfb: "..." }));
    });

    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setMetrics({
        dns: "13ms",
        tcp: "38ms",
        tls: "50ms",
        ttfb: "139ms",
      });
      setPValues({
        p50: "111ms",
        p95: "128ms",
        p99: "169ms",
      });
    });
  });

  return (
    <div
      ref={containerRef}
      className="w-full max-w-125 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-sm border border-neutral-100 flex flex-col font-sans"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100/60">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200"></div>
          </div>
          <div className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            LUMEN · BURST PROBE
          </div>
        </div>
        <div className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
          100 reqs · region us-east-1
        </div>
      </div>

      <div className="p-6 pb-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
            TARGET URL
          </label>
          <div className="flex h-11">
            <div className="flex-1 flex items-center gap-2 px-3 border border-r-0 border-neutral-200">
              <Globe size={14} className="text-neutral-400" />
              <input
                type="text"
                defaultValue="https://api.stripe.com/v1/charges"
                readOnly
                className="w-full text-sm outline-none bg-transparent font-mono text-neutral-800"
              />
            </div>
            <button
              onClick={runBurst}
              disabled={status === "running"}
              className={`flex items-center justify-center hover:cursor-pointer gap-2 px-6 h-full text-sm font-medium transition-all ${status === "running"
                ? "bg-blue-500 text-white"
                : "bg-black text-white hover:bg-neutral-800"
                }`}
            >
              {status === "running" ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running
                </>
              ) : (
                <>
                  Burst
                  <Zap size={14} fill="currentColor" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "dns", label: "DNS", data: metrics.dns },
            { id: "tcp", label: "TCP", data: metrics.tcp },
            { id: "tls", label: "TLS", data: metrics.tls },
            { id: "ttfb", label: "TTFB", data: metrics.ttfb },
          ].map((m) => {
            const isBlack = m.data !== "-" && m.data !== "...";
            return (
              <div
                key={m.id}
                className={`flex flex-col p-3 transition-colors duration-300 ${isBlack ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-black'}`}
              >
                <span className={`text-[8px] font-mono tracking-widest uppercase ${isBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {m.label}
                </span>
                <span className="text-sm font-bold mt-2 font-mono">{m.data}</span>
              </div>
            );
          })}
        </div>

        <div className="h-[220px] flex flex-col justify-between border border-neutral-100 bg-white relative">

          <div className="flex-1 w-full relative pt-4 overflow-hidden">
            {status === "running" ? (
              <div className="w-full h-full flex flex-col items-center justify-center pb-8">
                <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400 mb-6">
                  TRACING ROUTE
                </span>
                <div className="flex items-end gap-1.5 h-10">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-black rounded-sm"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        animation: `pulse 0.5s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    ></div>
                  ))}
                </div>
                <style jsx>{`
                   @keyframes pulse {
                     0% { transform: scaleY(0.5); }
                     100% { transform: scaleY(1); }
                   }
                 `}</style>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 400 120" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                  <line x1="10" y1="60" x2="390" y2="60" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />

                  {status === "complete" && (
                    <path
                      ref={pathRef}
                      d="M 10 65 L 20 62 L 30 60 L 40 58 L 50 63 L 60 65 L 70 70 L 80 65 L 90 75 L 100 80 L 110 70 L 120 72 L 130 68 L 140 70 L 150 75 L 160 50 L 165 20 L 170 65 L 180 70 L 190 75 L 200 68 L 210 65 L 220 75 L 230 60 L 240 70 L 250 65 L 260 72 L 270 25 L 280 65 L 290 70 L 300 65 L 310 70 L 320 60 L 330 65 L 340 75 L 350 70 L 360 65 L 370 75 L 380 65 L 390 70"
                      fill="none"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-0 border-t border-neutral-100 mx-4 mb-4">
            <div className="flex flex-col p-3 border border-neutral-100">
              <span className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase">P50</span>
              <span className="text-sm font-bold mt-1 text-black font-sans">{pValues.p50}</span>
            </div>
            <div className="flex flex-col p-3 border border-blue-400 bg-blue-50/30 relative">
              <span className="text-[8px] font-mono tracking-widest text-blue-500 uppercase">P95</span>
              <span className="text-sm font-bold mt-1 text-black font-sans">{pValues.p95}</span>
            </div>
            <div className="flex flex-col p-3 border border-neutral-100">
              <span className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase">P99</span>
              <span className="text-sm font-bold mt-1 text-black font-sans">{pValues.p99}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-animate]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen w-full bg-[#ffffff] overflow-hidden">
      <div className="dots absolute inset-0 z-0"></div>
      <div className="grid-triangle absolute inset-0 z-0"></div>

      <div className="hero relative z-10 h-full pt-36 pb-20 lg:pt-30 lg:pb-0">
        <div>
          <div data-hero-animate className="border border-neutral-300 w-full max-w-md flex font-mono h-8 rounded-full font-light items-center justify-center text-xs sm:text-sm gap-2 sm:gap-3">
            <div className="w-1.5 h-1.5 animate-pulse rounded-full bg-blue-600"></div>
            <div>lumen</div>
            <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
            <div>100-request burst engine, now public</div>
          </div>
          <div>
            <div data-hero-animate className="dialog mt-5 tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold max-w-2xl leading-[1.1]">
              <div>
                The{" "}
                <span className="font-sans text-neutral-500 italic font-light">
                  truth
                </span>
              </div>
              <div>about your</div>
              <div>
                <span className="underline underline-offset-18 decoration-blue-600 decoration-7">
                  endpoints.
                </span>
              </div>
            </div>
            <div data-hero-animate className="mt-10 max-w-xl text-base lg:text-lg text-neutral-600">
              lumen fires{" "}
              <span className="font-semibold text-black">100 concurrent</span>{" "}
              probes at any HTTP target, then unpacks the timeline — DNS, TCP,
              TLS, TTFB and percentile latency in microseconds. Built on a Go
              engine, orchestrated through BullMQ, persisted with Drizzle.
            </div>
            <div data-hero-animate className="flex gap-5 mt-10">
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

        <div className="hidden lg:flex flex-1 flex-col items-end gap-4">
          <BurstProbe />
          <div className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase mr-2">
            - SIMULATED LOCALLY FOR THE DEMO · REAL ENGINE EMITS THE SAME TELEMETRY
          </div>
        </div>
      </div>
    </section>
  );
};
