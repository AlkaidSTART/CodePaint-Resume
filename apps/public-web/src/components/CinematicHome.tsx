import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VideoHero } from "./VideoHero";
import { StudioNext } from "./StudioNext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * CinematicHome — 电影幕布式覆盖。
 * 结构：screen 用 -mt-[100vh] 直接叠在 hero 上，初始 yPercent:100 藏到视口下方；
 * 滚动时整个 root 被 pin 住，scrub 把 screen 拉回 yPercent:0，全程盖住 hero。
 * hero 内容同步后退（上移 + 缩小 + 压暗），幕布顶角由圆变直。
 */
export function CinematicHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const heroMedia = root?.querySelector('[data-cinema="hero-media"]');
      const dim = root?.querySelector('[data-cinema="dim"]');
      const screen = root?.querySelector('[data-cinema="screen"]');
      const panel = root?.querySelector('[data-cinema="screen-panel"]');
      if (!root || !screen) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set([heroMedia, dim, screen, panel], { clearProps: "all" });
        return;
      }

      // 主时间线：scrub 跟手，ease 必须为 none（滚动位置与画面 1:1）。
      // ScrollTrigger 只挂在顶层 timeline 上，不挂在子 tween 里。
      const tl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.addLabel("rise", 0);
      // 下一幕从 hero 底部升起，全程覆盖 hero
      tl.fromTo(screen, { yPercent: 100 }, { yPercent: 0 }, "rise");
      // 银幕后退：内容上移、轻微缩小、压暗
      if (heroMedia) {
        tl.to(heroMedia, { yPercent: -10, scale: 0.965, autoAlpha: 0.3 }, "rise");
      }
      if (dim) {
        tl.fromTo(dim, { opacity: 0 }, { opacity: 0.32 }, "rise");
      }
      // 幕布顶角：覆盖过程中由圆变直
      if (panel) {
        tl.fromTo(
          panel,
          { borderTopLeftRadius: 26, borderTopRightRadius: 26 },
          { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          "rise"
        );
      }

      // 幕内文案：离散入场（非 scrub），与上面的 scrub 时间线分离
      gsap.from("[data-reveal]", {
        y: 26,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: screen,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} data-cinema="root" className="relative overflow-x-clip">
      <div data-cinema="hero" className="relative z-0">
        <div data-cinema="hero-media" className="will-change-transform">
          <VideoHero />
        </div>
        <div
          data-cinema="dim"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black opacity-0"
        />
      </div>
      {/* 负边距直接叠到 hero 上：初始状态由 GSAP 下移 100% 藏起，scrub 拉回 0 盖住 hero */}
      <div data-cinema="screen" className="relative z-10 -mt-[100vh] will-change-transform">
        <StudioNext />
      </div>
    </div>
  );
}
