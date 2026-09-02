import { TypographyVortexCanvas } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { StrictMode, forwardRef, useEffect, useRef, useState, type Ref } from "react";
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
  Search,
  Terminal,
  Cpu,
  Workflow,
  Zap,
} from "lucide-react";
import { ApplyModal } from "./ApplyModal";
import { FloatingTechBadges } from "./components/FloatingTechBadges";
import { ThreeWaveScene } from "./components/ThreeWaveScene";
import { ThreeTracks } from "./components/ThreeTracks";
import { AlumniDestinations } from "./components/AlumniDestinations";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReveal, useCountUp, prefersReducedMotion } from "./lib/motion";
import "./index.css";

function Header(
  { onOpenApply }: { onOpenApply: (role?: string) => void },
  ref: Ref<HTMLElement>,
) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={ref}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/15 bg-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.05),0_12px_32px_rgba(0,0,0,0.3)]"
          : "border-b border-white/10 bg-transparent backdrop-blur-md shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.04)]"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src="/cp.webp"
              alt="CodePaint Studio"
              className="h-8 w-8 rounded-lg object-cover shadow-xs transition-transform group-hover:scale-105 border border-white/25"
            />
            <span className="text-sm font-bold tracking-[0.12em] text-white">
              CODEPAINT <span className="font-semibold text-sky-400">/ 码绘</span>
            </span>
          </Link>

          {/* Unboxed Slogan Text */}
          <div className="hidden md:flex items-center gap-2 border-l border-white/15 pl-4 text-xs">
            <span className="bg-gradient-to-r from-slate-200 via-sky-200 to-sky-400 bg-clip-text font-medium tracking-wide text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]">
              加入码绘，马上就会
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-xs font-medium text-slate-300 lg:flex">
          <a href="#stats" className="transition hover:text-sky-300">成果战报</a>
          <a href="#alumni" className="transition hover:text-sky-300">学长去向</a>
          <a href="#roles" className="transition hover:text-sky-300">招新双赛道</a>
          <a href="#growth" className="transition hover:text-sky-300">培养体系</a>
          <a href="#projects" className="transition hover:text-sky-300">实战交付</a>
          <a href="#mentors" className="transition hover:text-sky-300">导师阵容</a>
          <a href="#faq" className="transition hover:text-sky-300">常见疑问</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/my-applications" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition">
            <Search className="h-3.5 w-3.5 text-sky-400" />
            进度查询
          </Link>
          <Button
            onClick={() => onOpenApply()}
            className="h-8.5 px-4 text-xs font-semibold shadow-[0_0_18px_rgba(56,189,248,0.35)] bg-sky-400 hover:bg-sky-300 text-slate-950 border-0 transition-all hover:scale-[1.02]"
          >
            立即报名 <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

const HeaderWithRef = forwardRef(Header);

function StatsBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.08, distance: 20 });
  useCountUp(sectionRef);

  const stats = [
    {
      icon: GraduationCap,
      label: "暑期全员实习",
      count: 100,
      suffix: "%",
      sub: "26届成员100%落实实习",
      detail: "7人斩获腾讯、七牛云等一线大厂与独角兽企业",
      tag: "大厂Offer直通",
    },
    {
      icon: Trophy,
      label: "权威竞赛斩获",
      count: 21,
      suffix: "+",
      sub: "国家级4项 · 省级17项",
      detail: "蓝桥杯、高校数字艺术设计大赛(NCDA)高阶战绩",
      tag: "评奖评优加分",
    },
    {
      icon: Briefcase,
      label: "真实交付项目",
      count: 10,
      suffix: "+",
      sub: "拒绝玩具 Demo 实战",
      detail: "政务系统、企业平台、数媒交互与全栈系统上线",
      tag: "企业级代码流",
    },
    {
      icon: BookOpen,
      label: "知识库与技术分享",
      count: 100,
      suffix: "+",
      sub: "干货文档 · 60+场分享",
      detail: "开发专栏、AIGC应用、求职面经与定期实战复盘",
      tag: "老带新传承",
    },
  ];

  return (
    <section ref={sectionRef} id="stats" className="border-y border-white/10 bg-black py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                data-reveal
                className={`flex flex-col justify-between rounded-xl bg-white/[0.03] p-5 lg:bg-transparent lg:p-0 ${
                  i > 0 ? "lg:pl-6" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                      {stat.tag}
                    </span>
                  </div>

                  <div
                    data-count={stat.count}
                    data-suffix={stat.suffix}
                    className="mt-4 font-mono text-3xl font-black tracking-tight text-white sm:text-4xl"
                  >
                    {stat.count}
                    {stat.suffix}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-200">
                    {stat.label} · {stat.sub}
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
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
  const sectionRef = useRef<HTMLElement>(null);
  const hasSwitched = useRef(false);

  useReveal(sectionRef, { stagger: 0.08 });

  // Tab 切换时内容卡轻提示：首次渲染交给 useReveal，避免冲突
  useGSAP(
    () => {
      if (!hasSwitched.current || prefersReducedMotion()) return;
      const card = sectionRef.current?.querySelector<HTMLElement>("[data-roles-card]");
      if (!card) return;
      gsap.fromTo(card, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
    },
    { dependencies: [activeTab], scope: sectionRef },
  );

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
    <section ref={sectionRef} id="roles" className="border-t border-white/10 bg-[#070708] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div data-reveal>
            <SectionLabel>Core Tracks</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              2026 秋季招募双赛道
            </h2>
          </div>
          <p data-reveal className="mt-2 text-xs text-slate-400 md:mt-0">
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
                onClick={() => {
                  if (activeTab !== tab.id) hasSwitched.current = true;
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  active
                    ? "border-sky-400/70 bg-sky-500/15 text-sky-200 shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role Content Card */}
        <div data-reveal data-roles-card className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-xs sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-md bg-sky-500/15 px-2.5 py-1 text-xs font-bold text-sky-300">
                <current.icon className="h-3.5 w-3.5" />
                {current.name}
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {current.tagline}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">指导导师团队：</span> {current.mentor}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              <div className="hidden sm:block h-16 w-24 rounded-lg border border-white/10 bg-black/40 p-1 shadow-2xs overflow-hidden">
                <ThreeTracks type={activeTab} />
              </div>
              <Button
                onClick={() => onOpenApply(current.id)}
                className="h-10 px-5 text-xs font-semibold shadow-xs shrink-0"
              >
                投递 {current.name} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {current.highlights.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06] hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">0{idx + 1}</span>
                  <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                    {item.badge}
                  </span>
                </div>
                <h4 className="mt-2.5 text-sm font-semibold text-white">{item.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-400/20 bg-sky-500/[0.08] p-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-400 shrink-0" />
              <span><strong className="text-sky-200">招募期望：</strong>{current.idealFor}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/[0.05] border border-sky-400/20 px-2 py-0.5 text-[10px] font-medium text-sky-300"
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
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.07 });

  const steps = [
    { phase: "萌新期", title: "01 技术培养", desc: "专属学习路线 + 定期系统培训 + 学习进度一对一答疑跟踪，打牢开发底座。" },
    { phase: "初级期", title: "02 竞赛磨砺", desc: "蓝桥杯/全国高校数艺大赛等权威赛事带队冲奖，积累高质量背书与评奖加分。" },
    { phase: "成长期", title: "03 真实项目", desc: "进入企业商业项目与AIGC应用孵化，参与真实业务模块开发，接触工业级工作流。" },
    { phase: "中级期", title: "04 独当一面", desc: "独立负责核心模块系统设计 + 带领低年级新成员，全方位锻炼技术领导力。" },
    { phase: "就业期", title: "05 就业辅导", desc: "顶级大厂简历定制精修 + 1v1 模拟面试辅导 + 校友/导师内推直通一线企业。" },
    { phase: "回馈期", title: "06 回馈团队", desc: "返校经验分享 + 担任模拟面试官 + 持续沉淀并传承工作室技术知识库。" },
  ];

  return (
    <section ref={sectionRef} id="growth" className="border-t border-white/10 bg-black py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div data-reveal className="max-w-2xl">
          <SectionLabel>Growth & Career</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            面向就业与成长的全流程培养体系
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
            从大一零基础萌新到大四手握顶级 Offer，工作室构建了“学以致用、阶梯递进、老带新传承”的完整成长闭环。
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              data-reveal
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] hover:shadow-xs hover:border-sky-400/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                    {step.phase}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-sky-400 transition">
                    STEP 0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
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
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.08 });

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
    <section ref={sectionRef} id="projects" className="border-t border-white/10 bg-[#070708] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div data-reveal>
            <SectionLabel>Real Deliveries</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              拒绝纸上谈兵 · 接触真实商业与AIGC实战
            </h2>
          </div>
          <p data-reveal className="mt-2 text-xs text-slate-400">
            累计交付商业项目 10 余个 · 打造简历硬核项目背书
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                data-reveal
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xs transition hover:border-white/20"
              >
                <div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800/90 text-sky-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{p.desc}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-400"
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
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.06 });

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
    <section ref={sectionRef} id="mentors" className="border-t border-white/10 bg-black py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div data-reveal>
          <SectionLabel>Mentor Team</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            强大的双师型导师阵营
          </h2>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            来自中兴、华为及知名高校的资深工程师与学术导师，全程提供实战与技术指导。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m, i) => (
            <div
              key={i}
              data-reveal
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.06] hover:shadow-xs hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 font-mono text-sm font-bold text-white">
                  {m.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  <p className="text-[11px] font-medium text-sky-400">{m.title}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-300">
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
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.08 });

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
    <section ref={sectionRef} id="faq" className="border-t border-white/10 bg-[#070708] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div data-reveal className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            常见疑问与解答
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              data-reveal
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xs"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 text-[10px] font-bold">
                  Q
                </span>
                {faq.q}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 pl-7">
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
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    gsap.set(items, { autoAlpha: 0, y: 26 });
    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: root, start: "top 60%", once: true },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-24 text-white">
      <ThreeWaveScene />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <span data-reveal className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-300">
          <Sparkles className="h-3.5 w-3.5" />
          加入码绘 · 码上就绘
        </span>
        <h2 data-reveal className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
          在这里，和认真做事的伙伴一起，<br />
          把想法做成真正能运行的作品。
        </h2>
        <p data-reveal className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          开发方向 (前端/全栈) · AIGC 创新方向 · 商业项目 · 竞赛冲奖 · 顶级就业辅导
        </p>

        <div data-reveal className="mt-8 flex justify-center gap-4">
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
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const openApply = (role?: string) => {
    if (role) setDefaultRole(role);
    setModalOpen(true);
  };

  // 首屏入场：Header 与 Hero 文案按顺序淡入，营造进入感
  useGSAP(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;

    const items = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-item]"));
    const header = headerRef.current;

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
    if (header) tl.from(header, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0);
    if (items.length > 0) {
      gsap.set(items, { autoAlpha: 0, y: 24 });
      tl.to(items, { autoAlpha: 1, y: 0, stagger: 0.12 }, 0.1);
    }
  }, { scope: heroRef });

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-sky-500/30 selection:text-sky-100">
      <HeaderWithRef ref={headerRef} onOpenApply={openApply} />

      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative w-full overflow-hidden border-b border-white/10 bg-[#08090a]">
          <div className="shader-frame w-full h-[680px] sm:h-[760px] md:h-[840px] lg:h-[880px] relative">
            <TypographyVortexCanvas
              mode="dark"
              phrase="CODEPAINT / STUDIO / WEB / AIGC / MOTION / "
              speed={1.00}
              ringGrowth={1.21}
              opacity={1.00}
              dissolveRadius={1.00}
              particleAmount={1.00}
              suctionDuration={920}
            />
          </div>
          {/* Subtle radial vignette for better text contrast */}
          <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.85)_80%,rgba(8,9,10,0.98)_100%)] pointer-events-none" />
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6 py-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center pointer-events-auto flex flex-col items-center">
             
              <h1 data-hero-item className="mt-6 sm:mt-8 font-extrabold tracking-tight text-white text-4xl sm:text-6xl lg:text-[64px] sm:leading-[1.18] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                <span className="block text-slate-100">
                  致力于全栈与 AIGC 的
                </span>
                <span className="mt-1 block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
                  软创实践型工作室
                </span>
              </h1>
              <p data-hero-item className="mt-5 sm:mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                CodePaint（码绘）工作室围绕「提升能力、高质量就业」为愿景。聚焦{" "}
                <strong className="text-sky-300 font-semibold border-b border-sky-400/40 pb-0.5">开发（前端/全栈）</strong> 与{" "}
                <strong className="text-sky-300 font-semibold border-b border-sky-400/40 pb-0.5">AIGC（大模型/Agent应用）</strong>{" "}
                两大核心赛道，提供成体系学习路线、企业级实战与大厂 1v1 就业内推辅导。
              </p>
        
              <div data-hero-item className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={() => openApply()}
                  className="h-11 px-7 text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(56,189,248,0.3)] bg-sky-400 hover:bg-sky-300 text-slate-950 border-0 transition-all hover:scale-[1.02]"
                >
                  开始在线报名 <ArrowRight className="h-4 w-4" />
                </Button>
                <a href="#roles">
                  <Button variant="outline" className="h-11 px-6 text-xs sm:text-sm font-medium border-slate-700/80 bg-slate-900/70 text-slate-200 backdrop-blur-md hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all">
                    查看招新方向
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <StatsBanner />
        <AlumniDestinations />
        <Roles onOpenApply={openApply} />
        <GrowthPath />
        <Projects />
        <Mentors />
        <FAQ />
        <BottomCallout onOpenApply={openApply} />
      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/cp.webp" alt="Logo" className="h-4 w-4 rounded-xs" />
            <p>© 2026 CodePaint Studio (码绘工作室). All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#stats" className="hover:text-white transition">战报</a>
            <a href="#alumni" className="hover:text-white transition">去向</a>
            <a href="#roles" className="hover:text-white transition">方向</a>
            <a href="#growth" className="hover:text-white transition">培养</a>
            <a href="#projects" className="hover:text-white transition">实战</a>
            <a href="#mentors" className="hover:text-white transition">导师</a>
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
