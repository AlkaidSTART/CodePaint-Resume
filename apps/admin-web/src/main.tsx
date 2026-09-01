import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link } from "react-router-dom";
import { api, ApiError } from "@codepaint/api-client";
import { Button, StatusMark } from "@codepaint/ui";
import { taskStatusLabel } from "@codepaint/utils";
import type { Application, DashboardSummary, TaskRecord } from "@codepaint/types";
import "./index.css";

function Sidebar() {
  const navItems = [
    { label: "概览看板", href: "/workspace/dashboard", shortcut: "⌘1" },
    { label: "报名收件箱", href: "/workspace/inbox" },
    { label: "候选人列表", href: "/workspace/applicants" },
    { label: "招募岗位", href: "/workspace/roles" },
    { label: "简历解析模版", href: "/workspace/templates" },
    { label: "后台异步任务", href: "/workspace/tasks" },
  ];

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-5 lg:flex">
      <div>
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-white shadow-xs">
            CP
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-slate-900">
              CODEPAINT
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              RECRUIT ADMIN
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            工作空间
          </div>
          {navItems.map((item, index) => {
            const isActive = index === 0; // default active for dashboard
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50/80 text-sky-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="font-mono text-[10px] text-sky-600/70">
                    {item.shortcut}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          设置与组织
        </div>
        <Link
          to="/workspace/settings"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <span>系统设置与成员</span>
        </Link>
      </div>
    </aside>
  );
}

function App() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    api.getDashboard()
      .then(setDashboard)
      .catch((reason: unknown) => {
        setError(
          reason instanceof ApiError && reason.status === 403
            ? "请使用招新成员账号登录后查看工作台。"
            : "工作台暂时无法加载"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const applicants: Application[] = dashboard?.recentApplications ?? [];
  const tasks: TaskRecord[] = dashboard?.tasks ?? [];

  return (
    <div className="flex min-h-screen bg-[#fafbfc] text-slate-900">
      <Sidebar />

      <main className="min-w-0 flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">招募管理 / 2026 秋季招新</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-2 pr-3 text-xs font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                招
              </span>
              <span>招新评审员</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                招新工作台概览
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                实时掌握候选人报名流转、异步解析进度与评审状态。
              </p>
            </div>
            <Button variant="outline" className="h-8 px-3 text-xs" onClick={load}>
              刷新数据
            </Button>
          </div>

          {loading && (
            <div className="mt-8 flex items-center justify-center rounded-xl border border-slate-200/80 bg-white p-12">
              <p className="text-xs text-slate-400">正在获取工作台状态...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center justify-between rounded-lg border border-red-200/80 bg-red-50/50 p-4 text-xs text-red-700">
              <span>{error}</span>
              <Button variant="outline" className="h-7 px-2.5 text-xs" onClick={load}>
                重试
              </Button>
            </div>
          )}

          {!loading && !error && dashboard && (
            <>
              {/* Metrics Row */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "待初审简历", value: dashboard.pendingReview, hint: "需尽快分配评阅" },
                  { label: "AI 正在解析", value: dashboard.processing, hint: "后台队列运行中" },
                  { label: "解析异常/失败", value: dashboard.failed, hint: "需人工介入排查" },
                  { label: "本周新增报名", value: dashboard.newThisWeek, hint: "较上周稳定增长" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
                  >
                    <span className="text-xs font-medium text-slate-500">{m.label}</span>
                    <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {m.value}
                    </div>
                    <span className="mt-1 block text-[11px] text-slate-400">{m.hint}</span>
                  </div>
                ))}
              </div>

              {/* Main Split Sections */}
              <div className="mt-8 grid gap-8 lg:grid-cols-12">
                {/* Applicants List */}
                <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">最新提交的报名</h2>
                      <p className="text-xs text-slate-500">最近提交且待处理的候选人</p>
                    </div>
                    <Link
                      to="/workspace/applicants"
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 transition"
                    >
                      查看全部 →
                    </Link>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {applicants.map((applicant) => (
                      <Link
                        to={`/workspace/applicants/${applicant.id}`}
                        key={applicant.id}
                        className="group flex flex-col gap-2 py-4 transition hover:bg-slate-50/70 px-2 rounded-lg sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 text-xs group-hover:text-sky-600 transition">
                              {applicant.applicantName}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {applicant.role}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {applicant.summary || "暂无自动提取的摘要说明"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 sm:shrink-0">
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills?.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="rounded bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 text-[10px] text-slate-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <span className="font-mono text-xs font-bold text-sky-700">
                            {applicant.score ? `${applicant.score}分` : "待评"}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {applicants.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-400">
                        暂无新提交的报名数据。
                      </div>
                    )}
                  </div>
                </section>

                {/* Background Task Queue */}
                <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">后台异步解析任务</h2>
                      <p className="text-xs text-slate-500">OCR / LLM 提取管线状态</p>
                    </div>
                    <Link
                      to="/workspace/tasks"
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 transition"
                    >
                      任务队列 →
                    </Link>
                  </div>

                  <div className="mt-3 space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-800 line-clamp-1">{task.title}</p>
                          <StatusMark
                            tone={
                              task.status === "failed"
                                ? "red"
                                : task.status === "completed"
                                ? "green"
                                : "blue"
                            }
                          >
                            {taskStatusLabel(task.status)}
                          </StatusMark>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{task.stage}</span>
                          <span>{task.updatedAt}</span>
                        </div>
                        {task.status === "failed" && (
                          <Button
                            variant="outline"
                            className="mt-3 h-7 w-full text-xs font-medium text-rose-700 hover:bg-rose-50 border-rose-200"
                          >
                            重新触发任务
                          </Button>
                        )}
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-400">
                        当前无后台处理任务。
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
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
