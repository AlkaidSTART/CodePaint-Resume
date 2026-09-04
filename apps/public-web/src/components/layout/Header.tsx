import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import logo from "../../assets/1280X1280.webp";
import { useAppStore } from "../../store/appStore";

gsap.registerPlugin(useGSAP);

const albumUrl = "https://album.hub.feashow.cn/login";

type HeaderProps = {
  onApply: () => void;
};

/**
 * Header — 极致通透悬浮导航：
 * - 开屏阶段完全透明，文字、图标、边框随背景演进做平滑色彩插值；
 * - 开屏完成后恢复精致微磨砂背板与交互自适应；
 * - 交互保持极简清透，下滑自动隐藏、上滑/回顶优雅回弹。
 */
export function Header({ onApply }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const introProgress = useAppStore((state) => state.introProgress); // 0.0 (黑) -> 0.5 (米白) -> 1.0 (纸白)
  const introDone = useAppStore((state) => state.introDone);

  // 开屏期间完全透明，前景色根据背景黑->米白->纸白进度连续平滑插值
  const t = Math.max(0, Math.min(1, introProgress));
  const textColor = introDone
    ? "#111111"
    : `rgb(${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)})`;
  const subTextColor = introDone
    ? "rgba(17, 17, 17, 0.72)"
    : `rgba(${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)}, 0.82)`;
  const dividerColor = introDone
    ? "rgba(17, 17, 17, 0.12)"
    : `rgba(${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)}, ${Math.round(255 - t * 238)}, 0.25)`;

  useGSAP(
    (_context, contextSafe) => {
      const bar = headerRef.current;
      if (!bar || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro.addLabel("intro", 0);
      intro.from(
        ".header-item",
        {
          autoAlpha: 0,
          y: -10,
          duration: 0.6,
          stagger: 0.07,
          clearProps: "transform,opacity,visibility",
        },
        "intro",
      );

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
        if (intro.isActive() || hideTl.isActive() || hideTl.progress() === 1) return;
        hideTl.timeScale(1).play();
      });

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
        <div
          ref={barRef}
          style={{
            backgroundColor: introDone ? "rgba(255, 255, 252, 0.75)" : "transparent",
            borderColor: introDone ? "rgba(17, 17, 17, 0.08)" : "transparent",
            boxShadow: introDone ? "0 8px 32px rgba(0,0,0,0.06)" : "none",
            color: textColor,
          }}
          className={`pointer-events-auto relative flex min-h-16 transform-gpu items-center gap-4 overflow-hidden rounded-[14px] px-4 isolate will-change-transform sm:min-h-[72px] sm:px-6 transition-all duration-500 ease-out ${
            introDone ? "border backdrop-blur-xl backdrop-saturate-150" : ""
          }`}
        >
          {introDone && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/[0.06]"
              aria-hidden="true"
            />
          )}
          <a
            className="header-item relative flex min-w-0 shrink-0 items-center gap-3 rounded-md outline-offset-4 focus-visible:outline-2"
            href="/"
            aria-label="CodePaint Studio 首页"
            style={{ color: textColor }}
          >
            <img className="h-10 w-10 object-contain sm:h-12 sm:w-12 rounded-lg transition-transform duration-300 hover:scale-105" src={logo} alt="CodePaint Studio 标志" />
            <span className="hidden text-sm font-semibold tracking-[0.02em] sm:inline transition-colors duration-300">CodePaint Studio</span>
          </a>

          <div className="header-item ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <a
              className="header-item group flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 py-2 text-sm font-medium outline-offset-4 transition-colors duration-200 hover:text-[#FFB000] focus-visible:outline-2 sm:px-3"
              style={{
                color: subTextColor,
              }}
              href={albumUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="truncate">工作室相册系统</span>
              <span className="text-base transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
            </a>
            <div
              className="h-4 w-px shrink-0 transition-colors duration-300"
              style={{
                backgroundColor: dividerColor,
              }}
              aria-hidden="true"
            />
            <button
              data-header-apply-btn
              className="header-item group flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2 py-2 text-sm font-medium outline-offset-4 transition-colors duration-200 hover:text-[#FFB000] focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60 sm:px-3"
              style={{
                color: subTextColor,
              }}
              type="button"
              onClick={onApply}
            >
              <span>前往投递</span>
              <span className="inline-block text-base transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
