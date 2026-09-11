import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStore } from "../store/adminStore";
import type { TaskRecord, TaskStatus } from "../lib/types";

gsap.registerPlugin(useGSAP);

export function TasksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboard = useAdminStore((state) => state.dashboard);
  const tasks = dashboard?.tasks ?? [];

  const [activeTasks, setActiveTasks] = useState<TaskRecord[]>(tasks);
  const [feedback, setFeedback] = useState<string | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-tasks-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-stat-card", {
          opacity: 0,
          y: 8,
          duration: 0.25,
          stagger: 0.05,
          ease: "power2.out",
        });
        gsap.from(".anim-task-row", {
          opacity: 0,
          y: 6,
          duration: 0.25,
          stagger: 0.04,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    { dependencies: [activeTasks.length] }
  );

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-emerald-600" />;
      case "failed":
        return <XCircle className="size-4 text-rose-600" />;
      case "processing":
        return <LoaderCircle className="size-4 animate-spin text-cyan-600 motion-reduce:animate-none" />;
      default:
        return <Clock3 className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">解析完成</Badge>;
      case "failed":
        return <Badge variant="destructive">执行失败</Badge>;
      case "processing":
        return <Badge variant="secondary" className="border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">处理中</Badge>;
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
    setFeedback("已重新提交该解析任务至后台分布式执行池");
    setTimeout(() => setFeedback(null), 2800);
  };

  const processingCount = activeTasks.filter((t) => t.status === "processing").length;
  const completedCount = activeTasks.filter((t) => t.status === "completed").length;
  const failedCount = activeTasks.filter((t) => t.status === "failed").length;

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-tasks-header flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>ASYNC TASK RUNTIME</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            异步解析队列监控
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            监控简历 OCR 识别、多模态版面解析与大模型结构化抽取流水线
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
          <RotateCw className="size-3.5" />
          刷新队列状态
        </Button>
      </div>

      {feedback && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">处理中任务</span>
            <Sparkles className="size-4 text-cyan-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground">{processingCount}</p>
        </div>
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">已成功解析</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground">{completedCount}</p>
        </div>
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">解析异常</span>
            <AlertTriangle className="size-4 text-rose-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground">{failedCount}</p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">任务流水日志</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                显示最近提交的 PDF / DOCX 结构化解析作业
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">TOTAL {activeTasks.length}</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {activeTasks.map((t) => (
              <li
                key={t.id}
                className="anim-task-row flex flex-col gap-3 p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(t.status)}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
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
                      重新调度
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
