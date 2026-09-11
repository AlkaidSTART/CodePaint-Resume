import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle,
  Clock,
  Edit2,
  Plus,
  Users,
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
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);

  const toggleStatus = (id: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "open" ? "paused" : "open" } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            招募岗位管理
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护各项目组招募名额、JD 描述与招新流转规则
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="size-3.5" />
          发布新岗位
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <Card key={r.id} className="border shadow-sm transition-all hover:shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
                  <CardDescription className="text-xs">标识符: {r.slug}</CardDescription>
                </div>
                <Badge
                  variant={r.status === "open" ? "default" : "secondary"}
                  className="text-[11px]"
                >
                  {r.status === "open" ? "正在招募" : "暂停申请"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-1 text-xs">
              <p className="text-muted-foreground leading-relaxed">{r.description}</p>

              <div className="flex flex-wrap gap-1">
                {r.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-3.5 text-cyan-600" />
                  <span>当前投递：<strong className="text-foreground">{r.count}</strong> 人</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BriefcaseBusiness className="size-3.5 text-emerald-600" />
                  <span>录取名额：<strong className="text-foreground">{r.capacity}</strong> 位</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-3">
              <Button
                variant="ghost"
                size="xs"
                onPress={() => toggleStatus(r.id)}
                className="text-xs"
              >
                {r.status === "open" ? "暂停招募" : "恢复开放"}
              </Button>
              <Button variant="outline" size="xs" className="gap-1 text-xs">
                <Edit2 className="size-3" />
                编辑 JD
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
