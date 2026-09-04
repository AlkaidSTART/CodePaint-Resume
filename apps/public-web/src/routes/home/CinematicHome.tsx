import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VideoHero } from "../../components/home/VideoHero";
import { StudioNext } from "../../components/home/StudioNext";
import { LookingFor } from "../../components/home/LookingFor";
import { Mentors } from "../../components/home/Mentors";
import { HeroToWorksTransition } from "../../components/transitions/HeroToWorksTransition";
import { WorksToLookingTransition } from "../../components/transitions/WorksToLookingTransition";
import { LookingToMentorsTransition } from "../../components/transitions/LookingToMentorsTransition";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * CinematicHome — 全屏吸顶 + 纯净现代流式架构 + 组件间个性化惊艳过渡。
 *
 * 核心设计：
 * 1. 消除“蒙版遮罩”感：
 *    不使用底图钉住缩小、上层慢速爬升覆盖的抽屉模式；
 *    Hero 与 StudioNext 为自然相接的连续屏，没有图层重叠压制。
 * 2. 丝滑自动吸顶（Snap to Top）：
 *    在首屏 (Hero) 与第二屏 (StudioNext) 之间建立方向感知的磁吸过渡。
 * 3. 组件间差异化惊艳过渡动画：
 *    - 过渡 1 (Hero -> Works)：工程卡尺刻度绘制 + 斜角工装手撕胶带飞入 + 十字瞄准靶心旋转
 *    - 过渡 2 (Works -> LookingFor)：账本拉链撕票线双向拉开 + 剪刀滑动 + 红色验讫印章重力弹跳盖印
 *    - 过渡 3 (LookingFor -> Mentors)：阶梯电路脉冲导线绘制 + 节点序列点亮 + 档案名册封签滑入
 */
export function CinematicHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const hero = root?.querySelector<HTMLElement>('[data-cover="hero"]');
      const works = root?.querySelector<HTMLElement>('[data-screen="works"]');
      const heroCanvas = hero?.querySelector<HTMLCanvasElement>("canvas");
      if (!root || !hero || !works) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        return;
      }

      ScrollTrigger.config({ ignoreMobileResize: true });

      // 首屏与第二屏之间的方向感知自动吸顶
      const snapTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${hero.offsetHeight}`,
        snap: {
          snapTo: (progress, self) => {
            // 向下滚：超过 8% 即顺势平滑吸顶到 StudioNext
            if (self && self.direction > 0) {
              return progress > 0.08 ? 1 : 0;
            }
            // 向上滚：低于 92% 即顺势平滑吸回 Hero
            return progress < 0.92 ? 0 : 1;
          },
          duration: { min: 0.25, max: 0.5 },
          delay: 0.04,
          ease: "power2.out",
        },
        onUpdate: (self) => {
          // 滚过首屏后，隐藏 hero canvas 降低 GPU 开销
          if (heroCanvas) {
            const outOfView = self.progress >= 0.98;
            heroCanvas.style.visibility = outOfView ? "hidden" : "visible";
          }
        },
      });

      return () => {
        if (heroCanvas) {
          heroCanvas.style.visibility = "";
        }
        snapTrigger.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} data-screens="root" className="relative isolate overflow-x-clip">
      {/* 首屏：hero 独占一屏 */}
      <div
        data-cover="hero"
        className="relative z-0 min-h-[100dvh]"
      >
        <VideoHero />
      </div>

      {/* 后续内容：纯净文档流，无任何祖先 transform 干扰 sticky */}
      <div
        data-cover="flow"
        className="relative z-10 bg-[#fffffc]"
      >
        {/* 过渡 1: Hero -> Works (工程卡尺与工装胶带贴合) */}
        <HeroToWorksTransition />

        {/* 作品展示幕：自动吸顶目标 */}
        <div
          data-screen="works"
          className="relative z-0 min-h-[100dvh] scroll-mt-28 bg-[#fffffc]"
        >
          <StudioNext />
        </div>

        {/* 过渡 2: Works -> LookingFor (账本撕票虚线与验讫印章) */}
        <WorksToLookingTransition />

        {/* 招募幕 */}
        <div
          data-screen="looking"
          className="relative z-10 min-h-[100dvh] scroll-mt-28 bg-[#fffffc]"
        >
          <LookingFor />
        </div>

        {/* 过渡 3: LookingFor -> Mentors (电路脉冲导线与名册封签) */}
        <LookingToMentorsTransition />

        {/* 导师幕 */}
        <div
          data-screen="mentors"
          className="relative z-20 min-h-[100dvh] scroll-mt-28 bg-[#fffffc]"
        >
          <Mentors />
        </div>
      </div>
    </div>
  );
}
