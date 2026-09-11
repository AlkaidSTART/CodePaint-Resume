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
import { cn } from "@/lib/utils";
import { useAdminStore } from "../store/adminStore";
import type { TaskRecord, TaskStatus } from "../lib/types";
import {
  PipelineGraphViewer,
  DEFAULT_PIPELINE_NODES,
  type PipelineNodeData,
} from "@/components/pipeline/PipelineGraphViewer";

gsap.registerPlugin(useGSAP);

function getNodesForTask(task: TaskRecord): PipelineNodeData[] {
  if (task.status === "completed") {
    return DEFAULT_PIPELINE_NODES.map((n) => ({
      ...n,
      status: "completed",
      latency: n.latency === "--" ? "420ms" : n.latency,
    }));
  }
  if (task.status === "failed") {
    return DEFAULT_PIPELINE_NODES.map((n, idx) => {
      if (idx === 0) return { ...n, status: "completed" };
      if (idx === 1)
        return {
          ...n,
          status: "failed",
          description: "多模态 OCR 版面识别超时或低置信度异常，未能定位文本块",
          logs: [
            "[14:20:01.100] PDF frames decoded",
            "[14:20:05.410] Multimodal OCR worker timeout (code: E_OCR_TIMEOUT)",
          ],
        };
      return { ...n, status: "pending" };
    });
  }
  if (task.status === "queued") {
    return DEFAULT_PIPELINE_NODES.map((n, idx) => ({
      ...n,
      status: idx === 0 ? "running" : "pending",
      latency: idx === 0 ? "120ms..." : "--",
    }));
  }
  return DEFAULT_PIPELINE_NODES;
}

export function TasksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboard = useAdminStore((state) => state.dashboard);
  const tasks = dashboard?.tasks ?? [];

  const [activeTasks, setActiveTasks] = useState<TaskRecord[]>(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks[0]?.id ?? "task-1"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedTask =
    activeTasks.find((t) => t.id === selectedTaskId) ?? activeTasks[0];

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

  const handleRefresh = () => {
    setFeedback("已与异步解析服务集群完成状态同步");
    setTimeout(() => setFeedback(null), 2500);
  };

  const processingCount = activeTasks.filter((t) => t.status === "processing").length;
  const completedCount = activeTasks.filter((t) => t.status === "completed").length;
  const failedCount = activeTasks.filter((t) => t.status === "failed").length;

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-tasks-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            异步解析队列监控
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            实时监控简历版面 OCR 识别、多模态语义解析与 Schema 结构化提取任务
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onPress={handleRefresh}
          className="gap-1.5 text-xs font-medium"
        >
          <RotateCw className="size-3.5" />
          刷新队列状态
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

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">处理中任务</span>
            <Sparkles className="size-4 text-cyan-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground tabular-nums">{processingCount}</p>
        </div>
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">已成功解析</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground tabular-nums">{completedCount}</p>
        </div>
        <div className="anim-stat-card bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">解析异常</span>
            <AlertTriangle className="size-4 text-rose-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-foreground tabular-nums">{failedCount}</p>
        </div>
      </div>

      {/* LangGraph DAG Pipeline Visualizer */}
      {selectedTask && (
        <div className="anim-stat-card">
          <PipelineGraphViewer
            key={selectedTask.id}
            taskTitle={selectedTask.title}
            initialNodes={getNodesForTask(selectedTask)}
            onComplete={() => {
              setActiveTasks((prev) =>
                prev.map((t) =>
                  t.id === selectedTask.id
                    ? { ...t, status: "completed", stage: "全链路解析归档完成" }
                    : t
                )
              );
              setFeedback(`任务「${selectedTask.title}」已全链路流转完成`);
              setTimeout(() => setFeedback(null), 3000);
            }}
          />
        </div>
      )}

      <Card className="border shadow-xs">
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">任务流水日志</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                显示最近提交的 PDF / DOCX 结构化解析作业
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">共 {activeTasks.length} 个任务</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {activeTasks.map((t) => {
              const isSelected = t.id === selectedTaskId;
              return (
                <li
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTaskId(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedTaskId(t.id);
                    }
                  }}
                  className={cn(
                    "anim-task-row flex cursor-pointer flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "bg-accent/40 ring-1 ring-primary/30"
                      : "hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(t.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground">{t.title}</p>
                        {isSelected && (
                          <Badge variant="outline" className="text-[10px]">
                            查看拓扑
                          </Badge>
                        )}
                      </div>
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
                        onPress={(e) => {
                          e?.continuePropagation?.();
                          retryTask(t.id);
                        }}
                        className="gap-1 text-xs text-rose-600 hover:text-rose-700"
                      >
                        <RotateCw className="size-3" />
                        重新调度
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
