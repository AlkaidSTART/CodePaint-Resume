import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link } from "react-router-dom";
import { api } from "@codepaint/api-client";
import { Button, StatusMark } from "@codepaint/ui";
import { taskStatusLabel } from "@codepaint/utils";
import type { Application, DashboardSummary, TaskRecord } from "@codepaint/types";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Briefcase,
  FileText,
  Clock,
  Settings,
  RefreshCw,
  AlertCircle,
  Clock3,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import "./index.css";

function Sidebar() {
  const navItems = [
    { label: "概览看板", href: "/workspace/dashboard", icon: LayoutDashboard, shortcut: "⌘1", active: true },
    { label: "报名收件箱", href: "/workspace/inbox", icon: Inbox, count: 12 },
    { label: "候选人列表", href: "/workspace/applicants", icon: Users },
    { label: "招募岗位管理", href: "/workspace/roles", icon: Briefcase },
    { label: "简历解析模版", href: "/workspace/templates", icon: FileText },
    { label: "后台异步队列", href: "/workspace/tasks", icon: Clock },
  ];

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-5 lg:flex">
      <div>
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white shadow-xs">
            CP
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-slate-900">
              CODEPAINT
            </div>
            <div className="text-[10px] font-medium text-slate-400 font-mono">
              RECRUIT ADMIN
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            工作空间 WORKSPACE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  item.active
                    ? "bg-sky-50/80 text-sky-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${item.active ? "text-sky-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="font-mono text-[10px] text-sky-600/70">
                    {item.shortcut}
                  </span>
                )}
                {item.count && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          系统与设置
        </div>
        <Link
          to="/workspace/settings"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span>系统设置与成员权限</span>
        </Link>
      </div>
    </aside>
  );
}

function App() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<string>("all");

  const mockDashboard: DashboardSummary = {
    pendingReview: 14,
    processing: 3,
    failed: 1,
    newThisWeek: 28,
    recentApplications: [
      {
        id: "app-1",
        applicantName: "李思睿",
        role: "大前端项目组",
        roleSlug: "frontend",
        status: "submitted",
        submittedAt: "10分钟前",
        summary: "熟练掌握 React 18, TypeScript, Tailwind，有个人开源博客与组件库沉淀。",
        skills: ["React", "TypeScript", "Next.js"],
        score: 92,
      },
      {
        id: "app-2",
        applicantName: "张嘉琳",
        role: "UI / UX 设计项目组",
        roleSlug: "ui-ux",
        status: "processing",
        submittedAt: "35分钟前",
        summary: "精通 Figma 设计系统，曾获全国高校数艺大赛省级二等奖，产出完整交互原型作品集。",
        skills: ["Figma", "Design System", "交互设计"],
        score: 88,
      },
      {
        id: "app-3",
        applicantName: "赵云天",
        role: "办公室运营与策划组",
        roleSlug: "office",
        status: "submitted",
        submittedAt: "1小时前",
        summary: "有大型学生技术沙龙与迎新活动策划组织经验，熟练掌握飞书多维表格与协同知识库管理。",
        skills: ["活动统筹", "飞书知识库", "组织协同"],
        score: 85,
      },
      {
        id: "app-4",
        applicantName: "王逸飞",
        role: "大前端项目组",
        roleSlug: "frontend",
        status: "contacted",
        submittedAt: "2小时前",
        summary: "深入研究 Vue3 与前端工程化，已完成初筛沟通，学习自驱力强。",
        skills: ["Vue3", "Vite", "Pinia"],
        score: 90,
      },
    ],
    tasks: [
      {
        id: "task-101",
        title: "李思睿_前端开发个人简历.pdf (OCR & LLM 结构化提取)",
        status: "completed",
        stage: "LLM 信息抽取完成",
        updatedAt: "19:24:10",
      },
      {
        id: "task-102",
        title: "张嘉琳_UI交互设计作品集.pdf (多模态视觉版面识别)",
        status: "processing",
        stage: "视觉模块特征编码中 (78%)",
        updatedAt: "19:28:45",
      },
      {
        id: "task-103",
        title: "陈思远_个人简历_v2.docx (格式转化与内容对齐)",
        status: "failed",
        stage: "DOCX 损坏或编码异常",
        updatedAt: "19:15:02",
      },
    ],
  };

  const load = () => {
    setLoading(true);
    api.getDashboard()
      .then(setDashboard)
      .catch(() => {
        setDashboard(mockDashboard);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const applicants: Application[] = (dashboard?.recentApplications ?? []).filter((a) => {
    if (filterRole === "all") return true;
    return a.roleSlug === filterRole;
  });
  const tasks: TaskRecord[] = dashboard?.tasks ?? [];

  return (
    <div className="flex min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Sidebar />

      <main className="min-w-0 flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">招募管理 / 2026 秋季招新实时看板</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-2 pr-3 text-xs font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                招
              </span>
              <span>招新评审员（在线）</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                <Sparkles className="h-3 w-3" />
                2026 招募评审工作台
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                招新概览与流转监控
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                实时掌握候选人报名、简历异步解析管线与导师评审进度。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-8 px-3 text-xs font-medium gap-1.5" onClick={load}>
                <RefreshCw className="h-3.5 w-3.5" />
                刷新数据
              </Button>
            </div>
          </div>

          {loading && (
            <div className="mt-8 flex items-center justify-center rounded-xl border border-slate-200/80 bg-white p-12">
              <p className="text-xs text-slate-400">正在同步工作台数据...</p>
            </div>
          )}

          {!loading && dashboard && (
            <>
              {/* Metrics Row */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    icon: AlertCircle,
                    label: "待初审简历",
                    value: dashboard.pendingReview,
                    hint: "需尽快分配导师评阅",
                    color: "text-amber-600 bg-amber-50",
                  },
                  {
                    icon: Clock3,
                    label: "AI 解析处理中",
                    value: dashboard.processing,
                    hint: "OCR & 结构化队列中",
                    color: "text-sky-600 bg-sky-50",
                  },
                  {
                    icon: AlertCircle,
                    label: "解析异常/失败",
                    value: dashboard.failed,
                    hint: "需人工介入重新排队",
                    color: "text-rose-600 bg-rose-50",
                  },
                  {
                    icon: TrendingUp,
                    label: "本周新增报名",
                    value: dashboard.newThisWeek,
                    hint: "较上周稳定持续增长",
                    color: "text-emerald-600 bg-emerald-50",
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">{m.label}</span>
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                        {m.value}
                      </div>
                      <span className="mt-1 block text-[11px] text-slate-400">{m.hint}</span>
                    </div>
                  );
                })}
              </div>

              {/* Main Split Sections */}
              <div className="mt-8 grid gap-8 lg:grid-cols-12">
                {/* Applicants List */}
                <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
                  <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">最新提交的报名材料</h2>
                      <p className="text-xs text-slate-500">最近提交且待处理的候选人</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1 border border-slate-200/60">
                      {[
                        { id: "all", label: "全部" },
                        { id: "frontend", label: "前端" },
                        { id: "ui-ux", label: "UI" },
                        { id: "office", label: "办公室" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFilterRole(f.id)}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium transition ${
                            filterRole === f.id
                              ? "bg-white text-slate-900 font-semibold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="group flex flex-col gap-2 py-4 transition hover:bg-slate-50/70 px-2 rounded-lg sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs group-hover:text-sky-600 transition">
                              {applicant.applicantName}
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {applicant.role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {applicant.submittedAt}
                            </span>
                          </div>
                          <p className="mt-1.5 truncate text-xs text-slate-500">
                            {applicant.summary || "暂无自动提取的摘要说明"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 sm:shrink-0">
                          <div className="hidden sm:flex flex-wrap gap-1">
                            {applicant.skills?.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="rounded bg-sky-50/60 border border-sky-200/50 px-1.5 py-0.5 text-[10px] text-sky-700 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <span>{applicant.score ? `${applicant.score}分` : "待评"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {applicants.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-400">
                        当前筛选条件下暂无报名数据。
                      </div>
                    )}
                  </div>
                </section>

                {/* Background Task Queue */}
                <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">后台异步解析任务</h2>
                      <p className="text-xs text-slate-500">OCR / LLM 提取管线状态</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">QUEUE LIVE</span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 text-xs transition hover:border-slate-200 hover:bg-slate-50"
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
                            重新触发异步解析
                          </Button>
                        )}
                      </div>
                    ))}
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
