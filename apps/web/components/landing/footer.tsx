import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
    <path d="M12 18h.01"></path>
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      <section className="relative w-full border-b border-white/10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="container mx-auto px-5 2xl:px-0 py-32 md:py-48 relative z-10 flex flex-col lg:flex-row justify-between lg:items-end gap-16">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center tracking-widest font-mono text-sm uppercase text-neutral-500 gap-2">
              <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
              <div>07</div>
              <div>—</div>
              <div>START NOW</div>
            </div>

            <div className="mt-8 font-display -tracking-widest text-6xl md:text-8xl font-extrabold leading-none text-white">
              Stop guessing.
              <span className="font-display tracking-tighter italic text-neutral-500 font-light block">
                Start bursting.
              </span>
            </div>

            <p className="mt-8 tracking-wider text-neutral-400 font-light text-lg">
              14-day trial. Free CLI forever. No credit card to read your own
              telemetry.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:w-[400px]">
            <Link href={"/signin"} className="flex items-center justify-between w-full px-6 py-5 bg-white text-black font-medium hover:bg-blue-600 hover:text-white transition-colors">
              Run your first burst
              <ArrowUpRight size={18} />
            </Link>
            <Link href={"#hero"} className="flex items-center justify-between w-full px-6 py-5 bg-[#0a0a0a] text-white border border-white/10 font-medium hover:bg-white/5 transition-colors">
              Read the docs
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 2xl:px-0 py-24 flex flex-col lg:flex-row justify-between gap-20">
        <div className="flex flex-col max-w-md">
          <div className="font-display -tracking-widest text-3xl font-bold leading-tight">
            Telemetry that lands in your inbox.
          </div>
          <p className="mt-4 text-sm text-neutral-500 font-light leading-relaxed">
            Engineering deep dives on latency, queue design, and
            high-cardinality observability. Once a fortnight. No noise.
          </p>

          <div className="mt-8 flex w-full">
            <input
              type="email"
              placeholder="you@company.com"
              className="bg-transparent border border-r-0 border-white/10 text-white px-4 py-3 w-full focus:outline-none focus:border-white/30 text-sm font-light"
            />
            <button className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2">
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-4 font-mono text-[9px] uppercase tracking-widest text-neutral-600">
            WE DON'T SELL · UNSUBSCRIBE ANYTIME
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
              Product
            </h4>
            {["Engine", "Dashboard", "Integrations", "Roadmap", "Changelog"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
              Resources
            </h4>
            {[
              "Docs",
              "API Reference",
              "Status",
              "Open Source",
              "Brand",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
              Company
            </h4>
            {["About", "Customers", "Pricing", "Careers", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
              Legal
            </h4>
            {["Terms", "Privacy", "Security", "DPA", "Subprocessors"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 2xl:px-0 py-10 border-t border-white/10 flex flex-col pt-20">
        <div className="font-display font-extrabold text-[18vw] leading-[0.75] text-white tracking-tighter w-full text-center md:text-left select-none">
          lumen
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-16 pb-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            © 2026 LUMEN LABS · BUILT FOR OPERATORS
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-3 border border-white/10 hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href="#"
              className="p-3 border border-white/10 hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
            >
              <TwitterIcon size={16} />
            </a>
            <a
              href="#"
              className="p-3 border border-white/10 hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};
