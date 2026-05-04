"use client";

import { navLinks } from "@/constants";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export const Navbar = () => {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 20;

        gsap.to(headerRef.current, {
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(255, 255, 255, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          borderBottomColor: isScrolled
            ? "rgba(229, 229, 229, 0.5)"
            : "rgba(229, 229, 229, 0)",
          minHeight: isScrolled ? "8vh" : "10vh",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 w-full flex-center border-b border-transparent bg-transparent"
    >
      <nav className="container mx-auto px-5 2xl:px-0 flex-between w-full">
        <div id="logo" className="font-display text-xl font-extrabold">
          lumen
        </div>
        <div>
          <ul className="hidden md:flex-center gap-7 font-sans font-light text-sm">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-center font-sans font-light gap-4 text-sm">
          <Link
            href={"/signin"}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href={"/signup"}
            className="bg-black group hover:bg-blue-700 hover:border-blue-900 hover:cursor-pointer flex items-center justify-center gap-1 px-5 py-2 text-white transition-all"
          >
            <div>Start free</div>
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};
