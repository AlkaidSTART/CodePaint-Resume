import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Company = {
  id: string;
  name: string;
  sub: string;
  badge: string;
  code: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const COMPANIES: Company[] = [
  {
    id: "tencent",
    name: "腾讯",
    sub: "Tencent",
    code: "0700.HK",
    badge: "总部 / 核心产研",
    color: "#0052D9",
    bgColor: "rgba(0, 82, 217, 0.05)",
    borderColor: "rgba(0, 82, 217, 0.2)",
  },
  {
    id: "wechat",
    name: "微信",
    sub: "WeChat",
    code: "WXG",
    badge: "WXG 事业群",
    color: "#07C160",
    bgColor: "rgba(7, 193, 96, 0.05)",
    borderColor: "rgba(7, 193, 96, 0.2)",
  },
  {
    id: "tencent-cs",
    name: "腾讯云智",
    sub: "TCS Technology",
    code: "TCS",
    badge: "研发中心",
    color: "#0284c7",
    bgColor: "rgba(2, 132, 199, 0.05)",
    borderColor: "rgba(2, 132, 199, 0.2)",
  },
  {
    id: "qiniu",
    name: "七牛云",
    sub: "Qiniu Cloud",
    code: "QINIU",
    badge: "音视频 / 存储架构",
    color: "#0284c7",
    bgColor: "rgba(2, 132, 199, 0.05)",
    borderColor: "rgba(2, 132, 199, 0.2)",
  },
  {
    id: "meituan",
    name: "美团",
    sub: "Meituan",
    code: "3690.HK",
    badge: "零售与生活科技",
    color: "#d97706",
    bgColor: "rgba(217, 119, 6, 0.06)",
    borderColor: "rgba(217, 119, 6, 0.25)",
  },
];

export function Outcomes() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const underline = root.querySelector<SVGPathElement>("[data-outcome-underline]");
      const compCards = root.querySelectorAll<HTMLElement>("[data-company-card]");
      const statBoxes = root.querySelectorAll<HTMLElement>("[data-stat-box]");
      const detailCards = root.querySelectorAll<HTMLElement>("[data-detail-card]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      if (underline) {
        const len = underline.getTotalLength() || 160;
        gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(underline, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0);
      }

      if (statBoxes.length > 0) {
        tl.fromTo(
          statBoxes,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
          0.1
        );
      }

      if (compCards.length > 0) {
        tl.fromTo(
          compCards,
          { scale: 0.95, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
          0.2
        );
      }

      if (detailCards.length > 0) {
        tl.fromTo(
          detailCards,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: "power2.out" },
          0.35
        );
      }
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="outcomes"
      aria-labelledby="outcomes-title"
      data-screen="outcomes-panel"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden scroll-mt-28 py-20 bg-[#fffffc]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* 顶部标题区 */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono2 text-[11px] tracking-[0.18em] text-black/55 uppercase">
              outcomes — 04 / 就业与竞赛
            </p>
            <h2
              id="outcomes-title"
              className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl"
            >
              学长学姐
              <span className="relative inline-block">
                的去向与战绩
                <svg
                  aria-hidden="true"
                  viewBox="0 0 160 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full"
                >
                  <path
                    data-outcome-underline
                    d="M3 8 Q 30 3 60 7 T 110 7 T 157 5"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              。
            </h2>
          </div>
          <p className="font-mono2 text-xs tracking-wider text-black/50">
            [ 真实履历背书 · 一线大厂实习就业 + 权威国家级赛事统计 ]
          </p>
        </div>

        {/* 4 联数据战报条 (KPI Strip) */}
        <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-5">
          <div
            data-stat-box
            className="group rounded-xl border border-black/10 bg-[#fffdf4] p-4.5 shadow-[2px_2px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:border-black/25 sm:p-5"
          >
            <p className="font-mono2 text-[11px] font-medium tracking-wider text-black/50 uppercase">
              27届暑期实习率
            </p>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-[#111] sm:text-4xl">100</span>
              <span className="font-mono2 text-base font-bold text-sky-700">%</span>
            </div>
            <p className="mt-1.5 text-xs text-black/60">最近暑期全员落实实习</p>
          </div>

          <div
            data-stat-box
            className="group rounded-xl border border-black/10 bg-[#fffdf4] p-4.5 shadow-[2px_2px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:border-sky-700/30 sm:p-5"
          >
            <p className="font-mono2 text-[11px] font-medium tracking-wider text-sky-800 uppercase">
              名企 Offer 人数
            </p>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-sky-700 sm:text-4xl">7</span>
              <span className="font-mono2 text-base font-bold text-sky-700">人</span>
            </div>
            <p className="mt-1.5 text-xs text-black/60">腾讯、七牛云等录用</p>
          </div>

          <div
            data-stat-box
            className="group rounded-xl border border-black/10 bg-[#fffdf4] p-4.5 shadow-[2px_2px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:border-amber-600/30 sm:p-5"
          >
            <p className="font-mono2 text-[11px] font-medium tracking-wider text-amber-800 uppercase">
              国家级学科竞赛
            </p>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-amber-600 sm:text-4xl">4</span>
              <span className="font-mono2 text-base font-bold text-amber-600">项</span>
            </div>
            <p className="mt-1.5 text-xs text-black/60">蓝桥杯 / NCDA 顶级荣誉</p>
          </div>

          <div
            data-stat-box
            className="group rounded-xl border border-black/10 bg-[#fffdf4] p-4.5 shadow-[2px_2px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:border-black/25 sm:p-5"
          >
            <p className="font-mono2 text-[11px] font-medium tracking-wider text-black/50 uppercase">
              省部级竞赛大奖
            </p>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-[#111] sm:text-4xl">17</span>
              <span className="font-mono2 text-base font-bold text-sky-700">项</span>
            </div>
            <p className="mt-1.5 text-xs text-black/60">权威赛事实战斩获</p>
          </div>
        </div>

        {/* 5 大名企 实名去向卡片矩阵 (工装排版无Logo风格) */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              <h3 className="text-sm font-bold tracking-wider text-[#111] uppercase font-mono2">
                EMPLOYMENT DESTINATIONS // 学长学姐就职与实习名企
              </h3>
            </div>
            <span className="font-mono2 text-xs text-black/55">
              5 家重点录用企业
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {COMPANIES.map((comp, idx) => (
              <div
                key={comp.id}
                data-company-card
                className="group relative flex flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-4.5 shadow-[2px_2px_0_rgba(17,17,17,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-black/25 hover:shadow-[3px_5px_0_rgba(17,17,17,0.1)]"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                    <span className="font-mono2 text-[11px] font-bold text-black/40">
                      0{idx + 1}
                    </span>
                    <span className="font-mono2 text-[10px] tracking-wider text-sky-800/80 uppercase">
                      {comp.code}
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-lg font-bold tracking-tight text-[#111]">{comp.name}</h4>
                    <p className="font-mono2 text-[11px] text-black/50">{comp.sub}</p>
                  </div>
                </div>
                <div className="mt-4 pt-2.5 border-t border-black/5">
                  <span
                    className="font-mono2 inline-block rounded-xs px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      color: comp.color,
                      backgroundColor: comp.bgColor,
                      border: `1px solid ${comp.borderColor}`,
                    }}
                  >
                    {comp.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 实习就业 & 学科竞赛 深度叙事卡片 */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* 卡片 1：实习就业纪实 */}
          <article
            data-detail-card
            className="relative flex flex-col justify-between rounded-2xl border border-black/10 bg-[#fffdf4] p-6 shadow-[2px_3px_0_rgba(17,17,17,0.06)] sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-black/15 bg-[#fffffc] font-mono2 text-sm font-bold text-[#111] shadow-[1px_1px_0_rgba(17,17,17,0.08)]"
                  >
                    01
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#111]">实习就业实况</h3>
                    <p className="font-mono2 text-xs font-semibold text-sky-700">Career & Internship Trajectory</p>
                  </div>
                </div>
                <span className="font-mono2 rounded-xs border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-800">
                  26 / 27 / 28 届
                </span>
              </div>

              <div className="mt-5 space-y-3.5 text-[14px] leading-relaxed text-black/75">
                <p className="font-medium text-[#111]">
                  最近暑期 26 届成员全部实习，<span className="text-sky-800 underline decoration-sky-300 underline-offset-4 font-bold">其中七人获得腾讯、七牛云等企业 offer</span>。
                </p>
                <p>
                  不仅 26 届毕业班战绩亮眼，27 届、28 届梯队成员均有多人深度参与一线企业实习，涵盖后端云原生、前端工程化、音视频架构与移动端全栈。
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-black/5 pt-4">
              <span className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70">
                腾讯 / 微信 / 腾讯云智
              </span>
              <span className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70">
                七牛云 · 音视频架构
              </span>
              <span className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70">
                美团 · 基础技术平台
              </span>
            </div>
          </article>

          {/* 卡片 2：学科竞赛战绩 */}
          <article
            data-detail-card
            className="relative flex flex-col justify-between rounded-2xl border border-black/10 bg-[#fffdf4] p-6 shadow-[2px_3px_0_rgba(17,17,17,0.06)] sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-black/15 bg-[#fffffc] font-mono2 text-sm font-bold text-[#111] shadow-[1px_1px_0_rgba(17,17,17,0.08)]"
                  >
                    02
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#111]">权威学科竞赛荣誉</h3>
                    <p className="font-mono2 text-xs font-semibold text-amber-700">Official Competition Honors</p>
                  </div>
                </div>
                <span className="font-mono2 rounded-xs border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  高含金量国省奖
                </span>
              </div>

              <div className="mt-5 space-y-3.5 text-[14px] leading-relaxed text-black/75">
                <p className="font-medium text-[#111]">
                  在蓝桥杯、全国高校数字艺术设计大赛（NCDA）等多项教育部与行业权威赛事下：
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-amber-300/60 bg-amber-50/70 p-3">
                  <span className="text-xl">🏆</span>
                  <p className="text-sm font-bold text-amber-950">
                    累计斩获国家级：4 项 ， 省级：17 项
                  </p>
                </div>
                <p className="text-xs text-black/60">
                  由工作室指导教师全程带队孵化，从赛题拆解、架构落地到商业路演全流程实战赋能。
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-black/5 pt-4">
              <span className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70">
                蓝桥杯软件与信息技术大赛
              </span>
              <span className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70">
                全国高校数字艺术设计大赛 (NCDA)
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
