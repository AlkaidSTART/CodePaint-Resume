import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSearch,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type DashboardViewProps = {
  dashboard: DashboardSummary | null;
  loading: boolean;
  filterRole: string;
  onFilterChange: (role: string) => void;
  onRefresh: () => void | Promise<void>;
};

const filters = [
  { id: "all", label: "全部申请" },
  { id: "frontend", label: "前端" },
  { id: "ui-ux", label: "UI / UX" },
  { id: "office", label: "办公室" },
];

function applicationBadge(status: Application["status"]) {
  if (status === "contacted") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "processing") return "border-cyan-200 bg-cyan-50 text-cyan-700";
  if (status === "closed") return "border-border bg-muted text-muted-foreground";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function taskBadge(status: TaskStatus) {
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "failed") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "processing") return "border-cyan-200 bg-cyan-50 text-cyan-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "completed") return <CheckCircle2 aria-hidden="true" className="size-4 text-emerald-600" />;
  if (status === "failed") return <XCircle aria-hidden="true" className="size-4 text-rose-600" />;
  if (status === "processing") return <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-cyan-700 motion-reduce:animate-none" />;
  return <Clock3 aria-hidden="true" className="size-4 text-amber-600" />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pt-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-32" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton className="h-28" key={index} />)}</div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]"><Skeleton className="h-[30rem]" /><Skeleton className="h-[30rem]" /></div>
    </div>
  );
}

function ApplicantRow({ application, expanded, onToggle }: { application: Application; expanded: boolean; onToggle: () => void }) {
  return (
    <li className={cn("group border-b last:border-b-0", expanded && "bg-muted/30")}>
      <button type="button" className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[auto_minmax(0,1fr)_4.5rem_auto_auto]" aria-expanded={expanded} onClick={onToggle}>
        <Avatar className="size-9 bg-cyan-100 text-cyan-800"><AvatarFallback className="bg-cyan-100 text-sm font-semibold text-cyan-800">{application.applicantName.slice(0, 1)}</AvatarFallback></Avatar>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold text-foreground">{application.applicantName}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{application.role} · {application.submittedAt}</span></span>
        <span className="hidden text-right sm:block" aria-label={application.score ? `匹配度 ${application.score} 分` : undefined}><span className="block font-mono text-base font-semibold tabular-nums text-foreground">{application.score ?? "--"}</span><span className="text-[10px] text-muted-foreground">匹配分</span></span>
        <Badge variant="outline" className={cn("whitespace-nowrap text-[11px]", applicationBadge(application.status))}>{applicationStatusLabel(application.status)}</Badge>
        <ChevronDown aria-hidden="true" className={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && <div className="grid gap-4 px-4 pb-4 pl-16 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">候选人摘要</p><p className="mt-2 max-w-2xl leading-6 text-muted-foreground">{application.summary}</p></div><div className="flex flex-col items-start gap-3 sm:items-end"><div className="flex flex-wrap justify-end gap-1.5">{(application.skills ?? []).map((skill) => <Badge variant="secondary" key={skill}>{skill}</Badge>)}</div><Button variant="link" size="sm" className="h-auto px-0 text-cyan-700" onPress={() => undefined}>查看完整档案 <ArrowUpRight aria-hidden="true" /></Button></div></div>}
    </li>
  );
}

function TaskQueue({ tasks }: { tasks: TaskRecord[] }) {
  const [taskState, setTaskState] = useState<Record<string, TaskStatus>>(() => Object.fromEntries(tasks.map((task) => [task.id, task.status])));
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => { setTaskState(Object.fromEntries(tasks.map((task) => [task.id, task.status]))); }, [tasks]);

  const updateTask = (task: TaskRecord, nextStatus: TaskStatus, message: string) => {
    setTaskState((current) => ({ ...current, [task.id]: nextStatus }));
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2800);
  };

  return (
    <Card className="min-w-0 shadow-sm">
      <CardHeader className="gap-1 pb-3"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pipeline</p><CardTitle className="mt-1 text-lg tracking-tight">异步任务队列</CardTitle></div><Badge variant="secondary">{tasks.length} 项</Badge></div><p className="text-xs leading-5 text-muted-foreground">解析任务正在后台运行，异常项可以直接重试。</p></CardHeader>
      <Separator />
      <CardContent className="p-0">
        {feedback && <div className="mx-4 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700" role="status">{feedback}</div>}
        <ul className="divide-y">{tasks.map((task) => { const status = taskState[task.id] ?? task.status; const progressValue = status === "completed" ? 100 : status === "processing" ? 78 : 0; return <li className="space-y-3 px-4 py-4" key={task.id}><div className="flex items-start gap-3"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted"><TaskIcon status={status} /></span><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium leading-5 text-foreground">{task.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{status === "failed" ? "处理失败，可重新发起解析" : task.stage}</p></div><Badge variant="outline" className={cn("shrink-0 text-[10px]", taskBadge(status))}>{taskStatusLabel(status)}</Badge></div>{status === "processing" && <Progress aria-label="任务处理进度" value={progressValue}><span className="sr-only">{progressValue}%</span></Progress>}<div className="flex items-center justify-between gap-3 pl-10"><span className="text-[11px] text-muted-foreground">更新于 {task.updatedAt}</span><div className="flex gap-1.5">{status === "failed" && <Button variant="outline" size="xs" onPress={() => updateTask(task, "processing", "已重新加入解析队列")}>重试</Button>}{status === "queued" && <Button variant="outline" size="xs" onPress={() => updateTask(task, "processing", "任务已开始处理")}>开始处理</Button>}{status === "processing" && <Button variant="ghost" size="xs" onPress={() => updateTask(task, "completed", "任务已标记为完成")}>标记完成</Button>}</div></div></li>; })}</ul>
      </CardContent>
    </Card>
  );
}

export function DashboardView({ dashboard, loading, filterRole, onFilterChange, onRefresh }: DashboardViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const applicants = useMemo(() => dashboard?.recentApplications.filter((application) => filterRole === "all" || application.roleSlug === filterRole) ?? [], [dashboard, filterRole]);
  const metrics = dashboard ? [
    { label: "待初审简历", value: dashboard.pendingReview, hint: "等待安排评审", icon: FileSearch, tone: "text-amber-700", surface: "bg-amber-50" },
    { label: "AI 解析处理中", value: dashboard.processing, hint: "OCR 与结构化流程", icon: Sparkles, tone: "text-cyan-700", surface: "bg-cyan-50" },
    { label: "解析异常", value: dashboard.failed, hint: "需要人工处理", icon: AlertCircle, tone: "text-rose-700", surface: "bg-rose-50" },
    { label: "本周新增报名", value: dashboard.newThisWeek, hint: "较上周持续增长", icon: TrendingUp, tone: "text-emerald-700", surface: "bg-emerald-50" },
  ] : [];

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700"><span className="size-1.5 rounded-full bg-rose-500 shadow-[0_0_0_4px_rgb(244_63_94/0.1)]" />2026 秋季招新 <span className="text-muted-foreground/40">/</span> 工作台概览</p><h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">招新概览与流转监控</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">今天的评审工作，从这里开始。优先处理待初审申请，保持解析管线顺畅。</p></div><Button onPress={() => void onRefresh()} isDisabled={loading} className="shrink-0 self-start sm:self-auto"><RefreshCw aria-hidden="true" className={cn(loading && "animate-spin")} />{loading ? "正在刷新" : "刷新数据"}</Button></header>
    {loading && <DashboardSkeleton />}
    {!loading && dashboard && <><section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center" aria-labelledby="dashboard-summary-title"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">At a glance</p><h2 id="dashboard-summary-title" className="mt-1 text-lg font-semibold tracking-tight">当前摘要</h2><p className="mt-1 text-xs text-muted-foreground">{dashboard.failed > 0 ? `有 ${dashboard.failed} 个解析异常需要优先处理。` : "当前没有需要立即处理的解析异常。"}</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex size-7 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700"><Check aria-hidden="true" className="size-3.5" /></span><span>数据已同步<br /><strong className="font-semibold text-foreground">刚刚更新</strong></span></div></section><dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <Card className="shadow-sm" key={metric.label}><CardContent className="p-4"><div className="flex items-center justify-between gap-3"><dt className="text-xs font-medium text-muted-foreground">{metric.label}</dt><span className={cn("flex size-7 items-center justify-center rounded-md", metric.surface)}><Icon className={cn("size-4", metric.tone)} aria-hidden="true" /></span></div><dd className="mt-3 font-mono text-3xl font-semibold tracking-[-0.08em] text-foreground">{metric.value}</dd><span className="mt-1 block text-[11px] text-muted-foreground">{metric.hint}</span></CardContent></Card>; })}</dl><div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]"><Card className="min-w-0 shadow-sm" aria-labelledby="dashboard-applications-title"><CardHeader className="gap-1 pb-3"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Inbox / 01</p><CardTitle id="dashboard-applications-title" className="mt-1 text-lg tracking-tight">待处理申请</CardTitle></div><Badge variant="secondary" className="font-mono tabular-nums">{applicants.length.toString().padStart(2, "0")} 条</Badge></div><p className="text-xs leading-5 text-muted-foreground">按提交时间排列，优先完成初审与状态流转。</p></CardHeader><div className="flex gap-1 overflow-x-auto border-b px-4 pb-3" role="group" aria-label="按岗位筛选申请">{filters.map((filter) => <Button key={filter.id} type="button" size="sm" variant={filterRole === filter.id ? "secondary" : "ghost"} aria-pressed={filterRole === filter.id} onPress={() => onFilterChange(filter.id)}>{filter.label}</Button>)}</div><CardContent className="p-0">{applicants.length > 0 ? <ol>{applicants.map((application) => <ApplicantRow key={application.id} application={application} expanded={expandedId === application.id} onToggle={() => setExpandedId(expandedId === application.id ? null : application.id)} />)}</ol> : <div className="grid min-h-56 place-items-center px-6 text-center"><div><UserRound className="mx-auto size-7 text-muted-foreground/50" aria-hidden="true" /><p className="mt-3 text-sm font-medium">当前筛选下暂无申请</p><p className="mt-1 text-xs text-muted-foreground">切换岗位筛选，查看其他候选人的进展。</p></div></div>}</CardContent></Card><TaskQueue tasks={dashboard.tasks} /></div></>}
    {!loading && !dashboard && <Card className="grid min-h-56 place-items-center text-center"><CardContent><AlertCircle className="mx-auto size-7 text-muted-foreground/50" aria-hidden="true" /><p className="mt-3 text-sm font-medium">暂时无法载入工作台</p><p className="mt-1 text-xs text-muted-foreground">请稍后重试，或点击右上角刷新数据。</p></CardContent></Card>}
  </div>;
}
