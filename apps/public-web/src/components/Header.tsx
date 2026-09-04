import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import logo from "../assets/1280X1280.webp";

const albumUrl = "https://album.hub.feashow.cn/login";

type HeaderProps = {
  onApply: () => void;
};

export function Header({ onApply }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".header-item", { autoAlpha: 0, y: -14, duration: 0.7, stagger: 0.1, ease: "power2.out" });
    gsap.from(".header-rule", { scaleX: 0, transformOrigin: "left center", duration: 0.9, delay: 0.15, ease: "power3.out" });
  }, { scope: headerRef });

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex min-h-16 items-åcenter gap-4 overflow-hidden rounded-[14px] border border-black/15 bg-black/[0.035] px-4 shadow-[0_10px_35px_rgba(20,20,20,0.1)] backdrop-blur-2xl backdrop-saturate-150 sm:min-h-[72px] sm:px-6">
          <div className="header-rule pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/15" aria-hidden="true" />
          <a className="header-item relative flex min-w-0 shrink-0 items-center gap-3 rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-black" href="/" aria-label="CodePaint Studio 首页">
            <img className="h-10 w-10 object-contain sm:h-12 sm:w-12" src={logo} alt="CodePaint Studio 标志" />
            <span className="hidden text-sm font-semibold tracking-[0.02em] sm:inline">CodePaint Studio</span>
          </a>
          <div className="header-item h-8 w-px shrink-0 bg-black/15" aria-hidden="true" />
          <a className="header-item group relative flex min-w-0 items-center gap-2 rounded-md px- py-2 text-sm text-black/70 outline-offset-4 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-black" href={albumUrl} target="_blank" rel="noreferrer">
            <span className="truncate">工作室相册系统</span>
            <span className="text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
          </a>
          <div className="header-item ml-auto flex items-center gap-3">
            <button className="group relative min-h-11 shrink-0 rounded-md bg-wh px-4 text-sm font-medium text-white outline-offset-4 transition-[background-color,transform] hover:bg-black/80 active:translate-y-px focus-visible:outline-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60" type="button" onClick={onApply}>
              <span>前往投递</span><span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
