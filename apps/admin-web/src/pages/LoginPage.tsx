import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const authLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("admin@codepaint.studio");
  const [password, setPassword] = useState("codepaint2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("请输入登录邮箱");
      return;
    }
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setError(null);
    try {
      const ok = await login(email.trim(), "recruiter");
      if (ok) {
        navigate("/workspace/dashboard");
      }
    } catch {
      setError("登录失败，请检查网络或重试");
    }
  };

  const handleQuickLogin = async (role: "recruiter" | "user") => {
    const targetEmail = role === "recruiter" ? "admin@codepaint.studio" : "reviewer@codepaint.studio";
    setEmail(targetEmail);
    setPassword("codepaint2026");
    setError(null);
    const ok = await login(targetEmail, role);
    if (ok) {
      navigate("/workspace/dashboard");
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
              2026 秋季招募季
            </Badge>
            <Badge variant="outline" className="text-[11px] text-muted-foreground">
              v0.1.0 内部协同
            </Badge>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="mt-6 border shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight">
              登录管理员账号
            </CardTitle>
            <CardDescription className="text-xs">
              输入凭证以进入招新审核中心及看板
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="size-4" />
                <AlertTitle className="text-xs font-medium">登录错误</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs">
                  工作邮箱 / 账号
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-email"
                    type="email"
                    required
                    placeholder="name@codepaint.studio"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs">
                    密码
                  </Label>
                  <button
                    type="button"
                    onClick={() => setPassword("codepaint2026")}
                    className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    重置演示密码
                  </button>
                </div>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="text-xs"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <Button
                type="submit"
                className="w-full font-medium"
                isDisabled={authLoading}
              >
                {authLoading ? (
                  "正在验证身份..."
                ) : (
                  <>
                    进入工作台 <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Section */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="bg-card px-2 font-medium">快速体验通道</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-1.5 text-xs"
                onPress={() => void handleQuickLogin("recruiter")}
                isDisabled={authLoading}
              >
                <ShieldCheck className="size-3.5 text-cyan-600" />
                <span className="truncate">超级管理员</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-1.5 text-xs"
                onPress={() => void handleQuickLogin("user")}
                isDisabled={authLoading}
              >
                <KeyRound className="size-3.5 text-amber-600" />
                <span className="truncate">评审专家</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t bg-muted/10 py-3 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <span>还没有成员账号？</span>
              <Link
                to="/register"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                申请加入团队
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Security / info footer */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          CodePaint 招新协同系统 · 端到端严格权限隔离
        </p>
      </div>
    </div>
  );
}
