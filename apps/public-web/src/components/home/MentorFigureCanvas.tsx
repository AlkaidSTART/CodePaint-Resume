import { useEffect, useRef } from "react";

export type MentorGender = "female" | "male";

type Props = {
  gender: MentorGender;
  /** 0-3：区分 4 位女老师的发型/着装，男老师忽略 */
  variant?: number;
  className?: string;
};

const INK = "#181818";
const PAPER = "#fffdf4";
const ACCENT = "#0284c7";

/**
 * MentorFigureCanvas — 老师档案行的手绘小人（纯装饰）。
 * visual rationale：账本档案行左侧加一枚纸卡小人，用 canvas 手绘线条区分性别与发型，呼应纸面编辑美学。
 * - 女：长发 / 短 Bob / 高马尾 / 发髻+眼镜，四种发型 + 及膝裙摆
 * - 男：短发 + T 恤长裤
 * 装饰性 canvas：aria-hidden + pointer-events-none，真实信息仍由姓名/职称 DOM 承载；
 * 动效仅为 10s 呼吸级轻晃 + 周期眨眼，reduced-motion 下只画静态帧。
 */
export function MentorFigureCanvas({ gender, variant = 0, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let running = !document.hidden;
    let visible = true;
    let dpr = 1;

    // CSS 尺寸固定 56x72，backing store = CSS × dpr（封顶 2），几何预留避免 CLS
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 56;
      const h = rect.height || 72;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      running = !document.hidden && visible;
      kick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        running = !document.hidden && visible;
        kick();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let tick: (now: number) => void = () => {};
    const kick = () => {
      if (reduceMotion) return;
      if (running) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    const drawFace = (cx: number, cy: number, r: number, bob: number, blink: boolean, glasses: boolean) => {
      // 脸
      ctx.fillStyle = "#fffffc";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy + bob, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 眼
      ctx.fillStyle = INK;
      ctx.strokeStyle = INK;
      if (blink) {
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 7, cy + bob);
        ctx.lineTo(cx - 2, cy + bob);
        ctx.moveTo(cx + 2, cy + bob);
        ctx.lineTo(cx + 7, cy + bob);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(cx - 4.5, cy + bob, 1.7, 0, Math.PI * 2);
        ctx.arc(cx + 4.5, cy + bob, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (glasses) {
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx - 4.5, cy + bob, 4.2, 0, Math.PI * 2);
        ctx.arc(cx + 4.5, cy + bob, 4.2, 0, Math.PI * 2);
        ctx.moveTo(cx - 0.3, cy + bob);
        ctx.lineTo(cx + 0.3, cy + bob);
        ctx.stroke();
      }
      // 笑
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy + 3.5 + bob, 4.6, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      // 腮红（女）
      if (gender === "female") {
        ctx.fillStyle = "rgba(2,132,199,0.28)";
        ctx.beginPath();
        ctx.arc(cx - 8, cy + 4 + bob, 2, 0, Math.PI * 2);
        ctx.arc(cx + 8, cy + 4 + bob, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawFemaleHairBack = (v: number, cx: number, cy: number, r: number, bob: number, sway: number) => {
      ctx.fillStyle = INK;
      ctx.strokeStyle = INK;
      if (v === 0) {
        // 长直发：脑后大片 + 两侧垂发
        ctx.beginPath();
        ctx.ellipse(cx + sway * 0.4, cy - 2 + bob, r + 6, r + 11, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (v === 1) {
        // 短 Bob：齐耳圆盖
        ctx.beginPath();
        ctx.arc(cx, cy - 3 + bob, r + 4.5, Math.PI * 0.95, Math.PI * 2.05);
        ctx.lineTo(cx + r + 4.5, cy + 6 + bob);
        ctx.quadraticCurveTo(cx, cy + 10 + bob, cx - r - 4.5, cy + 6 + bob);
        ctx.closePath();
        ctx.fill();
      } else if (v === 2) {
        // 高马尾：圆盖 + 右侧马尾
        ctx.beginPath();
        ctx.arc(cx, cy - 2 + bob, r + 4, Math.PI, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx + r - 1, cy - 8 + bob);
        ctx.quadraticCurveTo(cx + r + 10 + sway, cy + 2 + bob, cx + r + 4 + sway, cy + 14 + bob);
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.arc(cx + r + 4 + sway, cy + 15 + bob, 3.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 发髻：圆盖 + 顶部丸子
        ctx.beginPath();
        ctx.arc(cx, cy - 2 + bob, r + 3.5, Math.PI * 0.9, Math.PI * 2.1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + sway * 0.3, cy - r - 6 + bob, 5.5, 0, Math.PI * 2);
        ctx.fill();
        // 发簪点缀
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - r - 6 + bob);
        ctx.lineTo(cx + 7, cy - r - 5 + bob);
        ctx.stroke();
        ctx.strokeStyle = INK;
      }
    };

    const draw = (t: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 10s 呼吸级轻晃（低幅），reduced-motion 下 t 固定
      const bob = Math.sin((t * Math.PI * 2) / 10) * 1.3;
      const sway = Math.sin((t * Math.PI * 2) / 10 + 0.7) * 1.1;
      const blink = t % 3.8 < 0.12;
      const cx = w / 2;
      const v = ((variant % 4) + 4) % 4;

      // 地面小影
      ctx.fillStyle = "rgba(17,17,17,0.10)";
      ctx.beginPath();
      ctx.ellipse(cx, h - 6, 13 - bob * 0.6, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      if (gender === "male") {
        const headR = 10.5;
        const headY = 18;
        // 腿：长裤
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(cx - 3, 44 + bob);
        ctx.lineTo(cx - 5, h - 10);
        ctx.moveTo(cx + 3, 44 + bob);
        ctx.lineTo(cx + 6, h - 10);
        ctx.stroke();
        // 鞋
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.ellipse(cx - 6.5, h - 9, 4.6, 2.6, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 7.5, h - 9, 4.6, 2.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // 上衣：纸色 T 恤 + 墨线
        ctx.fillStyle = "#fffffc";
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 9, 30 + bob);
        ctx.lineTo(cx + 9, 30 + bob);
        ctx.lineTo(cx + 7, 46 + bob);
        ctx.lineTo(cx - 7, 46 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // 领口 + 胸前口袋线（克制）
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, 31 + bob, 3.4, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
        ctx.strokeStyle = ACCENT;
        ctx.beginPath();
        ctx.moveTo(cx - 7, 40 + bob);
        ctx.lineTo(cx + 7, 40 + bob);
        ctx.stroke();
        ctx.strokeStyle = INK;
        // 手臂
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(cx - 9, 33 + bob);
        ctx.lineTo(cx - 13 + sway * 0.5, 44 + bob);
        ctx.moveTo(cx + 9, 33 + bob);
        ctx.lineTo(cx + 13 + sway * 0.5, 44 + bob);
        ctx.stroke();
        // 短发：顶部墨盖
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.arc(cx, headY + bob, headR + 1.5, Math.PI * 1.02, Math.PI * 1.98);
        ctx.quadraticCurveTo(cx + 4, headY - 4 + bob, cx + headR - 1, headY + 1 + bob);
        ctx.lineTo(cx + headR - 4, headY - 1 + bob);
        ctx.quadraticCurveTo(cx, headY - 7 + bob, cx - headR + 3, headY - 0.5 + bob);
        ctx.closePath();
        ctx.fill();
        drawFace(cx, headY + 3, headR - 1.5, bob, blink, false);
      } else {
        const headR = 10.5;
        const headY = 17;
        drawFemaleHairBack(v, cx, headY + 3, headR, bob, sway);
        // 腿
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(cx - 3.5, 54 + bob);
        ctx.lineTo(cx - 4.5, h - 10);
        ctx.moveTo(cx + 3.5, 54 + bob);
        ctx.lineTo(cx + 4.5, h - 10);
        ctx.stroke();
        // 鞋：小黑皮鞋
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.ellipse(cx - 5.5, h - 9, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 5.5, h - 9, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
        // 裙：及膝 A 字裙，纸底墨线；v=1 给深色上衣，v=3 给蓝腰线作区分
        const skirtTop = 32 + bob;
        // 上身
        ctx.fillStyle = v === 1 ? INK : "#fffffc";
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 8, skirtTop);
        ctx.lineTo(cx + 8, skirtTop);
        ctx.lineTo(cx + 6.5, skirtTop + 12);
        ctx.lineTo(cx - 6.5, skirtTop + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // 裙摆
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        ctx.moveTo(cx - 6.5, skirtTop + 12);
        ctx.lineTo(cx + 6.5, skirtTop + 12);
        ctx.lineTo(cx + 11 + sway * 0.4, skirtTop + 26);
        ctx.lineTo(cx - 11 + sway * 0.4, skirtTop + 26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // 腰线
        ctx.strokeStyle = v === 1 ? PAPER : ACCENT;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 6.5, skirtTop + 12);
        ctx.lineTo(cx + 6.5, skirtTop + 12);
        ctx.stroke();
        ctx.strokeStyle = INK;
        // 手臂
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(cx - 8, skirtTop + 2);
        ctx.lineTo(cx - 11.5 + sway * 0.5, skirtTop + 12);
        ctx.moveTo(cx + 8, skirtTop + 2);
        ctx.lineTo(cx + 11.5 + sway * 0.5, skirtTop + 12);
        ctx.stroke();
        // 脸盖住发根
        drawFace(cx, headY + 3, headR - 1, bob, blink, v === 3);
        // 前发刘海线（v=0/1）
        if (v <= 1) {
          ctx.strokeStyle = INK;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(cx, headY + 1 + bob, headR - 1, Math.PI * 1.08, Math.PI * 1.92);
          ctx.stroke();
        }
      }
    };

    if (reduceMotion) {
      draw(0.6);
      return () => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    tick = (now: number) => {
      if (!running) return;
      draw(now / 1000);
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
  }, [gender, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        "pointer-events-none h-[72px] w-[56px] shrink-0 border border-black/10 bg-[#fffdf4] shadow-[2px_2px_0_rgba(17,17,17,0.08)] " +
        (className ?? "")
      }
    />
  );
}
