import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  BriefcaseBusiness,
  Check,
  Edit2,
  Plus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

interface RoleItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  capacity: number;
  description: string;
  tags: string[];
  status: "open" | "paused";
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "r1",
    name: "大前端项目组",
    slug: "frontend",
    count: 18,
    capacity: 6,
    description: "负责 CodePaint 核心 Web 与全栈跨端产品研发，沉淀高质量设计系统与组件库。",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "Vite"],
    status: "open",
  },
  {
    id: "r2",
    name: "UI / UX 设计项目组",
    slug: "ui-ux",
    count: 12,
    capacity: 4,
    description: "主导设计语言升级、高保真原型交互构筑及品牌多媒体视觉资产规范。",
    tags: ["Figma", "Design System", "Motion", "用户调研"],
    status: "open",
  },
  {
    id: "r3",
    name: "办公室运营与策划组",
    slug: "office",
    count: 9,
    capacity: 3,
    description: "统筹技术沙龙、迎新破冰、团队知识库协同与对外开发者关系拓展。",
    tags: ["飞书多维表格", "活动策划", "知识沉淀", "团队协同"],
    status: "open",
  },
  {
    id: "r4",
    name: "后端与云原生架构组",
    slug: "backend",
    count: 14,
    capacity: 5,
    description: "负责高并发分布式微服务、PostgreSQL 集群优化、LLM 异步推理管线架构。",
    tags: ["Go", "Gin", "PostgreSQL", "Docker", "K8s"],
    status: "open",
  },
];

export function RolesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCapacity, setFormCapacity] = useState("5");
  const [formDesc, setFormDesc] = useState("");
  const [formTags, setFormTags] = useState("");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-roles-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-role-card", {
          opacity: 0,
          y: 8,
          duration: 0.28,
          stagger: 0.06,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    { dependencies: [roles.length] }
  );

  const toggleStatus = (id: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "open" ? "paused" : "open" } : r
      )
    );
  };

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormName("");
    setFormSlug("");
    setFormCapacity("5");
    setFormDesc("");
    setFormTags("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (role: RoleItem) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormSlug(role.slug);
    setFormCapacity(String(role.capacity));
    setFormDesc(role.description);
    setFormTags(role.tags.join(" "));
    setIsCreateOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: formName.trim(),
                slug: formSlug.trim() || r.slug,
                capacity: Number(formCapacity) || r.capacity,
                description: formDesc.trim(),
                tags: formTags.split(/[,， ]+/).filter(Boolean),
              }
            : r
        )
      );
      setFeedback(`已更新岗位「${formName}」配置`);
    } else {
      const newRole: RoleItem = {
        id: `r-${Date.now()}`,
        name: formName.trim(),
        slug: formSlug.trim() || `role-${roles.length + 1}`,
        count: 0,
        capacity: Number(formCapacity) || 4,
        description: formDesc.trim() || "暂无岗位描述",
        tags: formTags.split(/[,， ]+/).filter(Boolean),
        status: "open",
      };
      setRoles((prev) => [...prev, newRole]);
      setFeedback(`已发布新岗位「${newRole.name}」`);
    }

    setIsCreateOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-roles-header flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            招募岗位管理
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护各项目组招募名额、JD 描述与录取流转配额
          </p>
        </div>
        <Button
          size="sm"
          onPress={handleOpenCreate}
          className="gap-1.5 text-xs font-medium"
        >
          <Plus className="size-3.5" />
          发布新岗位
        </Button>
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-full border border-emerald-500/10 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300"
        >
          {feedback}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {roles.map((r) => {
          const ratio = r.count > 0 ? (r.capacity / r.count) * 100 : 100;
          return (
            <Card
              key={r.id}
              className="anim-role-card flex flex-col justify-between border shadow-xs"
            >
              <CardHeader className="p-5 pb-3 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
                    <span className="font-mono text-xs text-muted-foreground">ID: {r.slug}</span>
                  </div>
                  <Badge
                    variant={r.status === "open" ? "default" : "secondary"}
                    className="text-[11px] font-medium"
                  >
                    {r.status === "open" ? "正在招募" : "暂停申请"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-5 text-xs">
                <p className="leading-relaxed text-muted-foreground">{r.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5 text-cyan-600" />
                      <span>投递报名：<strong className="font-mono font-semibold text-foreground">{r.count}</strong> 份</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BriefcaseBusiness className="size-3.5 text-emerald-600" />
                      <span>计划名额：<strong className="font-mono font-semibold text-foreground">{r.capacity}</strong> 位</span>
                    </div>
                  </div>

                  {/* Progress ratio */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                      <span>名额预估录取率</span>
                      <span className="font-mono font-semibold text-foreground">
                        {ratio >= 100 ? "充裕" : `${ratio.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(100, ratio)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-3.5">
                <Button
                  variant="ghost"
                  size="xs"
                  onPress={() => toggleStatus(r.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {r.status === "open" ? "暂停招募" : "恢复开放"}
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onPress={() => handleOpenEdit(r)}
                  className="gap-1 text-xs"
                >
                  <Edit2 className="size-3" />
                  修改岗位 JD
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Role Add/Edit Dialog */}
      <Dialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editingRole ? `编辑岗位: ${editingRole.name}` : "发布新招募岗位"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            设置岗位职责需求、技能标签与招募名额规划
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveRole} className="mt-2 space-y-4">
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <Label htmlFor="role-name" className="text-xs">岗位名称 *</Label>
              <Input
                id="role-name"
                placeholder="例如: 移动端开发项目组"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="role-slug" className="text-xs">岗位标识 (Slug)</Label>
                <Input
                  id="role-slug"
                  placeholder="mobile"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role-capacity" className="text-xs">招募录取名额</Label>
                <Input
                  id="role-capacity"
                  type="number"
                  min="1"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role-tags" className="text-xs">技能标签 (空格或逗号分隔)</Label>
              <Input
                id="role-tags"
                placeholder="例如: Flutter iOS Android"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="role-desc" className="text-xs">岗位描述 (JD)</Label>
              <textarea
                id="role-desc"
                rows={3}
                placeholder="说明岗位职责、考核内容与面向学生要求..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={() => setIsCreateOpen(false)}
              className="text-xs"
            >
              取消
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 text-xs font-medium">
              <Check className="size-3.5" />
              保存
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
