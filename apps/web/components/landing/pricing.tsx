"use client";

import React, { useState, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
    {
        name: "Solo",
        description: "For an individual operator running checks from a laptop.",
        priceMonthly: "$0",
        priceYearly: "$0",
        buttonText: "Download CLI",
        buttonVariant: "outline",
        features: [
            "Single binary CLI",
            "Up to 25 endpoints",
            "7-day metric retention",
            "JSON & Prometheus export",
            "Community Discord",
        ],
    },
    {
        name: "Team",
        badge: "MOST TEAMS",
        description: "For startups and platform teams running production traffic.",
        priceMonthly: "$29",
        priceYearly: "$24",
        buttonText: "Start 14-day trial",
        buttonVariant: "dark",
        features: [
            "Everything in Solo",
            "Unlimited endpoints",
            "90-day retention + replay",
            "BullMQ region fan-out (3 regions)",
            "Slack & PagerDuty alerts",
            "SSO (Google + Microsoft)",
        ],
    },
    {
        name: "Scale",
        description: "For SREs at scale with audit, residency and SLO contracts.",
        priceMonthly: "Custom",
        priceYearly: "Custom",
        priceLabel: "",
        buttonText: "Talk to engineering",
        buttonVariant: "outline",
        features: [
            "Everything in Team",
            "Self-hosted & dedicated cloud",
            "Custom regions worldwide",
            "Audit log + SOC2 II",
            "Engineering-led onboarding",
            "Bring-your-own Postgres + Redis",
        ],
    },
];

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.from("[data-price-animate]", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="pricing" className="container w-full mx-auto border-t bg-neutral-50 border-neutral-200 px-5 2xl:px-0 pt-20 pb-32 flex flex-col items-center">
            <div className="flex flex-col items-center text-center max-w-3xl">
                <div data-price-animate className="flex items-center tracking-widest font-mono text-sm uppercase text-neutral-500 gap-2">
                    <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                    <div>05</div>
                    <div>—</div>
                    <div>PRICING</div>
                </div>

                <div data-price-animate className="mt-8 font-display -tracking-widest text-6xl md:text-7xl font-extrabold leading-tight">
                    Pay for telemetry,
                    <span className="font-sans tracking-tighter italic text-neutral-400 font-light block">
                        not for seats.
                    </span>
                </div>

                <p data-price-animate className="mt-8 tracking-wider text-neutral-600 font-light text-lg">
                    Honest, simple tiers. Cancel anytime. Open source CLI forever.
                </p>

                <div data-price-animate className="mt-10 flex items-center font-mono text-xs uppercase tracking-widest bg-white border border-neutral-200 p-1 shadow-sm">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-3  transition-colors ${!isYearly ? "bg-black text-white" : "text-neutral-500 hover:text-black"
                            }`}
                    >
                        MONTHLY
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-3  transition-colors ${isYearly ? "bg-black text-white" : "text-neutral-500 hover:text-black"
                            }`}
                    >
                        YEARLY · SAVE 17%
                    </button>
                </div>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl gap-0">
                {tiers.map((tier, index) => {
                    const isHighlighted = tier.name === "Team";
                    const price = isYearly ? tier.priceYearly : tier.priceMonthly;

                    return (
                        <div
                            data-price-animate
                            key={tier.name}
                            className={`relative flex flex-col p-10 ${isHighlighted
                                ? "bg-black text-white shadow-2xl z-10 -my-4 py-14"
                                : "bg-white text-black border border-neutral-200"
                                } ${index === 0 ? "md:border-r-0 md:rounded-l-2xl" : ""} ${index === 2 ? "md:border-l-0 md:rounded-r-2xl" : ""
                                }`}
                        >
                            {tier.badge && (
                                <div className="absolute top-0 left-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 font-mono">
                                    {tier.badge}
                                </div>
                            )}

                            <h3 className="font-sans font-bold text-2xl">{tier.name}</h3>
                            <p
                                className={`mt-4 text-sm font-light leading-relaxed h-12 ${isHighlighted ? "text-neutral-400" : "text-neutral-500"
                                    }`}
                            >
                                {tier.description}
                            </p>

                            <div className="mt-8 flex items-baseline gap-2">
                                <span className="font-display font-extrabold text-6xl tracking-tight">
                                    {price}
                                </span>
                                {price !== "Custom" && (
                                    <span
                                        className={`font-mono text-xs ${isHighlighted ? "text-neutral-500" : "text-neutral-400"
                                            }`}
                                    >
                                        /mo{isYearly ? " billed annually" : ""}
                                    </span>
                                )}
                            </div>

                            <button
                                className={`mt-10 flex items-center justify-between w-full px-5 py-4 text-sm font-medium border transition-colors ${isHighlighted
                                    ? "border-neutral-800 hover:bg-neutral-900"
                                    : "border-neutral-200 hover:bg-neutral-50"
                                    }`}
                            >
                                {tier.buttonText}
                                <ArrowRight size={16} />
                            </button>

                            <ul className="mt-10 flex flex-col gap-4">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check
                                            size={16}
                                            className={`mt-0.5 shrink-0 ${isHighlighted ? "text-blue-500" : "text-blue-500"
                                                }`}
                                        />
                                        <span
                                            className={`text-sm font-light ${isHighlighted ? "text-neutral-300" : "text-neutral-600"
                                                }`}
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
