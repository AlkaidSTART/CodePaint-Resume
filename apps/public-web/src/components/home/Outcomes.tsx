import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Placement = {
  no: string;
  name: string;
  code: string;
  meta: string;
};

type Award = {
  no: string;
  name: string;
  code: string;
  national: number;
  provincial: number;
};

const PLACEMENTS: Placement[] = [
  { no: "01", name: "腾讯", code: "0700.HK", meta: "成都 · 26届 " },
  { no: "02", name: "微信", code: "WXG", meta: "广州 · 26届" },
  { no: "03", name: "七牛云", code: "QINIU", meta: "26届 " },
  { no: "04", name: "腾讯云智", code: "TCS", meta: "录用" },
  { no: "05", name: "美团", code: "3690.HK", meta: "录用" },
];

const AWARDS: Award[] = [
  {
    no: "01",
    name: "蓝桥杯全国软件和信息技术专业人才大赛",
    code: "LANQIAO",
    national: 2,
    provincial: 9,
  },
  {
    no: "02",
    name: "全国高校数字艺术设计大赛",
    code: "NCDA",
    national: 2,
    provincial: 8,
  },
];

const STATS = [
  { label: "26届暑期实习落实率", value: 100, suffix: "%", note: "全员落实" },
  { label: "名企录用", value: 7, suffix: "人", note: "大厂 offer" },
  { label: "国家级奖项", value: 4, suffix: "项", note: "蓝桥杯 / NCDA" },
  { label: "省部级奖项", value: 17, suffix: "项", note: "实战斩获" },
];

export function Outcomes() {
  const rootRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"placements" | "awards">("placements");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const underline = root.querySelector<SVGPathElement>("[data-underline]");
      const counters = root.querySelectorAll<HTMLElement>("[data-count-target]");
      const rows = root.querySelectorAll<HTMLElement>("[data-ledger-row]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      if (underline) {
        const len = underline.getTotalLength() || 160;
        gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(underline, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0);
      }

      counters.forEach((el) => {
        const target = Number(el.dataset.countTarget || "0");
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: target,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
          },
          0.15
        );
      });

      if (rows.length > 0) {
        tl.fromTo(
          rows,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" },
          0.3
        );
      }
    },
    { scope: rootRef, dependencies: [tab] }
  );

  return (
    <section
      ref={rootRef}
      id="outcomes"
      aria-labelledby="outcomes-title"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden scroll-mt-24 py-20 bg-[#fffffc]"
    >
      {/* ponytail: clean editorial ledger, add complex charts when datasets expand */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono2 text-[11px] tracking-[0.2em] text-black/50 uppercase">
              04 / OUTCOMES & LEDGER
            </p>
            <h2
              id="outcomes-title"
              className="mt-2 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl"
            >
              学长学姐
              <span className="relative inline-block">
                去向与战绩
                <svg
                  aria-hidden="true"
                  viewBox="0 0 160 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full"
                >
                  <path
                    data-underline
                    d="M3 8 Q 30 3 60 7 T 110 7 T 157 5"
                    fill="none"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>
          <p className="font-mono2 text-xs text-black/50">
            [ 官方统计 · 真实履历台账 ]
          </p>
        </div>

        {/* Numeric Rollup Strip */}
        <div className="mt-8 grid grid-cols-2 border-b border-l border-black/10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-r border-t border-black/10 bg-[#fffffc] p-5 sm:p-6"
            >
              <p className="font-mono2 text-[11px] text-black/50">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  data-count-target={stat.value}
                  className="font-mono2 text-3xl font-black text-[#111] sm:text-4xl"
                >
                  0
                </span>
                <span className="font-mono2 text-sm font-semibold text-black/70">
                  {stat.suffix}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-black/40">{stat.note}</p>
            </div>
          ))}
        </div>

        {/* Ledger Section with Segmented Switcher */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <div className="inline-flex rounded-lg border border-black/10 bg-black/[0.03] p-0.5">
              <button
                type="button"
                onClick={() => setTab("placements")}
                className={`cursor-pointer rounded-md px-3.5 py-1.5 font-mono2 text-xs font-semibold transition-all ${
                  tab === "placements"
                    ? "bg-[#111] text-[#fffffc] shadow-xs"
                    : "text-black/60 hover:text-[#111]"
                }`}
              >
                名企就业台账 [05]
              </button>
              <button
                type="button"
                onClick={() => setTab("awards")}
                className={`cursor-pointer rounded-md px-3.5 py-1.5 font-mono2 text-xs font-semibold transition-all ${
                  tab === "awards"
                    ? "bg-[#111] text-[#fffffc] shadow-xs"
                    : "text-black/60 hover:text-[#111]"
                }`}
              >
                学科竞赛台账 [21]
              </button>
            </div>

            <span className="hidden font-mono2 text-xs text-black/40 sm:inline-block">
              {tab === "placements" ? "VERIFIED PLACEMENTS" : "COMPETITION AWARDS"}
            </span>
          </div>

          {/* Placements Ledger */}
          {tab === "placements" && (
            <div className="divide-y divide-black/10 border-b border-black/10">
              {PLACEMENTS.map((item) => (
                <div
                  key={item.no}
                  data-ledger-row
                  className="group flex flex-col justify-between gap-3 py-4 transition-colors hover:bg-black/[0.02] sm:flex-row sm:items-center sm:py-5"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-mono2 text-xs font-semibold text-black/35 group-hover:text-black">
                      {item.no}
                    </span>
                    <h3 className="text-lg font-bold text-[#111] tracking-tight sm:text-xl">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 pl-8 sm:pl-0">
                    <span className="font-mono2 text-xs text-black/60">
                      {item.meta}
                    </span>
                    <span className="font-mono2 rounded-xs border border-black/15 bg-black/[0.04] px-2 py-0.5 text-[11px] font-semibold text-black/80">
                      {item.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Competition Awards Ledger */}
          {tab === "awards" && (
            <div className="divide-y divide-black/10 border-b border-black/10">
              {AWARDS.map((item) => (
                <div
                  key={item.no}
                  data-ledger-row
                  className="group flex flex-col justify-between gap-3 py-4 transition-colors hover:bg-black/[0.02] sm:flex-row sm:items-center sm:py-5"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-mono2 text-xs font-semibold text-black/35 group-hover:text-black">
                      {item.no}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#111] tracking-tight sm:text-lg">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-8 sm:pl-0">
                    <span className="font-mono2 text-xs text-black/70">
                      国家级 <strong className="text-[#111] font-bold">{item.national}</strong> 项 · 省级 <strong className="text-[#111] font-bold">{item.provincial}</strong> 项
                    </span>
                    <span className="font-mono2 rounded-xs border border-black/15 bg-black/[0.04] px-2 py-0.5 text-[11px] font-semibold text-black/80">
                      {item.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
