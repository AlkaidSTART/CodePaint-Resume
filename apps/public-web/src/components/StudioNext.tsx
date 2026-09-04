import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * StudioNext — 项目展示幕（电影幕布的下一幕）。
 * 视觉 rationale：左标题定调、右项目清单纵排，像工作室墙上贴着的四张手写便签，
 * 每个项目配一个 2D 小人做"讲解员"，俏皮但不抢正文。
 * 动效 rationale：滚动时标题下划线手绘描出 → 行逐个升起、小人弹入 →
 * 待机时小人轻轻浮动、hover 跳一下；每个动效都解释"谁来了、从哪来"。
 */

type Project = {
  no: string;
  name: string;
  desc: string;
  tech: string;
  href?: string;
  note?: string;
  buddy: "folder" | "mail" | "camera" | "cap";
};

const PROJECTS: Project[] = [
  {
    no: "01",
    name: "vuedir",
    desc: "Vue 自定义指令小合集，开箱即用的轻量工具库。",
    tech: "Vue · TypeScript",
    href: "https://github.com/codepaintstudio/vuedir",
    buddy: "folder",
  },
  {
    no: "02",
    name: "cp-email",
    desc: "把发邮件这件小事，变成一行调用就能搞定。",
    tech: "Vue",
    href: "http://github.com/codepaintstudio/cp-email",
    buddy: "mail",
  },
  {
    no: "03",
    name: "album",
    desc: "在线相册系统，工作室的照片都有了去处。",
    tech: "TypeScript",
    href: "https://github.com/codepaintstudio/album",
    buddy: "camera",
  },
  {
    no: "04",
    name: "高校 / 考试院",
    desc: "交到学校和考试院手里的内部系统，稳定跑在人家内网里。",
    tech: "内部交付",
    note: "内部交付 · 不公开",
    buddy: "cap",
  },
];

/** 2D 小人：圆头 + 圆角身体 + 线条四肢，黑为主、天蓝点缀；纯装饰 aria-hidden。 */
function Buddy({ pose }: { pose: Project["buddy"] }) {
  return (
    <svg width="56" height="64" viewBox="0 0 56 64" fill="none" aria-hidden="true" focusable="false" className="h-14 w-12 shrink-0">
      <line x1="22" y1="46" x2="19" y2="58" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="46" x2="36" y2="58" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <rect x="15" y="26" width="24" height="22" rx="9" fill="#111" />
      <rect x="15" y="26" width="24" height="22" rx="9" fill="#0284c7" opacity="0.16" />
      <line x1="16" y1="32" x2="7" y2="38" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="32" x2="47" y2="38" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <circle cx="27" cy="15" r="10" fill="#fffffc" stroke="#111" strokeWidth="3" />
      <circle cx="23.5" cy="14" r="1.6" fill="#111" />
      <circle cx="30.5" cy="14" r="1.6" fill="#111" />
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
          <rect x="14" y="2" width="26" height="4" rx="1" fill="#111" transform="rotate(-6 27 4)" />
          <rect x="24" y="0" width="7" height="7" rx="1" fill="#0284c7" transform="rotate(-6 27 4)" />
        </g>
      )}
    </svg>
  );
}

export function StudioNext() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;
      // 减弱动效：空间位移/弹跳/循环全部跳过，内容直接呈现。
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1) 标题下划线：手绘描出。顶层 tween 自带 ScrollTrigger。
      const squiggle = root.querySelector<SVGPathElement>("[data-squiggle]");
      if (squiggle) {
        const len = squiggle.getTotalLength();
        gsap.fromTo(
          squiggle,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: root, start: "top 68%", toggleActions: "play none none reverse" },
          }
        );
      }

      // 2) 项目行入场：主时间线 + label + position 参数编排，ScrollTrigger 只挂顶层。
      const rows = root.querySelectorAll<HTMLElement>("[data-work-row]");
      const buddies = root.querySelectorAll<SVGSVGElement>("[data-work-row] svg");
      const enter = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: rows[0]?.closest("ol") ?? root, start: "top 74%", toggleActions: "play none none reverse" },
      });
      enter.addLabel("list", 0);
      enter.from(rows, { y: 36, autoAlpha: 0, duration: 0.65, stagger: 0.09 }, "list");
      enter.from(
        buddies,
        { scale: 0, rotation: -14, transformOrigin: "50% 90%", duration: 0.55, ease: "back.out(1.7)", stagger: 0.09 },
        "list+=0.15"
      );

      // 3) 待机浮动：小人轻轻上下浮， stagger 错开；hover 跳跃仍走 contextSafe。
      gsap.to(buddies, {
        y: -4,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.35 },
        delay: 1.4,
      });

      const hop = contextSafe!((target: SVGSVGElement) => {
        const tl = gsap.timeline({ defaults: { duration: 0.16, ease: "power2.out" } });
        tl.addLabel("jump", 0);
        tl.to(target, { y: -9 }, "jump");
        tl.to(target, { scaleY: 0.92, scaleX: 1.06, transformOrigin: "50% 100%" }, "jump+=0.14");
        tl.to(target, { y: 0, scaleY: 1, scaleX: 1 }, "jump+=0.28");
      });
      const onEnter = (e: Event) => {
        const svg = (e.currentTarget as HTMLElement).querySelector("svg");
        if (svg) hop(svg);
      };
      rows.forEach((row) => row.addEventListener("pointerenter", onEnter));
      return () => rows.forEach((row) => row.removeEventListener("pointerenter", onEnter));
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} data-cinema="screen-panel" aria-labelledby="studio-next-title" className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden rounded-t-[22px] border-t border-black/10 bg-[#fffffc] shadow-[0_-30px_80px_rgba(17,17,17,0.22)]">
      {/* 背景大编号：装饰，不抢正文 */}
      <span aria-hidden="true" className="font-mono2 pointer-events-none absolute -right-4 -bottom-8 hidden text-[11rem] leading-none text-black/[0.045] select-none lg:block">
        04
      </span>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="lg:col-span-5">
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
          <p data-reveal className="mt-5 max-w-[48ch] text-base leading-7 text-black/60">
            三个开源小项目，加上一批交到学校和考试院手里的内部系统。把鼠标放到小人身上，它会跳一下。
          </p>
        </div>
        <ol className="lg:col-span-7">
          {PROJECTS.map((p, i) => (
            <li key={p.no} data-work-row data-buddy-row className={`group flex items-center gap-4 rounded-xl py-6 transition-colors duration-150 hover:bg-black/[0.025] sm:gap-5 ${i > 0 ? "border-t border-black/10" : ""}`}>
              <span className="font-mono2 w-8 shrink-0 text-sm text-black/40 transition-colors group-hover:text-sky-700" aria-hidden="true">{p.no}</span>
              <Buddy pose={p.buddy} />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg leading-snug font-semibold text-[#111]">{p.name}</h3>
                <p className="mt-1 max-w-[52ch] text-base leading-7 text-black/60">{p.desc}</p>
                <p className="font-mono2 mt-2 text-xs tracking-wide text-black/45">{p.tech}</p>
              </div>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noreferrer" aria-label={`在新标签页打开 ${p.name} 的 GitHub 仓库`} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-xl text-[#111] outline-offset-4 transition-colors hover:bg-black/5 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-black">
                  <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              ) : (
                <span className="font-mono2 shrink-0 text-xs text-black/40">{p.note}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
