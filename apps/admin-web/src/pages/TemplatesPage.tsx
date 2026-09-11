import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Check,
  Code2,
  Layers,
  Play,
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
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

gsap.registerPlugin(useGSAP);

interface TemplateItem {
  id: string;
  title: string;
  version: string;
  description: string;
  fieldsCount: number;
  model: string;
  isDefault: boolean;
  schemaSample?: string;
}

const INITIAL_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl-1",
    title: "技术研发类简历抽取模板",
    version: "v2.1",
    description: "提取基本信息、教育背景、项目经历、技术栈标签、开源沉淀及 GitHub 链接。",
    fieldsCount: 16,
    model: "Qwen-2.5-72B-Instruct",
    isDefault: true,
    schemaSample: `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "contact": { "type": "string" },
    "skills": { "type": "array", "items": { "type": "string" } },
    "projects": { "type": "array" }
  },
  "required": ["name", "skills"]
}`,
  },
  {
    id: "tpl-2",
    title: "UI / UX 视觉与交互作品集解析",
    version: "v1.4",
    description: "支持 PDF 作品集多模态版面识别，提取 Figma 链接、设计系统熟练度、设计竞赛获奖经历。",
    fieldsCount: 12,
    model: "Qwen-VL-Max",
    isDefault: false,
    schemaSample: `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "portfolioUrl": { "type": "string" },
    "designTools": { "type": "array" }
  }
}`,
  },
  {
    id: "tpl-3",
    title: "通用学生社团 / 运营履历模板",
    version: "v1.0",
    description: "提取校园活动组织策划经历、学生会任职、飞书/表格协同技能与个人自述分析。",
    fieldsCount: 10,
    model: "Qwen-2.5-32B-Instruct",
    isDefault: false,
    schemaSample: `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "organizations": { "type": "array" },
    "leadership": { "type": "string" }
  }
}`,
  },
];

export function TemplatesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<TemplateItem[]>(INITIAL_TEMPLATES);
  const [activeSchemaModal, setActiveSchemaModal] = useState<TemplateItem | null>(null);
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newModel, setNewModel] = useState("Qwen-2.5-72B-Instruct");

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
    [templates.length]
  );

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: TemplateItem = {
      id: `tpl-${Date.now()}`,
      title: newTitle.trim(),
      version: "v1.0",
      description: newDesc.trim() || "自定义解析提取 Schema",
      fieldsCount: 8,
      model: newModel,
      isDefault: false,
      schemaSample: `{\n  "type": "object",\n  "properties": {}\n}`,
    };
    setTemplates((prev) => [...prev, item]);
    setIsNewTemplateOpen(false);
    setNewTitle("");
    setNewDesc("");
    setFeedback(`已创建新解析模板「${item.title}」`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSetDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
    setFeedback("已更新默认简历抽取模板");
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-tpl-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            简历解析模板库
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            配置不同专业组别的 Prompt 抽取规范、JSON Schema 约束及多模态模型参数
          </p>
        </div>
        <Button
          size="sm"
          onPress={() => setIsNewTemplateOpen(true)}
          className="gap-1.5 text-xs font-medium"
        >
          <Plus className="size-3.5" />
          新建解析模板
        </Button>
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300"
        >
          {feedback}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="anim-tpl-card flex flex-col justify-between border shadow-xs"
          >
            <CardHeader className="border-b p-5 pb-3.5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold leading-snug">
                  {tpl.title}
                </CardTitle>
                {tpl.isDefault ? (
                  <Badge variant="default" className="text-[10px]">
                    默认模板
                  </Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onPress={() => handleSetDefault(tpl.id)}
                    className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    设为默认
                  </Button>
                )}
              </div>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                版本 {tpl.version} · {tpl.model}
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
              <Button
                variant="ghost"
                size="xs"
                onPress={() => {
                  setFeedback(`已触发模板「${tpl.title}」沙箱回归测试`);
                  setTimeout(() => setFeedback(null), 3000);
                }}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Play className="size-3" />
                测试抽取效果
              </Button>
              <Button
                variant="outline"
                size="xs"
                onPress={() => setActiveSchemaModal(tpl)}
                className="gap-1 text-xs"
              >
                <Code2 className="size-3" />
                编辑 Schema
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Schema Editor Dialog */}
      <Dialog
        isOpen={Boolean(activeSchemaModal)}
        onOpenChange={(open) => !open && setActiveSchemaModal(null)}
        className="sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            编辑 JSON Schema 约束 · {activeSchemaModal?.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            指定大模型输出的字段名、数据类型与必填校验规则
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>模型: {activeSchemaModal?.model}</span>
            <span>版本: {activeSchemaModal?.version}</span>
          </div>
          <textarea
            rows={10}
            defaultValue={activeSchemaModal?.schemaSample || "{}"}
            className="w-full rounded-md border border-input bg-muted/30 p-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onPress={() => setActiveSchemaModal(null)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            size="sm"
            onPress={() => {
              setFeedback(`已成功保存「${activeSchemaModal?.title}」的 Schema 配置`);
              setActiveSchemaModal(null);
              setTimeout(() => setFeedback(null), 3000);
            }}
            className="gap-1.5 text-xs font-medium"
          >
            <Check className="size-3.5" />
            保存 Schema
          </Button>
        </DialogFooter>
      </Dialog>

      {/* New Template Dialog */}
      <Dialog isOpen={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">新建简历解析模板</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            为特定专业方向配置专属的 Prompt 与 Schema 映射
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateTemplate} className="mt-2 space-y-4">
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <Label htmlFor="tpl-title" className="text-xs">模板名称 *</Label>
              <Input
                id="tpl-title"
                placeholder="例如: 算法与深度学习方向抽取模板"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tpl-model" className="text-xs">解析执行大模型</Label>
              <select
                id="tpl-model"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Qwen-2.5-72B-Instruct">Qwen-2.5-72B-Instruct (高精度推荐)</option>
                <option value="Qwen-VL-Max">Qwen-VL-Max (支持多模态版面与图表)</option>
                <option value="Qwen-2.5-32B-Instruct">Qwen-2.5-32B-Instruct (极速响应)</option>
                <option value="DeepSeek-R1">DeepSeek-R1 (深度推理打分)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tpl-desc" className="text-xs">适用场景描述</Label>
              <textarea
                id="tpl-desc"
                rows={3}
                placeholder="描述该模板主要提取的简历维度和目标要求..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={() => setIsNewTemplateOpen(false)}
              className="text-xs"
            >
              取消
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 text-xs font-medium">
              <Check className="size-3.5" />
              创建模板
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
