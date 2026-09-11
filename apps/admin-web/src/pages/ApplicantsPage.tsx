import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  UserCheck,
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAdminStore } from "../store/adminStore";
import type { Application } from "../lib/types";

gsap.registerPlugin(useGSAP);

export function ApplicantsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboard = useAdminStore((state) => state.dashboard);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  const applications = useMemo(() => {
    const list = dashboard?.recentApplications ?? [];
    return list.filter((app) => {
      const matchSearch =
        !search ||
        app.applicantName.includes(search) ||
        app.summary.includes(search) ||
        (app.skills ?? []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchRole = roleFilter === "all" || app.roleSlug === roleFilter;
      return matchSearch && matchRole;
    });
  }, [dashboard, search, roleFilter]);

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
    { dependencies: [applications.length, roleFilter] }
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

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Page Header */}
      <div className="anim-header flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>APPLICANT REGISTRY</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            候选人档案库
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护投递档案、多维度技能提要及流转决策记录
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
            <Download className="size-3.5" />
            导出名单 (CSV)
          </Button>
          <Button size="sm" className="gap-1.5 text-xs font-medium">
            <Plus className="size-3.5" />
            手动录入候选人
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="按姓名、技能栈或摘要搜索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
          </InputGroup>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-1">
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
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                roleFilter === r.id
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table Card */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">候选人花名册</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                共匹配到 {applications.length} 位投递者
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              PAGE 01 / 01
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/30 font-medium text-muted-foreground font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">候选人</th>
                  <th className="px-5 py-3">意向组别</th>
                  <th className="px-5 py-3">核心技能标签</th>
                  <th className="px-5 py-3 text-center">AI 匹配分</th>
                  <th className="px-5 py-3">状态</th>
                  <th className="px-5 py-3">投递时间</th>
                  <th className="px-5 py-3 text-right">档案操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
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
                          <span className="font-semibold text-foreground">{app.applicantName}</span>
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
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-foreground">
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
        className="w-[min(32rem,94vw)] p-6 shadow-2xl"
      >
        {selectedApplicant && (
          <div className="flex h-full flex-col justify-between">
            <div>
              <SheetHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border bg-muted text-base font-bold">
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

              <div className="mt-6 space-y-5 text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">AI MATCH SCORE</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-foreground">{selectedApplicant.score ?? "--"}</span>
                    <span className="text-xs text-muted-foreground">/ 100 分</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">STRUCTURED SUMMARY</span>
                  <p className="mt-2 leading-relaxed text-foreground/90">{selectedApplicant.summary}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">TECH STACK & TAGS</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(selectedApplicant.skills ?? []).map((s) => (
                      <Badge key={s} variant="secondary" className="px-2 py-0.5 text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-1">
                <FileText className="size-3.5" />
                查看原始 PDF
              </Button>
              <Button size="sm" className="gap-1.5 text-xs flex-1">
                <UserCheck className="size-3.5" />
                标记初筛通过
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </div>
  );
}
