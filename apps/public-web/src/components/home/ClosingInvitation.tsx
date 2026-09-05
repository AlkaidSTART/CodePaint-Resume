import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "../../store/appStore";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

/**
 * ClosingInvitation — 终章席位与组件上下左右挤压压缩升空动效
 * 交互：点击“前往投递”，整块卡片向中心上下左右从容挤压压缩成实体小球，
 * 伴随视口平缓回滚，小球慢速沿抛物线升空归入 Header 投递口并唤起表单。
 */
export function ClosingInvitation() {
  const rootRef = useRef<HTMLElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const flightOverlayRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lampLightRef = useRef<SVGPolygonElement>(null);

  const openApply = useAppStore((state) => state.openApply);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLampOn, setIsLampOn] = useState(true);

  const { contextSafe } = useGSAP({ scope: rootRef });

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const underline = root.querySelector<SVGPathElement>("[data-closing-underline]");
      const workstation = root.querySelector<HTMLElement>("[data-workstation-scene]");
      const idBadge = root.querySelector<HTMLElement>("[data-id-badge]");
      const steamPaths = root.querySelectorAll<SVGPathElement>("[data-coffee-steam]");
      const typingLine = root.querySelector<HTMLElement>("[data-terminal-typing]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      if (underline) {
        const len = underline.getTotalLength() || 280;
        gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(underline, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0.1);
      }

      if (workstation) {
        tl.fromTo(
          workstation,
          { y: 35, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
          0.15
        );
      }

      if (idBadge) {
        tl.fromTo(
          idBadge,
          { y: -30, opacity: 0, rotation: -12 },
          { y: 0, opacity: 1, rotation: -3, duration: 0.6, ease: "back.out(1.8)" },
          0.25
        );
      }

      if (typingLine) {
        tl.fromTo(
          typingLine,
          { width: "0%" },
          { width: "100%", duration: 0.7, ease: "steps(22)" },
          0.35
        );
      }

      if (steamPaths.length > 0) {
        gsap.to(steamPaths, {
          y: -8,
          opacity: 0,
          duration: 1.4,
          stagger: 0.25,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    },
    { scope: rootRef }
  );

  // 台灯点击开关交互
  const toggleLamp = contextSafe(() => {
    const next = !isLampOn;
    setIsLampOn(next);
    if (lampLightRef.current) {
      gsap.to(lampLightRef.current, {
        opacity: next ? 0.35 : 0.03,
        duration: 0.15,
        ease: "power1.inOut",
      });
    }
  });

  // 点击“前往投递”：更从容明显的上下左右慢速挤压
  const handleApplyClick = contextSafe(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    const container = contentContainerRef.current;
    const btn = buttonRef.current;
    const overlay = flightOverlayRef.current;
    const orb = orbRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !container || !btn || !overlay || !orb) {
      window.scrollTo({ top: 0, behavior: "auto" });
      openApply();
      setIsNavigating(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const startX = containerRect.left + containerRect.width / 2;
    const startY = containerRect.top + containerRect.height / 2;

    const headerBtn = document.querySelector<HTMLElement>("[data-header-apply-btn]");
    const targetRect = headerBtn?.getBoundingClientRect();
    const targetX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 88;
    const targetY = targetRect ? Math.max(targetRect.top + targetRect.height / 2, 24) : 32;

    gsap.set(overlay, { display: "block" });
    gsap.set(orb, {
      x: startX,
      y: startY,
      scale: 0.1,
      opacity: 0,
      xPercent: -50,
      yPercent: -50,
      force3D: true,
    });

    // 计算三段贝塞尔弧线控制点与目标吸附
    const dx = targetX - startX;
    const dy = targetY - startY;
    // 弧线向左微弯抛物，更有物理飞升质感
    const cpX = startX + dx * 0.35 - (dx > 0 ? 60 : -60);
    const cpY = startY + dy * 0.65;

    const mainTl = gsap.timeline({
      defaults: { ease: "power2.inOut", force3D: true },
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        gsap.set(container, { clearProps: "transform,opacity" });
        setIsNavigating(false);

        if (headerBtn) {
          gsap.timeline({ defaults: { force3D: true } })
            .fromTo(
              headerBtn,
              { scale: 0.94 },
              {
                scale: 1.08,
                duration: 0.22,
                ease: "back.out(2)",
                onComplete: () => {
                  gsap.to(headerBtn, {
                    scale: 1,
                    duration: 0.15,
                    ease: "power1.out",
                    onComplete: () => {
                      gsap.set(headerBtn, { clearProps: "all" });
                      openApply();
                    },
                  });
                },
              }
            );
        } else {
          openApply();
        }
      },
    });

    mainTl.addLabel("squeeze", 0);
    mainTl.addLabel("condense", 1.05);
    mainTl.addLabel("takeoff", 1.4);
    mainTl.addLabel("dock", 2.85);

    // 阶段 1: 更加从容细腻的上下左右慢速挤压
    mainTl.to(
      container,
      {
        scaleX: 0.008,
        scaleY: 0.008,
        opacity: 0,
        transformOrigin: "50% 50%",
        duration: 1.4,
        ease: "power2.inOut",
      },
      "squeeze"
    );

    // 小实体球在挤压末段中心凝聚成型
    mainTl.fromTo(
      orb,
      {
        x: startX,
        y: startY,
        scale: 0.1,
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "sine.out",
      },
      "condense"
    );

    // 阶段 2: 视口随挤压完成平稳回滚 (加入主 timeline 管理，避免外生 tween 竞争)
    mainTl.to(
      window,
      {
        scrollTo: { y: 0, autoKill: false },
        duration: 1.5,
        ease: "power2.inOut",
      },
      "takeoff"
    );

    // 阶段 3: 实体小球沿独立 X/Y 连续曲线丝滑飞升 (X轴 power1.inOut 匀顺过渡，Y轴 power2.in 加速升空至 Header)
    mainTl.to(
      orb,
      {
        x: cpX,
        y: cpY,
        scale: 1.12,
        duration: 0.75,
        ease: "power1.out",
      },
      "takeoff"
    );

    mainTl.to(
      orb,
      {
        x: targetX,
        y: targetY,
        scale: 0.42,
        duration: 0.7,
        ease: "power2.inOut",
      },
      "takeoff+=0.75"
    );

    // 阶段 4: 小球平滑融入 Header 按钮并隐去
    mainTl.to(
      orb,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.14,
        ease: "power2.in",
      },
      "dock"
    );
  });

  return (
    <section
      ref={rootRef}
      id="closing"
      aria-labelledby="closing-title"
      data-screen="closing-panel"
      className="relative flex min-h-[90dvh] w-full flex-col justify-center overflow-hidden scroll-mt-28 py-20 bg-[#fffffc]"
    >
      {/* 纯色实体小球全屏悬浮层（GPU 独立合成层，无重绘无发光） */}
      <div
        ref={flightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 hidden overflow-hidden transform-gpu"
      >
        <div
          ref={orbRef}
          className="absolute flex items-center justify-center will-change-transform transform-gpu"
        >
          <div className="h-6 w-6 rounded-full bg-[#111111] border border-black/20 shadow-[0_4px_12px_rgba(0,0,0,0.35)]" />
        </div>
      </div>

      <div
        ref={contentContainerRef}
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 will-change-transform transform-gpu"
      >
       

        {/* 主内容双列：左侧情感召唤与CTA，右侧实体工位场景与挂绳工牌 */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* 左侧：文字召唤与前往投递交互 */}
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="font-mono2 text-[11px] font-semibold tracking-[0.25em] text-black/45 uppercase">
              INVITATION // 虚位以待
            </p>

            <h2
              id="closing-title"
              className="mt-4 text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl lg:text-5xl"
            >
              心动了？
              <br />
              <span className="relative mt-2 inline-block">
                这里仍有你的一席之位！
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 16"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3.5 w-full"
                >
                  <path
                    data-closing-underline
                    d="M3 10 Q 75 3 155 9 T 255 7 T 317 6"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-black/70 sm:text-lg">
              不必等到万事俱备才出发。文档已解锁，学长学姐也已就位——
              <br className="hidden sm:inline" />
              只要你对技术怀有真实的热忱，CodePaint 就有属于你的那一块屏幕。
            </p>

            {/* 投递交互区 */}
            <div className="mt-8 flex flex-col items-start gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
              <button
                ref={buttonRef}
                type="button"
                onClick={handleApplyClick}
                disabled={isNavigating}
                aria-label="前往投递加入 CodePaint Studio"
                className="group relative inline-flex min-h-13 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#111] px-8 text-base font-semibold text-[#fffffc] shadow-[3px_4px_0_rgba(17,17,17,0.25)] transition-colors duration-150 hover:bg-sky-700 active:bg-sky-800 disabled:cursor-wait"
              >
                <span>前往投递</span>
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>

              <p className="font-mono2 text-xs text-black/55">
                点击将压缩为小球飞往 Header 并展开投递表单。
              </p>
            </div>
          </div>

          {/* 右侧：实体工位场景与工牌 */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            <div
              data-workstation-scene
              className="relative overflow-hidden rounded-2xl border-2 border-black/15 bg-[#fffdf4] p-5 shadow-[4px_5px_0_rgba(17,17,17,0.1)] sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="font-mono2 text-[11px] font-bold tracking-wider text-black/60 uppercase">
                  WORKSTATION // CP-BAY-09
                </span>
                <button
                  type="button"
                  onClick={toggleLamp}
                  title="切换工位台灯照明"
                  className="inline-flex items-center gap-1.5 rounded-xs border border-black/15 bg-[#fffffc] px-2.5 py-1 font-mono2 text-[11px] text-black/70 transition-colors hover:bg-amber-50"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${isLampOn ? "bg-amber-500 shadow-[0_0_6px_#f59e0b]" : "bg-black/30"}`}
                  />
                  <span>{isLampOn ? "DESK LAMP: ON" : "DESK LAMP: OFF"}</span>
                </button>
              </div>

              {/* 2D 矢量工位插画场景 */}
              <div
                aria-hidden="true"
                className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-xl border border-black/10 bg-[#f8fafc] p-3"
              >
                <svg
                  viewBox="0 0 500 300"
                  className="h-full w-full select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern id="deskGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                  </pattern>
                  <rect width="500" height="240" fill="url(#deskGrid)" />

                  <polygon
                    ref={lampLightRef}
                    points="75,45 0,240 180,240"
                    fill="#fef08a"
                    opacity={isLampOn ? "0.35" : "0.03"}
                  />

                  <path d="M50 240 L80 240" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                  <path d="M65 240 L65 100 L85 45" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <ellipse cx="85" cy="45" rx="14" ry="7" fill="#f59e0b" stroke="#334155" strokeWidth="2" />
                  {isLampOn && <circle cx="85" cy="46" r="4" fill="#fff" />}

                  <rect x="140" y="55" width="220" height="140" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <rect x="235" y="195" width="30" height="45" fill="#64748b" />
                  <ellipse cx="250" cy="240" rx="35" ry="5" fill="#475569" />

                  <rect x="145" y="60" width="210" height="18" fill="#1e293b" />
                  <circle cx="155" cy="69" r="3" fill="#ef4444" />
                  <circle cx="165" cy="69" r="3" fill="#f59e0b" />
                  <circle cx="175" cy="69" r="3" fill="#10b981" />
                  <text x="188" y="72" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                    bash - codepaint-onboarding
                  </text>

                  <text x="152" y="94" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    const member = await studio.join({`{\n`})
                  </text>
                  <text x="160" y="108" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
                    passion: Infinity,
                  </text>
                  <text x="160" y="122" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
                    desk: &quot;BAY_09_READY&quot;,
                  </text>
                  <text x="160" y="136" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
                    status: &quot;ONBOARDING&quot;
                  </text>
                  <text x="152" y="150" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    {`}`});
                  </text>

                  <g transform="translate(152, 168)">
                    <text x="0" y="10" fill="#10b981" fontSize="8" fontFamily="monospace">
                      ➜ ready in 128ms! CodePaint welcomes you.
                    </text>
                  </g>

                  <g transform="translate(370, 75) rotate(-6)">
                    <rect x="0" y="0" width="105" height="135" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    <rect x="5" y="5" width="95" height="14" fill="#0f172a" />
                    <text x="10" y="15" fill="#38bdf8" fontSize="6" fontFamily="monospace">
                      feishu://knowledge
                    </text>
                    <rect x="10" y="26" width="85" height="18" rx="2" fill="#334155" />
                    <rect x="10" y="50" width="40" height="28" rx="2" fill="#0284c7" fillOpacity="0.4" />
                    <rect x="55" y="50" width="40" height="28" rx="2" fill="#0284c7" fillOpacity="0.4" />
                    <rect x="10" y="84" width="85" height="36" rx="2" fill="#334155" />
                  </g>

                  <rect x="0" y="238" width="500" height="62" fill="#e2d9cc" stroke="#111" strokeWidth="2" />
                  <line x1="0" y1="244" x2="500" y2="244" stroke="#c4b5a0" strokeWidth="2" />

                  <rect x="180" y="248" width="140" height="32" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                  <rect x="225" y="284" width="50" height="12" rx="2" fill="#475569" />

                  <rect x="105" y="250" width="22" height="26" rx="2" fill="#ea580c" />
                  <path d="M127 254 C132 254 132 268 127 268" stroke="#ea580c" strokeWidth="2.5" fill="none" />
                  <path data-coffee-steam d="M110 246 Q112 240 110 234" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path data-coffee-steam d="M116 246 Q118 238 116 230" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path data-coffee-steam d="M122 246 Q124 240 122 234" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* 实体挂绳工牌 */}
              <div
                data-id-badge
                aria-hidden="true"
                className="relative -mt-6 ml-auto w-64 rotate-[-3deg] select-none sm:w-72"
              >
                <div className="mx-auto h-4 w-6 rounded-xs bg-slate-400 border border-black/30 shadow-xs flex items-center justify-center">
                  <div className="h-1.5 w-3 rounded-full bg-slate-700" />
                </div>
                <div className="relative mt-1 rounded-xl border-2 border-dashed border-[#0284c7] bg-[#f0f9ff] p-4 shadow-[3px_4px_0_rgba(2,132,199,0.18)]">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                    <span className="font-mono2 text-[10px] font-bold tracking-wider text-sky-800 uppercase">
                      CODEPAINT PASS
                    </span>
                    <span className="font-mono2 rounded-xs bg-sky-200/70 px-1.5 py-0.5 text-[9px] font-bold text-sky-900">
                      NEW COHORT
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-sky-300 bg-white font-mono2 text-xs font-bold text-sky-700 shadow-inner">
                      YOU
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black/85">
                        准新成员 · 你的名字
                      </p>
                      <p className="font-mono2 text-[11px] text-black/55">
                        ROLE: SOFTWARE CRAFTSPERSON
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-sky-200 pt-2 text-[10px] font-medium text-sky-800">
                    <span className="font-mono2">STATION: DESK-09</span>
                    <span className="font-mono2 font-bold text-emerald-700">● READY TO CLAIM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部工作室版权 */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-black/8 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono2 text-xs text-black/45">
            © {new Date().getFullYear()} CodePaint Studio. All rights reserved.
          </p>
          <p className="font-mono2 text-xs text-black/40">
            BUILT WITH CRAFT & CARE · CHENGDU
          </p>
        </footer>
      </div>
    </section>
  );
}
