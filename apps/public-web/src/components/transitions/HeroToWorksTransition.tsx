import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

/**
 * Hero -> Works 间过渡：工程制图卷尺与工装胶带贴合 (Drafting Tape & Technical Caliper)
 *
 * 动画特征：
 * 1. 随着滚动靠近，一条精密的工程毫米刻度尺与基准线从左侧平滑绘制（DrawSVG）；
 * 2. 斜角 -3° 的暖黄工程胶带自左上方带弹性质感飞入贴合；
 * 3. 动态十字校准靶心（Reticle）带旋转视差展开，引出第二幕作品清单。
 */
export function HeroToWorksTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rulerPath = root.querySelector<SVGPathElement>("[data-ruler-path]");
      const ticks = root.querySelectorAll<SVGLineElement>("[data-ruler-tick]");
      const tape = root.querySelector<HTMLElement>("[data-tape]");
      const targetReticle = root.querySelector<SVGSVGElement>("[data-reticle]");
      const coordText = root.querySelector<HTMLElement>("[data-coord-text]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 92%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. 标尺基准线绘制
      if (rulerPath) {
        const len = rulerPath.getTotalLength() || 1000;
        gsap.set(rulerPath, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(rulerPath, { strokeDashoffset: 0, duration: 0.8, ease: "power3.out" }, 0);
      }

      // 2. 刻度牙齿弹起
      if (ticks.length > 0) {
        tl.fromTo(
          ticks,
          { scaleY: 0, transformOrigin: "bottom center" },
          { scaleY: 1, duration: 0.35, stagger: 0.012, ease: "back.out(2)" },
          0.1
        );
      }

      // 3. 胶带贴合入场
      if (tape) {
        tl.fromTo(
          tape,
          { x: -60, y: -20, rotation: -12, scale: 0.85, opacity: 0 },
          { x: 0, y: 0, rotation: -2.5, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" },
          0.15
        );
      }

      // 4. 十字瞄准靶心旋转入场
      if (targetReticle) {
        tl.fromTo(
          targetReticle,
          { rotation: -90, scale: 0.5, opacity: 0 },
          { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.2
        );
      }

      // 5. 坐标文本淡入
      if (coordText) {
        tl.fromTo(
          coordText,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          0.3
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative z-10 w-full overflow-hidden py-6 select-none sm:py-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* 左侧：斜切工装手撕胶带 */}
        <div
          data-tape
          className="relative inline-flex items-center gap-2 rounded-xs border border-amber-300/60 bg-[#FFDE59]/90 px-3.5 py-1.5 shadow-[2px_3px_0_rgba(17,17,17,0.1)] backdrop-blur-xs"
          style={{ transform: "rotate(-2.5deg)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#111]" />
          <span className="font-mono2 text-[11px] font-bold tracking-wider text-[#111] uppercase">
            SPEC // 01 · CRAFTED WORKS
          </span>
        </div>

        {/* 中右部：技术标尺与靶心 */}
        <div className="flex flex-1 items-center justify-end pl-6">
          <svg
            viewBox="0 0 500 24"
            className="h-6 w-full max-w-lg text-black/35"
            preserveAspectRatio="none"
          >
            <path
              data-ruler-path
              d="M0 20 L500 20"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {Array.from({ length: 26 }).map((_, i) => {
              const x = i * 20;
              const h = i % 5 === 0 ? 14 : i % 2 === 0 ? 8 : 4;
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

          {/* 十字靶心 */}
          <div className="ml-4 flex items-center gap-2">
            <svg
              data-reticle
              viewBox="0 0 24 24"
              className="h-5 w-5 text-sky-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <span
              data-coord-text
              className="font-mono2 hidden text-[11px] tracking-tight text-black/45 sm:inline"
            >
              GRID REF // 0x3F
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
