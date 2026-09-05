import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useAppStore } from "../../store/appStore";

interface IntroCurtainProps {
  onComplete: () => void;
}

interface CodeToken {
  t: string;
  c: string; // color
}

interface CodeBlock {
  id: string;
  lang: "TypeScript" | "Go" | "Rust" | "Binary";
  fileName: string;
  relX: number; // 相对中心偏移系数 (-1 ~ 1)
  relY: number;
  w: number;
  h: number;
  lines: Array<{ lineNum: number; tokens: CodeToken[] }>;
  floatPhase: number;
  scale: number;
  rotation: number;
}

interface InkSplatter {
  x: number;
  y: number;
  maxR: number;
  color: string;
  delay: number;
  points: number[];
}

/**
 * 电影级慢热开屏：TS / Go / Rust / Binary 实体代码窗口 -> 慢镜头柔缓引力挤压消融 -> 宣纸水墨晕染 -> 暖金油彩厚涂 -> CodePaint 定格
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

    // 预设真实工程代码块数据
    const CODE_BLOCKS: CodeBlock[] = [
      {
        id: "ts",
        lang: "TypeScript",
        fileName: "render.engine.ts",
        relX: -0.32,
        relY: -0.26,
        w: 380,
        h: 210,
        rotation: -2,
        floatPhase: 0,
        scale: 1,
        lines: [
          {
            lineNum: 1,
            tokens: [
              { t: "interface ", c: "#C084FC" },
              { t: "AtelierContext", c: "#38BDF8" },
              { t: " {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 2,
            tokens: [
              { t: "  readonly ", c: "#C084FC" },
              { t: "canvas", c: "#F8FAFC" },
              { t: ": ", c: "#94A3B8" },
              { t: "HTMLCanvasElement", c: "#38BDF8" },
              { t: ";", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 3,
            tokens: [
              { t: "  readonly ", c: "#C084FC" },
              { t: "palette", c: "#F8FAFC" },
              { t: ": ", c: "#94A3B8" },
              { t: "Record<", c: "#38BDF8" },
              { t: "string, Color", c: "#F8FAFC" },
              { t: ">;", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 4,
            tokens: [{ t: "}", c: "#94A3B8" }],
          },
          {
            lineNum: 5,
            tokens: [
              { t: "export const ", c: "#C084FC" },
              { t: "paint", c: "#FACC15" },
              { t: " = ", c: "#94A3B8" },
              { t: "async ", c: "#C084FC" },
              { t: "() => {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 6,
            tokens: [
              { t: "  await ", c: "#C084FC" },
              { t: "pipeline.", c: "#F8FAFC" },
              { t: "dispatch", c: "#FACC15" },
              { t: "({ ", c: "#94A3B8" },
              { t: "mode: ", c: "#38BDF8" },
              { t: "\"impasto\"", c: "#4ADE80" },
              { t: " });", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 7,
            tokens: [{ t: "};", c: "#94A3B8" }],
          },
        ],
      },
      {
        id: "rust",
        lang: "Rust",
        fileName: "rasterizer.rs",
        relX: 0.33,
        relY: -0.22,
        w: 390,
        h: 220,
        rotation: 2.2,
        floatPhase: 1.5,
        scale: 1,
        lines: [
          {
            lineNum: 1,
            tokens: [
              { t: "pub struct ", c: "#F97316" },
              { t: "ImpastoBrush", c: "#38BDF8" },
              { t: " {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 2,
            tokens: [
              { t: "    buffer: ", c: "#94A3B8" },
              { t: "Arc", c: "#38BDF8" },
              { t: "<", c: "#94A3B8" },
              { t: "Mutex", c: "#38BDF8" },
              { t: "<Vec<u8>>>", c: "#94A3B8" },
              { t: ",", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 3,
            tokens: [
              { t: "    pub tension: ", c: "#94A3B8" },
              { t: "f32", c: "#F97316" },
              { t: ",", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 4,
            tokens: [{ t: "}", c: "#94A3B8" }],
          },
          {
            lineNum: 5,
            tokens: [
              { t: "impl ", c: "#F97316" },
              { t: "ImpastoBrush", c: "#38BDF8" },
              { t: " {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 6,
            tokens: [
              { t: "    pub fn ", c: "#F97316" },
              { t: "blend_stroke", c: "#FACC15" },
              { t: "(&mut self) {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 7,
            tokens: [
              { t: "        unsafe { self.simd_blend(); }", c: "#4ADE80" },
            ],
          },
          {
            lineNum: 8,
            tokens: [{ t: "    }", c: "#94A3B8" }, { t: " }", c: "#94A3B8" }],
          },
        ],
      },
      {
        id: "go",
        lang: "Go",
        fileName: "stream.go",
        relX: -0.30,
        relY: 0.28,
        w: 370,
        h: 210,
        rotation: 1.5,
        floatPhase: 3.2,
        scale: 1,
        lines: [
          {
            lineNum: 1,
            tokens: [
              { t: "package ", c: "#00ADD8" },
              { t: "atelier", c: "#F8FAFC" },
            ],
          },
          {
            lineNum: 2,
            tokens: [
              { t: "func ", c: "#00ADD8" },
              { t: "StreamFrames", c: "#FACC15" },
              { t: "(ctx ", c: "#94A3B8" },
              { t: "context.Context", c: "#38BDF8" },
              { t: ") <-chan ", c: "#00ADD8" },
              { t: "Frame {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 3,
            tokens: [
              { t: "	out := ", c: "#94A3B8" },
              { t: "make", c: "#00ADD8" },
              { t: "(chan Frame, 64)", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 4,
            tokens: [
              { t: "	go func() {", c: "#00ADD8" },
            ],
          },
          {
            lineNum: 5,
            tokens: [
              { t: "		defer ", c: "#00ADD8" },
              { t: "close(out)", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 6,
            tokens: [
              { t: "		for f := range worker.Sync() {", c: "#94A3B8" },
            ],
          },
          {
            lineNum: 7,
            tokens: [
              { t: "			out <- f", c: "#4ADE80" },
            ],
          },
          {
            lineNum: 8,
            tokens: [{ t: "		}", c: "#94A3B8" }, { t: " }()", c: "#00ADD8" }, { t: " return out", c: "#94A3B8" }],
          },
        ],
      },
      {
        id: "bin",
        lang: "Binary",
        fileName: "core_dump.hex",
        relX: 0.31,
        relY: 0.29,
        w: 390,
        h: 200,
        rotation: -2.4,
        floatPhase: 4.8,
        scale: 1,
        lines: [
          {
            lineNum: 1,
            tokens: [
              { t: "0000: ", c: "#64748B" },
              { t: "436f 6465 5061 696e", c: "#4ADE80" },
              { t: " | CodePain", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 2,
            tokens: [
              { t: "0010: ", c: "#64748B" },
              { t: "7420 5374 7564 696f", c: "#4ADE80" },
              { t: " | t Studio", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 3,
            tokens: [
              { t: "0020: ", c: "#64748B" },
              { t: "2045 6e67 696e 6565", c: "#FACC15" },
              { t: " |  Enginee", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 4,
            tokens: [
              { t: "0030: ", c: "#64748B" },
              { t: "7269 6e67 2026 2041", c: "#FACC15" },
              { t: " | ring & A", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 5,
            tokens: [
              { t: "0040: ", c: "#64748B" },
              { t: "7465 6c69 6572 2100", c: "#F43F5E" },
              { t: " | telier!.", c: "#38BDF8" },
            ],
          },
          {
            lineNum: 6,
            tokens: [
              { t: "0050: ", c: "#64748B" },
              { t: "00ff b000 ffff fcfc", c: "#FFB000" },
              { t: " | ........", c: "#94A3B8" },
            ],
          },
        ],
      },
    ];

    // 水墨晕染斑点
    const generateInkSplatters = (cx: number, cy: number, width: number): InkSplatter[] => {
      const list: InkSplatter[] = [];
      const count = 30;
      const palette = ["#FFB000", "#F59E0B", "#E4DEC9", "#262626", "#D5CEBD"];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 50 + Math.random() * (width * 0.35);
        const pts = [];
        for (let j = 0; j < 9; j++) {
          pts.push(0.72 + Math.random() * 0.55);
        }
        list.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * (dist * 0.65),
          maxR: 40 + Math.random() * 100,
          color: palette[i % palette.length],
          delay: Math.random() * 0.3,
          points: pts,
        });
      }
      return list;
    };

    let inkSplatters = generateInkSplatters(w / 2, h / 2, w);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      inkSplatters = generateInkSplatters(w / 2, h / 2, w);
    };
    resize();
    window.addEventListener("resize", resize);

    // 动画状态驱动器
    const anim = {
      bgProgress: 0,        // 0(黑 #09090b) -> 0.5(米白 #F4F0EA) -> 1.0(纸白 #FFFFFC)
      codeEntrance: 0,      // 0~1 代码块入场浮现与呼吸
      squeezeProgress: 0,   // 0~1 慢速柔缓引力挤压消融进度
      inkWash: 0,           // 0~1 水墨晕染
      brushSweep: 0,        // 0~1 金粉厚涂油彩横扫
      logoAlpha: 0,         // 0~1 CodePaint 定格
      hudAlpha: 0,          // 0~1 极客准星与印章
    };

    let rafId = 0;

    const render = (time: number) => {
      const t = time / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      const p = anim.bgProgress;

      // 1. 背景色连续插值：纯黑 (#09090b) -> 温润米白 (#F4F0EA) -> 纯净纸白 (#FFFFFC)
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

      // 2. 暗黑代码空间极客网格与光芒
      if (p < 0.6) {
        ctx.save();
        const gridAlpha = (1 - p / 0.6) * 0.09;
        ctx.strokeStyle = `rgba(255, 255, 255, ${gridAlpha})`;
        ctx.lineWidth = 1;
        const step = 56;
        for (let gx = cx % step; gx < w; gx += step) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = cy % step; gy < h; gy += step) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. 实体代码块窗口渲染与慢镜头引力挤压动力学
      const sq = anim.squeezeProgress; // 0 -> 1
      const codeBlockAlpha = anim.codeEntrance * (1 - sq * 0.95);

      if (codeBlockAlpha > 0.01) {
        ctx.save();

        CODE_BLOCKS.forEach((block) => {
          // 悬浮晃动
          const floatY = Math.sin(t * 1.5 + block.floatPhase) * 6;
          const floatRot = Math.sin(t * 1.1 + block.floatPhase) * 0.5;

          // 慢速引力挤压：中心吸引 + 尺寸向中心坍缩 + 旋转收敛
          const origX = cx + block.relX * (w * 0.65);
          const origY = cy + block.relY * (h * 0.60);

          const curX = origX + (cx - origX) * sq;
          const curY = origY + (cy - origY) * sq + floatY * (1 - sq);

          const curScale = (1 - sq * 0.78) * (Math.min(w / 1200, 1) * 0.95);
          const curRot = (block.rotation + floatRot) * (1 - sq);

          ctx.save();
          ctx.translate(curX, curY);
          ctx.rotate((curRot * Math.PI) / 180);
          ctx.scale(curScale, curScale);
          ctx.globalAlpha = codeBlockAlpha;

          const bw = block.w;
          const bh = block.h;
          const bx = -bw / 2;
          const by = -bh / 2;

          // 窗口阴影与背板
          ctx.shadowColor = isLightBg ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 255, 140, 0.08)";
          ctx.shadowBlur = 28;
          ctx.shadowOffsetY = 12;

          ctx.fillStyle = isLightBg ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 17, 23, 0.88)";
          ctx.strokeStyle = isLightBg ? "rgba(17, 17, 17, 0.1)" : "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1;

          // 圆角矩形窗体
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 10);
          ctx.fill();
          ctx.stroke();

          // 重置阴影
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          // 窗口顶栏与 Traffic lights
          ctx.fillStyle = isLightBg ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, 28, [10, 10, 0, 0]);
          ctx.fill();

          const dotY = by + 14;
          const dots = ["#EF4444", "#EAB308", "#22C55E"];
          dots.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(bx + 14 + i * 11, dotY, 3.8, 0, Math.PI * 2);
            ctx.fill();
          });

          // 文件名标签
          ctx.font = "600 10.5px monospace";
          ctx.fillStyle = isLightBg ? "#475569" : "#94A3B8";
          ctx.textAlign = "center";
          ctx.fillText(block.fileName, 0, dotY + 3.5);

          // 语言徽章
          ctx.font = "700 9px monospace";
          ctx.fillStyle = isLightBg ? "rgba(17,17,17,0.4)" : "rgba(255,255,255,0.4)";
          ctx.textAlign = "right";
          ctx.fillText(block.lang.toUpperCase(), bx + bw - 12, dotY + 3.5);

          // 代码行渲染 (带行号与语法高亮)
          let lineY = by + 46;
          const lineHeight = 19.5;

          block.lines.forEach((line) => {
            // 行号
            ctx.font = "11px monospace";
            ctx.fillStyle = isLightBg ? "#94A3B8" : "#475569";
            ctx.textAlign = "right";
            ctx.fillText(String(line.lineNum), bx + 24, lineY);

            // Tokens
            let tokenX = bx + 36;
            ctx.textAlign = "left";
            line.tokens.forEach((token) => {
              ctx.fillStyle = isLightBg && token.c === "#F8FAFC" ? "#0F172A" : token.c;
              ctx.fillText(token.t, tokenX, lineY);
              tokenX += ctx.measureText(token.t).width;
            });

            lineY += lineHeight;
          });

          ctx.restore();
        });

        ctx.restore();
      }

      // 4. 挤压相变：宣纸水墨浸润晕染 (Ink Wash)
      if (anim.inkWash > 0.01) {
        ctx.save();
        inkSplatters.forEach((s) => {
          const progress = Math.max(0, Math.min(1, (anim.inkWash - s.delay) / (1 - s.delay)));
          if (progress <= 0) return;

          const currR = s.maxR * progress;
          ctx.fillStyle = s.color;
          ctx.globalAlpha = (1 - progress * 0.28) * (1 - anim.logoAlpha * 0.85) * 0.35;

          ctx.beginPath();
          const pts = s.points;
          for (let i = 0; i < pts.length; i++) {
            const angle = (i / pts.length) * Math.PI * 2;
            const rOffset = currR * pts[i];
            const px = s.x + Math.cos(angle) * rOffset;
            const py = s.y + Math.sin(angle) * rOffset;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // 5. 暖金厚涂油彩横扫 (Impasto Brush Sweep)
      if (anim.brushSweep > 0.01) {
        ctx.save();
        const fontSize = Math.max(52, Math.min(w * 0.115, 120));
        const bannerW = fontSize * 3.8;
        const bannerH = fontSize * 0.68;
        const sweepW = bannerW * anim.brushSweep;

        ctx.translate(cx + fontSize * 0.65, cy + 2);
        ctx.rotate(-0.04);

        // 多层油彩质感
        ctx.fillStyle = "#FFB000";
        ctx.fillRect(-bannerW / 2, -bannerH / 2, sweepW, bannerH);

        ctx.fillStyle = "rgba(245, 158, 11, 0.75)";
        ctx.fillRect(-bannerW / 2, -bannerH / 2 + 5, sweepW * 0.95, bannerH * 0.6);

        // 飞白肌理
        if (anim.brushSweep > 0.3) {
          ctx.fillStyle = "#FCD34D";
          for (let k = 0; k < 10; k++) {
            const fx = sweepW - bannerW / 2 + k * 4;
            const fy = (Math.random() - 0.5) * bannerH * 0.8;
            ctx.fillRect(fx, fy, 6, 2);
          }
        }

        ctx.restore();
      }

      // 6. CodePaint 核心品牌定格
      if (anim.logoAlpha > 0.01) {
        ctx.save();
        const fontSize = Math.max(52, Math.min(w * 0.115, 120));
        ctx.font = `700 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#111111";
        ctx.globalAlpha = anim.logoAlpha;
        ctx.fillText("CodePaint", cx, cy - 8);

        // 工坊副标印章
        ctx.font = "600 11px monospace";
        ctx.letterSpacing = "0.26em";
        ctx.fillStyle = "rgba(17, 17, 17, 0.68)";
        ctx.fillText("ENGINEERING & CREATIVE ATELIER", cx, cy + fontSize * 0.70);
        ctx.restore();
      }

      // 7. 极客工程准星与 HUD
      if (anim.hudAlpha > 0.02) {
        ctx.save();
        ctx.strokeStyle = isLightBg ? "rgba(17, 17, 17, 0.35)" : "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = anim.hudAlpha;

        const fontSize = Math.max(52, Math.min(w * 0.115, 120));
        const cross = 14;
        const hudW = fontSize * 2.7;
        const hudH = fontSize * 0.62;
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

    // GSAP 电影级时间轴节奏编排 (代码块展示 -> 慢速挤压消融 -> 水墨晕染 -> 油彩显现)
    const tl = gsap.timeline({
      onComplete: handleFinish,
    });

    // Chapter 1: 真实 TS / Go / Rust / Binary 代码块优雅浮现 (0s ~ 2.4s)
    tl.to(anim, {
      codeEntrance: 1.0,
      duration: 1.8,
      ease: "power2.out",
    }, 0)

    // Chapter 2: 柔缓慢镜头引力挤压：代码块向中心平滑收缩坍缩，背景从深黑晕染至米白 (2.4s ~ 5.2s)
    .to(anim, {
      squeezeProgress: 1.0,
      duration: 2.8,
      ease: "power2.inOut",
    }, "squeeze")
    .to(anim, {
      bgProgress: 0.52,
      inkWash: 1.0,
      hudAlpha: 0.85,
      duration: 2.6,
      ease: "sine.inOut",
      onUpdate: () => setIntroProgress(anim.bgProgress),
    }, "squeeze+=0.3")

    // Chapter 3: 黄金笔刷横扫、CodePaint 锐利显影、过渡至纯净纸白 (5.2s ~ 6.8s)
    .to(anim, {
      brushSweep: 1.0,
      logoAlpha: 1.0,
      bgProgress: 1.0,
      hudAlpha: 1.0,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => setIntroProgress(anim.bgProgress),
    }, "crystallize")

    // Chapter 4: 荣耀定格停留 (6.8s ~ 7.5s)
    .to({}, { duration: 0.7 })

    // Chapter 5: 柔焦开幕，无缝交接给 VideoHero (7.5s ~ 8.1s)
    .to(container, {
      opacity: 0,
      scale: 1.035,
      duration: 0.6,
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
