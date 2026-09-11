import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  CheckCheck,
  Send,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useAdminStore } from "../store/adminStore";

gsap.registerPlugin(useGSAP);

export function InboxPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboard = useAdminStore((state) => state.dashboard);
  const rawApplications = dashboard?.recentApplications ?? [];
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "contacted">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const applications = useMemo(() => {
    if (filterTab === "all") return rawApplications;
    if (filterTab === "pending") return rawApplications.filter((a) => a.status === "submitted" || a.status === "processing");
    return rawApplications.filter((a) => a.status === "contacted");
  }, [rawApplications, filterTab]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-inbox-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-inbox-item", {
          opacity: 0,
          y: 6,
          duration: 0.25,
          stagger: 0.04,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    { dependencies: [applications.length, filterTab] }
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const handleBatchApprove = () => {
    applications
      .filter((a) => selectedIds.includes(a.id))
      .forEach((a) => {
        a.status = "contacted";
      });
    setFeedback(`已批量将选中的 ${selectedIds.length} 位候选人标记为「初筛通过」`);
    setSelectedIds([]);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBatchNotify = () => {
    setFeedback(`已为选中的 ${selectedIds.length} 位候选人生成邮件通知并同步飞书工作台`);
    setSelectedIds([]);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSingleApprove = (id: string, name: string) => {
    const item = rawApplications.find((a) => a.id === id);
    if (item) item.status = "contacted";
    setFeedback(`已将候选人「${name}」状态流转为「已通过初筛」`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="anim-inbox-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            报名收件箱
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            集中处理最新投递申请，支持批量初审、流转决策与站内协同通知
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs font-medium"
              onPress={handleBatchApprove}
            >
              <CheckCheck className="size-3.5 text-emerald-600" />
              批量通过 ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 text-xs font-medium"
              onPress={handleBatchNotify}
            >
              <Send className="size-3.5" />
              发送面试邀请
            </Button>
          </div>
        )}
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300"
        >
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-1 rounded-md border border-border/80 bg-muted/40 p-1"
          role="tablist"
        >
          {[
            { id: "all", label: "全部申请" },
            { id: "pending", label: "待初审" },
            { id: "contacted", label: "已通过初审" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filterTab === tab.id}
              onClick={() => {
                setFilterTab(tab.id as any);
                setSelectedIds([]);
              }}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                filterTab === tab.id
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          显示 {applications.length} 条记录
        </span>
      </div>

      {/* Inbox List Card */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={applications.length > 0 && selectedIds.length === applications.length}
              onChange={selectAll}
              className="size-4 rounded border-border focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="全选当前列表所有申请"
            />
            <span className="text-xs text-muted-foreground">
              已选 {selectedIds.length} / {applications.length} 项
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {filterTab === "pending" ? "待审核申请" : "当前视图总览"}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {applications.length > 0 ? (
            <ul className="divide-y divide-border/60">
              {applications.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                return (
                  <li
                    key={app.id}
                    className={`anim-inbox-item flex items-center gap-4 p-4 transition-colors ${
                      isSelected ? "bg-muted/40" : "hover:bg-muted/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(app.id)}
                      className="size-4 rounded border-border focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`选择候选人 ${app.applicantName}`}
                    />

                    <Avatar size="sm" className="border bg-muted">
                      <AvatarFallback className="text-xs font-semibold">
                        {app.applicantName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {app.applicantName}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {app.role}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {app.submittedAt}
                        </span>
                        {app.status === "contacted" && (
                          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400">
                            已通过初审
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {app.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                          {app.score ? `${app.score}分` : "--"}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">AI 匹配</span>
                      </div>
                      {app.status !== "contacted" && (
                        <Button
                          variant="outline"
                          size="xs"
                          onPress={() => handleSingleApprove(app.id, app.applicantName)}
                          className="gap-1 text-xs text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                          <UserCheck className="size-3" />
                          通过
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-16 text-center text-xs text-muted-foreground">
              当前分类下暂无待处理的申请
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
