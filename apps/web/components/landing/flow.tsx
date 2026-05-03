"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Drop the URL in.",
    description:
      "No agent, no SDK, no rewriting. Just paste your API endpoint and watch it come alive. Run it anywhere laptop, CI/CD, cloud anywhere you can reach.",
  },
  {
    number: "02",
    title: "Burst 100 concurrent probes.",
    description:
      "The engine fires a controlled burst, capturing DNS, TCP, TLS, and TTFB at the kernel-trace level. BullMQ orchestrates fan-out across regions if you scale up.",
  },
  {
    number: "03",
    title: "Persist with Drizzle + Postgres.",
    description:
      "Every probe is hashed, normalized, and committed type-safely. Your historical data stays queryable, exportable, replayable.",
  },
  {
    number: "04",
    title: "Watch the dashboard breathe.",
    description:
      "A high-fidelity Next.js + Framer Motion dashboard surfaces percentile latency, regressions and SLO breaches the moment they happen.",
  },
];

export const Flow = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-flow-animate]", {
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
    <section ref={sectionRef} id="flow" className="container w-full mx-auto px-5 2xl:px-0 py-32">
      <div className="flex flex-col lg:flex-row justify-between gap-20">
        <div className="lg:w-1/3 flex flex-col pt-10">
          <div data-flow-animate className="flex w-full items-center tracking-widest font-mono text-sm uppercase text-neutral-500 gap-2">
            <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
            <div>04</div>
            <div>—</div>
            <div>FLOW</div>
          </div>

          <div data-flow-animate className="mt-8 font-display -tracking-widest text-6xl font-extrabold leading-none">
            Four steps,
            <span className="font-sans tracking-tighter italic text-neutral-400 font-light block mt-2">
              end to end.
            </span>
          </div>

          <p data-flow-animate className="mt-10 tracking-wider text-neutral-500 font-light leading-relaxed">
            No SDK, no instrumentation, no rewriting. lumen treats your endpoint
            exactly the way the rest of the internet does — and shows you what
            they see.
          </p>
        </div>

        <div className="lg:w-7/12 flex flex-col">
          {steps.map((step, index) => (
            <div
              data-flow-animate
              key={step.number}
              className={`flex gap-10 py-12 ${index !== steps.length - 1 ? "border-b border-neutral-200" : ""
                }`}
            >
              <div className="font-display font-black text-8xl text-neutral-200 leading-none select-none">
                {step.number}
              </div>
              <div className="flex flex-col pt-3">
                <h3 className="text-2xl font-bold font-sans text-black">
                  {step.title}
                </h3>
                <p className="mt-4 text-neutral-500 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
