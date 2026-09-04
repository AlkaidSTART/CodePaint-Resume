import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Mentors -> Outcomes 过渡：成果校验刻度线与归档印章
 */
export function MentorsToOutcomesTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trackLine = root.querySelector<SVGLineElement>("[data-track-line]");
      const tag = root.querySelector<HTMLElement>("[data-track-tag]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 35%",
          toggleActions: "play none none reverse",
        },
      });

      if (trackLine) {
        tl.fromTo(
          trackLine,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
          0
        );
      }

      if (tag) {
        tl.fromTo(
          tag,
          { scale: 0.8, opacity: 0, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.8)" },
          0.2
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative z-10 w-full overflow-hidden py-8 select-none sm:py-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono2 text-[11px] font-medium tracking-wider text-black/50 uppercase">
            RECORDS // TRACK & ACHIEVEMENTS
          </span>
        </div>

        <div className="mx-6 flex flex-1 items-center">
          <svg className="h-3 w-full" preserveAspectRatio="none">
            <line
              data-track-line
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#111"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              style={{ transformOrigin: "left center" }}
            />
          </svg>
        </div>

        <div
          data-track-tag
          className="relative inline-flex items-center gap-2 rounded-xs border border-emerald-300/70 bg-[#f0fdf4] px-3.5 py-1.5 shadow-[2px_3px_0_rgba(5,150,105,0.12)]"
          style={{ transform: "rotate(1.2deg)" }}
        >
          <span className="font-mono2 text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
            SECTION 04 // PROVEN OUTCOMES
          </span>
        </div>
      </div>
    </div>
  );
}
