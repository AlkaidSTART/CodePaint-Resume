import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Scenario = {
  tag: string;
  q: string;
  a: string;
  desc: string;
};

const SCENARIOS: Scenario[] = [
  {
    tag: "ONBOARDING · 01",
    q: "0基础？不用怕",
    a: "学长学姐来帮你！",
    desc: "1对1答疑与代码走读，遇到报错不慌，随时有人拉你一把。",
  },
  {
    tag: "KNOWLEDGE · 02",
    q: "资源少？",
    a: "飞书知识库沉淀100+文档",
    desc: "开箱即用的技术沉淀、踩坑记录与项目规范，省去到处搜寻的弯路。",
  },
  {
    tag: "ROADMAP · 03",
    q: "学什么？",
    a: "学长学姐学习路线作指导",
    desc: "阶段式递进学习树，从入门 Demo 到生产级项目，方向清晰不迷茫。",
  },
];

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

       {/* 场景卡片：0基础/资源少/学什么 + 2D小人插画 */}
       <div className="mt-12 grid gap-6 md:grid-cols-3">
          <style>{`
            @keyframes lf-bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes lf-bob-rev {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(4px); }
            }
            @keyframes lf-arm {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-4deg); }
            }
            @keyframes lf-wave {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg); }
            }
            @keyframes lf-flag {
              0%, 100% { transform: skewY(0deg) scaleX(1); }
              50% { transform: skewY(-3deg) scaleX(0.96); }
            }
            @keyframes lf-pulse {
              0%, 100% { transform: scale(1); opacity: 0.92; }
              50% { transform: scale(1.08); opacity: 1; }
            }
            .lf-anim-bob { animation: lf-bob 3s ease-in-out infinite; }
            .lf-anim-bob-rev { animation: lf-bob-rev 3.6s ease-in-out infinite; }
            .lf-anim-arm { transform-origin: 184px 74px; animation: lf-arm 2.6s ease-in-out infinite; }
            .lf-anim-wave { transform-origin: 194px 74px; animation: lf-wave 2s ease-in-out infinite; }
            .lf-anim-flag { transform-origin: 228px 26px; animation: lf-flag 2.2s ease-in-out infinite; }
            .lf-anim-pulse { transform-origin: center; animation: lf-pulse 2.4s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .lf-anim-bob,
              .lf-anim-bob-rev,
              .lf-anim-arm,
              .lf-anim-wave,
              .lf-anim-flag,
              .lf-anim-pulse {
                animation: none !important;
              }
            }
          `}</style>
          {/* 场景 1: 0基础？不用怕，学长学姐来帮你！ */}
          <div
            data-reveal
            className="group flex flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-5 shadow-[3px_3px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(2,132,199,0.2)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[10px] tracking-wider text-sky-700 uppercase bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded">
                  {SCENARIOS[0].tag}
                </span>
                <span className="font-mono2 text-xs text-black/35">Help</span>
              </div>

              {/* 2D小人插画：焦虑坐着的新人 + 弯腰辅导的学长 */}
              <div className="my-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-[#fffffc] p-2">
                <svg
                  viewBox="0 0 280 150"
                  className="h-full w-full select-none text-[#111]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* 阴影与背景地面 */}
                  <path d="M15 132 L265 132" stroke="rgba(17,17,17,0.12)" strokeWidth="2" strokeDasharray="3 3" />
                  {/* 书桌 */}
                  <rect x="75" y="88" width="88" height="6" rx="2" fill="#f1f5f9" stroke="#111" />
                  <line x1="83" y1="94" x2="80" y2="132" />
                  <line x1="155" y1="94" x2="158" y2="132" />

                  {/* 笔记本电脑 & 报错信息 */}
                  <path d="M96 88 L134 88" stroke="#111" strokeWidth="3" />
                  <rect x="100" y="62" width="30" height="24" rx="2" fill="#fff" stroke="#111" />
                  <rect x="103" y="65" width="24" height="15" rx="1" fill="#fee2e2" stroke="none" />
                  <line x1="106" y1="70" x2="118" y2="70" stroke="#ef4444" strokeWidth="1.5" />
                  <line x1="106" y1="74" x2="123" y2="74" stroke="#ef4444" strokeWidth="1.5" />

                  {/* 靠背转椅 (左侧) */}
                  <path d="M38 72 L38 98 Q38 102 42 102 L64 102" stroke="#64748b" strokeWidth="2" />
                  <line x1="50" y1="102" x2="50" y2="126" stroke="#64748b" />
                  <line x1="40" y1="126" x2="60" y2="126" stroke="#64748b" strokeWidth="2.5" />
                  <circle cx="41" cy="130" r="2" fill="#64748b" />
                  <circle cx="59" cy="130" r="2" fill="#64748b" />

                  {/* 萌版坐姿新人 (左侧) */}
                  <g className="lf-anim-bob">
                    <rect x="46" y="80" width="18" height="22" rx="4" fill="#e2e8f0" stroke="#111" />
                    <path d="M50 102 L50 118 L64 118 L66 128" fill="none" stroke="#111" strokeWidth="2" />
                    <path d="M58 84 L72 88 L84 88" fill="none" stroke="#111" strokeWidth="2" />
                    <path d="M52 86 L46 76 L52 70" fill="none" stroke="#111" strokeWidth="2" />
                    {/* 头部 */}
                    <circle cx="56" cy="58" r="13" fill="#fff" stroke="#111" />
                    {/* 困惑表情：眼睛 + 波浪形嘴巴 */}
                    <circle cx="54" cy="59" r="1.5" fill="#111" stroke="none" />
                    <circle cx="61" cy="59" r="1.5" fill="#111" stroke="none" />
                    <path d="M54 65 Q58 63 62 65" fill="none" stroke="#111" strokeWidth="1.2" />
                    {/* 焦虑小汗珠 */}
                    <path d="M70 46 C68 49, 72 53, 72 53 C72 53, 76 49, 74 46 C73 44, 71 44, 70 46 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                  </g>

                  {/* 学长小人 (右侧自然站立指导) */}
                  <g className="lf-anim-bob-rev">
                    {/* 腿部与脚 */}
                    <line x1="184" y1="106" x2="182" y2="132" stroke="#111" strokeWidth="2.5" />
                    <line x1="194" y1="106" x2="196" y2="132" stroke="#111" strokeWidth="2.5" />
                    {/* 躯干衬衫 */}
                    <rect x="178" y="70" width="22" height="36" rx="4" fill="#bae6fd" stroke="#111" strokeWidth="2" />
                    {/* 叉腰手 */}
                    <path d="M200 78 Q208 86 200 94" fill="none" stroke="#111" strokeWidth="2" />
                    {/* 头部 */}
                    <circle cx="189" cy="52" r="13" fill="#fff" stroke="#111" />
                    {/* 亲切微笑表情 */}
                    <path d="M183 52 Q186 49 189 52" stroke="#111" strokeWidth="1.5" />
                    <path d="M191 52 Q194 49 197 52" stroke="#111" strokeWidth="1.5" />
                    <path d="M186 58 Q190 62 194 58" fill="none" stroke="#111" strokeWidth="1.5" />
                  </g>

                  {/* 学长指点手臂 (微动画) */}
                  <g className="lf-anim-arm">
                    <path d="M180 76 Q156 74 132 70" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                    <circle cx="130" cy="70" r="2.5" fill="#0284c7" stroke="none" />
                  </g>

                  {/* 解题灵感灯泡 (微动画) */}
                  <g className="lf-anim-pulse">
                    <circle cx="134" cy="38" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                    <path d="M131 46 L137 46" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1="134" y1="26" x2="134" y2="23" stroke="#eab308" strokeWidth="2" />
                    <line x1="142" y1="31" x2="145" y2="29" stroke="#eab308" strokeWidth="2" />
                    <line x1="126" y1="31" x2="123" y2="29" stroke="#eab308" strokeWidth="2" />
                  </g>
                </svg>
              </div>

              <h3 className="mt-2 text-lg font-bold text-[#111]">
                <span className="text-black/50">{SCENARIOS[0].q}</span>{" "}
                <span className="text-sky-800">{SCENARIOS[0].a}</span>
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-black/65">{SCENARIOS[0].desc}</p>
            </div>
          </div>

          {/* 场景 2: 资源少？飞书知识库沉淀100+文档 */}
          <div
            data-reveal
            className="group flex flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-5 shadow-[3px_3px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(2,132,199,0.2)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[10px] tracking-wider text-sky-700 uppercase bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded">
                  {SCENARIOS[1].tag}
                </span>
                <span className="font-mono2 text-xs text-black/35">Docs</span>
              </div>

              {/* 2D小人插画：抱着知识库文档 + 100+卡片云集 */}
              <div className="my-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-[#fffffc] p-2">
                <svg
                  viewBox="0 0 280 150"
                  className="h-full w-full select-none text-[#111]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* 地面 */}
                  <path d="M15 132 L265 132" stroke="rgba(17,17,17,0.12)" strokeWidth="2" strokeDasharray="3 3" />

                  {/* 飞书知识库背景卡片堆叠 (浮动动画) */}
                  <g className="lf-anim-bob">
                    <rect x="142" y="28" width="72" height="42" rx="4" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
                    <line x1="152" y1="38" x2="192" y2="38" stroke="#22c55e" strokeWidth="2" />
                    <line x1="152" y1="46" x2="202" y2="46" stroke="#86efac" strokeWidth="1.5" />
                    <line x1="152" y1="54" x2="182" y2="54" stroke="#86efac" strokeWidth="1.5" />
                  </g>

                  <g className="lf-anim-bob-rev">
                    <rect x="172" y="62" width="76" height="44" rx="4" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
                    <line x1="184" y1="74" x2="224" y2="74" stroke="#0284c7" strokeWidth="2" />
                    <line x1="184" y1="82" x2="234" y2="82" stroke="#7dd3fc" strokeWidth="1.5" />
                    <line x1="184" y1="90" x2="212" y2="90" stroke="#7dd3fc" strokeWidth="1.5" />
                  </g>

                  {/* 100+ 文档徽章 (呼吸微动画) */}
                  <g className="lf-anim-pulse">
                    <rect x="152" y="98" width="90" height="26" rx="13" fill="#0284c7" stroke="#111" strokeWidth="2" />
                    <text x="197" y="115" fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" stroke="none">
                      100+ DOCS
                    </text>
                  </g>

                  {/* 知识云飘带/连接线 */}
                  <path d="M122 75 C138 60, 158 85, 172 65" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2 2" />

                  {/* 人物：抱着大文件夹/飞书文档开心的小人 (微动画) */}
                  <g className="lf-anim-bob">
                    <path d="M64 132 L70 106 L62 82 L74 82" fill="none" stroke="#111" strokeWidth="2.5" />
                    <path d="M80 132 L74 106" stroke="#111" />
                    {/* 头部 */}
                    <circle cx="68" cy="54" r="12" fill="#fff" stroke="#111" />
                    {/* 笑脸 */}
                    <path d="M64 54 Q67 51 70 54" stroke="#111" strokeWidth="1.5" />
                    <path d="M72 54 Q75 51 78 54" stroke="#111" strokeWidth="1.5" />
                    <path d="M64 60 Q69 65 74 60" fill="none" stroke="#111" strokeWidth="1.5" />
                    {/* 怀里抱的大文档本 */}
                    <rect x="76" y="66" width="38" height="46" rx="3" fill="#fef08a" stroke="#111" transform="rotate(-8 76 66)" />
                    <line x1="82" y1="78" x2="104" y2="75" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1="83" y1="86" x2="106" y2="83" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1="84" y1="94" x2="100" y2="91" stroke="#ca8a04" strokeWidth="1.5" />
                    {/* 手臂抱着文档 */}
                    <path d="M64 74 Q74 84 94 82" fill="none" stroke="#111" strokeWidth="2.5" />
                    <path d="M60 76 Q70 92 88 90" fill="none" stroke="#111" strokeWidth="2" />
                  </g>

                  {/* 闪烁星星 */}
                  <g className="lf-anim-pulse">
                    <path d="M104 44 L106 38 L108 44 L114 46 L108 48 L106 54 L104 48 L98 46 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
                  </g>
                </svg>
              </div>

              <h3 className="mt-2 text-lg font-bold text-[#111]">
                <span className="text-black/50">{SCENARIOS[1].q}</span>{" "}
                <span className="text-sky-800">{SCENARIOS[1].a}</span>
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-black/65">{SCENARIOS[1].desc}</p>
            </div>
          </div>

          {/* 场景 3: 学什么？按照以前学长学姐沉淀学习路线作为指导 */}
          <div
            data-reveal
            className="group flex flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-5 shadow-[3px_3px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(2,132,199,0.2)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[10px] tracking-wider text-sky-700 uppercase bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded">
                  {SCENARIOS[2].tag}
                </span>
                <span className="font-mono2 text-xs text-black/35">Roadmap</span>
              </div>

              {/* 2D小人插画：台阶路线阶梯 + 背包小人 + 领路指南旗 */}
              <div className="my-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-[#fffffc] p-2">
                <svg
                  viewBox="0 0 280 150"
                  className="h-full w-full select-none text-[#111]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* 阶梯路线 (从左下到右上递进) */}
                  <rect x="34" y="110" width="46" height="24" fill="#f8fafc" stroke="#111" strokeWidth="1.5" />
                  <text x="57" y="125" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle" stroke="none">
                    01.基础
                  </text>
                  <rect x="80" y="86" width="48" height="48" fill="#e0f2fe" stroke="#111" strokeWidth="1.5" />
                  <text x="104" y="101" fill="#0284c7" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" stroke="none">
                    02.进阶
                  </text>
                  <rect x="128" y="62" width="52" height="72" fill="#bae6fd" stroke="#111" strokeWidth="1.5" />
                  <text x="154" y="77" fill="#0369a1" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" stroke="none">
                    03.实战
                  </text>

                  {/* 路线虚线箭头 */}
                  <path d="M48 100 Q96 66 146 46" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />

                  {/* 背包攀登新手 (在台阶1迈步向台阶2, 微动画) */}
                  <g className="lf-anim-bob">
                    <rect x="33" y="80" width="8" height="12" rx="2" fill="#fb923c" stroke="#111" />
                    <path d="M44 110 L44 90 L52 82" fill="none" stroke="#111" strokeWidth="2.5" />
                    <path d="M44 90 L56 86 L66 94 L72 110" fill="none" stroke="#111" strokeWidth="2" />
                    <path d="M50 84 L60 88" stroke="#111" strokeWidth="2" />
                    <circle cx="54" cy="72" r="9" fill="#fff" stroke="#111" />
                    <path d="M54 73 L58 73" stroke="#111" strokeWidth="1.5" />
                  </g>

                  {/* 学长领路人 (站在高台阶，手持指示旗) */}
                  <path d="M198 132 L196 88 L204 72" fill="none" stroke="#111" strokeWidth="2.5" />
                  <path d="M192 132 L194 93" stroke="#111" />
                  <circle cx="204" cy="60" r="10" fill="#fff" stroke="#111" />
                  <path d="M201 61 L205 61" stroke="#111" strokeWidth="1.5" />
                  <path d="M200 65 Q204 68 207 65" fill="none" stroke="#111" strokeWidth="1.5" />

                  {/* 手持旗帜高高举起 (旗帜飘动微动画) */}
                  <line x1="210" y1="74" x2="228" y2="26" stroke="#111" strokeWidth="2" />
                  <g className="lf-anim-flag">
                    <path d="M228 26 L258 36 L228 46 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="240" y="39" fill="#0c4a6e" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" stroke="none">
                      GOAL
                    </text>
                  </g>

                  {/* 学长招手动作 (微动画) */}
                  <g className="lf-anim-wave">
                    <path d="M196 72 Q180 68 166 74" fill="none" stroke="#0284c7" strokeWidth="2" />
                  </g>

                  {/* 路线星标 (闪烁微动画) */}
                  <g className="lf-anim-pulse">
                    <polygon points="154,36 157,43 165,44 159,49 161,56 154,52 147,56 149,49 143,44 151,43" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                  </g>
                </svg>
              </div>

              <h3 className="mt-2 text-lg font-bold text-[#111]">
                <span className="text-black/50">{SCENARIOS[2].q}</span>{" "}
                <span className="text-sky-800">{SCENARIOS[2].a}</span>
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-black/65">{SCENARIOS[2].desc}</p>
            </div>
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
