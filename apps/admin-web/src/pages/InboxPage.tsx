import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  CheckCheck,
  FileText,
  Send,
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
  const applications = dashboard?.recentApplications ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

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
    { dependencies: [applications.length] }
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
    setFeedback(`已批量将选中的 ${selectedIds.length} 位候选人标记为「初筛通过」`);
    setSelectedIds([]);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBatchNotify = () => {
    setFeedback(`已为 ${selectedIds.length} 位候选人生成录用/面试通知邮件草稿`);
    setSelectedIds([]);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="anim-inbox-header flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
            <span>SUBMISSION INBOX</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            报名收件箱
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            集中处理最新投递申请，支持批量初审、流转与飞书/邮件协同推送
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
              初审通过 ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 text-xs font-medium"
              onPress={handleBatchNotify}
            >
              <Send className="size-3.5" />
              发送通知
            </Button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          {feedback}
        </div>
      )}

      {/* Inbox List Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === applications.length}
              onChange={selectAll}
              className="size-4 rounded border-border focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="全选所有申请"
            />
            <span className="font-mono text-xs text-muted-foreground">
              已选 {selectedIds.length} / {applications.length} 项
            </span>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            待审申请 {applications.length} 份
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <ul className="divide-y divide-border">
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {app.applicantName}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {app.role}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {app.submittedAt}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {app.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                      {app.score ? `${app.score}分` : "--"}
                    </span>
                    <Button variant="ghost" size="xs" className="gap-1 text-xs">
                      <FileText className="size-3 text-muted-foreground" />
                      查阅材料
                    </Button>
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
