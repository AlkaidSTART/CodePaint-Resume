import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Layers,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

gsap.registerPlugin(useGSAP);

export function TemplatesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const templates = [
    {
      id: "tpl-1",
      title: "技术研发类简历抽取模板",
      version: "v2.1",
      description: "提取基本信息、教育背景、项目经历、技术栈标签、开源沉淀及 GitHub 链接。",
      fieldsCount: 16,
      model: "Qwen-2.5-72B-Instruct",
      isDefault: true,
    },
    {
      id: "tpl-2",
      title: "UI / UX 视觉与交互作品集解析",
      version: "v1.4",
      description: "支持 PDF 作品集多模态版面识别，提取 Figma 链接、设计系统熟练度、设计竞赛获奖经历。",
      fieldsCount: 12,
      model: "Qwen-VL-Max",
      isDefault: false,
    },
    {
      id: "tpl-3",
      title: "通用学生社团 / 运营履历模板",
      version: "v1.0",
      description: "提取校园活动组织策划经历、学生会任职、飞书/表格协同技能与个人自述分析。",
      fieldsCount: 10,
      model: "Qwen-2.5-32B-Instruct",
      isDefault: false,
    },
  ];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-tpl-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-tpl-card", {
          opacity: 0,
          y: 8,
          duration: 0.28,
          stagger: 0.06,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    []
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-tpl-header flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
            <span>SCHEMA & PROMPTS</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            简历解析模板库
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            配置不同专业组别的 Prompt 抽取规范、JSON Schema 及多模态大模型参数
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs font-medium">
          <Plus className="size-3.5" />
          新建解析模板
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="anim-tpl-card flex flex-col justify-between border shadow-sm transition-all hover:shadow"
          >
            <CardHeader className="border-b p-5 pb-3.5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold leading-snug">
                  {tpl.title}
                </CardTitle>
                {tpl.isDefault && (
                  <Badge variant="default" className="text-[10px] font-mono">
                    DEFAULT
                  </Badge>
                )}
              </div>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                VERSION {tpl.version} · {tpl.model}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 text-xs text-muted-foreground">
              <p className="leading-relaxed">{tpl.description}</p>
              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-foreground font-medium">
                <Layers className="size-3.5 text-cyan-600" />
                <span>包含 {tpl.fieldsCount} 个结构化输出字段</span>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-3.5">
              <Button variant="ghost" size="xs" className="text-xs text-muted-foreground hover:text-foreground">
                测试抽取效果
              </Button>
              <Button variant="outline" size="xs" className="text-xs">
                编辑 Schema
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
