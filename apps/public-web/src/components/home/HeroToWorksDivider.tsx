import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

/**
 * HeroToWorksDivider — 过渡 1: 标尺展开 + 胶带粘合过渡带
 * 视觉机制：
 * - 顶部从 Hero 的点阵纸流出；
 * - 滚动触发时，一把工程卡尺/刻度标尺线从左向右 DrawSVG 快速划出；
 * - 伴随手绘斜纹纸胶带以倾角 -2deg 弹入贴合；
 * - 坐标轴读数与刻度齿牙产生视差错落，将草稿纸自然切入作品工作台。
 */
export function HeroToWorksDivider() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rulerLine = root.querySelector<SVGPathElement>("[data-ruler-line]");
      const tape = root.querySelector<HTMLElement>("[data-tape-strip]");
      const ticks = root.querySelectorAll<SVGLineElement>("[data-ruler-tick]");
      const badge = root.querySelector<HTMLElement>("[data-ruler-badge]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      if (rulerLine) {
        const len = rulerLine.getTotalLength() || 800;
        gsap.set(rulerLine, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(rulerLine, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 0);
      }

      if (ticks.length) {
        tl.fromTo(
          ticks,
          { scaleY: 0, transformOrigin: "bottom center" },
          { scaleY: 1, duration: 0.4, stagger: 0.015, ease: "back.out(2)" },
          0.15
        );
      }

      if (tape) {
        tl.fromTo(
          tape,
          { scaleX: 0, scaleY: 0.8, opacity: 0, rotation: -8, transformOrigin: "left center" },
          { scaleX: 1, scaleY: 1, opacity: 1, rotation: -2, duration: 0.55, ease: "back.out(1.5)" },
          0.1
        );
      }

      if (badge) {
        tl.fromTo(
          badge,
          { y: 15, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
          0.3
        );
      }
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative z-10 w-full overflow-hidden py-6 select-none sm:py-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* 左侧胶带 */}
        <div
          data-tape-strip
          className="relative inline-flex items-center rounded-xs bg-[#fef08a]/80 px-3 py-1 shadow-xs ring-1 ring-black/10 backdrop-blur-xs"
          style={{ transform: "rotate(-2deg)" }}
        >
          <span className="font-mono2 text-[10px] font-semibold tracking-wider text-black/70 uppercase">
            STAGE 01 // PROJECTS DEPLOYED
          </span>
        </div>

        {/* 右侧微型标尺与刻度 */}
        <div className="flex flex-1 items-center justify-end pl-6">
          <svg
            viewBox="0 0 400 24"
            className="h-6 w-full max-w-md text-black/40"
            preserveAspectRatio="none"
          >
            <path
              data-ruler-line
              d="M0 20 L400 20"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {Array.from({ length: 21 }).map((_, i) => {
              const x = i * 20;
              const h = i % 5 === 0 ? 12 : i % 2 === 0 ? 7 : 4;
              return (
                <line
                  key={i}
                  data-ruler-tick
                  x1={x}
                  y1={20 - h}
                  x2={x}
                  y2={20}
                  stroke="currentColor"
                  strokeWidth={i % 5 === 0 ? 1.5 : 1}
                />
              );
            })}
          </svg>
          <span
            data-ruler-badge
            className="font-mono2 ml-3 shrink-0 text-[11px] text-black/40"
          >
            SCALE 1:1
          </span>
        </div>
      </div>
    </div>
  );
}
