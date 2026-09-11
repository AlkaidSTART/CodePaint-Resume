import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RotateCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStore } from "../store/adminStore";
import type { TaskRecord, TaskStatus } from "../lib/types";

export function TasksPage() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const tasks = dashboard?.tasks ?? [];

  const [activeTasks, setActiveTasks] = useState<TaskRecord[]>(tasks);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-emerald-600" />;
      case "failed":
        return <XCircle className="size-4 text-rose-600" />;
      case "processing":
        return <LoaderCircle className="size-4 animate-spin text-cyan-600" />;
      default:
        return <Clock3 className="size-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/15 text-emerald-700">完成</Badge>;
      case "failed":
        return <Badge variant="destructive">失败</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-cyan-500/15 text-cyan-700">处理中</Badge>;
      default:
        return <Badge variant="outline">排队中</Badge>;
    }
  };

  const retryTask = (id: string) => {
    setActiveTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "processing", stage: "重新进入 OCR 解析管线" } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            异步解析队列监控
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            监控简历 OCR 识别、多模态版面解析与大模型结构化抽取流水线
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RotateCw className="size-3.5" />
          刷新队列状态
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">处理中任务</span>
            <Sparkles className="size-4 text-cyan-600" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono">
            {activeTasks.filter((t) => t.status === "processing").length}
          </p>
        </Card>
        <Card className="border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">已成功解析</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono">
            {activeTasks.filter((t) => t.status === "completed").length}
          </p>
        </Card>
        <Card className="border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">解析异常</span>
            <AlertTriangle className="size-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono">
            {activeTasks.filter((t) => t.status === "failed").length}
          </p>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-semibold">任务流水列表</CardTitle>
          <CardDescription className="text-xs">
            显示最近的 PDF/DOCX 文件结构化与特征抽取任务
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {activeTasks.map((t) => (
              <li key={t.id} className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(t.status)}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      阶段: {t.stage} · 更新于 {t.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {getStatusBadge(t.status)}
                  {t.status === "failed" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onPress={() => retryTask(t.id)}
                      className="gap-1 text-xs text-rose-600 hover:text-rose-700"
                    >
                      <RotateCw className="size-3" />
                      重试
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
