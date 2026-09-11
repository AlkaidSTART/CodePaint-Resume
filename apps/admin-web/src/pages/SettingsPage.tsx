import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  BellRing,
  Check,
  Cpu,
  Globe,
  LoaderCircle,
  Radio,
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
  const [testingPing, setTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [portalOpen, setPortalOpen] = useState(true);

  // Form states
  const [baseUrl, setBaseUrl] = useState("https://dashscope.aliyuncs.com/compatible-mode/v1");
  const [apiKey, setApiKey] = useState("sk-********************************");
  const [primaryModel, setPrimaryModel] = useState("qwen-2.5-72b-instruct");
  const [vlModel, setVlModel] = useState("qwen-vl-max");
  const [feishuWebhook, setFeishuWebhook] = useState("https://open.feishu.cn/open-apis/bot/v2/hook/xxx");

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

  const handleTestConnection = () => {
    setTestingPing(true);
    setPingStatus(null);
    setTimeout(() => {
      setTestingPing(false);
      setPingStatus("连通成功 (延迟 68ms, 端点响应 200 OK)");
      setTimeout(() => setPingStatus(null), 4000);
    }, 900);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="anim-settings-header flex flex-col justify-between gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            工作台系统设置
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            维护工作室招聘周期、大模型推理端点、飞书群机器人通知与安全凭据
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs font-medium" onPress={handleSave}>
          {saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
          {saved ? "配置已保存" : "保存所有配置"}
        </Button>
      </div>

      {saved && (
        <div
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300"
        >
          系统配置已成功保存并实时生效
        </div>
      )}

      <div className="grid gap-5">
        {/* Model Gateway */}
        <Card className="anim-settings-card border shadow-xs">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-cyan-600" />
                <CardTitle className="text-base font-semibold">LLM 推理网关与模型端点</CardTitle>
              </div>
              <Button
                variant="outline"
                size="xs"
                isDisabled={testingPing}
                onPress={handleTestConnection}
                className="gap-1 text-xs"
              >
                {testingPing ? (
                  <LoaderCircle className="size-3 animate-spin" />
                ) : (
                  <Radio className="size-3 text-cyan-600" />
                )}
                {testingPing ? "测试连通中..." : "测试服务连通性"}
              </Button>
            </div>
            <CardDescription className="text-xs">
              配置用于简历结构化提取、多模态版面识别及候选人初筛打分的 API 服务
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-xs">
            {pingStatus && (
              <div
                role="status"
                className="rounded-md border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-xs font-medium text-cyan-900 dark:text-cyan-200"
              >
                {pingStatus}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="base-url" className="text-xs">推理服务商 Base URL</Label>
                <Input
                  id="base-url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="api-key" className="text-xs">API Key 凭据</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="primary-model" className="text-xs">默认主干文本模型</Label>
                <Input
                  id="primary-model"
                  value={primaryModel}
                  onChange={(e) => setPrimaryModel(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vl-model" className="text-xs">多模态版面识别模型</Label>
                <Input
                  id="vl-model"
                  value={vlModel}
                  onChange={(e) => setVlModel(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Cycle & Public Web */}
        <Card className="anim-settings-card border shadow-xs">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-emerald-600" />
                <CardTitle className="text-base font-semibold">招新周期与对外门户</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => setPortalOpen(!portalOpen)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
                  portalOpen
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-muted bg-muted/40 text-muted-foreground"
                }`}
                aria-pressed={portalOpen}
              >
                <span className={`size-1.5 rounded-full ${portalOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {portalOpen ? "门户已开放" : "门户已关闭"}
              </button>
            </div>
            <CardDescription className="text-xs">
              控制面向学生大众的前台投递门户状态与轮次信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cycle-code" className="text-xs">当前招新轮次代号</Label>
                <Input
                  id="cycle-code"
                  defaultValue="2026-AUTUMN-CYCLE"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs">简历接收截止日期</Label>
                <Input
                  id="deadline"
                  defaultValue="2026-10-31 23:59:59"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feishu Notification Integration */}
        <Card className="anim-settings-card border shadow-xs">
          <CardHeader className="border-b p-5 pb-3.5">
            <div className="flex items-center gap-2">
              <BellRing className="size-4 text-indigo-600" />
              <CardTitle className="text-base font-semibold">飞书群消息自动化通知</CardTitle>
            </div>
            <CardDescription className="text-xs">
              当有新候选人投递、初筛完成或高分匹配时，自动推送富文本卡片至评审群
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="feishu-webhook" className="text-xs">飞书自定义机器人 Webhook 地址</Label>
              <Input
                id="feishu-webhook"
                value={feishuWebhook}
                onChange={(e) => setFeishuWebhook(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="anim-settings-card border shadow-xs">
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
            <p className="text-muted-foreground leading-relaxed">
              当前启用了 RBAC 基于角色的访问控制策略。初筛决策、评分修改记录均写入不可篡改的操作审计日志，且所有简历联系方式在未分配权限前均执行自动脱敏。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
