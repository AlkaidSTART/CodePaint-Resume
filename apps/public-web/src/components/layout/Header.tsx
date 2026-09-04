import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import logo from "../../assets/1280X1280.webp";

const albumUrl = "https://album.hub.feashow.cn/login";

type HeaderProps = {
  onApply: () => void;
};

/**
 * Header — 悬浮导航：下滑隐藏、上滑/回顶出现。
 * 视觉 rationale：招新页只有“相册 / 投递”两个去向，header 缩成一条常驻纸色浮条，
 * 滚动时让位给三幕内容，回头时立刻可用，不抢正文层级。
 */
export function Header({ onApply }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const bar = barRef.current;
      if (!bar || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1) 入场：同一顶层 timeline + label 编排，只动 transform/opacity。
      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro.addLabel("intro", 0);
      intro.from(
        ".header-item",
        {
          autoAlpha: 0,
          y: -10,
          duration: 0.5,
          stagger: 0.07,
          clearProps: "transform,opacity,visibility",
        },
        "intro",
      );
      intro.from(
        ".header-rule",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform",
        },
        "intro+=0.1",
      );

      // 2) 显隐：独立 paused timeline，ScrollTrigger 不挂子 tween，只由滚动方向驱动。
      // 退出用加速（power2.in），进入用减速（reverse 回 power2.out 起点），符合 motion 规范。
      const hideTl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.28, ease: "power2.in" },
      });
      hideTl.addLabel("hide", 0);
      hideTl.to(
        bar,
        { yPercent: -140, autoAlpha: 0, overwrite: "auto" },
        "hide",
      );

      const show = contextSafe(() => {
        hideTl.timeScale(1.4).reverse();
      });
      const hide = contextSafe(() => {
        // 入场未播完不抢跑；已隐藏不再重复 play。
        if (intro.isActive() || hideTl.isActive() || hideTl.progress() === 1) return;
        hideTl.timeScale(1).play();
      });

      // 方向判断 + 容差：小抖动不翻转；顶部附近永远展开，保证“回顶出现”。
      const SHOW_AFTER = 96;
      const TOLERANCE = 4;
      let lastY = window.scrollY;
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const y = window.scrollY;
          const dy = y - lastY;
          lastY = y;
          if (y <= SHOW_AFTER) {
            show();
            return;
          }
          if (Math.abs(dy) < TOLERANCE) return;
          if (dy > 0) hide();
          else show();
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3 pt-2 sm:top-4 sm:px-6 sm:pt-3"
    >
      <div className="mx-auto max-w-7xl">
        {/*
          防遮挡 + 丝滑：
          - pointer-events 只留在可交互子元素上，header 空隙不再挡住幕布边缘手势；
          - 背景改半透纸色 + 中等 blur（原来 2xl 全屏 backdrop 在 scrub 时每帧重绘，是卡顿主因）；
          - 独立合成层 isolate + transform-gpu，避免和幕布 transform 同层抖动。
          - 显隐只动 bar 层 transform/opacity，header 定位层不动，不触发布局。
        */}
        <div
          ref={barRef}
          className="pointer-events-auto relative flex min-h-16 transform-gpu items-center gap-4 overflow-hidden rounded-[14px] border border-black/10 bg-[#fffffc]/85 px-4 shadow-[0_10px_35px_rgba(20,20,20,0.1)] backdrop-blur-md backdrop-saturate-150 isolate will-change-transform sm:min-h-[72px] sm:px-6"
        >
          <div className="header-rule pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/15" aria-hidden="true" />
          <a className="header-item relative flex min-w-0 shrink-0 items-center gap-3 rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-black" href="/" aria-label="CodePaint Studio 首页">
            <img className="h-10 w-10 object-contain sm:h-12 sm:w-12" src={logo} alt="CodePaint Studio 标志" />
            <span className="hidden text-sm font-semibold tracking-[0.02em] sm:inline">CodePaint Studio</span>
          </a>
          <div className="header-item ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <a className="header-item group flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 py-2 text-sm text-black/70 outline-offset-4 transition-colors duration-150 hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-black sm:px-3" href={albumUrl} target="_blank" rel="noreferrer">
              <span className="truncate">工作室相册系统</span>
              <span className="text-base transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
            </a>
            <div className="h-5 w-px shrink-0 bg-black/15" aria-hidden="true" />
            <button className="header-item group flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2 py-2 text-sm text-black/70 outline-offset-4 transition-colors duration-150 hover:text-sky-600 active:text-sky-700 focus-visible:outline-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60 sm:px-3" type="button" onClick={onApply}>
              <span>前往投递</span>
              <span className="inline-block text-base transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
