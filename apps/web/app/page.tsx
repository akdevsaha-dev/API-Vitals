import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Navbar } from "@/components/landing/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Marquee />
    </div>
  );
}
