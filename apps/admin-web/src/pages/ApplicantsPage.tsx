import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Check,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAdminStore } from "../store/adminStore";
import type { Application } from "../lib/types";

gsap.registerPlugin(useGSAP);

export function ApplicantsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboard = useAdminStore((state) => state.dashboard);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"score" | "date">("score");
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New applicant form state
  const [newApplicantName, setNewApplicantName] = useState("");
  const [newApplicantRole, setNewApplicantRole] = useState("大前端项目组");
  const [newApplicantSummary, setNewApplicantSummary] = useState("");
  const [newApplicantSkills, setNewApplicantSkills] = useState("");

  const applications = useMemo(() => {
    const list = [...(dashboard?.recentApplications ?? [])];
    const filtered = list.filter((app) => {
      const matchSearch =
        !search ||
        app.applicantName.includes(search) ||
        app.summary.includes(search) ||
        (app.skills ?? []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchRole = roleFilter === "all" || app.roleSlug === roleFilter;
      return matchSearch && matchRole;
    });

    if (sortBy === "score") {
      filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
    return filtered;
  }, [dashboard, search, roleFilter, sortBy]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-table-row", {
          opacity: 0,
          y: 6,
          duration: 0.25,
          stagger: 0.04,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    { dependencies: [applications.length, roleFilter, sortBy] }
  );

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "contacted":
        return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">已沟通</Badge>;
      case "processing":
        return <Badge variant="secondary" className="border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">初筛中</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-muted-foreground">已归档</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400">已提交</Badge>;
    }
  };

  const handleExportCSV = () => {
    const csvHeader = "ID,姓名,意向岗位,AI评分,状态,投递时间\n";
    const csvRows = applications
      .map((a) => `${a.id},${a.applicantName},${a.role},${a.score ?? 0},${a.status},${a.submittedAt}`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback("已成功生成并下载候选人 CSV 名单");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantName.trim()) return;
    const newApp: Application = {
      id: `app-manual-${Date.now()}`,
      applicantName: newApplicantName.trim(),
      role: newApplicantRole,
      roleSlug: newApplicantRole.includes("前端") ? "frontend" : "ui-ux",
      status: "submitted",
      submittedAt: "刚刚",
      summary: newApplicantSummary || "手动录入候选人，待补充原始简历文件及初筛评估。",
      skills: newApplicantSkills.split(/[,， ]+/).filter(Boolean),
      score: 85,
    };
    dashboard?.recentApplications.unshift(newApp);
    setIsAddModalOpen(false);
    setNewApplicantName("");
    setNewApplicantSummary("");
    setNewApplicantSkills("");
    setFeedback(`已手动录入候选人「${newApp.applicantName}」`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateStatus = (app: Application, nextStatus: Application["status"]) => {
    app.status = nextStatus;
    setSelectedApplicant({ ...app });
    setFeedback(`已将候选人「${app.applicantName}」状态更新为「${nextStatus === "contacted" ? "初筛通过" : "已归档"}」`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Page Header */}
      <div className="anim-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            候选人档案库
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护各项目组报名档案、技能提要、多维评分证据与初审决策
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={handleExportCSV}
            className="gap-1.5 text-xs font-medium"
          >
            <Download className="size-3.5" />
            导出名单 (CSV)
          </Button>
          <Button
            size="sm"
            onPress={() => setIsAddModalOpen(true)}
            className="gap-1.5 text-xs font-medium"
          >
            <Plus className="size-3.5" />
            手动录入候选人
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300"
        >
          {feedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="按姓名、技能栈或经历搜索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
            {search && (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="清除搜索关键字"
                >
                  <X className="size-3.5" />
                </button>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1 rounded-md border border-border/80 bg-muted/40 p-1"
            role="group"
            aria-label="按专业组别筛选"
          >
            {[
              { id: "all", label: "全部" },
              { id: "frontend", label: "大前端" },
              { id: "ui-ux", label: "UI/UX" },
              { id: "office", label: "办公室" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleFilter(r.id)}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  roleFilter === r.id
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-1 rounded-md border border-border/80 bg-muted/40 p-1"
            role="group"
            aria-label="排序方式"
          >
            <button
              type="button"
              onClick={() => setSortBy("score")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === "score"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              评分优先
            </button>
            <button
              type="button"
              onClick={() => setSortBy("date")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === "date"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              时间优先
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Table Card */}
      <Card className="border shadow-xs">
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">候选人花名册</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                当前筛选下共 {applications.length} 位候选人
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              共 1 页
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/30 font-medium text-muted-foreground text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-medium">候选人</th>
                  <th className="px-5 py-3 font-medium">意向组别</th>
                  <th className="px-5 py-3 font-medium">核心技能</th>
                  <th className="px-5 py-3 text-center font-medium">AI 匹配分</th>
                  <th className="px-5 py-3 font-medium">状态</th>
                  <th className="px-5 py-3 font-medium">投递时间</th>
                  <th className="px-5 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="anim-table-row transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-3.5 font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm" className="border bg-muted">
                            <AvatarFallback className="text-xs font-semibold">
                              {app.applicantName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold text-foreground">{app.applicantName}</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {app.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{app.role}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(app.skills ?? []).map((s) => (
                            <Badge key={s} variant="secondary" className="px-1.5 py-0 text-[10px]">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-foreground tabular-nums">
                        {app.score ? `${app.score}分` : "--"}
                      </td>
                      <td className="px-5 py-3.5">{getStatusBadge(app.status)}</td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground text-[11px]">
                        {app.submittedAt}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`查看 ${app.applicantName} 详情`}
                            onPress={() => setSelectedApplicant(app)}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`初筛通过 ${app.applicantName}`}
                            onPress={() => handleUpdateStatus(app, "contacted")}
                          >
                            <UserCheck className="size-3.5 text-emerald-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-muted-foreground">
                      未检索到匹配的候选人档案
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Candidate Inspection Drawer */}
      <SheetContent
        isOpen={Boolean(selectedApplicant)}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
        side="right"
        className="w-[min(34rem,94vw)] p-6 shadow-xl"
      >
        {selectedApplicant && (
          <div className="flex h-full flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <SheetHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11 border bg-muted text-base font-bold">
                      <AvatarFallback>{selectedApplicant.applicantName.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-lg font-bold">{selectedApplicant.applicantName}</SheetTitle>
                      <p className="text-xs text-muted-foreground">{selectedApplicant.role} · 投递于 {selectedApplicant.submittedAt}</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedApplicant.status)}
                </div>
              </SheetHeader>

              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-xs font-semibold text-foreground">AI 综合匹配分</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-foreground">{selectedApplicant.score ?? "--"}</span>
                    <span className="text-xs text-muted-foreground">/ 100 分 (建议进入初筛技术面)</span>
                  </div>
                  {/* Dimension breakdown */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">工程与技术深度</span>
                      <span className="font-mono font-medium text-foreground">92%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "92%" }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-muted-foreground">交互与设计感知</span>
                      <span className="font-mono font-medium text-foreground">88%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "88%" }} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-xs font-semibold text-foreground">结构化经历提要</span>
                  <p className="mt-2 leading-relaxed text-foreground/90">{selectedApplicant.summary}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-xs font-semibold text-foreground">技能标签</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(selectedApplicant.skills ?? []).map((s) => (
                      <Badge key={s} variant="secondary" className="px-2 py-0.5 text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-xs font-semibold text-foreground">简历核验证据引用</span>
                  <div className="mt-2 space-y-2 rounded-md border border-border/80 bg-muted/20 p-3 text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-medium text-cyan-700 dark:text-cyan-400 shrink-0">[P1 引文]</span>
                      <p className="text-muted-foreground">
                        “主导开发高并发数据流组件库，优化渲染重绘链路，首屏加载时延降低 40%。”
                      </p>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                      <span className="font-mono font-medium text-cyan-700 dark:text-cyan-400 shrink-0">[P2 引文]</span>
                      <p className="text-muted-foreground">
                        “具备团队协作自驱力，多次在 GitHub 活跃维护开源技术生态与文档体系。”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onPress={() => handleUpdateStatus(selectedApplicant, "closed")}
              >
                <UserX className="size-3.5 text-rose-600" />
                归档
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <FileText className="size-3.5" />
                查看原始 PDF
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs flex-1"
                onPress={() => handleUpdateStatus(selectedApplicant, "contacted")}
              >
                <UserCheck className="size-3.5" />
                初筛通过
              </Button>
            </div>
          </div>
        )}
      </SheetContent>

      {/* Manual Candidate Registration Dialog */}
      <Dialog isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">手动录入候选人</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            为线下投递或内推人员创建结构化档案记录
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddCandidate} className="mt-2 space-y-4">
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <Label htmlFor="candidate-name" className="text-xs">候选人姓名 *</Label>
              <Input
                id="candidate-name"
                placeholder="例如: 林晓枫"
                value={newApplicantName}
                onChange={(e) => setNewApplicantName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="candidate-role" className="text-xs">意向项目组</Label>
              <select
                id="candidate-role"
                value={newApplicantRole}
                onChange={(e) => setNewApplicantRole(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="大前端项目组">大前端项目组</option>
                <option value="UI / UX 设计项目组">UI / UX 设计项目组</option>
                <option value="办公室运营与策划组">办公室运营与策划组</option>
                <option value="后端与云原生架构组">后端与云原生架构组</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="candidate-skills" className="text-xs">技术栈与核心技能 (空格或逗号分隔)</Label>
              <Input
                id="candidate-skills"
                placeholder="例如: React TypeScript Tailwind"
                value={newApplicantSkills}
                onChange={(e) => setNewApplicantSkills(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="candidate-summary" className="text-xs">背景经历概要</Label>
              <textarea
                id="candidate-summary"
                rows={3}
                placeholder="简要填写候选人项目经历、教育背景与内推说明..."
                value={newApplicantSummary}
                onChange={(e) => setNewApplicantSummary(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={() => setIsAddModalOpen(false)}
              className="text-xs"
            >
              取消
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 text-xs font-medium">
              <Check className="size-3.5" />
              确认录入
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
