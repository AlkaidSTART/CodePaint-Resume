import { useState, useMemo } from "react";
import {
  Download,
  Eye,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAdminStore } from "../store/adminStore";
import type { Application } from "../lib/types";

export function ApplicantsPage() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "contacted":
        return <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25">已沟通</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-cyan-500/15 text-cyan-700">处理中</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-muted-foreground">已归档</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700">已提交</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            候选人档案库
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            管理所有投递候选人信息、AI 匹配度评分及流转进度
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            导出花名册
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            录入候选人
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
              placeholder="按姓名、技能标签或摘要模糊搜索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
          </InputGroup>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "frontend", "ui-ux", "office"].map((r) => (
            <Button
              key={r}
              size="xs"
              variant={roleFilter === r ? "default" : "outline"}
              onPress={() => setRoleFilter(r)}
              className="text-xs"
            >
              {r === "all" ? "全部" : r === "frontend" ? "大前端" : r === "ui-ux" ? "UI/UX" : "办公室"}
            </Button>
          ))}
        </div>
      </div>

      {/* Candidates Table Card */}
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">档案清单</CardTitle>
              <CardDescription className="text-xs">
                共找到 {applications.length} 位匹配候选人
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">候选人姓名</th>
                  <th className="px-4 py-3">意向组别</th>
                  <th className="px-4 py-3">专业技能</th>
                  <th className="px-4 py-3 text-center">AI 匹配分</th>
                  <th className="px-4 py-3">当前状态</th>
                  <th className="px-4 py-3">投递时间</th>
                  <th className="px-4 py-3 text-right">快捷操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm" className="bg-cyan-100 text-cyan-800">
                            <AvatarFallback className="bg-cyan-100 text-xs font-semibold text-cyan-800">
                              {app.applicantName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{app.applicantName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{app.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(app.skills ?? []).map((s) => (
                            <Badge key={s} variant="secondary" className="px-1.5 py-0 text-[10px]">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-foreground">
                        {app.score ?? "--"}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.submittedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-xs" aria-label="查看详情">
                            <Eye className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-xs" aria-label="标记通过">
                            <UserCheck className="size-3.5 text-emerald-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      未找到符合条件的候选人档案
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
