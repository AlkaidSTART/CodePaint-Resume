import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
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
import { applicationStatusLabel, taskStatusLabel } from "../../lib/utils";

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

function applicationTone(status: Application["status"]): string {
  if (status === "contacted") return "dashboard-status dashboard-status-success";
  if (status === "processing") return "dashboard-status dashboard-status-info";
  if (status === "closed") return "dashboard-status dashboard-status-neutral";
  return "dashboard-status dashboard-status-warning";
}

function taskTone(status: TaskStatus): string {
  if (status === "completed") return "dashboard-status dashboard-status-success";
  if (status === "failed") return "dashboard-status dashboard-status-danger";
  if (status === "processing") return "dashboard-status dashboard-status-info";
  return "dashboard-status dashboard-status-warning";
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "completed") return <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-600" />;
  if (status === "failed") return <XCircle aria-hidden="true" className="h-4 w-4 text-rose-600" />;
  if (status === "processing") return <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-cyan-700 motion-reduce:animate-none" />;
  return <Clock3 aria-hidden="true" className="h-4 w-4 text-amber-600" />;
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-busy="true" aria-live="polite">
      <div className="dashboard-skeleton-line dashboard-skeleton-line-short" />
      <div className="dashboard-skeleton-metrics">
        {Array.from({ length: 4 }).map((_, index) => <div className="dashboard-skeleton-metric" key={index} />)}
      </div>
      <div className="dashboard-skeleton-columns">
        <div className="dashboard-skeleton-list">{Array.from({ length: 4 }).map((_, index) => <div className="dashboard-skeleton-row" key={index} />)}</div>
        <div className="dashboard-skeleton-list">{Array.from({ length: 3 }).map((_, index) => <div className="dashboard-skeleton-row" key={index} />)}</div>
      </div>
    </div>
  );
}

function ApplicantRow({ application, expanded, onToggle }: { application: Application; expanded: boolean; onToggle: () => void }) {
  return (
    <li className={`dashboard-applicant ${expanded ? "dashboard-applicant-expanded" : ""}`}>
      <button type="button" className="dashboard-applicant-trigger" aria-expanded={expanded} onClick={onToggle}>
        <span className="dashboard-avatar" aria-hidden="true">{application.applicantName.slice(0, 1)}</span>
        <span className="dashboard-applicant-main">
          <span className="dashboard-applicant-name">{application.applicantName}</span>
          <span className="dashboard-applicant-meta">{application.role} · {application.submittedAt}</span>
        </span>
        <span className="dashboard-applicant-score" aria-label={application.score ? `匹配度 ${application.score} 分` : undefined}>
          {application.score ?? "--"}<small>匹配</small>
        </span>
        <span className={applicationTone(application.status)}>{applicationStatusLabel(application.status)}</span>
        <ChevronDown aria-hidden="true" className={`dashboard-chevron ${expanded ? "dashboard-chevron-open" : ""}`} />
      </button>
      {expanded && (
        <div className="dashboard-applicant-detail">
          <div>
            <p className="dashboard-detail-label">候选人摘要</p>
            <p className="dashboard-detail-copy">{application.summary}</p>
          </div>
          <div className="dashboard-skill-list">
            {(application.skills ?? []).map((skill) => <span className="dashboard-skill" key={skill}>{skill}</span>)}
          </div>
          <button type="button" className="dashboard-inline-action">查看完整档案 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></button>
        </div>
      )}
    </li>
  );
}

function TaskQueue({ tasks }: { tasks: TaskRecord[] }) {
  return (
    <section className="dashboard-panel dashboard-task-panel" aria-labelledby="dashboard-tasks-title">
      <div className="dashboard-panel-heading">
        <div>
          <p className="dashboard-kicker">Pipeline</p>
          <h2 id="dashboard-tasks-title" className="dashboard-section-title">异步任务</h2>
        </div>
        <span className="dashboard-count">{tasks.length.toString().padStart(2, "0")}</span>
      </div>
      <p className="dashboard-section-intro">简历解析管线的实时状态。</p>
      {tasks.length > 0 ? (
        <ol className="dashboard-task-list">
          {tasks.map((task) => (
            <li className="dashboard-task" key={task.id}>
              <span className="dashboard-task-icon"><TaskIcon status={task.status} /></span>
              <span className="dashboard-task-content">
                <span className="dashboard-task-title">{task.title}</span>
                <span className="dashboard-task-meta"><span className={taskTone(task.status)}>{taskStatusLabel(task.status)}</span><span>{task.updatedAt}</span></span>
                <span className="dashboard-task-stage">{task.stage}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="dashboard-empty dashboard-empty-compact"><Clock3 aria-hidden="true" /><p>暂无后台解析任务</p><span>新任务会在管线启动后显示。</span></div>
      )}
    </section>
  );
}

export function DashboardView({ dashboard, loading, filterRole, onFilterChange, onRefresh }: DashboardViewProps) {
  const rootRef = useRef<HTMLElement>(null);
  const refreshRef = useRef<HTMLButtonElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const applicants = (dashboard?.recentApplications ?? []).filter((application) => filterRole === "all" || application.roleSlug === filterRole);
  const tasks = dashboard?.tasks ?? [];

  useLayoutEffect(() => {
    if (!rootRef.current || loading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo("[data-dashboard-reveal]", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: "power2.out" });
    }, rootRef);
    return () => context.revert();
  }, [loading, dashboard]);

  const refresh = () => {
    if (refreshRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(refreshRef.current.querySelector("svg"), { rotate: 360, duration: 0.65, ease: "power2.inOut" });
    }
    void onRefresh();
  };

  const metrics = dashboard ? [
    { label: "待初审简历", value: dashboard.pendingReview, hint: "等待安排评审", icon: FileSearch, tone: "dashboard-metric-warning" },
    { label: "AI 解析处理中", value: dashboard.processing, hint: "OCR 与结构化流程", icon: Sparkles, tone: "dashboard-metric-info" },
    { label: "解析异常", value: dashboard.failed, hint: "需要人工处理", icon: AlertCircle, tone: "dashboard-metric-danger" },
    { label: "本周新增报名", value: dashboard.newThisWeek, hint: "较上周持续增长", icon: TrendingUp, tone: "dashboard-metric-success" },
  ] : [];

  return (
    <main ref={rootRef} id="main-content" className="dashboard-view">
      <header className="dashboard-hero" data-dashboard-reveal>
        <div>
          <p className="dashboard-eyebrow"><span className="dashboard-live-dot" />2026 秋季招新 <span className="dashboard-eyebrow-divider">/</span> 工作台概览</p>
          <h1 className="dashboard-title">招新概览与<br className="dashboard-title-break" />流转监控</h1>
          <p className="dashboard-lede">今天的评审工作，从这里开始。优先处理待初审申请，保持解析管线顺畅。</p>
        </div>
        <button ref={refreshRef} type="button" className="dashboard-refresh" onClick={refresh} disabled={loading} aria-busy={loading}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />{loading ? "正在刷新" : "刷新数据"}
        </button>
      </header>

      {loading && <DashboardSkeleton />}
      {!loading && dashboard && (
        <>
          <section className="dashboard-summary" aria-labelledby="dashboard-summary-title" data-dashboard-reveal>
            <div className="dashboard-summary-copy"><p className="dashboard-kicker">At a glance</p><h2 id="dashboard-summary-title" className="dashboard-section-title">当前摘要</h2><p>{dashboard.failed > 0 ? `有 ${dashboard.failed} 个解析异常需要优先处理。` : "当前没有需要立即处理的解析异常。"}</p></div>
            <div className="dashboard-summary-note"><span className="dashboard-summary-mark"><Check aria-hidden="true" className="h-4 w-4" /></span><span>数据已同步<br /><strong>刚刚更新</strong></span></div>
          </section>
          <dl className="dashboard-metrics" data-dashboard-reveal>
            {metrics.map((metric) => { const Icon = metric.icon; return <div className={`dashboard-metric ${metric.tone}`} key={metric.label}><dt><Icon aria-hidden="true" className="h-4 w-4" />{metric.label}</dt><dd>{metric.value}</dd><span>{metric.hint}</span></div>; })}
          </dl>
          <div className="dashboard-content-grid" data-dashboard-reveal>
            <section className="dashboard-panel dashboard-applications-panel" aria-labelledby="dashboard-applications-title">
              <div className="dashboard-panel-heading"><div><p className="dashboard-kicker">Inbox / 01</p><h2 id="dashboard-applications-title" className="dashboard-section-title">待处理申请</h2></div><span className="dashboard-count">{applicants.length.toString().padStart(2, "0")} <small>条</small></span></div>
              <p className="dashboard-section-intro">按提交时间排列，优先完成初审与状态流转。</p>
              <div className="dashboard-filter-bar" role="group" aria-label="按岗位筛选申请">{filters.map((filter) => <button type="button" key={filter.id} aria-pressed={filterRole === filter.id} className={filterRole === filter.id ? "dashboard-filter dashboard-filter-active" : "dashboard-filter"} onClick={() => onFilterChange(filter.id)}>{filter.label}</button>)}</div>
              {applicants.length > 0 ? <ol className="dashboard-applicant-list">{applicants.map((application) => <ApplicantRow key={application.id} application={application} expanded={expandedId === application.id} onToggle={() => setExpandedId(expandedId === application.id ? null : application.id)} />)}</ol> : <div className="dashboard-empty"><UserRound aria-hidden="true" /><p>当前筛选下暂无申请</p><span>切换岗位筛选，查看其他候选人的进展。</span></div>}
            </section>
            <TaskQueue tasks={tasks} />
          </div>
        </>
      )}
      {!loading && !dashboard && <div className="dashboard-empty dashboard-empty-error" role="status"><AlertCircle aria-hidden="true" /><p>暂时无法载入工作台</p><span>请稍后重试，或点击右上角刷新数据。</span></div>}
    </main>
  );
}
