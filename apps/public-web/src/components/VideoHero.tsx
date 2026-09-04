import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

/**
 * VideoHero — 双句 editorial hero（左上 / 右下）
 * 设计 rationale：第一句顶左放大，第二句右下整体 -4° 倾斜 + 手绘下划线，
 * canvas 在第二句旁边画一个会眨眼、招手、身体轻晃的 2D 工程师小人。
 */
const INK = "#111111";
const PAPER = "#FFFFFC";
const AMBER = "#FFB000";

export function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const line2 = section.querySelector('[data-hero="line2"]');
    if (!line2) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let running = !document.hidden;
    let visible = true;
    let dpr = 1;
    // 工程师落点（CSS px，相对 section）：画在第二句左侧，脚底与句 baseline 对齐
    const anchor = { x: 0, y: 0, s: 140 };

    const computeAnchor = () => {
      const sRect = section.getBoundingClientRect();
      const lRect = line2.getBoundingClientRect();
      const s = Math.max(104, Math.min(190, Math.min(sRect.width, sRect.height) * 0.24));
      anchor.s = s;
      anchor.x = Math.max(12, lRect.left - sRect.left - s * 0.72);
      anchor.y = lRect.bottom - sRect.top - 6;
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeAnchor();
    };
    resize();
    if (document.fonts?.ready) void document.fonts.ready.then(computeAnchor);

    const ro = new ResizeObserver(resize);
    ro.observe(section);
    window.addEventListener("resize", resize);

    const kick = () => {
      if (running && !reduceMotion) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    };
    const onVisibility = () => {
      running = !document.hidden && visible;
      kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 离屏暂停，省电 + 降 jank
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        running = !document.hidden && visible;
        kick();
      },
      { threshold: 0 }
    );
    io.observe(section);

    let tick: (now: number) => void = () => {};

    const rrect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    };

    /** 2D 工程师小人：200 单位设计空间，(0,0) 为双脚中点 */
    const drawEngineer = (t: number) => {
      const { x: ax, y: ay, s } = anchor;
      const k = s / 200;
      const bob = Math.sin(t * 2.1) * 5;

      ctx.save();
      ctx.translate(ax, ay);
      ctx.scale(k, k);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 地面阴影（随晃动缩放）
      ctx.fillStyle = "rgba(17,17,17,0.12)";
      ctx.beginPath();
      ctx.ellipse(4, 8, 36 - bob * 1.6, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 腿（脚固定，臀随身体晃）
      const hipY = -92 + bob;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(-6, hipY);
      ctx.lineTo(-14, 0);
      ctx.moveTo(6, hipY);
      ctx.lineTo(16, 0);
      ctx.stroke();
      // 鞋
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.ellipse(-16, 0, 11, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(18, 0, 11, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 身体：黑色工装
      ctx.fillStyle = INK;
      rrect(-25, -154 + bob, 50, 66, 14);
      ctx.fill();
      // 背带 + 口袋（纸色线）
      ctx.strokeStyle = PAPER;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-12, -154 + bob);
      ctx.lineTo(-12, -118 + bob);
      ctx.moveTo(12, -154 + bob);
      ctx.lineTo(12, -118 + bob);
      ctx.stroke();
      ctx.fillStyle = PAPER;
      ctx.fillRect(-11, -112 + bob, 22, 12);

      // 左臂 + 铅笔
      ctx.strokeStyle = INK;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(-22, -138 + bob);
      ctx.lineTo(-38, -96 + bob);
      ctx.stroke();
      ctx.save();
      ctx.translate(-38, -96 + bob);
      ctx.rotate(0.5);
      ctx.fillStyle = AMBER;
      ctx.fillRect(-5, 0, 10, 30);
      ctx.fillStyle = PAPER;
      ctx.beginPath();
      ctx.moveTo(-5, 30);
      ctx.lineTo(5, 30);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 头
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(8, -180 + bob, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 眼睛（周期眨眼）
      const blink = t % 3.4 < 0.14;
      ctx.strokeStyle = INK;
      ctx.fillStyle = INK;
      ctx.lineWidth = 3.5;
      if (blink) {
        ctx.beginPath();
        ctx.moveTo(8, -182 + bob);
        ctx.lineTo(16, -182 + bob);
        ctx.moveTo(22, -182 + bob);
        ctx.lineTo(30, -182 + bob);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(12, -183 + bob, 3.4, 0, Math.PI * 2);
        ctx.arc(26, -183 + bob, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // 笑
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(19, -172 + bob, 10, Math.PI * 0.15, Math.PI * 0.8);
      ctx.stroke();

      // 安全帽
      ctx.fillStyle = AMBER;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(8, -194 + bob, 30, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      rrect(-28, -200 + bob, 72, 12, 6);
      ctx.fill();
      ctx.stroke();
      // 帽灯
      ctx.fillStyle = PAPER;
      ctx.beginPath();
      ctx.arc(8, -216 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 右臂招手（朝文字方向）
      const wave = -1.05 + Math.sin(t * 4.4) * 0.32;
      const sx = 22;
      const sy = -138 + bob;
      const hx = sx + Math.cos(wave) * 56;
      const hy = sy + Math.sin(wave) * 56;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = PAPER;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(hx, hy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 周围小星星（呼吸闪烁）
      const sparks: Array<[number, number, number]> = [
        [86, -228, 0],
        [108, -160, 1.3],
        [-64, -214, 2.4],
      ];
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      sparks.forEach(([px, py, ph], i) => {
        const a = 0.3 + 0.25 * Math.sin(t * 2.6 + ph);
        const r = 7 + 2 * Math.sin(t * 3.1 + i);
        ctx.globalAlpha = Math.max(0.12, a);
        ctx.beginPath();
        ctx.moveTo(px - r, py);
        ctx.lineTo(px + r, py);
        ctx.moveTo(px, py - r);
        ctx.lineTo(px, py + r);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    if (reduceMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawEngineer(0.6);
      return () => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    tick = (now: number) => {
      if (!running) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawEngineer(now / 1000);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = sectionRef.current;
      const line1 = root?.querySelector('[data-hero="line1"]');
      const tilt = root?.querySelector('[data-hero="tilt"]');
      const line2 = root?.querySelector('[data-hero="line2"]');
      const squiggle = root?.querySelector('[data-hero="squiggle"]');
      const meta = root?.querySelector('[data-hero="meta"]');
      if (!line1 || !line2) return;
      if (reduceMotion) {
        gsap.set([line1, tilt, line2, meta], { clearProps: "all", opacity: 1 });
        if (squiggle) gsap.set(squiggle, { strokeDashoffset: 0 });
        return;
      }
      const s1 = SplitText.create(line1 as HTMLElement, { type: "words, chars", mask: "words" });
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
      tl.addLabel("intro", 0.1);
      tl.from(s1.chars ?? [], { yPercent: 70, autoAlpha: 0, stagger: 0.024, duration: 0.7 }, "intro");
      tl.addLabel("second", "-=0.45");
      tl.from(tilt as HTMLElement, { rotation: -12, y: 40, autoAlpha: 0, duration: 0.9 }, "second");
      tl.from(line2 as HTMLElement, { y: 26, autoAlpha: 0, duration: 0.7 }, "second+=0.1");
      if (squiggle)
        tl.fromTo(
          squiggle,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" },
          "second+=0.45"
        );
      if (meta) tl.from(meta, { autoAlpha: 0, y: 10, duration: 0.5 }, "second+=0.5");
      return () => {
        s1.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-screen min-h-[600px] w-full flex-col justify-between overflow-hidden px-4 pt-28 pb-8 sm:px-6 sm:pt-32"
      aria-label="CodePaint hero"
      style={{
        backgroundImage:
          "linear-gradient(rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* 第一句：左上，放大 */}
      <h1
        data-hero="line1"
        className="font-grot relative z-10 max-w-[14ch] self-start text-left font-bold text-[#111]"
        style={{ fontSize: "clamp(3rem, 11vw, 10rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
      >
        Here is{" "}
        <span className="relative inline-block">
          <span
            aria-hidden="true"
            className="absolute inset-x-[-0.06em] inset-y-[0.08em] -rotate-2 bg-[#FFB000]"
          />
          <span className="relative">codepaint</span>
        </span>
      </h1>

      {/* 第二句：右下，整块 -4° 倾斜 */}
      <div className="relative z-10 flex w-full justify-end">
        <div data-hero="tilt" style={{ transform: "rotate(-4deg)" }} className="text-right">
          <p
            data-hero="line2"
            className="font-grot font-medium text-[#111]"
            style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)", lineHeight: 1.12, letterSpacing: "-0.01em" }}
          >
            what we are{" "}
            <span className="relative inline-block">
              building
              <svg
                aria-hidden="true"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full"
              >
                <path
                  data-hero="squiggle"
                  d="M2 8 Q 20 2 40 7 T 78 6 T 118 7"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                />
              </svg>
            </span>
          </p>
        </div>
      </div>

      <div
        data-hero="meta"
        className="font-mono2 relative z-10 flex items-center justify-between text-[11px] tracking-[0.18em] text-[#111]/55 uppercase"
      >
        <span>N 31°13′ / E 121°28′</span>
        <span>scroll</span>
      </div>
    </section>
  );
}
