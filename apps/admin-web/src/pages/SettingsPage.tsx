import { useState } from "react";
import {
  Check,
  Save,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "../store/authStore";

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [autoOcr, setAutoOcr] = useState(true);
  const [autoMatchScore, setAutoMatchScore] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            系统设置与权限
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护招新协同工作区全局配置、流水线自动化触发规则及管理员角色权限
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onPress={handleSave}>
          {saved ? <Check className="size-3.5 text-emerald-300" /> : <Save className="size-3.5" />}
          {saved ? "已保存配置" : "保存所有设置"}
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Workspace Account Info */}
        <Card className="border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">当前管理员信息</CardTitle>
            <CardDescription className="text-xs">
              登录账号主体与绑定的组织角色
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">姓名 / 称谓</Label>
              <Input defaultValue={user?.name ?? "林默"} className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">工作邮箱</Label>
              <Input defaultValue={user?.email ?? "admin@codepaint.studio"} disabled className="text-xs opacity-70" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">已授权角色</Label>
              <div className="flex gap-2">
                {(user?.roles ?? ["recruiter"]).map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role === "recruiter" ? "招新管理员 (Recruiter)" : "评审专家 (User)"}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI & Automation Pipeline */}
        <Card className="border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">AI 解析与自动化流转</CardTitle>
            <CardDescription className="text-xs">
              控制投递简历的后台自动处理策略
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">新投递自动触发 OCR 解析</p>
                <p className="text-muted-foreground text-[11px]">投递成功后立即启动版面分析与文本抽取</p>
              </div>
              <Switch
                isSelected={autoOcr}
                onChange={setAutoOcr}
                aria-label="自动触发 OCR"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">自动计算岗位匹配度评分</p>
                <p className="text-muted-foreground text-[11px]">结合岗位 JD 进行 LLM 多维度打分与关键词匹配</p>
              </div>
              <Switch
                isSelected={autoMatchScore}
                onChange={setAutoMatchScore}
                aria-label="自动计算匹配分"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">异常任务飞书/邮件实时提醒</p>
                <p className="text-muted-foreground text-[11px]">当简历解析失败时推送告警给值班管理员</p>
              </div>
              <Switch
                isSelected={notifications}
                onChange={setNotifications}
                aria-label="异常任务通知"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
