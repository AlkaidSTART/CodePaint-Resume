import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Trait = {
  no: string;
  title: string;
  desc: string;
  meta: string;
  doodle: "circle" | "underline" | "arrow";
};

// 骨架文案：结构定稿、文字可换。TODO: 把 title/desc/meta 换成正式招募文案。
const TRAITS: Trait[] = [
  {
    no: "01",
    title: "愿意动手的人",
    desc: "先把东西做出来，再慢慢改好。",
    meta: "e.g. 自己的小作品 / demo / 开源提交",
    doodle: "circle",
  },
  {
    no: "02",
    title: "爱折腾的人",
    desc: "对新工具好奇，愿意啃文档、踩坑、再分享坑。",
    meta: "e.g. 折腾过构建 / 部署 / 小工具",
    doodle: "underline",
  },
  {
    no: "03",
    title: "乐于分享的人",
    desc: "愿意写下来、讲清楚，带别人一起往前走。",
    meta: "e.g. 写过博客 / 文档 / 做过分享",
    doodle: "arrow",
  },
];

/**
 * LookingFor — “我们在找的人”。
 * 视觉 rationale：一页招募便签——顶部是编辑式标题+导语，
 * 中部是三行横线账本式特质，底部是一条“如何加入”便签；
 * 用横线纸纹与上一幕的点阵纸区分，手绘圈线只点缀关键词。
 */
export function LookingFor() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const arrow = root.querySelector<SVGPathElement>("[data-join-arrow]");
      if (arrow) {
        const L = arrow.getTotalLength() || 120;
        arrow.style.strokeDasharray = `${L}`;
        arrow.style.strokeDashoffset = `${L}`;
        gsap.to(arrow, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 68%", toggleActions: "play none none none", once: true },
        });
        gsap.delayedCall(4, () => {
          arrow.style.strokeDashoffset = "0";
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="looking-for"
      aria-labelledby="looking-for-title"
      data-screen="looking-panel"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden scroll-mt-28 border-t border-black/10 bg-[#fffffc]"
    >
      {/* 横线纸纹：区别于上一幕的点阵 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 31px, rgba(17,17,17,0.05) 31px 32px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-24">
        {/* 头部：左标题 / 右导语，不对称编辑排版 */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p data-reveal className="font-mono2 text-[11px] tracking-[0.18em] text-black/55 uppercase">
              who we are looking for — 02 / 招募
            </p>
            <h2
              data-reveal
              id="looking-for-title"
              className="mt-4 max-w-[14ch] text-4xl leading-[1.12] font-semibold tracking-tight text-[#111] sm:text-5xl"
            >
              我们在找
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">这样的人</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 180 26"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 z-0 h-4 w-full text-sky-700/50"
                >
                  <path
                    d="M4 16 C 50 8, 120 8, 176 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              。
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p data-reveal className="max-w-[42ch] text-base leading-7 text-black/60">
              不看年级和头衔，看你做过什么、怎么想问题。
              下面三条是草稿方向，正式文案可直接替换。
            </p>
            <p
              data-reveal
              className="font-mono2 mt-4 inline-block rounded-sm border border-black/10 bg-[#fffdf4] px-2.5 py-1 text-[11px] tracking-[0.14em] text-black/60 uppercase shadow-[2px_2px_0_rgba(17,17,17,0.08)]"
            >
              open — 长期招募
            </p>
          </div>
        </div>

        {/* 中部：三行账本式特质 */}
        <ol data-reveal className="mt-12 border-y border-black/10">
          {TRAITS.map((t) => (
            <li
              key={t.no}
              data-reveal
              className="group grid list-none gap-2 border-b border-black/10 py-6 last:border-b-0 sm:grid-cols-[56px_1fr_auto] sm:items-baseline sm:gap-5"
            >
              <span aria-hidden="true" className="font-mono2 text-sm text-black/40 transition-colors group-hover:text-sky-700">
                {t.no}
              </span>
              <div className="min-w-0">
                <h3 className="text-xl leading-snug font-semibold text-[#111] sm:text-2xl">
                  {t.title}
                  {t.doodle === "circle" && (
                    <svg aria-hidden="true" viewBox="0 0 40 40" className="ml-2 inline h-6 w-6 -translate-y-1 text-sky-700/60">
                      <path d="M20 4 C 30 4, 36 12, 34 21 C 32 30, 24 36, 14 34 C 6 32, 3 23, 7 14 C 10 8, 18 4, 26 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                  {t.doodle === "underline" && (
                    <svg aria-hidden="true" viewBox="0 0 60 10" preserveAspectRatio="none" className="ml-1 inline h-3 w-14 text-sky-700/50">
                      <path d="M2 7 C 20 3, 40 3, 58 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                  {t.doodle === "arrow" && (
                    <span aria-hidden="true" className="ml-1 inline-block -rotate-6 text-sky-700/70">↗</span>
                  )}
                </h3>
                <p className="mt-1 max-w-[56ch] text-base leading-7 text-black/60">{t.desc}</p>
                {/* TODO: meta 换成真实例子或链接 */}
                <p className="font-mono2 mt-2 text-xs tracking-wide text-black/45">{t.meta}</p>
              </div>
              <span aria-hidden="true" className="font-mono2 hidden text-xs text-black/30 sm:block">→</span>
            </li>
          ))}
        </ol>

        {/* 底部：如何加入便签 */}
        <div
          data-reveal
          className="relative mt-8 flex flex-col gap-4 rounded-[14px] border border-black/10 bg-[#fffdf4] px-5 py-5 shadow-[3px_4px_0_rgba(17,17,17,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <span aria-hidden="true" className="absolute -top-2.5 left-8 h-5 w-14 -rotate-6 rounded-[2px] bg-sky-200/80 shadow-sm" />
          <div>
            {/* TODO: 加入方式 CTA（申请表单 / 联系方式） */}
            <p className="font-mono2 text-[11px] tracking-[0.16em] text-black/50 uppercase">how to join · 待补充正式入口</p>
            <p className="mt-1.5 text-base leading-7 text-[#111]">
              <span className="font-medium">看看作品</span>
              <span aria-hidden="true" className="mx-2 text-black/30">→</span>
              <span className="font-medium">来聊聊</span>
              <span aria-hidden="true" className="mx-2 text-black/30">→</span>
              <span className="font-medium">一起做</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 80 32" className="hidden h-8 w-20 text-[#111]/40 sm:block">
              <path
                data-join-arrow
                d="M4 6 C 30 4, 55 8, 68 22 M68 22 l-9 -2 M68 22 l-1 -9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <a
              href="https://github.com/codepaintstudio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#111] px-5 text-[15px] font-medium text-[#fffffc] transition-colors outline-offset-4 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-black active:bg-sky-800"
            >
              先逛逛我们的 GitHub
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
