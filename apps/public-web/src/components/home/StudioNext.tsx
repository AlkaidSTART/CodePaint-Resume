import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * StudioNext — 项目展示幕（电影幕布的下一幕）。
 * 视觉 rationale：左标题 + 项目目录（桌面端 sticky，可跳、可跟随），
 * 右清单纵排；vuedir 是贴了胶带的置顶便签，其余是手写行；
 * 波浪线分隔、手绘箭头、小人讲解员各有倾角，俏皮但不抢正文。
 */

type WorkLink = { label: string; href: string; aria: string };
type Project = {
  id: string;
  no: string;
  name: string;
  desc: string;
  tech: string;
  links: WorkLink[];
  note?: string;
  buddy: "folder" | "mail" | "camera" | "cap";
  big?: boolean;
  tilt?: number;
};

const PROJECTS: Project[] = [
  {
    id: "work-vuedir",
    no: "01",
    name: "vuedir",
    desc: "Vue 自定义指令小合集，轻量、开箱即用，工作室的旗舰开源项目。",
    tech: "Vue · TypeScript",
    links: [
      { label: "GitHub", href: "https://github.com/codepaintstudio/vuedir", aria: "在新标签页打开 vuedir 的 GitHub 仓库" },
      { label: "在线文档", href: "https://vuedir.feashow.cn/", aria: "在新标签页打开 vuedir 的在线文档" },
    ],
    buddy: "folder",
    big: true,
    tilt: 0,
  },
  {
    id: "work-cp-email",
    no: "02",
    name: "cp-email",
    desc: "把发邮件这件小事，变成一行调用就能搞定。",
    tech: "Vue",
    links: [
      { label: "GitHub", href: "https://github.com/codepaintstudio/cp-email", aria: "在新标签页打开 cp-email 的 GitHub 仓库" },
      { label: "在线体验", href: "http://cpemail.hub.feashow.cn/", aria: "在新标签页打开 cp-email 的在线体验地址" },
    ],
    buddy: "mail",
    tilt: 0,
  },
  {
    id: "work-album",
    no: "03",
    name: "album",
    desc: "在线相册系统，工作室的照片都有了去处。",
    tech: "TypeScript",
    links: [
      { label: "GitHub", href: "https://github.com/codepaintstudio/album", aria: "在新标签页打开 album 的 GitHub 仓库" },
      { label: "在线体验", href: "https://album.hub.feashow.cn", aria: "在新标签页打开 album 的在线体验地址" },
    ],
    buddy: "camera",
    tilt: 0,
  },
  {
    id: "work-internal",
    no: "04",
    name: "高校 / 考试院",
    desc: "交到学校和考试院手里的内部系统，稳定跑在人家内网里。",
    tech: "内部交付",
    links: [],
    note: "内部交付 · 不公开",
    buddy: "cap",
    tilt: 0,
  },
];

/** 2D 小人：圆头 + 圆角身体 + 线条四肢，黑为主、天蓝点缀；纯装饰 aria-hidden。 */
function Buddy({ pose, big, tilt }: { pose: Project["buddy"]; big?: boolean; tilt?: number }) {
  return (
    <svg
      width="56"
      height="64"
      viewBox="0 0 56 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-buddy=""
      data-tilt={tilt ?? 0}
      style={tilt ? { rotate: `${tilt}deg` } : undefined}
      className={big ? "h-16 w-14 shrink-0 sm:h-[4.5rem] sm:w-16" : "h-14 w-12 shrink-0"}
    >
      <line x1="22" y1="46" x2="19" y2="58" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="46" x2="36" y2="58" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <rect x="15" y="26" width="24" height="22" rx="9" fill="#111" />
      <rect x="15" y="26" width="24" height="22" rx="9" fill="#0284c7" opacity="0.16" />
      <line x1="16" y1="32" x2="7" y2="38" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="32" x2="47" y2="38" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <circle cx="27" cy="15" r="10" fill="#fffffc" stroke="#111" strokeWidth="3" />
      <circle data-eye cx="23.5" cy="14" r="1.6" fill="#111" />
      <circle data-eye cx="30.5" cy="14" r="1.6" fill="#111" />
      <path d="M23 19.5 Q27 22.5 31 19.5" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      {pose === "folder" && (
        <g aria-hidden="true">
          <rect x="38" y="34" width="14" height="10" rx="2" fill="#0284c7" />
          <rect x="38" y="34" width="14" height="4" rx="2" fill="#0369a1" />
        </g>
      )}
      {pose === "mail" && (
        <g aria-hidden="true">
          <rect x="2" y="26" width="12" height="9" rx="1.5" fill="#fffffc" stroke="#0284c7" strokeWidth="2" />
          <path d="M2.5 27 L8 32 L13.5 27" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 12 L50 6 L46 17" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {pose === "camera" && (
        <g aria-hidden="true">
          <rect x="36" y="30" width="16" height="11" rx="2.5" fill="#111" />
          <circle cx="44" cy="35.5" r="3" fill="#fffffc" />
          <circle cx="44" cy="35.5" r="3" stroke="#0284c7" strokeWidth="1.6" />
          <rect x="40" y="27.5" width="6" height="3" rx="1" fill="#111" />
        </g>
      )}
      {pose === "cap" && (
        <g aria-hidden="true">
          <rect x="14" y="2" width="26" height="6" rx="3" fill="#111" />
          <rect x="24" y="-2" width="6" height="6" rx="1.5" fill="#111" />
          <line x1="40" y1="5" x2="50" y2="8" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <rect x="42" y="34" width="10" height="8" rx="1.5" fill="#fffffc" stroke="#0284c7" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

export function StudioNext() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1) 左栏入场 + 标题下划线手绘描出 + 手绘箭头描出（同一顶层 timeline，label 编排）。
      const squiggle = root.querySelector<SVGPathElement>("[data-squiggle]");
      const arrow = root.querySelector<SVGPathElement>("[data-arrow]");
      const drawTargets = [squiggle, arrow].filter((el): el is SVGPathElement => !!el);
      drawTargets.forEach((p) => {
        const L = p.getTotalLength();
        p.style.strokeDasharray = `${L}`;
        p.style.strokeDashoffset = `${L}`;
      });
      const head = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none", once: true },
      });
      head.addLabel("head", 0);
      // 内容默认可见（不再用 from 隐藏）：滚动 reveal 只是可选装饰，触发失败也不能让正文消失。
      if (drawTargets.length > 0) {
        head.to(
          drawTargets,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.12,
          },
          "head+=0.3"
        );
      }

      // 2) 项目行默认可见：不再用 from 隐藏行/小人（在 CinematicHome 的变换容器里
      // ScrollTrigger 触发位不可靠，from 的 immediateRender 会把整块内容长期藏住）。
      const rows = root.querySelectorAll<HTMLElement>("[data-work-row]");
      const wavies = root.querySelectorAll<SVGPathElement>("[data-wavy]");
      wavies.forEach((w) => {
        const L = w.getTotalLength();
        w.style.strokeDasharray = `${L}`;
        w.style.strokeDashoffset = `${L}`;
      });
      const enter = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: rows[0]?.closest("ol") ?? root, start: "top 80%", toggleActions: "play none none none", once: true },
      });
      enter.addLabel("list", 0);
      if (wavies.length > 0) {
        enter.to(wavies, { strokeDashoffset: 0, duration: 0.45, stagger: 0.07 }, "list+=0.1");
      }

      // 2b) 背景大编号视差：独立 scrub tween，顶层挂载。
      const giant = root.querySelector("[data-giant-no]");
      if (giant) {
        gsap.to(giant, {
          yPercent: 24,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // 3) 待机动画已移除：小人/眼睛保持静止，避免无因果的自移动。
      // 如需装饰性微动，需满足 motion 规范（8–30s 低幅、可暂停），再单独加。

      // 3b) 底部小指引：箭头一次性描出，指引本身保持静止。
      const cue = root.querySelector<HTMLElement>("[data-look-cue]");
      const cueArrow = root.querySelector<SVGPathElement>("[data-look-arrow]");
      if (cueArrow) {
        const L = cueArrow.getTotalLength();
        cueArrow.style.strokeDasharray = `${L}`;
        cueArrow.style.strokeDashoffset = `${L}`;
        gsap.to(cueArrow, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: cue ?? root, start: "top 94%", toggleActions: "play none none none", once: true },
        });
      }
      // 底部指引保持静止（hover 位移由 CSS group-hover 处理），不再做无限 yoyo 浮动。

      // 兜底：装饰线描出若因触发位计算失败一直不播放，5s 后直接置为完成态。
      // delayedCall 绑定在 scope 上，卸载自动清理；已播完时置 0 是空操作。
      gsap.delayedCall(5, () => {
        drawTargets.forEach((el) => {
          el.style.strokeDashoffset = "0";
        });
        wavies.forEach((el) => {
          el.style.strokeDashoffset = "0";
        });
        if (cueArrow) cueArrow.style.strokeDashoffset = "0";
      });

      // 4) 左侧目录 scrollspy：每行一个顶层 ScrollTrigger，高亮当前目录项。
      const links = new Map<string, HTMLElement>();
      root.querySelectorAll<HTMLElement>("[data-index-link]").forEach((a) => {
        const key = a.getAttribute("data-index-link");
        if (key) links.set(key, a);
      });
      const setActive = (id: string | null) => {
        links.forEach((a, key) => {
          const on = key === id;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      };
      rows.forEach((row) => {
        const id = row.id;
        if (!id || !links.has(id)) return;
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => {
            if (self.isActive) setActive(id);
          },
        });
      });

      const hop = contextSafe!((target: SVGSVGElement) => {
        const tl = gsap.timeline({ defaults: { duration: 0.16, ease: "power2.out" } });
        tl.addLabel("jump", 0);
        tl.to(target, { y: -9 }, "jump");
        tl.to(target, { scaleY: 0.92, scaleX: 1.06, transformOrigin: "50% 100%" }, "jump+=0.14");
        tl.to(target, { y: 0, scaleY: 1, scaleX: 1 }, "jump+=0.28");
      });
      const onEnter = (e: Event) => {
        const svg = (e.currentTarget as HTMLElement).querySelector<SVGSVGElement>("[data-buddy]");
        if (svg) hop(svg);
      };
      rows.forEach((row) => row.addEventListener("pointerenter", onEnter));
      return () => rows.forEach((row) => row.removeEventListener("pointerenter", onEnter));
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      data-screen="works-panel"
      aria-labelledby="studio-next-title"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-x-clip bg-[#fffffc]"
    >
      <span
        data-giant-no
        aria-hidden="true"
        className="font-mono2 pointer-events-none absolute -right-4 -bottom-8 hidden text-[11rem] leading-none text-black/[0.045] select-none lg:block"
      >
        01
      </span>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-28 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-28">
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <p data-reveal className="font-mono2 text-[11px] tracking-[0.18em] text-[#111]/55 uppercase">studio works</p>
          <h2 data-reveal id="studio-next-title" className="mt-4 max-w-[16ch] text-3xl leading-[1.15] font-semibold tracking-tight text-[#111] sm:text-4xl">
            我们做了
            <span className="relative inline-block">
              这些东西
              <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full">
                <path data-squiggle d="M3 8 Q 20 3 40 7 T 78 7 T 117 5" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            。
          </h2>
          <p data-reveal className="mt-5 max-w-[44ch] text-base leading-7 text-black/60">
            三个开源项目都能点进去看，第四个住在内网里。
          </p>
          <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/codepaintstudio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#111] px-6 text-base font-medium text-[#fffffc] transition-colors outline-offset-4 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-black active:bg-sky-800"
            >
              逛逛我们的 GitHub
              <span aria-hidden="true">→</span>
            </a>
            <svg aria-hidden="true" viewBox="0 0 120 48" className="hidden h-12 w-28 text-[#111]/50 lg:block">
              <path
                data-arrow
                d="M6 8 C 44 6, 78 10, 104 30 M104 30 l-11 -3 M104 30 l-1 -11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <nav data-reveal aria-label="项目目录" className="mt-8">
            <ol className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-1">
              {PROJECTS.map((p) => (
                <li key={p.id} className="list-none">
                  <a
                    href={`#${p.id}`}
                    data-index-link={p.id}
                    className="font-mono2 group inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-[13px] text-black/45 underline-offset-4 outline-offset-4 transition-all hover:text-sky-700 hover:underline focus-visible:outline-2 focus-visible:outline-black [&.is-active]:translate-x-0.5 [&.is-active]:text-sky-700 [&.is-active]:underline lg:[&.is-active]:translate-x-1"
                  >
                    <span aria-hidden="true">{p.no}</span>
                    <span className={p.big ? "font-semibold" : undefined}>{p.name}</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <ol className="lg:col-span-7">
          {PROJECTS.map((p, i) => (
            <Fragment key={p.no}>
              {i > 0 && (
                <li aria-hidden="true" className="list-none px-1 py-1">
                  <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="h-3 w-full">
                    <path
                      data-wavy
                      d="M4 7 Q 60 2 120 7 T 240 7 T 360 7 T 480 7 T 596 6"
                      fill="none"
                      stroke={i === 2 ? "#0284c7" : "#111"}
                      strokeOpacity={i === 2 ? "0.45" : "0.16"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </li>
              )}
              <li
                id={p.id}
                data-work-row
                data-buddy-row
                className={
                  p.big
                    ? "group relative flex list-none scroll-mt-24 items-start gap-4 rounded-[18px] border border-black/10 bg-[#fffdf4] px-4 py-6 transition-colors duration-150 hover:bg-[#fff9e8] sm:gap-5 sm:px-5"
                    : "group flex list-none scroll-mt-24 items-start gap-4 rounded-xl px-1 py-6 transition-colors duration-150 hover:bg-black/[0.025] sm:gap-5 sm:px-2"
                }
              >
                {p.big && (
                  <>
                    <span aria-hidden="true" className="absolute -top-2.5 left-10 h-5 w-16 -rotate-6 rounded-[2px] bg-sky-200/80" />
                    <span aria-hidden="true" className="absolute -top-2 right-10 h-5 w-12 rotate-3 rounded-[2px] bg-sky-200/70" />
                  </>
                )}
                <span className="font-mono2 w-8 shrink-0 pt-1.5 text-sm text-black/40 transition-colors group-hover:text-sky-700" aria-hidden="true">{p.no}</span>
                <span className="flex shrink-0 pt-0.5"><Buddy pose={p.buddy} big={p.big} tilt={p.tilt} /></span>
                <div className="min-w-0 flex-1">
                  <h3 className={p.big ? "text-xl leading-snug font-semibold text-[#111] sm:text-2xl" : "text-lg leading-snug font-semibold text-[#111]"}>
                    {p.name}
                    {p.big && <span className="font-mono2 ml-2 align-middle text-[11px] font-normal tracking-wide text-sky-700">★ 主力开源</span>}
                  </h3>
                  <p className="mt-1 max-w-[52ch] text-base leading-7 text-black/60">{p.desc}</p>
                  <p className="font-mono2 mt-2 text-xs tracking-wide text-black/45">{p.tech}</p>
                  {p.links.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-x-6">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={l.aria}
                          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 outline-offset-4 transition-colors hover:decoration-sky-700 focus-visible:outline-2 focus-visible:outline-black"
                        >
                          {l.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono2 mt-1 inline-flex min-h-11 items-center text-xs text-black/40">{p.note}</p>
                  )}
                </div>
              </li>
            </Fragment>
          ))}
        </ol>
      </div>

      {/* 底部小指引：2D 手绘下箭头在左、小字在右，跳到下一幕 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center sm:bottom-4">
        <a
          href="#looking-for"
          data-look-cue
          aria-label="滚动到下一节：我们在找的人"
          className="font-mono2 group pointer-events-auto inline-flex min-h-10 items-center gap-1.5 rounded-full border border-black/10 bg-[#fffffc]/85 px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-black/55 uppercase backdrop-blur-sm outline-offset-4 transition-colors hover:border-sky-700/30 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-black"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            style={{ transform: "rotate(0deg)" }}
            className="shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
          >
            <path
              data-look-arrow
              d="M7 1.5 C 7.4 7, 6.6 12.5, 7 16.5 M7 16.5 L2.5 11.5 M7 16.5 L11.5 11.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>who we are looking for</span>
        </a>
      </div>
    </section>
  );
}
