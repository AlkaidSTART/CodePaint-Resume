import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "@codepaint/api-client";
import { Button, SectionLabel } from "@codepaint/ui";
import type { RecruitmentRole } from "@codepaint/types";
import "./index.css";

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-white shadow-xs">
            CP
          </span>
          <span className="text-sm font-bold tracking-[0.14em] text-slate-900">
            CODEPAINT <span className="font-medium text-sky-600">/ STUDIO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#roles" className="transition hover:text-slate-900">招募方向</a>
          <a href="#about" className="transition hover:text-slate-900">关于工作室</a>
          <a href="#process" className="transition hover:text-slate-900">招募流程</a>
          <a href="#status" className="transition hover:text-slate-900">进度查询</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/apply">
            <Button className="h-9 px-4 text-xs font-semibold">
              立即报名 <span aria-hidden="true">↗</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Roles() {
  const [roles, setRoles] = useState<RecruitmentRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = () => {
    setLoading(true);
    setError(null);
    api.getRoles()
      .then(setRoles)
      .catch((reason: unknown) => {
        setError(reason instanceof ApiError ? reason.message : "招新方向暂时无法加载");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <section id="roles" className="border-t border-slate-200/80 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Open Positions</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              我们正在寻找这些伙伴
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500 md:mt-0">
            2026 秋季招新 · 预计录取 8-12 人
          </p>
        </div>

        {loading && (
          <div className="mt-12 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 py-16">
            <p className="text-sm text-slate-400">正在同步招募方向数据...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-center justify-between rounded-lg border border-red-200/80 bg-red-50/50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <Button variant="outline" className="h-8 px-3 text-xs" onClick={loadRoles}>
              重新加载
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((role, index) => (
              <div
                key={role.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-sky-600">
                      0{index + 1}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {role.shortName}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                    {role.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {role.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5">
                  <Link
                    to={`/roles/${role.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition group-hover:text-sky-600"
                  >
                    查看岗位要求与方向
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="col-span-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-16 text-center text-sm text-slate-500">
                当前暂无开放的招募方向。
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/50 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                  2026 秋季招新正式启动 · 研发 / 设计 / 产品
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.1]">
                  一起把想法，<br />
                  <span className="text-sky-600">做成真正能运行的作品</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  CodePaint Studio 是一个注重工程实现与设计质感的实践型组织。寻找愿意动手、深度协作、且渴望把产品体验做到极致的创作者。
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={() => navigate("/apply")}
                    className="h-11 px-6 text-sm font-semibold shadow-sm"
                  >
                    开始在线报名 <span aria-hidden="true">↗</span>
                  </Button>
                  <a href="#about">
                    <Button variant="outline" className="h-11 px-5 text-sm font-medium">
                      了解工作室
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    </div>
                    <span className="font-mono text-xs font-medium text-slate-400">STUDIO_LOG.md</span>
                  </div>
                  <div className="space-y-4 pt-5 text-xs text-slate-600">
                    <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                      <p className="font-mono text-slate-400">// 我们关注的是</p>
                      <p className="mt-1 font-medium text-slate-900">不仅是代码量，更是解决具体问题的审美与完整度。</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <span className="text-[10px] text-slate-400">STACK</span>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">React · Go · TS</p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <span className="text-[10px] text-slate-400">CYCLE</span>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">2026 Autumn</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Roles />

        {/* About Section */}
        <section id="about" className="border-t border-slate-200/80 bg-slate-50/50 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <SectionLabel>About CodePaint</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  从模糊的想法出发，走到被真实使用的产品。
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  我们聚集了一群对软件质感有执念的开发者和设计师。在工作室里，没有空谈的概念，只有不断迭代的原型和扎实的系统设计。
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                {[
                  { title: "真实项目交付", desc: "拒绝玩具项目，所有产出均服务于实际场景或对外开源。" },
                  { title: "工程与设计并重", desc: "重视交互细节与视觉结构，代码优雅与界面审美同等重要。" },
                  { title: "平等协作机制", desc: "讨论基于证据与方案，扁平沟通，快速试错与复盘。" },
                  { title: "体系化成长", desc: "代码审查、架构演进分享与工业级工程流标准实践。" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
                    <span className="font-mono text-xs font-semibold text-sky-600">0{idx + 1}</span>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="border-t border-slate-200/80 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div>
              <SectionLabel>Recruitment Process</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                招募流程
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "在线提交报名", desc: "填写基本资料、方向意向并上传你的简历或作品集链接。" },
                { step: "02", title: "材料初选与评估", desc: "团队成员仔细评估你的作品、代码仓库及过往项目经历。" },
                { step: "03", title: "技术与志趣交流", desc: "面对面或线上沟通，探讨过往经历与技术思考，双向选择。" },
                { step: "04", title: "正式入队启航", desc: "发放录取通知，分配导师并进入实际项目组共同协作。" },
              ].map((item) => (
                <div key={item.step} className="relative rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <span className="font-mono text-xl font-bold text-sky-600">{item.step}</span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Status Query Section */}
        <section id="status" className="border-t border-slate-200/80 bg-slate-50/50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs md:flex-row md:items-center">
              <div>
                <SectionLabel>Application Status</SectionLabel>
                <h3 className="text-xl font-semibold text-slate-900">
                  已经提交过报名？
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  你可以登录状态查询面板，实时了解材料审核与流程推进进度。
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/my-applications">
                  <Button variant="outline" className="h-10 px-5 text-xs font-semibold">
                    查看我的报名记录 →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 CodePaint Studio. Built for craftsmen.</p>
          <div className="flex items-center gap-6">
            <a href="#roles" className="hover:text-slate-900 transition">招新方向</a>
            <a href="#about" className="hover:text-slate-900 transition">关于</a>
            <a href="#process" className="hover:text-slate-900 transition">流程</a>
          </div>
        </div>
      </footer>
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
