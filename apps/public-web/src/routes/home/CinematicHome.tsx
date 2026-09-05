import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VideoHero } from "../../components/home/VideoHero";
import { IntroCurtain } from "../../components/home/IntroCurtain";
import { useState } from "react";
import { StudioNext } from "../../components/home/StudioNext";
import { LookingFor } from "../../components/home/LookingFor";
import { Mentors } from "../../components/home/Mentors";
import { Outcomes } from "../../components/home/Outcomes";
import { HeroToWorksTransition } from "../../components/transitions/HeroToWorksTransition";
import { WorksToLookingTransition } from "../../components/transitions/WorksToLookingTransition";
import { LookingToMentorsTransition } from "../../components/transitions/LookingToMentorsTransition";
import { MentorsToOutcomesTransition } from "../../components/transitions/MentorsToOutcomesTransition";
import { OutcomesToClosingTransition } from "../../components/transitions/OutcomesToClosingTransition";
import { ClosingInvitation } from "../../components/home/ClosingInvitation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * CinematicHome — 全屏吸顶 + 纯净现代流式架构 + 组件间个性化惊艳过渡。
 */
export function CinematicHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(false);

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
            if (self && self.direction > 0) {
              return progress > 0.08 ? 1 : 0;
            }
            return progress < 0.92 ? 0 : 1;
          },
          duration: { min: 0.25, max: 0.5 },
          delay: 0.04,
          ease: "power2.out",
        },
        onUpdate: (self) => {
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
      {/* 极客开屏动画：黑 -> 米白 -> 白 -> CodePaint 凝聚 */}
      {!introDone && <IntroCurtain onComplete={() => setIntroDone(true)} />}
      {/* 首屏：hero 独占一屏 */}
      <div
        data-cover="hero"
        className="relative z-0 min-h-[100dvh]"
      >
        <VideoHero startEntrance={introDone} />
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

        {/* 过渡 4: Mentors -> Outcomes (成果校验刻度线与归档印章) */}
        <MentorsToOutcomesTransition />

        {/* 成果幕：学长学姐去向与竞赛战绩 */}
        <div
          data-screen="outcomes"
          className="relative z-30 min-h-[100dvh] scroll-mt-28 bg-[#fffffc]"
        >
          <Outcomes />
        </div>

        {/* 过渡 5: Outcomes -> Closing (终章席位登机与就绪指示) */}
        <OutcomesToClosingTransition />

        {/* 终章幕：心动了？这里仍有你的一席之位！ */}
        <div
          data-screen="closing"
          className="relative z-40 min-h-[100dvh] scroll-mt-28 bg-[#fffffc]"
        >
          <ClosingInvitation />
        </div>
      </div>
    </div>
  );
}
