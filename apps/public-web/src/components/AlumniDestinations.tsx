import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { SectionLabel } from "@codepaint/ui";
import {
  SiQq,
  SiWechat,
  SiMeituan,
} from "react-icons/si";
import { Cloud, Award, Users, Sparkles, Server, Gamepad2 } from "lucide-react";

export function AlumniDestinations() {
  const [activeCategory, setActiveCategory] = useState<"distribution" | "trends">("distribution");

  // Only exact companies requested: 网易, 七牛云, 腾讯, 腾讯云智, 微信, 美团
  const companies = [
    {
      name: "腾讯 (Tencent)",
      badge: "26届实习 x3",
      role: "前端 / 全栈研发",
      icon: SiQq,
      color: "hover:border-[#0052d9]/40 hover:bg-[#0052d9]/5 text-[#0052d9]",
      desc: "PCG / 平台与内容事业群 核心研发",
    },
    {
      name: "微信 (WeChat)",
      badge: "大厂研发",
      role: "小程序 / Web 架构",
      icon: SiWechat,
      color: "hover:border-[#07c160]/40 hover:bg-[#07c160]/5 text-[#07c160]",
      desc: "WXG 微信事业群 生态产品线",
    },
    {
      name: "七牛云 (Qiniu)",
      badge: "26届实习 x4",
      role: "云存储 / 前端架构",
      icon: Cloud,
      color: "hover:border-sky-500/40 hover:bg-sky-500/5 text-sky-600",
      desc: "音视频与云原生前端基础架构",
    },
    {
      name: "腾讯云智 (Tencent CSIG)",
      badge: "产业互联",
      role: "行业云 / 全栈工程",
      icon: Server,
      color: "hover:border-[#0066ff]/40 hover:bg-[#0066ff]/5 text-[#0066ff]",
      desc: "云与智慧产业数字化解决方案",
    },
    {
      name: "网易 (NetEase)",
      badge: "游戏与互娱",
      role: "雷火 / 互娱工具链",
      icon: Gamepad2,
      color: "hover:border-[#e60012]/40 hover:bg-[#e60012]/5 text-[#e60012]",
      desc: "网易互娱与雷火事业群 研发体系",
    },
    {
      name: "美团 (Meituan)",
      badge: "校招录用",
      role: "到店 / 基础研发",
      icon: SiMeituan,
      color: "hover:border-[#ffd000]/60 hover:bg-[#ffd000]/10 text-amber-600",
      desc: "高并发本地生活与大前端体系",
    },
  ];

  // ECharts Option for Career & Distribution of these 6 destinations
  const pieOption = {
    animationDuration: 1400,
    animationEasing: "cubicOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      textStyle: { color: "#ffffff", fontSize: 12 },
      formatter: "{b}: <strong>{c} 人 ({d}%)</strong>",
    },
    legend: {
      bottom: "2%",
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: "#64748b", fontSize: 11 },
    },
    series: [
      {
        name: "名企录取分布",
        type: "pie",
        radius: ["42%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#10141d",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          fontSize: 11,
          color: "#e2e8f0",
          formatter: "{b}\n{c}人 ({d}%)",
        },
        labelLine: {
          smooth: 0.2,
          length: 10,
          length2: 12,
        },
        data: [
          { value: 4, name: "七牛云 (Qiniu)", itemStyle: { color: "#0284c7" } },
          { value: 3, name: "腾讯 (Tencent)", itemStyle: { color: "#0052d9" } },
          { value: 2, name: "微信 (WeChat)", itemStyle: { color: "#07c160" } },
          { value: 2, name: "腾讯云智 (Tencent CSIG)", itemStyle: { color: "#38bdf8" } },
          { value: 2, name: "网易 (NetEase)", itemStyle: { color: "#e60012" } },
          { value: 2, name: "美团 (Meituan)", itemStyle: { color: "#f59e0b" } },
        ],
      },
    ],
  };

  const barOption = {
    animationDuration: 1200,
    animationEasing: "exponentialOut",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      textStyle: { color: "#ffffff", fontSize: 12 },
    },
    grid: {
      top: "14%",
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["2023届", "2024届", "2025届", "2026届(暑期)"],
      axisLine: { lineStyle: { color: "#334155" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      name: "落实率 (%)",
      max: 100,
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    series: [
      {
        name: "暑期/秋招一线名企落实率",
        type: "bar",
        barWidth: "36%",
        data: [
          { value: 92, itemStyle: { color: "#93c5fd", borderRadius: [6, 6, 0, 0] } },
          { value: 95, itemStyle: { color: "#60a5fa", borderRadius: [6, 6, 0, 0] } },
          { value: 98, itemStyle: { color: "#38bdf8", borderRadius: [6, 6, 0, 0] } },
          { value: 100, itemStyle: { color: "#0284c7", borderRadius: [6, 6, 0, 0] } },
        ],
        label: {
          show: true,
          position: "top",
          formatter: "{c}%",
          fontSize: 12,
          fontWeight: "bold",
          color: "#7dd3fc",
        },
      },
    ],
  };

  return (
    <section id="alumni" className="border-t border-white/10 bg-black py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Alumni & Impact</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              学长学姐名企去向版图
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm md:mt-0">
            涵盖网易、七牛云、腾讯、腾讯云智、微信、美团
          </p>
        </div>

        {/* 6 Target Company Brand Cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:bg-white/[0.07] ${comp.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/80 shadow-2xs border border-white/10 transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                      {comp.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xs font-bold text-white group-hover:text-sky-200">
                    {comp.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-medium text-sky-400">
                    {comp.role}
                  </p>
                </div>

                <p className="mt-3 text-[10px] text-slate-400 border-t border-white/10 pt-2 leading-tight">
                  {comp.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ECharts Animated Visualization Box */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                动态数据看板
              </div>
              <h3 className="mt-1 text-lg font-bold text-white">
                名企录取人数分布与历届落实率
              </h3>
            </div>

            <div className="inline-flex rounded-lg border border-white/10 bg-black/50 p-1 shadow-2xs">
              <button
                onClick={() => setActiveCategory("distribution")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === "distribution"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                去向分布 (Pie)
              </button>
              <button
                onClick={() => setActiveCategory("trends")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === "trends"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                落实趋势 (Trend)
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="h-72 w-full lg:col-span-8">
              <ReactECharts
                option={activeCategory === "distribution" ? pieOption : barOption}
                style={{ height: "100%", width: "100%" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>

            <div className="space-y-3 lg:col-span-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Award className="h-4 w-4 text-sky-400" />
                  大厂录用直通闭环
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                  得益于“真实商业项目交付 + 老带新代码审查”，成员在面试中具备超越同龄人的工业级项目经验。
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Users className="h-4 w-4 text-sky-400" />
                  校友圈子持续赋能
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                  已毕业与在职学长学姐定期开展求职面经分享，提供一线名企岗位内推通道。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
