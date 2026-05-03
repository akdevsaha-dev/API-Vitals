import {
  Box,
  CircleDashed,
  Diamond,
  Hexagon,
  Square,
  Triangle,
} from "lucide-react";

export const Marquee = () => {
  return (
    <div className=" border-y border-y-neutral-200">
      <div id="marquee">
        <div className="w-full md:pt-0 pt-10 md:w-40 uppercase tracking-widest font-sans text-neutral-600 text-xs font-light">
          Trusted by infra teams that ship at scale
        </div>
        <div className="overflow-hidden w-full md:pl-10 pl-0">
          <div className="flex gap-10 text-neutral-500 font-display font-semibold whitespace-nowrap animate-marquee will-change-transform ">
            <div className="flex gap-10">
              <div className="flex-center  gap-2 ">
                <Box strokeWidth={1.5} />
                <span>Boxworks</span>
              </div>
              <div className="flex-center  gap-2 ">
                <CircleDashed strokeWidth={1.5} />
                <span>Cipher</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Diamond strokeWidth={1.5} />
                <span>Facet</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Square strokeWidth={1.5} />
                <span>Quadrant</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Hexagon strokeWidth={1.5} />
                <span>Hexon</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Triangle strokeWidth={1.5} />
                <span>Triade</span>
              </div>
            </div>
            <div className="flex gap-10">
              <div className="flex-center  gap-2 ">
                <Box strokeWidth={1.5} />
                <span>Boxworks</span>
              </div>
              <div className="flex-center  gap-2 ">
                <CircleDashed strokeWidth={1.5} />
                <span>Cipher</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Diamond strokeWidth={1.5} />
                <span>Facet</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Square strokeWidth={1.5} />
                <span>Quadrant</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Hexagon strokeWidth={1.5} />
                <span>Hexon</span>
              </div>
              <div className="flex-center  gap-2 ">
                <Triangle strokeWidth={1.5} />
                <span>Triade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
