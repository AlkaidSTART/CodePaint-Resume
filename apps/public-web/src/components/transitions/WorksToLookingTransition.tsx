import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Works -> LookingFor 间过渡：账本虚线撕孔与工坊验讫印章 (Perforated Receipt & Workshop Seal)
 *
 * 动画特征：
 * 1. 虚线撕票孔（Perforation Line）从中心向两侧“拉链式”延展解开；
 * 2. 剪刀切口小图标随虚线滑动到位；
 * 3. 仿旧活字印章 [ CODEX // TALENT ACQUISITION ] 自上方微旋重力压印（弹性落印 + 墨晕展开）；
 * 4. 纸张边缘轻微折角投影，从纯净作品流切换到横线账本便签。
 */
export function WorksToLookingTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const perfLeft = root.querySelector<SVGLineElement>("[data-perf-left]");
      const perfRight = root.querySelector<SVGLineElement>("[data-perf-right]");
      const scissors = root.querySelector<SVGSVGElement>("[data-scissors]");
      const stamp = root.querySelector<HTMLElement>("[data-stamp]");
      const stampRing = root.querySelector<SVGCircleElement>("[data-stamp-ring]");
      const memoTag = root.querySelector<HTMLElement>("[data-memo-tag]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 35%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. 撕纸线从中间向两侧拉开
      if (perfLeft && perfRight) {
        tl.fromTo(
          [perfLeft, perfRight],
          { scaleX: 0 },
          { scaleX: 1, duration: 0.65, ease: "power2.inOut" },
          0
        );
      }

      // 2. 剪刀图标伴随撕线弹出
      if (scissors) {
        tl.fromTo(
          scissors,
          { scale: 0, rotation: -45, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" },
          0.1
        );
      }

      // 3. 工坊印章重力敲击盖下
      if (stamp) {
        tl.fromTo(
          stamp,
          { scale: 2.2, opacity: 0, rotation: 18, y: -30 },
          { scale: 1, opacity: 1, rotation: 4, y: 0, duration: 0.5, ease: "bounce.out" },
          0.2
        );
      }

      // 4. 印章圆环波纹扩散
      if (stampRing) {
        const len = stampRing.getTotalLength() || 120;
        gsap.set(stampRing, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(stampRing, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 0.35);
      }

      // 5. 提示标签淡入
      if (memoTag) {
        tl.fromTo(
          memoTag,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
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
      className="relative z-10 w-full overflow-hidden py-8 select-none sm:py-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* 左侧撕票虚线 */}
        <div className="relative flex flex-1 items-center">
          <svg className="h-4 w-full" preserveAspectRatio="none">
            <line
              data-perf-left
              x1="100%"
              y1="50%"
              x2="0%"
              y2="50%"
              stroke="#111"
              strokeOpacity="0.3"
              strokeWidth="2"
              strokeDasharray="6 6"
              style={{ transformOrigin: "right center" }}
            />
          </svg>
          {/* 小剪刀 */}
          <div className="absolute right-0 flex -translate-y-1/2 items-center justify-center bg-[#fffffc] px-1.5">
            <svg
              data-scissors
              viewBox="0 0 24 24"
              className="h-4 w-4 text-black/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
        </div>

        {/* 中间：工坊敲打印章 (红色/深墨色印泥风) */}
        <div className="mx-4 flex shrink-0 items-center gap-3">
          <div
            data-stamp
            className="relative flex items-center gap-2 rounded-md border-2 border-dashed border-[#c2410c]/70 bg-[#fff7ed] px-3.5 py-1.5 shadow-[2px_2px_0_rgba(194,65,12,0.15)]"
            style={{ transform: "rotate(4deg)" }}
          >
            <svg className="h-4 w-4 text-[#c2410c]" viewBox="0 0 24 24" fill="none">
              <circle
                data-stamp-ring
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono2 text-[11px] font-bold tracking-widest text-[#c2410c] uppercase">
              APPROVED // RECRUITMENT OPEN
            </span>
          </div>
        </div>

        {/* 右侧撕票虚线 */}
        <div className="relative flex flex-1 items-center">
          <svg className="h-4 w-full" preserveAspectRatio="none">
            <line
              data-perf-right
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#111"
              strokeOpacity="0.3"
              strokeWidth="2"
              strokeDasharray="6 6"
              style={{ transformOrigin: "left center" }}
            />
          </svg>
          <span
            data-memo-tag
            className="font-mono2 hidden text-[11px] tracking-tight text-black/40 sm:ml-3 sm:inline"
          >
            TEAR ALONG DOTTED LINE
          </span>
        </div>
      </div>
    </div>
  );
}
