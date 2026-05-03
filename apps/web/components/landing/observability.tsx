"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const pathD = "M 0 65 L 1 66 L 2 64 L 3 65 L 4 62 L 5 63 L 6 60 L 7 59 L 8 60 L 9 64 L 10 61 L 11 60 L 12 65 L 13 63 L 14 62 L 15 66 L 16 67 L 17 65 L 18 64 L 19 66 L 20 64 L 21 14 L 22 66 L 23 65 L 24 64 L 25 70 L 26 72 L 27 68 L 28 67 L 29 65 L 30 68 L 31 66 L 32 64 L 33 65 L 34 62 L 35 60 L 36 63 L 37 65 L 38 64 L 39 60 L 40 59 L 41 55 L 42 60 L 43 55 L 44 25 L 45 40 L 46 50 L 47 52 L 48 55 L 49 53 L 50 50 L 51 51 L 52 55 L 53 58 L 54 60 L 55 58 L 56 65 L 57 60 L 58 64 L 59 66 L 60 68";

export const Observability = () => {
  const [hoverPoint, setHoverPoint] = useState<{ x: number, y: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const points = useMemo(() => {
    return pathD.split(" L ").map(p => {
      const [x, y] = p.replace("M ", "").split(" ");
      return { x: parseFloat(x), y: parseFloat(y) };
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const mappedX = (x / rect.width) * 60;

    let closest = points[0];
    let minDiff = Math.abs(points[0].x - mappedX);
    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - mappedX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = points[i];
      }
    }
    setHoverPoint(closest);
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-obs-animate]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <div id="obs" ref={sectionRef}>
      <div className="col">
        <div data-obs-animate className="flex w-full items-center tracking-widest font-mono text-sm uppercase text-neutral-500 gap-2">
          <div className="w-0.5 h-0.5 rounded bg-black "></div>
          <div>02</div>
          <div>-</div>
          <div>Observability</div>
        </div>
        <div data-obs-animate className="font-display mt-5 [word-spacing:0.5rem] -tracking-widest text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-2xl">
          Microsecond truth,{" "}
          <span className="font-sans tracking-tighter italic text-neutral-500 font-light">
            stitched together
          </span>{" "}
          live.
        </div>
        <div data-obs-animate className="max-w-lg tracking-wider mt-8 text-neutral-600">
          Every probe is captured, queued, and fanned-out across workers. The
          result lands on a dashboard built for operators — no toy graphs, no
          vanity numbers.
        </div>
        <div data-obs-animate className="w-full max-w-xl mt-10 border border-neutral-300 grid grid-cols-2 grid-rows-2 bg-white h-[280px]">
          <div className="col border-r px-5 border-b border-neutral-300 flex flex-col justify-center">
            <div className="uppercase text-[10px] font-mono font-light text-neutral-400 tracking-widest">
              REQUESTS PROBED
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              2,840,372
            </div>
            <div className="flex items-center text-xs gap-1.5 mt-2 font-mono">
              <TrendingUp strokeWidth={2} size={14} className="text-blue-500" />
              <div className="text-neutral-500">+12.4%</div>
            </div>
          </div>

          <div className="col px-5 border-b border-neutral-300 flex flex-col justify-center">
            <div className="uppercase text-[10px] font-mono font-light text-neutral-400 tracking-widest">
              ENDPOINTS MONITORED
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              184
            </div>
            <div className="flex items-center text-xs gap-1.5 mt-2 font-mono">
              <TrendingUp strokeWidth={2} size={14} className="text-blue-500" />
              <div className="text-neutral-500">+8</div>
            </div>
          </div>

          <div className="col border-r px-5 border-neutral-300 flex flex-col justify-center">
            <div className="uppercase text-[10px] font-mono font-light text-neutral-400 tracking-widest">
              MEDIAN P95 (MS)
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              146
            </div>
            <div className="flex items-center text-xs gap-1.5 mt-2 font-mono">
              <TrendingDown strokeWidth={2} size={14} className="text-neutral-500" />
              <div className="text-neutral-500">−4ms</div>
            </div>
          </div>

          <div className="col px-5 border-neutral-300 flex flex-col justify-center">
            <div className="uppercase text-[10px] font-mono font-light text-neutral-400 tracking-widest">
              REGRESSIONS CAUGHT
            </div>
            <div className="mt-3 tracking-tight text-4xl font-extrabold font-display">
              38
            </div>
            <div className="flex items-center text-xs gap-1.5 mt-2 font-mono">
              <div className="w-2.5 h-[1px] bg-neutral-400"></div>
              <div className="text-neutral-500">this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Graph Container */}
      <div data-obs-animate className="hidden lg:flex flex-1 justify-end">
        <div className="w-full max-w-[600px] border border-neutral-200 bg-white shadow-sm flex flex-col font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                API.LUMEN.DEV/V1/CHECKOUT · LAST 60 BURSTS
              </div>
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              region · sgp-1
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 border-b border-neutral-100 relative bg-[#fafafa]/50">
            <div className="flex flex-col p-5 border-r border-neutral-100">
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-2">P50</span>
              <span className="text-2xl font-bold font-sans tracking-tight">98ms</span>
            </div>
            {/* P95 with blue border overlay */}
            <div className="flex flex-col p-5 relative z-10 bg-blue-50/20">
              <div className="absolute inset-0 border border-blue-400 pointer-events-none"></div>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-2">P95</span>
              <span className="text-2xl font-bold font-sans tracking-tight text-black">146ms</span>
            </div>
            <div className="flex flex-col p-5 border-l border-neutral-100">
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-2">P99</span>
              <span className="text-2xl font-bold font-sans tracking-tight">312ms</span>
            </div>
          </div>

          {/* Graph Area */}
          <div className="relative h-[240px] w-full p-5 flex flex-col">
            {/* Y Axis */}
            <div className="absolute left-5 top-5 bottom-8 flex flex-col justify-between text-[8px] font-mono text-neutral-300">
              <span>160</span>
              <span>120</span>
              <span>80</span>
              <span>40</span>
              <span>0</span>
            </div>

            {/* X Axis */}
            <div className="absolute left-10 right-5 bottom-3 flex justify-between text-[7px] font-mono text-neutral-300">
              {[...Array(30)].map((_, i) => (
                <span key={i}>{i * 2}</span>
              ))}
            </div>

            {/* Graph SVG */}
            <div className="absolute left-10 right-5 top-5 bottom-8 cursor-crosshair">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 60 160"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverPoint(null)}
              >
                {/* P95 dashed line at value 146 -> 160 - 146 = 14 Y */}
                <line x1="0" y1="14" x2="55" y2="14" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="1 1" />
                <text x="56" y="15.5" fontSize="4" fill="#60a5fa" fontFamily="monospace">P9</text>

                {/* Shaded Area underneath */}
                <path
                  d={pathD + " L 60 160 L 0 160 Z"}
                  fill="rgba(0,0,0,0.02)"
                />

                {/* Main Line Graph Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#262626"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Hover Effects */}
                {hoverPoint && (
                  <g>
                    {/* Vertical dashed line */}
                    <line
                      x1={hoverPoint.x}
                      y1={hoverPoint.y}
                      x2={hoverPoint.x}
                      y2="160"
                      stroke="#a3a3a3"
                      strokeWidth="0.2"
                      strokeDasharray="0.5 0.5"
                    />
                    {/* Hover dot */}
                    <circle
                      cx={hoverPoint.x}
                      cy={hoverPoint.y}
                      r="1.2"
                      fill="black"
                      stroke="white"
                      strokeWidth="0.3"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
            <div className="text-[8px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              SPIKE AT PROBE 22 · TLS RENEGOTIATION, +68MS
            </div>
            <div className="text-[8px] font-mono tracking-[0.2em] text-neutral-400 lowercase flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300"></div>
              live
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
