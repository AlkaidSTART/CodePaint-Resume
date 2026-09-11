import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Check,
  Cpu,
  Globe,
  Save,
  ShieldCheck,
} from "lucide-react";
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

gsap.registerPlugin(useGSAP);

export function SettingsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".anim-settings-header", { opacity: 0, y: -8, duration: 0.3, ease: "power2.out" });
        gsap.from(".anim-settings-card", {
          opacity: 0,
          y: 8,
          duration: 0.28,
          stagger: 0.06,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    },
    []
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-settings-header flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
            <span>STUDIO SYSTEM CONFIGURATION</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            工作台系统设置
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护工作室招聘周期、LLM 解析网关、飞书通知集成及权限策略
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs font-medium" onPress={handleSave}>
          {saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
          {saved ? "配置已保存" : "保存所有配置"}
        </Button>
      </div>

      <div className="grid gap-5">
        {/* Model Gateway */}
        <Card className="anim-settings-card border shadow-sm">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-cyan-600" />
              <CardTitle className="text-base font-semibold">LLM 推理网关与模型端点</CardTitle>
            </div>
            <CardDescription className="text-xs">
              配置用于简历结构化提取、多模态图表识别及候选人初筛打分的 API 服务
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">推理服务商 Base URL</Label>
                <Input defaultValue="https://dashscope.aliyuncs.com/compatible-mode/v1" className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">API Key 凭据</Label>
                <Input type="password" defaultValue="sk-********************************" className="font-mono text-xs" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">默认主干文本模型</Label>
                <Input defaultValue="qwen-2.5-72b-instruct" className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">多模态版面识别模型</Label>
                <Input defaultValue="qwen-vl-max" className="font-mono text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Cycle & Public Web */}
        <Card className="anim-settings-card border shadow-sm">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-emerald-600" />
              <CardTitle className="text-base font-semibold">招新周期与对外门户</CardTitle>
            </div>
            <CardDescription className="text-xs">
              控制面向学生大众的前台投递门户状态与轮次信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">当前招新轮次代号</Label>
                <Input defaultValue="2026-AUTUMN-CYCLE" className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">简历接收截止日期</Label>
                <Input defaultValue="2026-10-31 23:59:59" className="font-mono text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="anim-settings-card border shadow-sm">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-600" />
              <CardTitle className="text-base font-semibold">安全凭据与评审角色</CardTitle>
            </div>
            <CardDescription className="text-xs">
              设置工作室内部评审员与管理员的权限边界
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 text-xs">
            <p className="text-muted-foreground">
              当前启用了 RBAC 基于角色的访问控制策略。所有初筛决策、评分修改记录均写入不可篡改的操作审计日志。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
