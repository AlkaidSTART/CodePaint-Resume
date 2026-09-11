import { useState, useTransition } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  RotateCw,
  Play,
  FileCode2,
  Check,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PipelineNodeData {
  id: string;
  step: string;
  label: string;
  agent: string;
  model: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  latency?: string;
  tokens?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  logs?: string[];
}

export const DEFAULT_PIPELINE_NODES: PipelineNodeData[] = [
  {
    id: "node_ingress",
    step: "01",
    label: "文档接入与格式校验",
    agent: "IngressGuard",
    model: "Native Go Worker",
    description: "PDF/DOCX 格式白名单校验、沙箱反病毒探测与原始页面栅格化",
    status: "completed",
    latency: "145ms",
    tokens: "0 tok",
    inputs: {
      file_name: "林晓枫_大前端工程_简历.pdf",
      mime_type: "application/pdf",
      file_size_bytes: 1482910,
      sha256: "9a2f7c01b...8e4d",
    },
    outputs: {
      validated: true,
      page_count: 2,
      raster_format: "png_300dpi",
      ingress_verdict: "PASSED",
    },
    logs: [
      "[14:20:01.102] IngressGuard: Received multipart upload stream (1.41 MB)",
      "[14:20:01.198] PDF Magic Number verified (0x25 0x50 0x44 0x46)",
      "[14:20:01.247] Rasterized 2 pages to sandbox frame buffers",
    ],
  },
  {
    id: "node_ocr",
    step: "02",
    label: "多模态版面与 OCR 剖析",
    agent: "LayoutParser-VL",
    model: "Qwen2.5-VL-72B",
    description: "识别双栏排版、头像与联系方式区域、经历时序块与开源项目卡片",
    status: "completed",
    latency: "1,240ms",
    tokens: "1,840 tok",
    inputs: {
      image_batches: 2,
      ocr_lang: ["zh-CN", "en-US"],
      layout_det: "hybrid_two_column",
    },
    outputs: {
      detected_sections: [
        "Header_Contact",
        "Education_Background",
        "Tech_Stack",
        "Project_Experience",
        "OpenSource_Contributions",
      ],
      bounding_boxes_count: 38,
      raw_text_length: 2460,
    },
    logs: [
      "[14:20:01.250] LayoutParser-VL: Sending 2 frames to multimodal inference worker",
      "[14:20:02.110] Bounding boxes localized: 5 major semantic regions",
      "[14:20:02.490] Layout reconstruction completed with 99.2% confidence",
    ],
  },
  {
    id: "node_extract",
    step: "03",
    label: "经历实体与技能提取",
    agent: "EntityExtractor",
    model: "DeepSeek-V3",
    description: "抽取结构化基础信息、工作/项目经历、角色职责、技术关键词与成果量化指标",
    status: "running",
    latency: "890ms...",
    tokens: "2,410 tok",
    inputs: {
      target_role: "大前端项目组",
      strict_mode: true,
      schema_version: "2026.1",
    },
    outputs: {
      name: "林晓枫",
      email: "lin.xf@university.edu.cn",
      skills_extracted: ["React 19", "TypeScript", "Next.js", "WebAssembly", "Tailwind CSS"],
      years_exp: 3,
      current_status: "EXTRACTING_PROJECT_DETAILS",
    },
    logs: [
      "[14:20:02.500] EntityExtractor: Applying JSON Schema extraction prompt template",
      "[14:20:03.110] Found 3 project entries: Web Audio Worklet, UI Design System, Rust Canvas",
      "[14:20:03.390] Parsing key metrics: 40% render latency reduction...",
    ],
  },
  {
    id: "node_validate",
    step: "04",
    label: "JSON 规范校验与自纠偏",
    agent: "SchemaValidator",
    model: "Zod + Fast-Check",
    description: "验证必填字段完整性、手机与邮箱格式合规、日期时序倒置自愈修正",
    status: "pending",
    latency: "--",
    tokens: "--",
    inputs: {
      schema: "CandidateProfileStrictSchema",
      allow_coercion: true,
    },
    outputs: undefined,
    logs: ["Waiting for EntityExtractor output node checkpoint..."],
  },
  {
    id: "node_scoring",
    step: "05",
    label: "岗位画像匹配与打分",
    agent: "ReviewerAgent",
    model: "DeepSeek-R1-Distill",
    description: "对照大前端 JD 维度（基础广度、工程深度、交互感知、项目复杂度）生成评分",
    status: "pending",
    latency: "--",
    tokens: "--",
    inputs: {
      rubric_id: "frontend-eng-autumn-2026",
      weights: { engineering: 0.4, design_sense: 0.3, open_source: 0.3 },
    },
    outputs: undefined,
    logs: ["Awaiting upstream schema validation completion."],
  },
  {
    id: "node_sync",
    step: "06",
    label: "档案归档与飞书协同通知",
    agent: "SyncDispatcher",
    model: "Feishu Webhook Worker",
    description: "写入 PostgreSQL 候选人全量档案库，并向初审群推送结构化评审卡片",
    status: "pending",
    latency: "--",
    tokens: "--",
    inputs: {
      notify_channel: "招新初审评审委员会",
      format: "interactive_card_v2",
    },
    outputs: undefined,
    logs: ["Pending final verdict and persistent write transaction."],
  },
];

interface PipelineGraphViewerProps {
  taskTitle?: string;
  initialNodes?: PipelineNodeData[];
  onComplete?: () => void;
}

export function PipelineGraphViewer({
  taskTitle = "林晓枫_大前端工程_简历.pdf",
  initialNodes = DEFAULT_PIPELINE_NODES,
  onComplete,
}: PipelineGraphViewerProps) {
  const [nodes, setNodes] = useState<PipelineNodeData[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node_extract");
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? nodes[0];

  // Advance simulation to the next node like LangGraph stepping
  const stepForward = () => {
    const runningIdx = nodes.findIndex((n) => n.status === "running");
    if (runningIdx === -1) {
      // Find first pending node
      const firstPendingIdx = nodes.findIndex((n) => n.status === "pending");
      if (firstPendingIdx !== -1) {
        startTransition(() => {
          setNodes((prev) =>
            prev.map((n, idx) =>
              idx === firstPendingIdx
                ? { ...n, status: "running", latency: "320ms..." }
                : n
            )
          );
          setSelectedNodeId(nodes[firstPendingIdx].id);
        });
      }
      return;
    }

    startTransition(() => {
      setNodes((prev) => {
        const nextNodes = [...prev];
        // Mark current running as completed
        nextNodes[runningIdx] = {
          ...nextNodes[runningIdx],
          status: "completed",
          latency: `${(Math.random() * 0.8 + 0.4).toFixed(2)}s`,
          tokens: `${Math.floor(Math.random() * 800 + 1200)} tok`,
          outputs: nextNodes[runningIdx].outputs ?? {
            status: "SUCCESS",
            checkpoint: `chk_${Date.now().toString(36)}`,
          },
          logs: [
            ...(nextNodes[runningIdx].logs ?? []),
            `[${new Date().toLocaleTimeString()}] Node execution finished with state saved.`,
          ],
        };

        // Advance next pending node if exists
        const nextPendingIdx = runningIdx + 1;
        if (nextPendingIdx < nextNodes.length) {
          nextNodes[nextPendingIdx] = {
            ...nextNodes[nextPendingIdx],
            status: "running",
            latency: "410ms...",
            tokens: "850 tok...",
            logs: [
              `[${new Date().toLocaleTimeString()}] Activated from checkpoint ${nextNodes[runningIdx].id}`,
              `[${new Date().toLocaleTimeString()}] Loaded agent context into worker memory`,
            ],
          };
          setSelectedNodeId(nextNodes[nextPendingIdx].id);
        } else {
          onComplete?.();
        }
        return nextNodes;
      });
    });
  };

  // Reset entire graph to initial state
  const resetPipeline = () => {
    setNodes(initialNodes);
    setSelectedNodeId("node_extract");
    setIsSimulating(false);
  };

  // Auto-run full pipeline simulation
  const runAutoSimulation = () => {
    setIsSimulating(true);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      stepForward();
      if (currentStep >= 4) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1400);
  };

  const copyPayload = () => {
    if (!selectedNode) return;
    const jsonStr = JSON.stringify(
      { inputs: selectedNode.inputs, outputs: selectedNode.outputs },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNodeIcon = (status: PipelineNodeData["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case "running":
        return <LoaderCircle className="size-4 animate-spin text-cyan-600 dark:text-cyan-400" />;
      case "failed":
        return <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Clock className="size-4 text-muted-foreground/60" />;
    }
  };

  const completedCount = nodes.filter((n) => n.status === "completed").length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

  return (
    <Card className="flex flex-col border shadow-sm">
      {/* Visualizer Top Bar */}
      <CardHeader className="border-b p-4 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                LANGGRAPH WORKFLOW RUNTIME
              </span>
              <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                DAG ID: wf_resume_v26
              </Badge>
            </div>
            <CardTitle className="mt-1 text-base font-semibold tracking-tight text-foreground">
              当前任务: {taskTitle}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              基于有向无环图 (DAG) 的简历抽取、Schema 校验与画像评分多 Agent 流水线
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="xs"
              onPress={resetPipeline}
              className="gap-1.5 text-xs font-medium"
              aria-label="重置图谱到初始状态"
            >
              <RotateCw className="size-3 text-muted-foreground" />
              重置
            </Button>
            <Button
              variant="outline"
              size="xs"
              onPress={stepForward}
              isDisabled={isSimulating}
              className="gap-1.5 text-xs font-medium text-cyan-700 dark:text-cyan-300"
              aria-label="推进执行下一个节点"
            >
              <ArrowRight className="size-3" />
              单步流转
            </Button>
            <Button
              size="xs"
              onPress={runAutoSimulation}
              isDisabled={isSimulating}
              className="gap-1.5 text-xs font-medium"
              aria-label="自动执行流水线"
            >
              {isSimulating ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : (
                <Play className="size-3" />
              )}
              {isSimulating ? "执行中..." : "完整执行"}
            </Button>
          </div>
        </div>

        {/* Global Pipeline Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-[11px] font-medium text-muted-foreground">
            {completedCount}/{nodes.length} 节点完成 ({progressPercent}%)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* DAG Horizontal Node Sequence */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>执行拓扑图谱 (点击任意节点查看状态检查点)</span>
            <span className="font-mono text-[11px]">CHECKPOINT: in_memory_sqlite</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const isRunning = node.status === "running";
              const isCompleted = node.status === "completed";
              const isFailed = node.status === "failed";

              return (
                <div key={node.id} className="relative flex flex-col">
                  {/* Connector chevron arrow (on xl screens) */}
                  {index < nodes.length - 1 && (
                    <div
                      className="pointer-events-none absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 text-muted-foreground/40 xl:block"
                      aria-hidden="true"
                    >
                      <ArrowRight className="size-3" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={cn(
                      "flex h-full flex-col justify-between rounded-lg border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary/80 bg-accent/30 shadow-xs ring-1 ring-primary/40"
                        : "border-border/70 bg-card hover:border-border hover:bg-muted/30",
                      isRunning && "border-cyan-500/80 bg-cyan-500/5 ring-1 ring-cyan-500/30",
                      isCompleted && "border-emerald-500/40",
                      isFailed && "border-rose-500/80 bg-rose-500/5"
                    )}
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                          STAGE {node.step}
                        </span>
                        {getNodeIcon(node.status)}
                      </div>

                      {/* Node Label */}
                      <p className="mt-2 text-xs font-bold leading-snug text-foreground">
                        {node.label}
                      </p>

                      {/* Agent badge */}
                      <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                        <Cpu className="size-2.5 shrink-0" />
                        <span className="truncate">{node.agent}</span>
                      </div>
                    </div>

                    {/* Node Footer Metas */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 font-mono text-[10px]">
                      <span
                        className={cn(
                          "font-semibold",
                          isRunning && "text-cyan-700 dark:text-cyan-400",
                          isCompleted && "text-emerald-700 dark:text-emerald-400",
                          node.status === "pending" && "text-muted-foreground/60"
                        )}
                      >
                        {isRunning
                          ? "执行中"
                          : isCompleted
                          ? "已完成"
                          : isFailed
                          ? "失败"
                          : "等待中"}
                      </span>
                      <span className="text-muted-foreground">{node.latency}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node State & Checkpoint Inspector */}
        <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
          <div className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-cyan-600" />
              <div>
                <span className="text-xs font-bold text-foreground">
                  节点检查点状态: {selectedNode.label} ({selectedNode.id})
                </span>
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  AGENT: {selectedNode.agent} · MODEL: {selectedNode.model}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onPress={copyPayload}
                className="gap-1 text-xs font-mono"
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "已复制 JSON" : "复制节点状态"}
              </Button>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">{selectedNode.description}</p>

          {/* Node Inspect Details: Left inputs/outputs JSON, Right logs */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* IO Payloads */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-foreground">
                <FileCode2 className="size-3.5 text-muted-foreground" />
                <span>STATE CHECKPOINT (INPUT / OUTPUT)</span>
              </div>
              <div className="h-44 overflow-auto rounded-md border border-border/80 bg-background/80 p-3 font-mono text-[11px] text-foreground">
                <pre className="whitespace-pre leading-relaxed">
                  {JSON.stringify(
                    {
                      node_id: selectedNode.id,
                      status: selectedNode.status,
                      latency: selectedNode.latency,
                      tokens_consumed: selectedNode.tokens,
                      inputs: selectedNode.inputs ?? {},
                      outputs: selectedNode.outputs ?? "Pending execution...",
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Execution Stream Logs */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-foreground">
                <Sparkles className="size-3.5 text-muted-foreground" />
                <span>RUNTIME EVENT STREAM (LOGS)</span>
              </div>
              <div className="h-44 overflow-auto rounded-md border border-border/80 bg-background/80 p-3 font-mono text-[11px] text-muted-foreground">
                {selectedNode.logs && selectedNode.logs.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedNode.logs.map((log, idx) => (
                      <li key={idx} className="leading-normal">
                        <span className="text-cyan-700 dark:text-cyan-400">❯</span> {log}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground/60">暂无事件流记录</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
