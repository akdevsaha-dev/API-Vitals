import { Capabilities } from "@/components/landing/capabilities";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Navbar } from "@/components/landing/navbar";
import { Observability } from "@/components/landing/observability";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Marquee />
      <Observability />
      <Capabilities />
    </div>
  );
}
