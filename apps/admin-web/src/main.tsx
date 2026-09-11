import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button, StatusMark } from "./lib/ui";
import { applicationStatusLabel, taskStatusLabel } from "./lib/utils";
import type { Application, TaskRecord, TaskStatus } from "./lib/types";
import { useAdminStore } from "./store/adminStore";
import "./index.css";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "概览看板", href: "/workspace/dashboard", icon: LayoutDashboard, active: true },
  { label: "报名收件箱", href: "/workspace/inbox", icon: Inbox },
  { label: "候选人列表", href: "/workspace/applicants", icon: Users },
  { label: "招募岗位管理", href: "/workspace/roles", icon: Briefcase },
  { label: "简历解析模板", href: "/workspace/templates", icon: FileText },
  { label: "后台异步队列", href: "/workspace/tasks", icon: Clock3 },
];

function ProductBrand() {
  return (
    <Link
      to="/workspace/dashboard"
      className="flex min-h-10 items-center gap-2.5 rounded-lg"
      aria-label="CodePaint 招新管理工作台"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-mono text-xs font-bold text-white">
        CP
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold tracking-wide text-ink">CODEPAINT</span>
        <span className="block text-[11px] font-medium text-muted">招新管理工作台</span>
      </span>
    </Link>
  );
}

function NavigationLinks({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? "flex min-w-max items-center gap-1" : "space-y-1"}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              to={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`group relative flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                compact ? "shrink-0" : "w-full"
              } ${
                item.active
                  ? "bg-accent-soft text-accent-strong"
                  : "text-muted hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {item.active && !compact && (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" aria-hidden="true" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 ${item.active ? "text-accent" : "text-subtle group-hover:text-muted"}`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-line bg-surface px-4 py-5 lg:flex">
      <div>
        <div className="px-2">
          <ProductBrand />
        </div>
        <nav aria-label="工作区导航" className="mt-9">
          <NavigationLinks />
        </nav>
      </div>

      <div className="border-t border-line pt-4">
        <Link
          to="/workspace/settings"
          className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <Settings className="h-4 w-4 text-subtle" aria-hidden="true" />
          <span>系统设置与权限</span>
        </Link>
      </div>
    </aside>
  );
}

function MobileNavigation() {
  return (
    <nav
      aria-label="移动端工作区导航"
      className="sticky top-16 z-10 border-b border-line bg-surface/95 px-3 py-2 backdrop-blur lg:hidden"
    >
      <div className="overflow-x-auto">
        <NavigationLinks compact />
      </div>
    </nav>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mt-8" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted">正在同步工作台数据…</p>
      <div className="mt-5 border-y border-line py-5">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-8 w-14 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <div className="space-y-5">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border-b border-line pb-5">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full max-w-xl animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="space-y-5 xl:border-l xl:border-line xl:pl-8">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border-b border-line pb-5">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function applicationTone(status: Application["status"]) {
  if (status === "contacted") return "green" as const;
  if (status === "processing") return "blue" as const;
  if (status === "closed") return "neutral" as const;
  return "amber" as const;
}

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />;
  }
  if (status === "failed") {
    return <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />;
  }
  if (status === "processing") {
    return <LoaderCircle className="h-4 w-4 animate-spin text-cyan-700 motion-reduce:animate-none" aria-hidden="true" />;
  }
  return <Clock3 className="h-4 w-4 text-amber-600" aria-hidden="true" />;
}

function taskTone(status: TaskStatus) {
  if (status === "completed") return "green" as const;
  if (status === "failed") return "red" as const;
  if (status === "processing") return "blue" as const;
  return "amber" as const;
}

function ApplicantQueue({
  applicants,
  filterRole,
  onFilterChange,
}: {
  applicants: Application[];
  filterRole: string;
  onFilterChange: (role: string) => void;
}) {
  const filters = [
    { id: "all", label: "全部" },
    { id: "frontend", label: "前端" },
    { id: "ui-ux", label: "UI / UX" },
    { id: "office", label: "办公室" },
  ];

  return (
    <section aria-labelledby="applications-title" className="min-w-0">
      <header className="border-b border-line pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="applications-title" className="text-base font-semibold text-ink">
              待处理申请
            </h2>
            <p className="mt-1 text-sm text-muted">按提交时间排列，优先完成初审与状态流转。</p>
          </div>
          <span className="shrink-0 pt-0.5 text-sm font-medium text-muted">{applicants.length} 条</span>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">按岗位筛选申请</legend>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => {
              const selected = filterRole === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onFilterChange(filter.id)}
                  className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition-colors ${
                    selected
                      ? "border-cyan-200 bg-accent-soft text-accent-strong"
                      : "border-line bg-surface text-muted hover:border-slate-300 hover:text-ink"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </header>

      {applicants.length > 0 ? (
        <ul className="divide-y divide-line">
          {applicants.map((applicant) => (
            <li key={applicant.id} className="py-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_10rem] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-sm font-semibold text-ink">{applicant.applicantName}</h3>
                    <StatusMark tone={applicationTone(applicant.status)}>
                      {applicationStatusLabel(applicant.status)}
                    </StatusMark>
                    <span className="text-xs text-muted">{applicant.role}</span>
                    <span className="text-xs text-subtle">{applicant.submittedAt}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {applicant.summary || "暂无自动提取的摘要说明"}
                  </p>
                  {applicant.skills && applicant.skills.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1" aria-label="候选人技能">
                      {applicant.skills.slice(0, 3).map((skill) => (
                        <li key={skill} className="text-xs font-medium text-cyan-800">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-baseline gap-2 lg:flex-col lg:items-end lg:gap-0">
                  <span className="text-xs font-medium text-muted">匹配评分</span>
                  <span className="font-mono text-xl font-semibold tracking-tight text-ink">
                    {typeof applicant.score === "number" ? applicant.score : "待评"}
                  </span>
                  {typeof applicant.score === "number" && <span className="text-xs text-subtle">分</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-b border-line py-12 text-center">
          <p className="text-sm font-medium text-ink">当前筛选条件下暂无报名数据</p>
          <p className="mt-1 text-sm text-muted">切换岗位筛选可查看其他待处理申请。</p>
          {filterRole !== "all" && (
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className="mt-4 min-h-10 rounded-lg border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-slate-50"
            >
              显示全部申请
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function TaskQueue({ tasks }: { tasks: TaskRecord[] }) {
  return (
    <section
      aria-labelledby="tasks-title"
      className="min-w-0 xl:border-l xl:border-line xl:pl-8"
    >
      <header className="border-b border-line pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="tasks-title" className="text-base font-semibold text-ink">
              后台解析任务
            </h2>
            <p className="mt-1 text-sm text-muted">跟进 OCR 与结构化提取状态，异常优先处理。</p>
          </div>
          <span className="shrink-0 pt-0.5 text-sm font-medium text-muted">{tasks.length} 个</span>
        </div>
      </header>

      {tasks.length > 0 ? (
        <ol className="divide-y divide-line">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`py-4 ${
                task.status === "failed"
                  ? "-mx-2 border-l-2 border-rose-400 bg-rose-50/60 px-3"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <TaskStatusIcon status={task.status} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 break-words text-sm font-medium leading-6 text-ink">{task.title}</p>
                    <StatusMark tone={taskTone(task.status)}>{taskStatusLabel(task.status)}</StatusMark>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="font-medium text-subtle">阶段</dt>
                      <dd className="mt-1 leading-5 text-slate-600">{task.stage}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-subtle">更新时间</dt>
                      <dd className="mt-1 font-mono leading-5 text-slate-600">{task.updatedAt}</dd>
                    </div>
                  </dl>
                  {task.status === "failed" && (
                    <p className="mt-3 text-xs font-medium text-rose-700">此任务需要人工处理。</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="border-b border-line py-12 text-center">
          <p className="text-sm font-medium text-ink">暂无后台解析任务</p>
          <p className="mt-1 text-sm text-muted">新提交的简历会在解析管线启动后显示在这里。</p>
        </div>
      )}
    </section>
  );
}

function DashboardContent() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const loading = useAdminStore((state) => state.loading);
  const filterRole = useAdminStore((state) => state.filterRole);
  const load = useAdminStore((state) => state.load);
  const setFilterRole = useAdminStore((state) => state.setFilterRole);

  useEffect(() => {
    void load();
  }, [load]);

  const applicants: Application[] = (dashboard?.recentApplications ?? []).filter((application) => {
    if (filterRole === "all") return true;
    return application.roleSlug === filterRole;
  });
  const tasks: TaskRecord[] = dashboard?.tasks ?? [];

  const metrics = dashboard
    ? [
        {
          label: "待初审简历",
          value: dashboard.pendingReview,
          hint: "等待安排评审",
          icon: AlertCircle,
          iconClass: "text-amber-700",
        },
        {
          label: "AI 解析处理中",
          value: dashboard.processing,
          hint: "OCR 与结构化流程",
          icon: Clock3,
          iconClass: "text-cyan-700",
        },
        {
          label: "解析异常",
          value: dashboard.failed,
          hint: "需要人工处理",
          icon: AlertCircle,
          iconClass: "text-rose-700",
        },
        {
          label: "本周新增报名",
          value: dashboard.newThisWeek,
          hint: "本周进入工作台",
          icon: TrendingUp,
          iconClass: "text-emerald-700",
        },
      ]
    : [];

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-cyan-800">2026 秋季招新</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            招新概览与流转监控
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            优先处理待初审申请，及时跟进简历解析异常与候选人状态。
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void load()}
          disabled={loading}
          aria-busy={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden="true" />
          {loading ? "正在刷新" : "刷新数据"}
        </Button>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && dashboard && (
        <>
          <section aria-labelledby="summary-title" className="mt-8 border-y border-line py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="summary-title" className="text-base font-semibold text-ink">
                  当前摘要
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {dashboard.failed > 0
                    ? `有 ${dashboard.failed} 个解析异常需要优先处理。`
                    : "当前没有需要立即处理的解析异常。"}
                </p>
              </div>
              <Link
                to="/workspace/tasks"
                className="w-fit rounded-md text-sm font-medium text-cyan-800 underline decoration-cyan-300 underline-offset-4 transition-colors hover:text-cyan-950"
              >
                查看异步任务
              </Link>
            </div>

            <dl className="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-4 sm:gap-x-0">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="min-w-0 border-t border-line py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0"
                  >
                    <dt className="flex items-center gap-2 text-sm font-medium text-muted">
                      <Icon className={`h-4 w-4 shrink-0 ${metric.iconClass}`} aria-hidden="true" />
                      <span>{metric.label}</span>
                    </dt>
                    <dd className="mt-2 font-mono text-3xl font-semibold tracking-tight text-ink">
                      {metric.value}
                    </dd>
                    <dd className="mt-1 text-xs text-subtle">{metric.hint}</dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
            <ApplicantQueue
              applicants={applicants}
              filterRole={filterRole}
              onFilterChange={setFilterRole}
            />
            <TaskQueue tasks={tasks} />
          </div>
        </>
      )}
    </main>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-workspace text-ink selection:bg-cyan-100 selection:text-cyan-950">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        跳至主要内容
      </a>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="lg:hidden">
                <ProductBrand />
              </div>
              <nav aria-label="面包屑" className="hidden items-center gap-2 text-sm lg:flex">
                <Link
                  to="/workspace/dashboard"
                  className="font-medium text-muted transition-colors hover:text-ink"
                >
                  招募管理
                </Link>
                <span className="text-slate-300" aria-hidden="true">/</span>
                <span className="font-medium text-ink" aria-current="page">2026 秋季招新</span>
              </nav>

              <div className="flex shrink-0 items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  招
                </span>
                <span className="hidden text-sm font-medium text-ink sm:block">招新评审员</span>
                <span className="hidden items-center gap-1.5 text-xs font-medium text-emerald-700 md:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  在线
                </span>
              </div>
            </div>
          </header>

          <MobileNavigation />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
