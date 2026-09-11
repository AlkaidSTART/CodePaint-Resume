import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSearch,
  FileText,
  LoaderCircle,
  RefreshCw,
  RotateCw,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import type { Application, DashboardSummary, TaskRecord, TaskStatus } from "../../lib/types";
import { applicationStatusLabel, taskStatusLabel } from "../../lib/utils/index";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DashboardCharts } from "./DashboardCharts";
import { PipelineGraphViewer } from "@/components/pipeline/PipelineGraphViewer";

gsap.registerPlugin(useGSAP);

export type DashboardViewProps = {
  dashboard: DashboardSummary | null;
  loading: boolean;
  filterRole: string;
  onFilterChange: (role: string) => void;
  onRefresh: () => void | Promise<void>;
};

const FILTERS = [
  { id: "all", label: "全部申请" },
  { id: "frontend", label: "大前端" },
  { id: "ui-ux", label: "UI / UX" },
  { id: "office", label: "办公室" },
];

function getApplicationStatusBadge(status: Application["status"]) {
  switch (status) {
    case "contacted":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "processing":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400";
    case "closed":
      return "border-border bg-muted/60 text-muted-foreground";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
}

function getTaskStatusBadge(status: TaskStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "failed":
      return "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400";
    case "processing":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400";
    default:
      return "border-border bg-muted/60 text-muted-foreground";
  }
}

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 aria-hidden="true" className="size-4 text-emerald-600" />;
    case "failed":
      return <XCircle aria-hidden="true" className="size-4 text-rose-600" />;
    case "processing":
      return <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-cyan-600 motion-reduce:animate-none" />;
    default:
      return <Clock3 aria-hidden="true" className="size-4 text-muted-foreground" />;
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pt-4" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card p-5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Skeleton className="lg:col-span-7 h-80 rounded-xl" />
        <Skeleton className="lg:col-span-5 h-80 rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Skeleton className="lg:col-span-7 h-[28rem] rounded-xl" />
        <Skeleton className="lg:col-span-5 h-[28rem] rounded-xl" />
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = numberRef.current;
      if (!el) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 0.65,
        ease: "power2.out",
        onUpdate: () => {
          if (el) el.textContent = Math.round(obj.val).toString();
        },
      });
    },
    { dependencies: [value] }
  );

  return (
    <div className="metric-box flex flex-col justify-between bg-card p-5 transition-colors hover:bg-muted/20">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-7 items-center justify-center rounded-md bg-muted/60", tone)}>
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span
            ref={numberRef}
            className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums"
          >
            {value}
          </span>
          <span className="font-mono text-xs text-muted-foreground">份</span>
        </div>
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

function ApplicantRowItem({
  application,
  expanded,
  onToggle,
}: {
  application: Application;
  expanded: boolean;
  onToggle: () => void;
}) {
  const detailRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = detailRef.current;
      if (!el) return;

      if (expanded) {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.22, ease: "power2.out" }
        );
      }
    },
    { dependencies: [expanded] }
  );

  return (
    <li className={cn("applicant-row border-b border-border/70 last:border-b-0 transition-colors", expanded && "bg-muted/25")}>
      <button
        type="button"
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[auto_minmax(0,1fr)_5rem_auto_auto]"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <Avatar className="size-9 border bg-muted font-medium text-foreground">
          <AvatarFallback className="text-xs font-semibold">
            {application.applicantName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {application.applicantName}
            </span>
            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
              {application.role}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            投递于 {application.submittedAt}
          </p>
        </div>

        <div className="hidden text-right sm:block" aria-label={`匹配度 ${application.score ?? 0} 分`}>
          <span className="block font-mono text-sm font-semibold tabular-nums text-foreground">
            {application.score ? `${application.score}分` : "--"}
          </span>
          <span className="block text-[10px] text-muted-foreground">AI 匹配</span>
        </div>

        <Badge
          variant="outline"
          className={cn("whitespace-nowrap text-[11px] font-medium", getApplicationStatusBadge(application.status))}
        >
          {applicationStatusLabel(application.status)}
        </Badge>

        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div ref={detailRef} className="overflow-hidden border-t border-border/40 bg-muted/15 px-4 py-4 sm:pl-16">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="text-xs font-semibold text-foreground">简历提要</p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                {application.summary}
              </p>

              {application.skills && application.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {application.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-1.5 py-0.5 text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end gap-2 border-t border-border/40 pt-3 sm:border-t-0 sm:pt-0 sm:items-end">
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="xs" className="gap-1 text-xs">
                  <UserCheck className="size-3 text-emerald-600" />
                  初审通过
                </Button>
                <Button variant="outline" size="xs" className="gap-1 text-xs">
                  <FileText className="size-3" />
                  查看 PDF
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">ID: {application.id}</span>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function TaskQueueSection({ tasks }: { tasks: TaskRecord[] }) {
  const [taskList, setTaskList] = useState<TaskRecord[]>(tasks);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [inspectTask, setInspectTask] = useState<TaskRecord | null>(null);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const retryTask = (task: TaskRecord) => {
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: "processing", stage: "重新调度 OCR 结构化流水线" } : t
      )
    );
    setFeedback(`已重新调度任务: ${task.title.slice(0, 16)}...`);
    window.setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <Card className="flex h-full flex-col border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 p-4 pb-3.5">
        <div className="min-w-0 flex-1 pr-3">
          <CardTitle className="text-sm font-semibold tracking-tight">
            异步解析任务流水线
          </CardTitle>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            实时监控 OCR 抽取、LLM 评分与版面分析执行队列
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/workspace/tasks"
            className="text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            DAG 图谱大屏 →
          </Link>
          <Badge variant="secondary" className="font-mono text-xs">
            {taskList.length} 个任务
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {feedback && (
          <div className="m-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            {feedback}
          </div>
        )}

        <ul className="divide-y divide-border">
          {taskList.map((task) => {
            const isProcessing = task.status === "processing";
            const isFailed = task.status === "failed";
            return (
              <li key={task.id} className="task-row space-y-2.5 p-4 transition-colors hover:bg-muted/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                      <TaskStatusIcon status={task.status} />
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-xs font-semibold text-foreground">
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {isFailed ? "解析中断，点击右侧重试恢复" : task.stage}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-[10px] font-medium", getTaskStatusBadge(task.status))}
                  >
                    {taskStatusLabel(task.status)}
                  </Badge>
                </div>

                {isProcessing && (
                  <Progress aria-label="处理进度" value={68} className="h-1" />
                )}

                <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-mono text-[10px]">更新于 {task.updatedAt}</span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onPress={() => setInspectTask(task)}
                      className="h-6 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <Sparkles className="size-2.5 text-cyan-600" />
                      节点拓扑
                    </Button>
                    {isFailed && (
                      <Button
                        variant="outline"
                        size="xs"
                        onPress={() => retryTask(task)}
                        className="gap-1 text-xs text-rose-600 hover:text-rose-700"
                      >
                        <RotateCw className="size-3" />
                        重新调度
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>

      {/* Slide-out DAG Flow Inspector for selected task */}
      <SheetContent
        isOpen={Boolean(inspectTask)}
        onOpenChange={(open) => !open && setInspectTask(null)}
        side="right"
        className="w-[min(52rem,96vw)] overflow-y-auto p-6"
      >
        {inspectTask && (
          <div className="space-y-4">
            <SheetHeader className="border-b pb-3">
              <SheetTitle className="text-base font-bold">
                任务执行 DAG 图谱监控
              </SheetTitle>
            </SheetHeader>
            <PipelineGraphViewer taskTitle={inspectTask.title} />
          </div>
        )}
      </SheetContent>
    </Card>
  );
}

export function DashboardView({
  dashboard,
  loading,
  filterRole,
  onFilterChange,
  onRefresh,
}: DashboardViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const applicants = useMemo(
    () =>
      dashboard?.recentApplications.filter(
        (app) => filterRole === "all" || app.roleSlug === filterRole
      ) ?? [],
    [dashboard, filterRole]
  );

  // High-performance GSAP page entrance animation
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(".dashboard-header", {
          opacity: 0,
          y: -10,
          duration: 0.35,
        });

        tl.from(
          ".metric-box",
          {
            opacity: 0,
            y: 8,
            duration: 0.3,
            stagger: 0.05,
          },
          "-=0.2"
        );

        tl.from(
          ".dashboard-panel",
          {
            opacity: 0,
            y: 12,
            duration: 0.35,
            stagger: 0.08,
          },
          "-=0.2"
        );
      }, containerRef);

      return () => ctx.revert();
    },
    { dependencies: [loading] }
  );

  const metrics = dashboard
    ? [
        {
          label: "待初审简历",
          value: dashboard.pendingReview,
          hint: "等待组长初筛评估",
          icon: FileSearch,
          tone: "text-amber-600",
        },
        {
          label: "AI 解析中任务",
          value: dashboard.processing,
          hint: "多模态抽取与向量化",
          icon: Sparkles,
          tone: "text-cyan-600",
        },
        {
          label: "解析异常待处理",
          value: dashboard.failed,
          hint: "格式损坏或识别超时",
          icon: AlertCircle,
          tone: "text-rose-600",
        },
        {
          label: "本周新增报名",
          value: dashboard.newThisWeek,
          hint: "较上周期递增 24%",
          icon: TrendingUp,
          tone: "text-emerald-600",
        },
      ]
    : [];

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Page Header */}
      <header className="dashboard-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            招新概览看板
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            2026 秋季招募周期 · 实时监控投递流动、AI 结构化解析管线健康度与各组初筛进度
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={() => void onRefresh()}
            isDisabled={loading}
            className="gap-2 text-xs font-medium"
          >
            <RefreshCw
              aria-hidden="true"
              className={cn("size-3.5", loading && "animate-spin")}
            />
            {loading ? "正在同步..." : "刷新看板数据"}
          </Button>
        </div>
      </header>

      {loading && <DashboardSkeleton />}

      {!loading && dashboard && (
        <>
          {/* Integrated Metrics Grid (Structured monolithic bar instead of 4 floating cards) */}
          <section aria-label="核心统计指标">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
              {metrics.map((metric) => (
                <MetricItem key={metric.label} {...metric} />
              ))}
            </div>
          </section>

          {/* ECharts Visual Data Insights & Distributions */}
          <section aria-label="招新数据分析与趋势" className="dashboard-panel">
            <DashboardCharts />
          </section>

          {/* Workbench Grid: Left stream + Right pipeline */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Applicant Review Queue */}
            <Card className="lg:col-span-7 dashboard-panel flex flex-col border border-border/80 shadow-xs" aria-labelledby="inbox-heading">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 p-4 pb-3.5">
                <div className="min-w-0 flex-1 pr-3">
                  <CardTitle id="inbox-heading" className="text-sm font-semibold tracking-tight">
                    待处理申请流
                  </CardTitle>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    共 {applicants.length} 份候选人材料等待初审评定
                  </p>
                </div>

                {/* Filter segmented buttons */}
                <div
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-1"
                  role="group"
                  aria-label="按专业组别筛选"
                >
                  {FILTERS.map((filter) => {
                    const isActive = filterRole === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => onFilterChange(filter.id)}
                        className={cn(
                          "rounded px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                          isActive
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                {applicants.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {applicants.map((application) => (
                      <ApplicantRowItem
                        key={application.id}
                        application={application}
                        expanded={expandedId === application.id}
                        onToggle={() =>
                          setExpandedId(expandedId === application.id ? null : application.id)
                        }
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <UserRound className="size-8 text-muted-foreground/40" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-foreground">
                      当前组别下暂无待初审申请
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      可切换上方组别或等待新投递进入流水线
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right: Task Pipeline Queue */}
            <div className="lg:col-span-5 dashboard-panel">
              <TaskQueueSection tasks={dashboard.tasks} />
            </div>
          </div>
        </>
      )}

      {!loading && !dashboard && (
        <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-foreground">无法加载招新控制台数据</p>
          <p className="mt-1 text-xs text-muted-foreground">请检查网络或后端服务连接</p>
          <Button variant="outline" size="sm" className="mt-4" onPress={() => void onRefresh()}>
            重试连接
          </Button>
        </Card>
      )}
    </div>
  );
}
