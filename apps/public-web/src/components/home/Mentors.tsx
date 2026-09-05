import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

type Mentor = {
  id: string;
  no: string;
  code: string;
  pinyin: string;
  surname: string;
  name: string;
  title: string;
  domain: string;
  focus: string;
  pedigree: string;
  tags: string[];
  meta: string;
  bio: string;
  scatter: { x: number; y: number; rotation: number };
};

const MENTORS: Mentor[] = [
  {
    id: "mentor-huang",
    no: "01",
    code: "ARCH // 01",
    pinyin: "HUANG YUANYUAN",
    surname: "黄",
    name: "黄媛媛",
    focus: "企业级高可用架构 · 全栈工程化研发",
    pedigree: "电子科技大学硕士 · 数字媒体技术系主任 · 前中兴通讯系统工程师",
    title: "副教授 · 高级工程师",
    domain: "工程架构 / 全栈开发",
    tags: ["前中兴通讯", "2G–5G网管研发", "系主任·学术委员"],
    meta: "电子科技大学硕士 · 数字媒体技术系主任 · 前中兴通讯系统工程师",
    bio: "曾就职于中兴通讯，主导 2G–5G 网管平台研发，具备多年企业级复杂系统架构落地与团队管理经验。",
    scatter: { x: -280, y: -160, rotation: -16 },
  },
  {
    id: "mentor-wang",
    no: "02",
    code: "SYS // 02",
    pinyin: "WANG FENGSHUO",
    surname: "王",
    name: "王风硕",
    focus: "高并发服务治理 · 生产级微服务实战",
    pedigree: "西南交通大学硕士 · 前华为终端/华为技术 7 年 · 骨干教师",
    title: "工程师 · 双师型教师",
    domain: "系统架构 / 高并发服务",
    tags: ["华为技术 7 年", "政企平台架构", "大型运维研发"],
    meta: "西南交通大学硕士 · 前华为终端/华为技术 7 年 · 骨干教师",
    bio: "历任华为研发/运维/项目经理/系统架构师，主持参与社保话务系统、政务监察平台与精品网建设等重大工程。",
    scatter: { x: -120, y: 180, rotation: 14 },
  },
  {
    id: "mentor-guo",
    no: "03",
    code: "R&D // 03",
    pinyin: "GUO YUJUN",
    surname: "郭",
    name: "郭昱君",
    focus: "权威学科竞赛孵化 · 产学研成果转化",
    pedigree: "莫纳什大学硕士 · 马来西亚国立大学博士在读 · 学院竞赛负责人",
    title: "讲师 · 竞赛负责教师",
    domain: "创新竞赛 / 产学转化",
    tags: ["国家级竞赛指导", "CIMA 管理会计", "在读博士"],
    meta: "莫纳什大学硕士 · 马来西亚国立大学博士在读 · 学院竞赛负责人",
    bio: "负责学院学科竞赛组织与拔尖孵化，指导学生斩获多项国家级/省部级奖项，推进创意与工程成果转化。",
    scatter: { x: 40, y: -220, rotation: -10 },
  },
  {
    id: "mentor-zhang",
    no: "04",
    code: "DSGN // 04",
    pinyin: "ZHANG HUI",
    surname: "张",
    name: "张蕙",
    focus: "设计工程化 · Design System · 交互体验",
    pedigree: "电子科技大学硕士 · 一线交互设计履历 · 川大锦城“夫子育人”奖",
    title: "讲师 · UI 人机界面方向",
    domain: "人机交互 / 体验设计",
    tags: ["企业级 UI/UX", "国家级设计奖项", "双师型教师"],
    meta: "电子科技大学硕士 · 企业交互设计履历 · 川大锦城“夫子育人”奖",
    bio: "拥有多年一线企业级产品设计与交互开发经验，指导学生在权威设计与软件大赛中持续斩获最高奖项。",
    scatter: { x: 160, y: 190, rotation: 12 },
  },
  {
    id: "mentor-chu",
    no: "05",
    code: "MEDIA // 05",
    pinyin: "CHU XIAOCHUAN",
    surname: "褚",
    name: "褚晓川",
    focus: "数字媒体产研 · 权威赛事标准与答辩评审",
    pedigree: "四川省高校美协会员 · “金犊奖”评审委员 · 全国毕业设计评审专家",
    title: "讲师 · 艺术评审专家",
    domain: "数字媒体 / 评审专家",
    tags: ["金犊奖评审委员", "省级课题主持", "省高校美协会员"],
    meta: "四川省高校美协会员 · “金犊奖”评审委员 · 全国毕业设计评审专家",
    bio: "主持多项省级重点科研课题，深耕数字媒体技术与视觉传达，熟悉从技术构思到权威赛事评审的全链路准则。",
    scatter: { x: 320, y: -150, rotation: -15 },
  },
];

function MentorCard({
  mentor,
  isDuplicate,
}: {
  mentor: Mentor;
  isDuplicate?: boolean;
}) {
  const cardProps = isDuplicate
    ? { "data-duplicate-card": "" }
    : { "data-primary-card": "" };

  return (
    <article
      {...cardProps}
      className={`group relative flex w-[370px] shrink-0 flex-col justify-between overflow-hidden rounded-md border border-black/15 bg-[#fffdf6] p-5 shadow-[3px_4px_0_rgba(17,17,17,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-black/40 hover:shadow-[6px_8px_0_rgba(17,17,17,0.16)] sm:w-[420px] sm:p-6 will-change-transform ${
        isDuplicate ? "opacity-0" : ""
      }`}
    >
      {/* 空间标定角标 */}
      <span aria-hidden="true" className="absolute top-2 left-2 font-mono2 text-[9px] text-black/20 select-none">+</span>
      <span aria-hidden="true" className="absolute top-2 right-2 font-mono2 text-[9px] text-black/20 select-none">+</span>

      {/* 巨幅背景汉字水印 — 建立空间深度与设计感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-3 select-none font-serif text-[116px] font-black leading-none text-black/[0.035] transition-colors duration-300 group-hover:text-black/[0.07] sm:text-[132px]"
      >
        {mentor.surname}
      </div>

      {/* 顶栏：档案编号与在席标识 */}
      <div className="relative z-10 flex items-center justify-between border-b border-black/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono2 text-[10px] font-bold tracking-widest text-[#111] bg-black/5 px-2 py-0.5 rounded-xs border border-black/10">
            DOC // #{mentor.no}
          </span>
          <span className="font-mono2 text-[11px] font-semibold tracking-wider text-black/45">
            {mentor.code}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono2 text-[10.5px] font-medium text-sky-800 bg-sky-50/90 border border-sky-200/80 px-2 py-0.5 rounded-xs">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
          <span>带教在席 · RESIDENT</span>
        </div>
      </div>

      {/* 主体核心：姓名 + 领域 + 履历板块 */}
      <div className="relative z-10 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h3 className="font-grot text-2xl font-bold tracking-tight text-[#111] sm:text-[26px]">
                {mentor.name}
              </h3>
              <span className="font-mono2 text-[10.5px] font-medium tracking-widest text-black/40 uppercase">
                {mentor.pinyin}
              </span>
            </div>
            <p className="mt-1 font-mono2 text-xs font-semibold text-black/60">
              {mentor.title}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-block rounded-xs border border-black/15 bg-black/[0.03] px-2.5 py-1 font-mono2 text-[11px] font-bold text-[#111] shadow-[1px_1px_0_rgba(17,17,17,0.06)]">
              {mentor.domain}
            </span>
          </div>
        </div>

        {/* 履历凭证框：结构化档案板块 */}
        <div className="mt-4 rounded-xs border border-black/10 bg-black/[0.025] p-3">
          <div className="flex items-center justify-between font-mono2 text-[10px] font-bold tracking-wider text-black/45 uppercase border-b border-black/8 pb-1.5">
            <span>CREDENTIAL // 行业与学术履历</span>
            <span>OFFICIAL RECORD</span>
          </div>
          <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-black/85">
            {mentor.pedigree}
          </p>
        </div>

        {/* 实战指导主攻方向 */}
        <div className="mt-3.5 rounded-xs border-l-3 border-sky-700 bg-sky-50/50 py-2 px-3 border-y border-r border-sky-200/50">
          <span className="font-mono2 text-[10.5px] font-bold tracking-wider text-sky-950 uppercase">
            FOCUS // 实战带教主攻
          </span>
          <p className="mt-0.5 text-[13px] font-bold tracking-tight text-[#111]">
            {mentor.focus}
          </p>
        </div>

        {/* 标签群 */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {mentor.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono2 rounded-xs border border-black/12 bg-[#fffffc] px-2 py-0.5 text-[11px] font-medium text-black/75 transition-colors group-hover:border-sky-600/40 group-hover:bg-sky-50 group-hover:text-sky-900"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 导师详述 */}
        <p className="mt-3.5 text-xs leading-relaxed text-black/65 line-clamp-2">
          {mentor.bio}
        </p>
      </div>

      {/* 底部档案校验带 */}
      <div className="relative z-10 mt-5 border-t border-black/10 pt-2.5">
        <div className="flex items-center justify-between font-mono2 text-[10px] text-black/45">
          <span className="tracking-widest">VERIFIED RECORD // 官方导师组</span>
          <span className="font-semibold text-black/60">CODEPAINT FACULTY</span>
        </div>
      </div>
    </article>
  );
}

/**
 * Mentors — 导师组曲：多向飞入集结 + 无缝跑马灯启航
 */
export function Mentors() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track || !contextSafe) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(track.querySelectorAll("[data-duplicate-card]"), { opacity: 1 });
        return;
      }

      const underline = root.querySelector<SVGPathElement>("[data-mentor-underline]");
      const primaryCards = track.querySelectorAll<HTMLElement>("[data-primary-card]");
      const duplicateCards = track.querySelectorAll<HTMLElement>("[data-duplicate-card]");

      let marqueeTween: gsap.core.Tween | null = null;

      const playEntrance = () => {
        if (marqueeTween) {
          marqueeTween.kill();
          marqueeTween = null;
        }
        gsap.set(track, { xPercent: 0 });
        gsap.set(duplicateCards, { opacity: 0 });
        masterTl.restart();
      };

      const resetState = () => {
        if (marqueeTween) {
          marqueeTween.kill();
          marqueeTween = null;
        }
        masterTl.pause(0);
        gsap.set(track, { xPercent: 0 });
        gsap.set(duplicateCards, { opacity: 0 });
      };

      // 1. 顶层编排主 Timeline
      const masterTl = gsap.timeline({
        paused: true,
      });

      // 下划线手绘绘制
      if (underline) {
        const len = underline.getTotalLength() || 120;
        gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
        masterTl.to(underline, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0);
      }

      // 阶段一：从四面八方飞入集结成排
      primaryCards.forEach((card, index) => {
        const config = MENTORS[index % MENTORS.length].scatter;
        masterTl.fromTo(
          card,
          {
            x: config.x,
            y: config.y,
            rotation: config.rotation,
            scale: 0.8,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: "back.out(1.4)",
          },
          0.1 + index * 0.08
        );
      });

      // 阶段二：副组卡片同步就绪并无缝接力开启无限跑马灯
      masterTl.to(
        duplicateCards,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (marqueeTween) marqueeTween.kill();
            gsap.set(track, { xPercent: 0 });
            // 启动无限匀速跑马灯
            marqueeTween = gsap.to(track, {
              xPercent: -50,
              ease: "none",
              duration: 34,
              repeat: -1,
            });
          },
        },
        "-=0.1"
      );

      // 2. 每次进入/重返视口均触发重播
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        end: "bottom 20%",
        onEnter: playEntrance,
        onEnterBack: playEntrance,
        onLeave: resetState,
        onLeaveBack: resetState,
      });

      // 悬停降速交互
      const slowDown = contextSafe(() => {
        if (marqueeTween) gsap.to(marqueeTween, { timeScale: 0.15, duration: 0.4 });
      });
      const speedUp = contextSafe(() => {
        if (marqueeTween) gsap.to(marqueeTween, { timeScale: 1, duration: 0.4 });
      });

      track.addEventListener("mouseenter", slowDown);
      track.addEventListener("mouseleave", speedUp);

      return () => {
        trigger.kill();
        masterTl.kill();
        if (marqueeTween) marqueeTween.kill();
        track.removeEventListener("mouseenter", slowDown);
        track.removeEventListener("mouseleave", speedUp);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="mentors"
      aria-labelledby="mentors-title"
      data-screen="mentors-panel"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden scroll-mt-28 py-20 bg-[#fffffc]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* 顶部标题区 */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono2 text-[11px] tracking-[0.18em] text-black/55 uppercase">
              FACULTY & ADVISORS // 03 · 指导团队
            </p>
            <h2
              id="mentors-title"
              className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl"
            >
              带你做事
              <span className="relative inline-block ml-1">
                的老师
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full"
                >
                  <path
                    data-mentor-underline
                    d="M3 8 Q 20 3 40 7 T 78 7 T 117 5"
                    fill="none"
                    stroke="#0369a1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <p className="font-mono2 text-xs tracking-wider text-black/60">
              [ 5 位产业与学术双导师在席 · 华为/中兴前线研发 + 国家级赛事评审委员 ]
            </p>
          </div>
        </div>
      </div>

      {/* 跑马灯轨道遮罩区 */}
      <div className="relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div
          ref={trackRef}
          className="flex w-max gap-6 py-4 px-4 will-change-transform"
        >
          {/* 第一组（主卡组）：各方向散落飞入集结成排 */}
          {MENTORS.map((m) => (
            <MentorCard key={"primary-" + m.id} mentor={m} />
          ))}

          {/* 第二组（接力卡组）：用于无缝跑马灯循环 */}
          {MENTORS.map((m) => (
            <MentorCard key={"dup-" + m.id} mentor={m} isDuplicate />
          ))}
        </div>
      </div>
    </section>
  );
}
