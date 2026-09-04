import { useRef } from "react";
import { MentorFigureCanvas, type MentorGender } from "./MentorFigureCanvas";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Mentor = {
  id: string;
  no: string;
  surname: string;
  name: string;
  title: string;
  meta: string;
  bio: string;
  tilt: number;
  gender: MentorGender;
  figure: number;
};

const MENTORS: Mentor[] = [
  {
    id: "mentor-huang",
    no: "01",
    surname: "黄",
    name: "黄媛媛",
    title: "副教授 · 高级工程师",
    meta: "电子科技大学硕士 · 数字媒体技术系主任、学术委员会成员 · 前中兴通讯",
    bio: "毕业后曾就职于中兴通讯，参与 2G–5G 网管平台研发，先后担任开发经理、系统工程师，有多年的前端、后端设计、开发与研发管理经验。",
    tilt: 0,
    gender: "female",
    figure: 0,
  },
  {
    id: "mentor-guo",
    no: "02",
    surname: "郭",
    name: "郭昱君",
    title: "讲师 · 学院竞赛工作负责教师",
    meta: "莫纳什大学 CIMA 方向管理会计硕士 · 马来西亚国立大学博士在读 · 计算机学院学生科副科长",
    bio: "负责学院竞赛工作，带领学生获得多项竞赛奖项，陪你把想法变成能拿奖的作品。",
    tilt: 0,
    gender: "female",
    figure: 1,
  },
  {
    id: "mentor-wang",
    no: "03",
    surname: "王",
    name: "王风硕",
    title: "工程师 · 双师型教师",
    meta: "西南交通大学硕士 · 前华为终端 / 华为技术（7 年）",
    bio: "先后担任研发工程师、运维工程师、项目经理、系统架构师，曾主持和参与社保话务系统、政府信息监察平台、精品网建设等重大项目。",
    tilt: 0,
    gender: "male",
    figure: 0,
  },
  {
    id: "mentor-zhang",
    no: "04",
    surname: "张",
    name: "张蕙",
    title: "讲师 · 双师型教师 · UI 人机界面方向",
    meta: "电子科技大学硕士 · 曾在企业从事用户界面设计 · 川大锦城学院“夫子育人”奖三等奖",
    bio: "有着丰富的项目开发实践经验，带领学生获得多项国家级奖项，帮你把界面做得好看又好用。",
    tilt: 0,
    gender: "female",
    figure: 2,
  },
  {
    id: "mentor-chu",
    no: "05",
    surname: "褚",
    name: "褚晓川",
    title: "讲师 · 硕士",
    meta: "四川省高校美术协会成员 · “金犊奖”评审委员 · 全国本科毕业论文（设计）评审专家",
    bio: "发表学术论文数篇，主持省级课题两项；数字媒体技术相关竞赛经验丰富，获奖若干，熟悉从创作到评审的全链路。",
    tilt: -4,
    gender: "female",
    figure: 3,
  },
];

/**
 * Mentors — 指导老师档案幕。
 * 视觉 rationale：指导档案——左侧 sticky 编辑标题 + 右侧档案行，
 * 每位老师一行：canvas 手绘小人（女女男女女）+ 姓氏印章 + 姓名职称 + 经历正文；
 * 用干净纸面与账本式分隔线区别于作品幕的点阵纸和招募幕的横线纸，
 * 小人为纸卡质感的克制点缀（呼吸级轻晃 + 眨眼），信息仍由 DOM 承载。
 */
export function Mentors() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(root.querySelectorAll("[data-reveal]"), {
        y: 16,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="mentors"
      aria-labelledby="mentors-title"
      data-screen="mentors-panel"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden scroll-mt-28 bg-[#fffffc]"
    >
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pt-28 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-28">
        {/* 左：编辑式标题，桌面端 sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
          <p data-reveal className="font-mono2 text-[11px] tracking-[0.18em] text-black/55 uppercase">
            mentors — 03 / 指导老师
          </p>
          <h2
            data-reveal
            id="mentors-title"
            className="mt-4 max-w-[12ch] text-3xl leading-[1.15] font-semibold tracking-tight text-[#111] sm:text-4xl"
          >
            带你做事
            <span className="relative inline-block">
              的老师
              <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full">
                <path
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
          <p data-reveal className="mt-5 max-w-[38ch] text-base leading-7 text-black/60">
            来自企业与高校一线：做过真实项目，也带过学生拿奖。进工作室后，他们会直接指导你的方向和作品。
          </p>
          <p
            data-reveal
            className="font-mono2 mt-5 inline-block rounded-sm border border-black/10 bg-[#fffdf4] px-2.5 py-1 text-[11px] tracking-[0.14em] text-black/60 uppercase shadow-[2px_2px_0_rgba(17,17,17,0.08)]"
          >
            5 位指导老师 · 企业 + 高校
          </p>
        </div>

        {/* 右：档案行 */}
        <ol className="lg:col-span-7 lg:col-start-6">
          {MENTORS.map((m) => (
            <li
              key={m.id}
              id={m.id}
              data-reveal
              className="group flex scroll-mt-24 list-none items-start gap-4 border-t border-black/10 py-6 first:border-t-0 first:pt-0 last:pb-0 sm:gap-5 sm:py-7"
            >
              <span className="flex w-14 shrink-0 flex-col items-center gap-1.5">
                <MentorFigureCanvas gender={m.gender} variant={m.figure} />
                <span
                  aria-hidden="true"
                  style={{ rotate: `${m.tilt}deg` }}
                  className="flex h-11 w-11 items-center justify-center border border-black/15 bg-[#fffdf4] text-lg font-semibold text-[#111] shadow-[2px_2px_0_rgba(17,17,17,0.08)]"
                >
                  {m.surname}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg leading-snug font-semibold text-[#111] sm:text-xl">{m.name}</h3>
                  <p className="text-sm leading-6 text-black/55">{m.title}</p>
                  <span aria-hidden="true" className="font-mono2 ml-auto text-xs text-black/30">
                    {m.no}
                  </span>
                </div>
                <p className="mt-1.5 max-w-[62ch] text-[15px] leading-7 text-black/65">{m.bio}</p>
                <p className="font-mono2 mt-2 max-w-[68ch] text-xs leading-5 tracking-wide text-black/45">{m.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
