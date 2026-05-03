"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote:
            "We replaced three internal scripts and a legacy synthetic-monitoring vendor with a single lumen burst. The TTFB delta on our checkout API was a 4-line PR.",
        name: "Alina Petrova",
        role: "STAFF SRE, NORTHWAVE",
        avatar: "https://i.pravatar.cc/150?u=alina",
    },
    {
        quote:
            "P99 was lying to us for months. lumen surfaced a TLS renegotiation issue on a single edge node — caught it on the first burst.",
        name: "Patricia Wisewood",
        role: "PLATFORM ENGINEER, TIDEFLOW",
        avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    {
        quote:
            "The dashboard reads like a piece of design software, not a Grafana clone. My on-call rotation actually opens it on Sundays.",
        name: "Daniel Okafor",
        role: "VP ENGINEERING, STRATUS",
        avatar: "https://i.pravatar.cc/150?u=daniel",
    },
];

export const Voices = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.from("[data-voice-animate]", {
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
        <section ref={sectionRef} id="voices" className="container w-full mx-auto px-5 2xl:px-0 py-32 flex flex-col">
            <div className="flex flex-col max-w-3xl">
                <div data-voice-animate className="flex items-center tracking-widest font-mono text-sm uppercase text-neutral-500 gap-2">
                    <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                    <div>06</div>
                    <div>—</div>
                    <div>VOICES</div>
                </div>

                <div data-voice-animate className="mt-8 font-display -tracking-widest text-6xl md:text-7xl font-extrabold leading-none">
                    The teams who
                    <span className="font-sans tracking-tighter italic text-neutral-400 font-light block mt-2">
                        trusted the burst.
                    </span>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {testimonials.map((testimonial, index) => (
                    <div
                        data-voice-animate
                        key={index}
                        className="flex flex-col justify-between p-10 bg-white border border-neutral-200"
                    >
                        <div>
                            <div className="flex gap-1 mb-8">
                                <div className="w-1.5 h-3 bg-blue-600"></div>
                                <div className="w-1.5 h-3 bg-blue-600"></div>
                            </div>

                            <p className="font-sans text-neutral-600 font-light leading-relaxed">
                                {testimonial.quote}
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center gap-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-none grayscale"
                            />
                            <div className="flex flex-col">
                                <div className="font-sans font-bold text-sm text-black">
                                    {testimonial.name}
                                </div>
                                <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
