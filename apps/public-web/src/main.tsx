import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link } from "react-router-dom";
import { Button, SectionLabel } from "@codepaint/ui";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Bot,
  GraduationCap,
  Trophy,
  Briefcase,
  BookOpen,
  Flame,
  Search,
  Terminal,
  Cpu,
  Workflow,
  Zap,
} from "lucide-react";
import { ApplyModal } from "./ApplyModal";
import "./index.css";

function Header({ onOpenApply }: { onOpenApply: (role?: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src="/cp.webp"
            alt="CodePaint Studio"
            className="h-8 w-8 rounded-lg object-cover shadow-xs transition-transform group-hover:scale-105 border border-slate-200/60"
          />
          <div>
            <span className="text-sm font-bold tracking-[0.14em] text-slate-900">
              CODEPAINT <span className="font-medium text-sky-600">/ 码绘</span>
            </span>
            <span className="hidden text-[10px] text-slate-400 sm:inline sm:ml-2 font-mono">
              STUDIO
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-medium text-slate-600 md:flex">
          <a href="#stats" className="transition hover:text-slate-900">成果战报</a>
          <a href="#roles" className="transition hover:text-slate-900">招新双赛道</a>
          <a href="#growth" className="transition hover:text-slate-900">培养体系</a>
          <a href="#projects" className="transition hover:text-slate-900">实战交付</a>
          <a href="#mentors" className="transition hover:text-slate-900">导师阵容</a>
          <a href="#faq" className="transition hover:text-slate-900">常见疑问</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/my-applications" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
            <Search className="h-3.5 w-3.5" />
            进度查询
          </Link>
          <Button
            onClick={() => onOpenApply()}
            className="h-9 px-4 text-xs font-semibold shadow-xs hover:shadow-sm"
          >
            立即报名 <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function StatsBanner() {
  const stats = [
    {
      icon: GraduationCap,
      label: "暑期全员实习",
      value: "100%",
      sub: "26届成员100%落实实习",
      detail: "7人斩获腾讯、七牛云等一线大厂与独角兽企业",
      tag: "大厂Offer直通",
    },
    {
      icon: Trophy,
      label: "权威竞赛斩获",
      value: "21+",
      sub: "国家级4项 · 省级17项",
      detail: "蓝桥杯、高校数字艺术设计大赛(NCDA)高阶战绩",
      tag: "评奖评优加分",
    },
    {
      icon: Briefcase,
      label: "真实交付项目",
      value: "10+",
      sub: "拒绝玩具 Demo 实战",
      detail: "政务系统、企业平台、数媒交互与全栈系统上线",
      tag: "企业级代码流",
    },
    {
      icon: BookOpen,
      label: "知识库与技术分享",
      value: "100+",
      sub: "干货文档 · 60+场分享",
      detail: "开发专栏、AIGC应用、求职面经与定期实战复盘",
      tag: "老带新传承",
    },
  ];

  return (
    <section id="stats" className="border-y border-slate-200/80 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`flex flex-col justify-between rounded-xl bg-slate-50/40 p-5 lg:bg-transparent lg:p-0 ${
                  i > 0 ? "lg:pl-6" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      {stat.tag}
                    </span>
                  </div>

                  <div className="mt-4 font-mono text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-800">
                    {stat.label} · {stat.sub}
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Roles({ onOpenApply }: { onOpenApply: (role?: string) => void }) {
  const [activeTab, setActiveTab] = useState<"dev" | "aigc">("dev");

  const roleDetails = {
    dev: {
      id: "dev",
      name: "开发方向 (前端 / 全栈)",
      tagline: "现代 Web 全栈 · 架构工程 · 工业级代码规范 · 追求极致交互质感",
      mentor: "黄媛媛（副教授/高级工程师/原中兴研发）、王风硕（双师型工程师/7年华为系统架构师）",
      icon: Code2,
      highlights: [
        {
          title: "现代全栈技术栈体系",
          desc: "深入 React 19、Vue 3、TypeScript、Next.js、Node.js 服务端研发与跨端应用架构。",
          badge: "核心栈",
        },
        {
          title: "老带新答疑与 Code Review",
          desc: "大厂实习学长一对一 Review 代码，告别独自摸索与低效卡壳，快速建立工程化思维。",
          badge: "体系培养",
        },
        {
          title: "企业商业项目直接实战",
          desc: "真实交付政务监控系统、企业级管理后台、高可用应用，简历拥有拿得出手的真实背书。",
          badge: "真实项目",
        },
      ],
      idealFor: "对写代码有极高热情、渴望搞懂底层原理与工程架构，想在大二大三斩获大厂实习 Offer 的同学（零基础设有专属新人航线）。",
      tags: ["React / Vue", "TypeScript", "Next.js", "Node.js", "老带新", "商业项目实战"],
    },
    aigc: {
      id: "aigc",
      name: "AIGC 创新方向 (Agent / 多模态)",
      tagline: "AI Agent 构建 · 大模型应用落地 · 多模态交互 · 探索智能时代软件新形态",
      mentor: "黄媛媛（数媒系主任/研发架构）、郭昱君（竞赛负责教师/莫纳什硕士/在读博士）",
      icon: Bot,
      highlights: [
        {
          title: "AI Agent & 工作流落地",
          desc: "掌握 LLM 结构化提取、RAG 知识检索、Prompt 工程、Function Calling 与智能体编排。",
          badge: "前沿前瞻",
        },
        {
          title: "多模态与智能交互体验",
          desc: "结合视觉版面识别、OCR、文生图/音视频等技术，打造新一代智能人机协同系统。",
          badge: "创新探索",
        },
        {
          title: "高阶学科竞赛与孵化",
          desc: "聚焦国家级/省部级创新创业与 AI 专项赛事，带队打造高获奖率的 AIGC 原创作品。",
          badge: "竞赛冲奖",
        },
      ],
      idealFor: "对大模型、生成式 AI、智能体充满好奇心，热衷于用 AI 工具和 API 解决实际问题、探索未来软件交互的同学。",
      tags: ["AI Agent", "LLM 应用开发", "RAG 检索增强", "多模态交互", "学科竞赛", "创新孵化"],
    },
  };

  const current = roleDetails[activeTab];

  return (
    <section id="roles" className="border-t border-slate-200/80 bg-slate-50/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Core Tracks</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              2026 秋季招募双赛道
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-500 md:mt-0">
            不限年级与专业 · 导师+学长双轨制培养 · 零基础友好
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
          {[
            { id: "dev", label: "开发方向 (前端/全栈)", icon: Code2 },
            { id: "aigc", label: "AIGC 创新方向", icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  active
                    ? "border-sky-600 bg-white text-sky-700 shadow-sm"
                    : "border-slate-200/80 bg-white/50 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role Content Card */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                <current.icon className="h-3.5 w-3.5" />
                {current.name}
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {current.tagline}
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">指导导师团队：</span> {current.mentor}
              </p>
            </div>

            <Button
              onClick={() => onOpenApply(current.id)}
              className="h-10 px-5 text-xs font-semibold shadow-xs shrink-0 self-start lg:self-center"
            >
              投递 {current.name} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {current.highlights.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-600">0{idx + 1}</span>
                  <span className="rounded bg-sky-100/70 px-1.5 py-0.5 text-[9px] font-semibold text-sky-800">
                    {item.badge}
                  </span>
                </div>
                <h4 className="mt-2.5 text-sm font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50/40 p-4 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-600 shrink-0" />
              <span><strong className="text-sky-950">招募期望：</strong>{current.idealFor}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white border border-sky-200/80 px-2 py-0.5 text-[10px] font-medium text-sky-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GrowthPath() {
  const steps = [
    { phase: "萌新期", title: "01 技术培养", desc: "专属学习路线 + 定期系统培训 + 学习进度一对一答疑跟踪，打牢开发底座。" },
    { phase: "初级期", title: "02 竞赛磨砺", desc: "蓝桥杯/全国高校数艺大赛等权威赛事带队冲奖，积累高质量背书与评奖加分。" },
    { phase: "成长期", title: "03 真实项目", desc: "进入企业商业项目与AIGC应用孵化，参与真实业务模块开发，接触工业级工作流。" },
    { phase: "中级期", title: "04 独当一面", desc: "独立负责核心模块系统设计 + 带领低年级新成员，全方位锻炼技术领导力。" },
    { phase: "就业期", title: "05 就业辅导", desc: "顶级大厂简历定制精修 + 1v1 模拟面试辅导 + 校友/导师内推直通一线企业。" },
    { phase: "回馈期", title: "06 回馈团队", desc: "返校经验分享 + 担任模拟面试官 + 持续沉淀并传承工作室技术知识库。" },
  ];

  return (
    <section id="growth" className="border-t border-slate-200/80 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <SectionLabel>Growth & Career</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            面向就业与成长的全流程培养体系
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            从大一零基础萌新到大四手握顶级 Offer，工作室构建了“学以致用、阶梯递进、老带新传承”的完整成长闭环。
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xs hover:border-sky-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-sky-100/80 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
                    {step.phase}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-sky-600 transition">
                    STEP 0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "政务与重大信息监察平台",
      desc: "涵盖多角色权限治理、高并发数据看板与实时告警系统的企业级政务交付案例。",
      tags: ["React", "TypeScript", "可视化", "RBAC"],
      icon: Terminal,
    },
    {
      title: "智能简历解析与招新流转平台",
      desc: "CodePaint 自研招募系统，集成 LLM 提取、OCR 与自动化评审工作流。",
      tags: ["AIGC Agent", "Next.js", "Go API", "Tailwind"],
      icon: Workflow,
    },
    {
      title: "数媒交互艺术与AI智能体作品集",
      desc: "结合生成式 AI、人机交互与 WebGL 动效，斩获省部级及国家级多项殊荣。",
      tags: ["Prompt Flow", "Three.js", "NCDA国家奖", "Agent"],
      icon: Cpu,
    },
  ];

  return (
    <section id="projects" className="border-t border-slate-200/80 bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Real Deliveries</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              拒绝纸上谈兵 · 接触真实商业与AIGC实战
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            累计交付商业项目 10 余个 · 打造简历硬核项目背书
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-slate-300"
              >
                <div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{p.desc}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-50 border border-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Mentors() {
  const mentors = [
    {
      name: "黄媛媛",
      title: "副教授 · 高级工程师",
      desc: "电子科技大学硕士，现任数字媒体技术系主任。曾就职于中兴通讯，参与 2G-5G 网管平台研发，深厚的大前端与前后端架构及研发管理经验。",
    },
    {
      name: "郭昱君",
      title: "讲师 · 学院竞赛负责教师",
      desc: "澳大利亚莫纳什大学硕士、马来西亚国立大学博士在读。学院竞赛工作负责教师，带队斩获多项高级别权威竞赛奖项。",
    },
    {
      name: "褚晓川",
      title: "讲师 · 金犊奖评审委员",
      desc: "四川省高校美术协会成员，全国本科毕业论文评审专家。主持省级课题两项，指导数媒艺术类设计大赛经验丰富。",
    },
    {
      name: "王风硕",
      title: "工程师 · 双师型教师",
      desc: "西南交通大学硕士。华为工作 7 年，历任研发工程师、项目经理、系统架构师。主持国家重大政务与通信系统建设。",
    },
    {
      name: "张蕙",
      title: "讲师 · UI/人机界面方向",
      desc: "电子科技大学硕士。企业从事 UI/人机交互设计多年，川大学锦城学院“夫子育人”奖获得者，指导多项国家级获奖作品。",
    },
  ];

  return (
    <section id="mentors" className="border-t border-slate-200/80 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div>
          <SectionLabel>Mentor Team</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            强大的双师型导师阵营
          </h2>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            来自中兴、华为及知名高校的资深工程师与学术导师，全程提供实战与技术指导。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-6 transition hover:bg-white hover:shadow-xs hover:border-slate-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-mono text-sm font-bold text-white">
                  {m.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                  <p className="text-[11px] font-medium text-sky-600">{m.title}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "我是大一零基础，可以报名吗？",
      a: "完全可以！工作室设有完善的「萌新期」阶段培养路线，大二大三学长和导师会定期组织答疑，只要有足够的好奇心和动手热情即可。",
    },
    {
      q: "开发方向与 AIGC 方向有什么区别？可以兼顾吗？",
      a: "开发方向侧重现代 Web 全栈架构、React/Vue 与企业工程化交付；AIGC 方向侧重大模型应用、Agent 编排与多模态交互。两个方向底层技术互通，日常会深度协作。",
    },
    {
      q: "报名后大概多久有反馈？",
      a: "一般在提交后的 3-5 个工作日内完成初选，你可以在网站顶部的「进度查询」随时输入信息追踪审核状态。",
    },
  ];

  return (
    <section id="faq" className="border-t border-slate-200/80 bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            常见疑问与解答
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs"
            >
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                  Q
                </span>
                {faq.q}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCallout({ onOpenApply }: { onOpenApply: (role?: string) => void }) {
  return (
    <section className="border-t border-slate-200/80 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-300">
          <Sparkles className="h-3.5 w-3.5" />
          加入码绘 · 码上就绘
        </span>
        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
          在这里，和认真做事的伙伴一起，<br />
          把想法做成真正能运行的作品。
        </h2>
        <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          开发方向 (前端/全栈) · AIGC 创新方向 · 商业项目 · 竞赛冲奖 · 顶级就业辅导
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => onOpenApply()}
            className="h-11 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 shadow-md"
          >
            立即提交报名申请 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState("dev");

  const openApply = (role?: string) => {
    if (role) setDefaultRole(role);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header onOpenApply={openApply} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/50 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                  2026 秋季招新正式启动 · 面向全校技术与设计爱好者
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.12]">
                  致力于大前端、全栈与 AIGC 的<br />
                  <span className="text-sky-600">软创实践型工作室</span>
                </h1>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  CodePaint（码绘）工作室围绕「提升能力、高质量就业」为愿景。聚焦<strong>开发（前端/全栈）</strong>与<strong>AIGC（大模型/Agent应用）</strong>两大核心赛道，提供成体系学习路线、企业级实战与大厂 1v1 就业内推辅导。
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={() => openApply()}
                    className="h-11 px-6 text-xs sm:text-sm font-semibold shadow-sm"
                  >
                    开始在线报名 <ArrowRight className="h-4 w-4" />
                  </Button>
                  <a href="#roles">
                    <Button variant="outline" className="h-11 px-5 text-xs sm:text-sm font-medium">
                      查看招新方向
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-slate-400">
                      <img src="/cp.webp" alt="cp" className="h-3.5 w-3.5 rounded-xs" />
                      CodePaint_Manifesto.ts
                    </div>
                  </div>

                  <div className="space-y-4 pt-5 text-xs">
                    <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100/80">
                      <p className="font-mono text-slate-400">// 初衷与愿景</p>
                      <p className="mt-1 font-medium text-slate-900 leading-relaxed">
                        “学生提升能力与高质量就业，教师产学研合作与专业发展。”
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                        <span className="text-[10px] text-slate-400">TRACKS</span>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">开发 · AIGC 智能体</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                        <span className="text-[10px] text-slate-400">CULTURE</span>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">学以致用 · 老带新</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-[11px] text-emerald-800 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>26届全员暑期实习落实 · 7人斩获腾讯/七牛云大厂 Offer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatsBanner />
        <Roles onOpenApply={openApply} />
        <GrowthPath />
        <Projects />
        <Mentors />
        <FAQ />
        <BottomCallout onOpenApply={openApply} />
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/cp.webp" alt="Logo" className="h-4 w-4 rounded-xs" />
            <p>© 2026 CodePaint Studio (码绘工作室). All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#stats" className="hover:text-slate-900 transition">战报</a>
            <a href="#roles" className="hover:text-slate-900 transition">方向</a>
            <a href="#growth" className="hover:text-slate-900 transition">培养</a>
            <a href="#projects" className="hover:text-slate-900 transition">实战</a>
            <a href="#mentors" className="hover:text-slate-900 transition">导师</a>
          </div>
        </div>
      </footer>

      <ApplyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultRole={defaultRole}
      />
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
