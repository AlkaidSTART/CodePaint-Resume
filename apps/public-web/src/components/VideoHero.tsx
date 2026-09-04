import { useEffect, useRef } from "react";

/**
 * VideoHero — canvas 动画骨架（内容已清空）
 * 设计 rationale：一屏预留几何 + 全幅 decorative canvas，后续 procedural 动画在此绘制。
 */
export function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let running = true;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    window.addEventListener("resize", resize);

    let last = performance.now();

    // tick 占位声明（onVisibility 闭包引用）
    let tick: (now: number) => void = () => {};

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduceMotion) {
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // reduced-motion：仅渲染一帧静态底（透明清空），不启动循环
    if (reduceMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    tick = (now: number) => {
      if (!running) return;
      const elapsed = (now - last) / 1000; // 供后续动画使用
      last = now;
      void elapsed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // TODO(canvas): 在此绘制动画帧 — ctx / canvas.width / canvas.height / _elapsed
      // 约束：transform+opacity 为主，避免重排；对象数按视口收敛；禁止通用星空/粒子网/光球/鼠标拖尾。

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-screen min-h-[600px] w-full overflow-hidden"
      aria-label="Hero canvas"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </section>
  );
}
