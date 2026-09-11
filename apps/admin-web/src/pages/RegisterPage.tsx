import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { Role } from "../lib/types";
import { useAuthStore } from "../store/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const authLoading = useAuthStore((state) => state.isLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("recruiter");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("请输入成员姓名或昵称");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("请输入有效的组织或个人邮箱");
      return;
    }
    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setError(null);
    try {
      const ok = await register(name.trim(), email.trim(), role);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/workspace/dashboard");
        }, 600);
      }
    } catch {
      setError("注册申请提交失败，请稍后再试");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background radial highlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background"
        aria-hidden="true"
      />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            to="/workspace/dashboard"
            className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground font-mono text-sm font-bold tracking-tight text-background shadow-md transition-transform group-hover:scale-105">
              <span className="absolute -right-3 -top-3 size-9 rounded-full bg-cyan-400/25" />
              CP
            </span>
            <div className="text-left">
              <span className="block text-sm font-bold tracking-[0.18em] text-foreground">
                CODEPAINT
              </span>
              <span className="block text-xs font-medium text-muted-foreground">
                招新管理工作台
              </span>
            </div>
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-2.5 text-[11px] font-medium">
              <Sparkles className="size-3 text-cyan-600" />
              成员邀请与注册
            </Badge>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="mt-6 border shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">
              注册管理员账号
            </CardTitle>
            <CardDescription className="text-xs">
              创建招募团队账号以参与初筛评审与流程流转
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="size-4" />
                <AlertTitle className="text-xs font-medium">注册校验未通过</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-200 bg-emerald-50 py-2.5 text-emerald-800">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <AlertTitle className="text-xs font-medium">注册成功</AlertTitle>
                <AlertDescription className="text-xs">
                  正在初始化工作区并进入概览看板...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs">
                  真实姓名 / 成员昵称
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-name"
                    required
                    placeholder="例如：张明远"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-xs">
                  工作邮箱
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">申请角色权限</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("recruiter")}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all ${
                      role === "recruiter"
                        ? "border-primary bg-accent/50 text-foreground ring-1 ring-primary"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">招新管理员</span>
                    <span className="text-[10px] text-muted-foreground">拥有完整审核与流转权限</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all ${
                      role === "user"
                        ? "border-primary bg-accent/50 text-foreground ring-1 ring-primary"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">评审打分专家</span>
                    <span className="text-[10px] text-muted-foreground">查看简历与打分评审</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-xs">
                  登录密码 (不少于 6 位)
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm" className="text-xs">
                  确认密码
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <Button
                type="submit"
                className="w-full font-medium"
                isDisabled={authLoading || success}
              >
                {authLoading ? (
                  "正在创建账号..."
                ) : (
                  <>
                    创建账号并进入工作台 <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t bg-muted/10 py-3 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <span>已有成员账号？</span>
              <Link
                to="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                返回登录
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
