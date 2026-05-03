import { navLinks } from "@/constants";
import { ArrowUpRight } from "lucide-react";

export const Navbar = () => {
  return (
    <header>
      <nav>
        <div id="logo">lumen</div>
        <div>
          <ul>
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-center font-sans font-light gap-4 text-sm">
          <div>Sign in</div>
          <div className="bg-black group hover:bg-blue-700 hover:border-blue-900 hover:cursor-crosshair flex items-center justify-center gap-1 px-5 py-2 text-white">
            <div>Start free</div>
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
