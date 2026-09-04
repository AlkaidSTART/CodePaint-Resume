import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/appStore";

interface IntroCurtainProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // 目标字母像素 X
  ty: number; // 目标字母像素 Y
  baseX: number;
  baseY: number;
  codeChar: string;
  size: number;
  baseAlpha: number;
  glow: boolean;
  colorType: "code" | "gold" | "ink";
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  phaseShift: number;
}

interface InkDrop {
  x: number;
  y: number;
  maxR: number;
  color: string;
  growthDelay: number;
  wobble: number[];
}

/**
 * 电影级慢热开屏：CodePaint 粒子重构、水墨相变与金粉厚涂油彩
 * - 沉稳优雅叙事节奏（~6.8s 完整体验，支持 ESC / SKIP 一键跳过）
 * - 纯黑 (#09090b) -> 浸润米白 (#F4F0EA) -> 纸白 (#FFFFFC)
 * - 结合 Code (代码流/准星/矩阵) 与 Paint (水墨扩散/金粉厚涂/手绘笔刷)
 */
export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [skipped, setSkipped] = useState(false);

  const setIntroProgress = useAppStore((state) => state.setIntroProgress);
  const setIntroDone = useAppStore((state) => state.setIntroDone);

  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const handleFinish = useCallback(() => {
    setIntroDone(true);
    completeRef.current();
  }, [setIntroDone]);

  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: handleFinish,
      });
    }
  }, [skipped, handleFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      handleFinish();
      return;
    }

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 采样 CodePaint 字体像素矩阵
    const sampleCodePaint = (width: number, height: number) => {
      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return { particles: [] as Particle[], bounds: { w: 0, h: 0, fontSize: 48 } };

      offCanvas.width = width;
      offCanvas.height = height;

      // 响应式字号
      const fontSize = Math.max(52, Math.min(width * 0.115, 124));
      offCtx.font = `700 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const text = "CodePaint";
      const cx = width / 2;
      const cy = height / 2 - 12;
      offCtx.fillText(text, cx, cy);

      const metrics = offCtx.measureText(text);
      const tw = metrics.width;
      const th = fontSize * 1.25;

      const startX = Math.max(0, Math.floor(cx - tw / 2 - 20));
      const startY = Math.max(0, Math.floor(cy - th / 2 - 10));
      const sampleW = Math.min(width - startX, Math.ceil(tw + 40));
      const sampleH = Math.min(height - startY, Math.ceil(th + 20));

      const imgData = offCtx.getImageData(startX, startY, sampleW, sampleH);
      const data = imgData.data;

      const codePool = [
        "0", "1", "<", ">", "/", "{", "}", ";", "x", "=", "#", "+", "•", "λ", "fn", "ctx", "let", "px", "0x",
      ];
      const particles: Particle[] = [];
      const step = width < 768 ? 6 : 5;

      for (let y = 0; y < sampleH; y += step) {
        for (let x = 0; x < sampleW; x += step) {
          const idx = (y * sampleW + x) * 4;
          if (data[idx + 3] > 100) {
            const targetX = startX + x;
            const targetY = startY + y;

            // 初始轨道与星尘分布
            const orbitR = Math.max(width, height) * (0.18 + Math.random() * 0.72);
            const orbitA = Math.random() * Math.PI * 2;
            const initX = cx + Math.cos(orbitA) * orbitR;
            const initY = cy + Math.sin(orbitA) * orbitR;

            const isGold = targetX > cx - tw * 0.08;
            const rnd = Math.random();

            particles.push({
              x: initX,
              y: initY,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              tx: targetX,
              ty: targetY,
              baseX: initX,
              baseY: initY,
              codeChar: codePool[Math.floor(Math.random() * codePool.length)],
              size: 7 + Math.random() * 5,
              baseAlpha: 0.25 + Math.random() * 0.75,
              glow: rnd > 0.85,
              colorType: isGold ? (rnd > 0.35 ? "gold" : "code") : rnd > 0.6 ? "code" : "ink",
              orbitRadius: orbitR,
              orbitAngle: orbitA,
              orbitSpeed: (0.15 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1),
              phaseShift: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      return { particles, bounds: { w: tw, h: th, fontSize } };
    };

    // 生成宣纸浸润水墨斑点
    const generateInkDrops = (cx: number, cy: number, w: number): InkDrop[] => {
      const drops: InkDrop[] = [];
      const count = 28;
      const goldTones = ["#FFB000", "#F59E0B", "#FCD34D"];
      const paperTones = ["#EFEAE1", "#E6DFD3", "#D8D0C0", "#222224"];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 60 + Math.random() * (w * 0.38);
        const wobble: number[] = [];
        for (let j = 0; j < 10; j++) {
          wobble.push(0.72 + Math.random() * 0.56);
        }
        drops.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * (dist * 0.65),
          maxR: 35 + Math.random() * 110,
          color: i % 5 === 0 ? goldTones[i % goldTones.length] : paperTones[i % paperTones.length],
          growthDelay: Math.random() * 0.3,
          wobble,
        });
      }
      return drops;
    };

    let { particles, bounds } = sampleCodePaint(w, h);
    let inkDrops = generateInkDrops(w / 2, h / 2, w);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sampled = sampleCodePaint(w, h);
      particles = sampled.particles;
      bounds = sampled.bounds;
      inkDrops = generateInkDrops(w / 2, h / 2, w);
    };

    resize();
    window.addEventListener("resize", resize);

    // 动画状态驱动器 (GSAP 平滑插值驱动)
    const anim = {
      bgProgress: 0,        // 0(黑 #09090b) -> 0.5(米白 #F4F0EA) -> 1.0(纸白 #FFFFFC)
      nebulaIntensity: 0.1, // 0~1 代码星云微光与流动速度
      inkDiffusion: 0,      // 0~1 水墨晕染与纸面浸润
      particleAttract: 0,   // 0~1 粒子向字形结晶汇聚动力
      brushStroke: 0,       // 0~1 暖金油彩厚涂毛刷横扫
      crystallization: 0,   // 0~1 实体字体锐化显影
      hudOpacity: 0,        // 0~1 极客准星与工程刻度
      finalAura: 0,         // 0~1 最终呼吸光晕
    };

    let rafId = 0;
    let lastTime = performance.now();

    // 主渲染循环
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const t = time / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2 - 10;
      const p = anim.bgProgress;

      // 1. 电影级背景连续插值：深邃黑 (#09090b) -> 温润米白 (#F4F0EA) -> 纸白 (#FFFFFC)
      let r = 9, g = 9, b = 11;
      if (p <= 0.5) {
        const k = p / 0.5;
        r = 9 + (244 - 9) * k;
        g = 9 + (240 - 9) * k;
        b = 11 + (234 - 11) * k;
      } else {
        const k = (p - 0.5) / 0.5;
        r = 244 + (255 - 244) * k;
        g = 240 + (255 - 240) * k;
        b = 234 + (252 - 234) * k;
      }
      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      ctx.fillRect(0, 0, w, h);

      const isLightBg = p > 0.42;

      // 2. 暗夜极客星轨与工程网格
      if (p < 0.6) {
        ctx.save();
        const gridAlpha = (1 - p / 0.6) * 0.12;
        ctx.strokeStyle = `rgba(255, 255, 255, ${gridAlpha})`;
        ctx.lineWidth = 1;
        const gridStep = 56;
        for (let gx = (cx % gridStep); gx < w; gx += gridStep) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = (cy % gridStep); gy < h; gy += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }

        // 中心流光射线 (沉浸氛围)
        const rayCount = 6;
        for (let i = 0; i < rayCount; i++) {
          const angle = t * 0.18 + (i * Math.PI * 2) / rayCount;
          const rayLen = Math.max(w, h) * 0.7;
          const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
          grad.addColorStop(0, "rgba(255, 176, 0, 0.08)");
          grad.addColorStop(0.4, "rgba(0, 255, 140, 0.02)");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, rayLen, angle - 0.12, angle + 0.12);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. 水墨晕染与宣纸浸润 (Ink Diffusion)
      if (anim.inkDiffusion > 0.01) {
        ctx.save();
        inkDrops.forEach((d) => {
          const progress = Math.max(0, Math.min(1, (anim.inkDiffusion - d.growthDelay) / (1 - d.growthDelay)));
          if (progress <= 0) return;

          const currR = d.maxR * progress;
          ctx.fillStyle = d.color;
          ctx.globalAlpha = (1 - progress * 0.3) * (1 - anim.crystallization * 0.88) * 0.32;

          ctx.beginPath();
          const pts = d.wobble;
          for (let i = 0; i < pts.length; i++) {
            const angle = (i / pts.length) * Math.PI * 2;
            const rOffset = currR * pts[i];
            const px = d.x + Math.cos(angle) * rOffset;
            const py = d.y + Math.sin(angle) * rOffset;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // 4. 金粉油彩厚涂笔刷横扫 (Paint Sweep)
      if (anim.brushStroke > 0.01) {
        ctx.save();
        const strokeW = bounds.w * 0.52;
        const strokeH = bounds.h * 0.68;
        const sweepProgress = anim.brushStroke;

        ctx.translate(cx + bounds.w * 0.19, cy + 2);
        ctx.rotate(-0.04);

        // 油画肌理多重多层笔触
        const layers = [
          { color: "rgba(255, 176, 0, 0.95)", yOff: 0, hScale: 1.0 },
          { color: "rgba(245, 158, 11, 0.85)", yOff: -6, hScale: 0.7 },
          { color: "rgba(254, 240, 138, 0.4)", yOff: 8, hScale: 0.4 },
        ];

        layers.forEach((l) => {
          ctx.fillStyle = l.color;
          const curW = strokeW * Math.min(1, sweepProgress * 1.15);
          ctx.fillRect(-strokeW / 2, -strokeH / 2 + l.yOff, curW, strokeH * l.hScale);
        });

        // 笔刷尾部飞白噪点
        if (sweepProgress > 0.3) {
          ctx.fillStyle = "#FFB000";
          for (let k = 0; k < 12; k++) {
            const fx = strokeW * sweepProgress - strokeW / 2 + (k * 4);
            const fy = (Math.random() - 0.5) * strokeH * 0.9;
            ctx.fillRect(fx, fy, 4 + Math.random() * 8, 2);
          }
        }

        ctx.restore();
      }

      // 5. 物理字符粒子系统动力学
      if (particles.length > 0) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const attract = anim.particleAttract;

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];

          if (attract <= 0.001) {
            // 暗夜旋转星轨漂浮
            pt.orbitAngle += pt.orbitSpeed * dt * anim.nebulaIntensity;
            const rad = pt.orbitRadius + Math.sin(t * 1.5 + pt.phaseShift) * 16;
            pt.x = cx + Math.cos(pt.orbitAngle) * rad;
            pt.y = cy + Math.sin(pt.orbitAngle) * (rad * 0.6);
          } else {
            // 引力透镜吸引与弹簧阻尼收敛至字符像素目标点
            const targetX = pt.tx;
            const targetY = pt.ty;
            const spring = 9.8 * attract;
            const damping = 0.78;

            const dx = targetX - pt.x;
            const dy = targetY - pt.y;

            pt.vx = (pt.vx + dx * spring * dt) * damping;
            pt.vy = (pt.vy + dy * spring * dt) * damping;

            pt.x += pt.vx * dt * 60;
            pt.y += pt.vy * dt * 60;
          }

          // 粒子渲染与颜色演进
          const particleAlpha = (1 - anim.crystallization * 0.92) * pt.baseAlpha;
          if (particleAlpha > 0.02) {
            let fillColor = "#00FF66";
            if (isLightBg) {
              if (pt.colorType === "gold") fillColor = "#FFB000";
              else if (attract > 0.6) fillColor = "#111111";
              else fillColor = "#555555";
            } else {
              if (pt.colorType === "gold") fillColor = "#FFB000";
              else if (pt.glow) fillColor = "#FFFFFF";
              else fillColor = "#38BDF8";
            }

            ctx.font = `600 ${pt.size}px "SF Mono", Consolas, monospace`;
            ctx.fillStyle = fillColor;
            ctx.globalAlpha = particleAlpha;
            ctx.fillText(pt.codeChar, pt.x, pt.y);

            // 高亮粒子微型发光晶格连线
            if (pt.glow && i % 8 === 0 && attract > 0.2 && attract < 0.9) {
              const nextPt = particles[(i + 13) % particles.length];
              const dist = Math.hypot(pt.x - nextPt.x, pt.y - nextPt.y);
              if (dist < 80) {
                ctx.strokeStyle = isLightBg ? "rgba(17,17,17,0.15)" : "rgba(255,255,255,0.2)";
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(nextPt.x, nextPt.y);
                ctx.stroke();
              }
            }
          }
        }
        ctx.restore();
      }

      // 6. 高清实体文字定格 (Crystallization)
      if (anim.crystallization > 0.01) {
        ctx.save();
        const fontSize = bounds.fontSize;
        ctx.font = `700 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#111111";
        ctx.globalAlpha = anim.crystallization;
        ctx.fillText("CodePaint", cx, cy);

        // 工坊副标印章
        ctx.font = "600 11px monospace";
        ctx.letterSpacing = "0.26em";
        ctx.fillStyle = "rgba(17, 17, 17, 0.65)";
        ctx.fillText("ENGINEERING & CREATIVE ATELIER", cx, cy + fontSize * 0.72);
        ctx.restore();
      }

      // 7. 极客工程准星、坐标 HUD 与校准微标尺
      if (anim.hudOpacity > 0.02) {
        ctx.save();
        ctx.strokeStyle = isLightBg ? "rgba(17, 17, 17, 0.35)" : "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = anim.hudOpacity;

        const cross = 14;
        const hudW = bounds.w / 2 + 48;
        const hudH = 58;
        const corners = [
          [cx - hudW, cy - hudH],
          [cx + hudW, cy - hudH],
          [cx - hudW, cy + hudH],
          [cx + hudW, cy + hudH],
        ];

        corners.forEach(([px, py]) => {
          ctx.beginPath();
          ctx.moveTo(px - cross, py);
          ctx.lineTo(px + cross, py);
          ctx.moveTo(px, py - cross);
          ctx.lineTo(px, py + cross);
          ctx.stroke();
        });

        // 顶部微标尺线
        ctx.beginPath();
        ctx.moveTo(cx - hudW, cy - hudH);
        ctx.lineTo(cx + hudW, cy - hudH);
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "9px monospace";
        ctx.fillStyle = isLightBg ? "rgba(17, 17, 17, 0.5)" : "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.fillText("SYS.REV // 2026", cx + hudW, cy - hudH - 8);
        ctx.textAlign = "left";
        ctx.fillText("ATELIER // ACTIVE", cx - hudW, cy + hudH + 16);
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // GSAP 电影级时间轴节奏编排 (总时长 ~6.8s，沉稳而惊艳)
    const tl = gsap.timeline({
      onComplete: handleFinish,
    });

    // Chapter 1: 代码暗夜微光漫游 (0s ~ 1.8s)
    tl.to(anim, {
      nebulaIntensity: 1.0,
      duration: 1.8,
      ease: "power1.out",
    }, 0)

    // Chapter 2: 引力启动、水墨相变、背景从纯黑晕染至温润米白 (1.8s ~ 3.6s)
    .to(anim, {
      particleAttract: 0.7,
      duration: 1.8,
      ease: "power2.inOut",
    }, "phase1")
    .to(anim, {
      bgProgress: 0.52,
      inkDiffusion: 1.0,
      hudOpacity: 0.85,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => setIntroProgress(anim.bgProgress),
    }, "phase1+=0.2")

    // Chapter 3: 黄金笔刷横扫、粒子结晶锁紧、升华至纯净纸白 (3.6s ~ 5.4s)
    .to(anim, {
      particleAttract: 1.0,
      brushStroke: 1.0,
      crystallization: 1.0,
      bgProgress: 1.0,
      hudOpacity: 1.0,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => setIntroProgress(anim.bgProgress),
    }, "phase2")

    // Chapter 4: 荣耀定格与呼吸光圈停留 (5.4s ~ 6.5s)
    .to(anim, {
      finalAura: 1.0,
      duration: 1.1,
      ease: "none",
    })

    // Chapter 5: 柔焦开幕，无缝交接给 VideoHero (6.5s ~ 7.2s)
    .to(container, {
      opacity: 0,
      scale: 1.035,
      duration: 0.65,
      ease: "power2.inOut",
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      tl.kill();
    };
  }, [handleFinish, handleSkip, setIntroProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden bg-[#09090b] select-none"
      aria-label="CodePaint 启幕动画"
      role="dialog"
      aria-modal="true"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={handleSkip}
        className="font-mono2 absolute top-6 right-6 z-20 cursor-pointer rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-xs text-white/70 backdrop-blur-md transition-all hover:border-white/60 hover:text-white active:scale-95"
      >
        SKIP [ESC]
      </button>
    </div>
  );
}
