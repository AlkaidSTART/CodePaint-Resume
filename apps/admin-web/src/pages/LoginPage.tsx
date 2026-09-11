import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  const [activeRole, setActiveRole] = useState<"recruiter" | "user">("recruiter");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("请输入工作邮箱");
      return;
    }
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setError(null);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        navigate("/workspace/dashboard");
      }
    } catch {
      setError("登录凭证校验未通过，请核对邮箱与密码");
    }
  };

  const handleRolePreset = (role: "recruiter" | "user") => {
    setActiveRole(role);
    setError(null);
    if (role === "recruiter") {
      setEmail("admin@codepaint.studio");
      setPassword("codepaint2026");
    } else {
      setEmail("reviewer@codepaint.studio");
      setPassword("codepaint2026");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.25fr_0.75fr]">
        {/* Left: Editorial Studio Console Identity (hidden on mobile, visible on desktop) */}
        <aside className="relative hidden flex-col justify-between border-r border-border bg-muted/20 p-10 lg:flex xl:p-14">
          {/* Subtle architectural hairline background */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"
            aria-hidden="true"
          />

          {/* Top Brand Bar */}
          <div className="relative z-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src="/logo.png"
                alt="CodePaint Studio"
                className="size-9 rounded-lg object-contain shadow-xs transition-transform duration-200 group-hover:scale-105"
              />
              <div>
                <span className="block font-mono text-xs font-semibold tracking-[0.24em] text-foreground">
                  CODEPAINT STUDIO
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  招新与评审协作控制台
                </span>
              </div>
            </Link>
          </div>

          {/* Center Editorial Manifesto & Cadence */}
          <div className="relative z-10 my-auto max-w-xl py-12">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>AUTUMN 2026 RECRUITMENT CYCLE</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-[2.75rem] xl:leading-[1.15]">
              专注代码质量、
              <br />
              设计感知与工程深度。
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              CodePaint 招新管理系统服务于大前端、UI/UX 设计、办公室与后端架构四个组别的集中初筛、多模态简历解析与评审流转。不唯过往履历，重视作品思考与实现密度。
            </p>

            {/* Architecture Metrics Grid */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/80 pt-8 font-mono">
              <div>
                <span className="block text-2xl font-bold text-foreground">04</span>
                <span className="mt-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  协同方向组别
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-foreground">OCR+LLM</span>
                <span className="mt-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  结构化提取流水线
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-foreground">100%</span>
                <span className="mt-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  本地安全隔离
                </span>
              </div>
            </div>
          </div>

          {/* Bottom System Meta */}
          <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <span className="font-mono text-[11px]">VERSION 0.1.0 · BUILD 2026.09</span>
            <span className="font-mono text-[11px]">CLUSTER READY</span>
          </div>
        </aside>

        {/* Right: Interaction Form Surface */}
        <main className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-14 xl:px-16">
          {/* Mobile Top Brand (visible on < lg) */}
          <div className="flex items-center justify-between border-b border-border/60 pb-6 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src="/logo.png"
                alt="CodePaint Logo"
                className="size-8 rounded-md object-contain"
              />
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-foreground">
                CODEPAINT
              </span>
            </Link>
            <span className="font-mono text-[11px] text-muted-foreground">
              招新管理工作台
            </span>
          </div>

          {/* Main Form Center Box */}
          <div className="mx-auto my-auto w-full max-w-[380px] py-8 sm:max-w-[400px]">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                管理员登录
              </h2>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                输入团队成员凭证以进入候选人流转与初筛工作台
              </p>
            </div>

            {/* Quick Demo Segmented Switcher */}
            <div className="mb-6 rounded-lg border border-border bg-muted/30 p-1">
              <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleRolePreset("recruiter")}
                  className={`flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
                    activeRole === "recruiter"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeRole === "recruiter" && <Check className="size-3 text-emerald-600" />}
                  <span>主管账号</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRolePreset("user")}
                  className={`flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
                    activeRole === "user"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeRole === "user" && <Check className="size-3 text-emerald-600" />}
                  <span>评审账号</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6 py-2.5">
                <AlertCircle className="size-4" />
                <AlertTitle className="text-xs font-medium">验证失败</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-medium">
                  工作邮箱
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@codepaint.studio"
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-medium">
                    密码
                  </Label>
                </div>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-xs"
                  />
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Eye className="size-3.5 text-muted-foreground" />
                    )}
                  </InputGroupButton>
                </InputGroup>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full gap-2 text-xs font-semibold"
                isDisabled={authLoading}
              >
                {authLoading ? "正在验证凭证..." : "进入工作台"}
                {!authLoading && <ArrowRight className="size-3.5" />}
              </Button>
            </form>

            {/* Bottom Register Prompt */}
            <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
              <span>还没有加入评审团队？</span>{" "}
              <Link
                to="/register"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                申请协作账号
              </Link>
            </div>
          </div>

          {/* Footer Security / Provenance */}
          <div className="flex items-center justify-between border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-muted-foreground/70" />
              仅限内部授权人员访问
            </span>
            <span className="font-mono">CP-OPERATIONS</span>
          </div>
        </main>
      </div>
    </div>
  );
}
