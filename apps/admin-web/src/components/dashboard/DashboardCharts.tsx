import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TREND_DATA_7D = {
  dates: ["09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11"],
  submissions: [4, 8, 12, 9, 15, 21, 18],
  parsed: [3, 7, 11, 8, 14, 19, 17],
};

const TREND_DATA_14D = {
  dates: [
    "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04",
    "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11",
  ],
  submissions: [2, 5, 4, 7, 6, 11, 8, 4, 8, 12, 9, 15, 21, 18],
  parsed: [2, 4, 4, 6, 6, 10, 7, 3, 7, 11, 8, 14, 19, 17],
};

const DEPARTMENT_DATA = [
  { name: "大前端项目组", value: 20, itemStyle: { color: "#0e7490" } },
  { name: "UI / UX 设计组", value: 14, itemStyle: { color: "#6366f1" } },
  { name: "后端与云原生", value: 12, itemStyle: { color: "#059669" } },
  { name: "办公室协同组", value: 7, itemStyle: { color: "#d97706" } },
];

const SCORE_BUCKETS = [
  { range: "90-100分", count: 8, hint: "顶尖推荐" },
  { range: "80-89分", count: 18, hint: "建议复审" },
  { range: "70-79分", count: 15, hint: "初筛合格" },
  { range: "60-69分", count: 9, hint: "待讨论" },
  { range: "< 60分", count: 3, hint: "储备候选" },
];

export function DashboardCharts() {
  const [timeRange, setTimeRange] = useState<"7d" | "14d">("7d");
  const [distributionMode, setDistributionMode] = useState<"department" | "score">("department");
  const [showTrendTable, setShowTrendTable] = useState(false);
  const [showDistTable, setShowDistTable] = useState(false);

  const trendChartRef = useRef<HTMLDivElement>(null);
  const trendInstanceRef = useRef<echarts.ECharts | null>(null);

  const distributionChartRef = useRef<HTMLDivElement>(null);
  const distributionInstanceRef = useRef<echarts.ECharts | null>(null);

  // Initialize and update Trend Chart
  useEffect(() => {
    if (!trendChartRef.current) return;

    if (!trendInstanceRef.current) {
      trendInstanceRef.current = echarts.init(trendChartRef.current, undefined, {
        renderer: "canvas",
      });
    }

    const chart = trendInstanceRef.current;
    const currentTrend = timeRange === "7d" ? TREND_DATA_7D : TREND_DATA_14D;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#18181b",
        borderColor: "#27272a",
        borderWidth: 1,
        textStyle: {
          color: "#f4f4f5",
          fontSize: 12,
          fontFamily: "monospace",
        },
        padding: [8, 12],
        axisPointer: {
          lineStyle: {
            color: "#0e7490",
            width: 1,
            type: "dashed",
          },
        },
      },
      legend: {
        top: 0,
        right: 0,
        icon: "roundRect",
        itemWidth: 12,
        itemHeight: 6,
        itemGap: 16,
        textStyle: {
          fontSize: 11,
          color: "#64748b",
        },
      },
      grid: {
        top: 36,
        left: 36,
        right: 16,
        bottom: 24,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: currentTrend.dates,
        axisLine: {
          lineStyle: { color: "#e2e8f0" },
        },
        axisLabel: {
          color: "#64748b",
          fontSize: 11,
          fontFamily: "monospace",
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#f1f5f9",
            type: "dashed",
          },
        },
        axisLabel: {
          color: "#64748b",
          fontSize: 11,
          fontFamily: "monospace",
        },
      },
      series: [
        {
          name: "新提交报名",
          type: "line",
          smooth: 0.35,
          showSymbol: false,
          data: currentTrend.submissions,
          itemStyle: { color: "#0e7490" },
          lineStyle: { width: 2.2, color: "#0e7490" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(14, 116, 144, 0.22)" },
              { offset: 1, color: "rgba(14, 116, 144, 0.00)" },
            ]),
          },
        },
        {
          name: "AI 结构化解析完成",
          type: "line",
          smooth: 0.35,
          showSymbol: false,
          data: currentTrend.parsed,
          itemStyle: { color: "#059669" },
          lineStyle: { width: 2, color: "#059669", type: "dotted" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(5, 150, 105, 0.12)" },
              { offset: 1, color: "rgba(5, 150, 105, 0.00)" },
            ]),
          },
        },
      ],
    };

    chart.setOption(option, true);
  }, [timeRange]);

  // Initialize and update Distribution Chart (Department Donut OR Score Bar)
  useEffect(() => {
    if (!distributionChartRef.current) return;

    if (!distributionInstanceRef.current) {
      distributionInstanceRef.current = echarts.init(
        distributionChartRef.current,
        undefined,
        { renderer: "canvas" }
      );
    }

    const chart = distributionInstanceRef.current;

    if (distributionMode === "department") {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "item",
          backgroundColor: "#18181b",
          borderColor: "#27272a",
          borderWidth: 1,
          textStyle: {
            color: "#f4f4f5",
            fontSize: 12,
            fontFamily: "monospace",
          },
          formatter: "{b}: {c} 份 ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "center",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12,
          textStyle: {
            fontSize: 11,
            color: "#64748b",
          },
        },
        series: [
          {
            name: "投递方向分布",
            type: "pie",
            radius: ["48%", "72%"],
            center: ["36%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
            label: {
              show: false,
            },
            emphasis: {
              scaleSize: 6,
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
              },
            },
            data: DEPARTMENT_DATA,
          },
        ],
      };
      chart.setOption(option, true);
    } else {
      // Score distribution bar chart
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "#18181b",
          borderColor: "#27272a",
          borderWidth: 1,
          textStyle: {
            color: "#f4f4f5",
            fontSize: 12,
            fontFamily: "monospace",
          },
          axisPointer: { type: "shadow" },
        },
        grid: {
          top: 18,
          left: 36,
          right: 16,
          bottom: 24,
        },
        xAxis: {
          type: "category",
          data: SCORE_BUCKETS.map((b) => b.range),
          axisLine: { lineStyle: { color: "#e2e8f0" } },
          axisLabel: {
            color: "#64748b",
            fontSize: 10,
            fontFamily: "monospace",
          },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: { color: "#f1f5f9", type: "dashed" },
          },
          axisLabel: {
            color: "#64748b",
            fontSize: 11,
            fontFamily: "monospace",
          },
        },
        series: [
          {
            name: "候选人数量",
            type: "bar",
            barWidth: "42%",
            data: SCORE_BUCKETS.map((b, idx) => ({
              value: b.count,
              itemStyle: {
                color:
                  idx === 0
                    ? "#0e7490"
                    : idx === 1
                    ? "#0891b2"
                    : idx === 2
                    ? "#06b6d4"
                    : idx === 3
                    ? "#64748b"
                    : "#94a3b8",
                borderRadius: [4, 4, 0, 0],
              },
            })),
          },
        ],
      };
      chart.setOption(option, true);
    }
  }, [distributionMode]);

  // Responsive resize observer
  useEffect(() => {
    const handleResize = () => {
      trendInstanceRef.current?.resize();
      distributionInstanceRef.current?.resize();
    };

    const observer = new ResizeObserver(handleResize);
    if (trendChartRef.current) observer.observe(trendChartRef.current);
    if (distributionChartRef.current) observer.observe(distributionChartRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      trendInstanceRef.current?.dispose();
      distributionInstanceRef.current?.dispose();
      trendInstanceRef.current = null;
      distributionInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* 投递趋势分析图 */}
      <Card className="lg:col-span-7 flex flex-col border border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 p-4 pb-3.5">
          <div className="min-w-0 flex-1 pr-3">
            <CardTitle className="text-sm font-semibold tracking-tight">
              投递流转趋势与解析吞吐
            </CardTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              实时追踪新增候选人报名与后台 AI 结构化抽取完成比率
            </p>
          </div>

          <div
            className="flex shrink-0 items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-1"
            role="group"
            aria-label="选择时间区间"
          >
            <button
              type="button"
              onClick={() => setTimeRange("7d")}
              className={cn(
                "rounded px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                timeRange === "7d"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              近 7 日
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("14d")}
              className={cn(
                "rounded px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                timeRange === "14d"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              近 14 日
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div ref={trendChartRef} className="h-64 w-full" aria-label="投递趋势与解析吞吐折线图" />
          <div className="mt-2 border-t border-border/50 pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowTrendTable((v) => !v)}
              className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              {showTrendTable ? "收起明细表格" : "查看数据明细表"}
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">单位: 份</span>
          </div>

          {showTrendTable && (
            <div className="mt-3 overflow-x-auto rounded border border-border/70 bg-muted/20">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="p-1.5 px-3">日期</th>
                    <th className="p-1.5 px-3 text-right">新增投递</th>
                    <th className="p-1.5 px-3 text-right">解析完成</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(timeRange === "7d" ? TREND_DATA_7D : TREND_DATA_14D).dates.map((d, i) => (
                    <tr key={d}>
                      <td className="p-1.5 px-3">{d}</td>
                      <td className="p-1.5 px-3 text-right tabular-nums">
                        {(timeRange === "7d" ? TREND_DATA_7D : TREND_DATA_14D).submissions[i]}
                      </td>
                      <td className="p-1.5 px-3 text-right tabular-nums">
                        {(timeRange === "7d" ? TREND_DATA_7D : TREND_DATA_14D).parsed[i]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 候选人多维分布图 */}
      <Card className="lg:col-span-5 flex flex-col border border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 p-4 pb-3.5">
          <div className="min-w-0 flex-1 pr-3">
            <CardTitle className="text-sm font-semibold tracking-tight">
              {distributionMode === "department" ? "专业组别投递占比" : "AI 匹配评分梯队分布"}
            </CardTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {distributionMode === "department"
                ? "四大协同项目组候选人报名分布"
                : "基于多模态大模型初筛的匹配评分分布"}
            </p>
          </div>

          <div
            className="flex shrink-0 items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-1"
            role="group"
            aria-label="切换分布图表"
          >
            <button
              type="button"
              onClick={() => setDistributionMode("department")}
              className={cn(
                "rounded px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                distributionMode === "department"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              组别
            </button>
            <button
              type="button"
              onClick={() => setDistributionMode("score")}
              className={cn(
                "rounded px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                distributionMode === "score"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              评分
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div ref={distributionChartRef} className="h-64 w-full" aria-label="候选人分布图" />
          <div className="mt-2 border-t border-border/50 pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowDistTable((v) => !v)}
              className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              {showDistTable ? "收起明细表格" : "查看分布数据表"}
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">
              {distributionMode === "department" ? "占比合计 100%" : "评分区间"}
            </span>
          </div>

          {showDistTable && (
            <div className="mt-3 overflow-x-auto rounded border border-border/70 bg-muted/20">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="p-1.5 px-3">
                      {distributionMode === "department" ? "项目组" : "评分梯队"}
                    </th>
                    <th className="p-1.5 px-3 text-right">份数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {distributionMode === "department"
                    ? DEPARTMENT_DATA.map((d) => (
                        <tr key={d.name}>
                          <td className="p-1.5 px-3 font-sans">{d.name}</td>
                          <td className="p-1.5 px-3 text-right tabular-nums">{d.value}</td>
                        </tr>
                      ))
                    : SCORE_BUCKETS.map((b) => (
                        <tr key={b.range}>
                          <td className="p-1.5 px-3">{b.range} ({b.hint})</td>
                          <td className="p-1.5 px-3 text-right tabular-nums">{b.count}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
