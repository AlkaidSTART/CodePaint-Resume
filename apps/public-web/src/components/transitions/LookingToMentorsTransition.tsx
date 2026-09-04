import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

/**
 * LookingFor -> Mentors 间过渡：墨迹连接折线与名册火漆印/导线 (Ink Trace & Circuit Bus Transition)
 *
 * 动画特征：
 * 1. 一条手绘/电路导线风的阶梯折线从左侧招募连接点向右侧导师区脉冲式生长（DrawSVG）；
 * 2. 折线转折处的逻辑节点小圆点（Bus Nodes）依次高亮闪烁点亮；
 * 3. 一枚朱砂/黛蓝色的“导师名册 · FACULTY ROSTER”档案封签自右端平滑推入展开；
 * 4. 完美将横线纸招募需求引导至导师档案与实践经历中。
 */
export function LookingToMentorsTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const pathLine = root.querySelector<SVGPathElement>("[data-circuit-line]");
      const nodes = root.querySelectorAll<SVGCircleElement>("[data-node-dot]");
      const rosterTag = root.querySelector<HTMLElement>("[data-roster-tag]");
      const pulseArrow = root.querySelector<SVGPathElement>("[data-pulse-arrow]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 35%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. 导线脉冲绘制
      if (pathLine) {
        const len = pathLine.getTotalLength() || 600;
        gsap.set(pathLine, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(pathLine, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, 0);
      }

      // 2. 节点逐个点亮
      if (nodes.length > 0) {
        tl.fromTo(
          nodes,
          { scale: 0, opacity: 0, transformOrigin: "center center" },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.12, ease: "back.out(3)" },
          0.2
        );
      }

      // 3. 封签标签自右侧平滑滑入
      if (rosterTag) {
        tl.fromTo(
          rosterTag,
          { x: 50, opacity: 0, rotation: 6 },
          { x: 0, opacity: 1, rotation: -1.5, duration: 0.55, ease: "power3.out" },
          0.25
        );
      }

      // 4. 导线末梢小箭头描出
      if (pulseArrow) {
        const len = pulseArrow.getTotalLength() || 40;
        gsap.set(pulseArrow, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(pulseArrow, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, 0.6);
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
        {/* 左侧引导文案 */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
          <span className="font-mono2 text-[11px] font-medium tracking-wider text-black/50 uppercase">
            PATHWAY // TO MENTORSHIP
          </span>
        </div>

        {/* 中间：手绘阶梯折线导线 */}
        <div className="mx-6 flex flex-1 items-center">
          <svg
            viewBox="0 0 400 32"
            className="h-8 w-full text-sky-700/60"
            preserveAspectRatio="none"
          >
            <path
              data-circuit-line
              d="M0 16 L120 16 L145 6 L260 6 L285 24 L385 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              data-pulse-arrow
              d="M375 19 L388 24 L375 29"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle data-node-dot cx="120" cy="16" r="3.5" fill="#0284c7" />
            <circle data-node-dot cx="145" cy="6" r="3.5" fill="#0284c7" />
            <circle data-node-dot cx="260" cy="6" r="3.5" fill="#0284c7" />
            <circle data-node-dot cx="285" cy="24" r="3.5" fill="#0284c7" />
          </svg>
        </div>

        {/* 右侧：导师名册档案贴签 */}
        <div
          data-roster-tag
          className="relative inline-flex items-center gap-2 rounded-xs border border-sky-300/70 bg-[#f0f9ff] px-3.5 py-1.5 shadow-[2px_3px_0_rgba(2,132,199,0.12)]"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <span className="font-mono2 text-[11px] font-bold tracking-widest text-sky-800 uppercase">
            SECTION 03 // FACULTY DOSSIER
          </span>
        </div>
      </div>
    </div>
  );
}
