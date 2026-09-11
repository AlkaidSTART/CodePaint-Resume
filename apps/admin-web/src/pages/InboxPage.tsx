import { useState } from "react";
import {
  CheckCheck,
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

export function InboxPage() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const applications = dashboard?.recentApplications ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            报名收件箱
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            集中审核新投递的简历申请，支持批量初审、通过与发送通知邮件
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <CheckCheck className="size-3.5 text-emerald-600" />
              批量初筛通过 ({selectedIds.length})
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Send className="size-3.5 text-cyan-600" />
              批量发送通知
            </Button>
          </div>
        )}
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === applications.length}
              onChange={selectAll}
              className="size-4 rounded border-border"
              aria-label="全选"
            />
            <span className="text-xs font-semibold text-muted-foreground">
              已选 {selectedIds.length} / {applications.length} 项
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            待处理申请 12 份
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {applications.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              return (
                <li
                  key={app.id}
                  className={`flex items-center gap-3.5 p-4 transition-colors ${
                    isSelected ? "bg-accent/40" : "hover:bg-muted/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(app.id)}
                    className="size-4 rounded border-border"
                    aria-label={`选择候选人 ${app.applicantName}`}
                  />

                  <Avatar size="sm" className="bg-cyan-100 text-cyan-800">
                    <AvatarFallback className="text-xs font-semibold text-cyan-800">
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
                      <span className="text-[11px] text-muted-foreground">
                        {app.submittedAt}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {app.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-700">
                      {app.score ? `${app.score}分` : "--"}
                    </span>
                    <Button variant="ghost" size="xs" className="text-xs">
                      查看简历
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
