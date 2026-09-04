import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

type Mentor = {
  id: string;
  no: string;
  surname: string;
  name: string;
  title: string;
  domain: string;
  tags: string[];
  meta: string;
  bio: string;
  // 初始离散飞行矢量（从不同方位聚集入场）
  scatter: { x: number; y: number; rotation: number };
};

const MENTORS: Mentor[] = [
  {
    id: "mentor-huang",
    no: "01",
    surname: "黄",
    name: "黄媛媛",
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
    surname: "王",
    name: "王风硕",
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
    surname: "郭",
    name: "郭昱君",
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
    surname: "张",
    name: "张蕙",
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
    surname: "褚",
    name: "褚晓川",
    title: "讲师 · 艺术评审专家",
    domain: "数字媒体 / 评审专家",
    tags: ["金犊奖评审委员", "省级课题主持", "省高校美协会员"],
    meta: "四川省高校美协会员 · “金犊奖”评审委员 · 全国毕业设计评审专家",
    bio: "主持多项省级重点科研课题，深耕数字媒体技术与视觉传达，熟悉从技术构思到权威赛事评审的全链路准则。",
    scatter: { x: 320, y: -150, rotation: -15 },
  },
];

/**
 * Mentors — 导师组曲：多向飞入集结 + 无缝跑马灯启航
 * 
 * 动效机制：
 * 1. 阶段一：各方奔赴集结（Assembly）
 *    - 5 张卡片分别从左上、左下、正上、右下、右上以不同初速度与倾角飞跃而来；
 *    - 带有轻微弹性过冲（back.out），在视口中心精准卡位锁链成一排；
 * 2. 阶段二：跑马灯平滑启程（Marquee Transition）
 *    - 集结完毕后，副组无缝淡入，启动无限水平循环滚动；
 *    - 悬停（mouseenter）即刻平滑减速至 0.15x，移开恢复。
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
              mentors — 03 / 指导团队
            </p>
            <h2
              id="mentors-title"
              className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl"
            >
              带你做事
              <span className="relative inline-block">
                的老师
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full"
                >
                  <path
                    data-mentor-underline
                    d="M3 8 Q 20 3 40 7 T 78 7 T 117 5"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              。
            </h2>
          </div>
          <p className="font-mono2 text-xs tracking-wider text-black/50">
            [ 华为 / 中兴前线研发 + 国家级赛事评审委员 · 悬停降速查看 ]
          </p>
        </div>
      </div>

      {/* 跑马灯轨道遮罩区 */}
      <div className="relative mt-12 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <div
          ref={trackRef}
          className="flex w-max gap-6 py-4 will-change-transform"
        >
          {/* 第一组（主卡组）：各方向散落飞入集结成排 */}
          {MENTORS.map((m) => (
            <article
              key={`primary-${m.id}`}
              data-primary-card
              className="group relative flex w-[350px] shrink-0 flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-5 shadow-[2px_3px_0_rgba(17,17,17,0.06)] transition-shadow duration-200 hover:border-black/30 hover:shadow-[4px_6px_0_rgba(17,17,17,0.12)] sm:w-[380px] sm:p-6 will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/8 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs border border-black/15 bg-[#fffffc] text-lg font-bold text-[#111] shadow-[1.5px_1.5px_0_rgba(17,17,17,0.08)] group-hover:border-sky-700/40 group-hover:text-sky-800"
                    >
                      {m.surname}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#111]">{m.name}</h3>
                      <p className="font-mono2 text-xs font-semibold text-sky-700">{m.domain}</p>
                    </div>
                  </div>
                  <span className="font-mono2 text-xs text-black/30">/{m.no}</span>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70 group-hover:border-sky-700/30 group-hover:bg-sky-50 group-hover:text-sky-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3.5 text-sm leading-relaxed text-black/75 line-clamp-3">
                  {m.bio}
                </p>
              </div>

              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="font-mono2 text-[11px] leading-4 text-black/50 line-clamp-1">
                  {m.meta}
                </p>
              </div>
            </article>
          ))}

          {/* 第二组（接力卡组）：用于无缝跑马灯循环 */}
          {MENTORS.map((m) => (
            <article
              key={`dup-${m.id}`}
              data-duplicate-card
              className="group relative flex w-[350px] shrink-0 flex-col justify-between rounded-xl border border-black/10 bg-[#fffdf4] p-5 shadow-[2px_3px_0_rgba(17,17,17,0.06)] opacity-0 transition-shadow duration-200 hover:border-black/30 hover:shadow-[4px_6px_0_rgba(17,17,17,0.12)] sm:w-[380px] sm:p-6 will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/8 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs border border-black/15 bg-[#fffffc] text-lg font-bold text-[#111] shadow-[1.5px_1.5px_0_rgba(17,17,17,0.08)] group-hover:border-sky-700/40 group-hover:text-sky-800"
                    >
                      {m.surname}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#111]">{m.name}</h3>
                      <p className="font-mono2 text-xs font-semibold text-sky-700">{m.domain}</p>
                    </div>
                  </div>
                  <span className="font-mono2 text-xs text-black/30">/{m.no}</span>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono2 rounded-xs border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] font-medium text-black/70 group-hover:border-sky-700/30 group-hover:bg-sky-50 group-hover:text-sky-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3.5 text-sm leading-relaxed text-black/75 line-clamp-3">
                  {m.bio}
                </p>
              </div>

              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="font-mono2 text-[11px] leading-4 text-black/50 line-clamp-1">
                  {m.meta}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
