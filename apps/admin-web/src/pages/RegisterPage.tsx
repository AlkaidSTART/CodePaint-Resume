import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
      setError("请输入成员姓名或技术昵称");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("请输入有效的组织或工作邮箱");
      return;
    }
    if (password.length < 6) {
      setError("密码长度至少为 6 位字符");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setError(null);
    try {
      const ok = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/workspace/dashboard");
        }, 500);
      }
    } catch {
      setError("注册申请提交失败，请核对信息后重试");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.25fr_0.75fr]">
        {/* Left: Editorial Studio Protocol & Roles (visible on desktop) */}
        <aside className="relative hidden flex-col justify-between border-r border-border bg-muted/20 p-10 lg:flex xl:p-14">
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
              <span className="flex size-9 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-bold text-background transition-transform duration-200 group-hover:scale-95">
                CP
              </span>
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

          {/* Center Editorial Narrative */}
          <div className="relative z-10 my-auto max-w-xl py-12">
            <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="size-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
              <span>COLLABORATOR ONBOARDING</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-[2.75rem] xl:leading-[1.15]">
              协同构建更专业的
              <br />
              招募与筛选标准。
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              加入 CodePaint 招新委员会，你将参与多模态简历解析 Schema 制定、打分细则沉淀及候选人面试流转全流程。系统严格遵循候选人信息隐私与保密协议。
            </p>

            {/* Workflow sequence */}
            <div className="mt-10 space-y-4 border-t border-border/80 pt-8 font-mono text-xs">
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">01</span>
                <div>
                  <span className="font-semibold text-foreground">身份注册与工作邮箱绑定</span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground font-sans">
                    创建成员通行证，连接飞书/内部通知管道
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">02</span>
                <div>
                  <span className="font-semibold text-foreground">分配评审组别与流转权限</span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground font-sans">
                    招新主管具备全功能审核，评审专家专注于方向打分
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">03</span>
                <div>
                  <span className="font-semibold text-foreground">即时访问协作控制台</span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground font-sans">
                    查阅候选人档案、解析任务队列与结构化提要
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <span className="font-mono text-[11px]">ACCESS CONTROL · LEVEL 2</span>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
              <span className="font-mono text-[11px]">AUTHENTICATED PIPELINE</span>
            </div>
          </div>
        </aside>

        {/* Right: Registration Form Surface */}
        <main className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-14 xl:px-16">
          {/* Mobile Top Brand (visible on < lg) */}
          <div className="flex items-center justify-between border-b border-border/60 pb-6 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-foreground font-mono text-xs font-bold text-background">
                CP
              </span>
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-foreground">
                CODEPAINT
              </span>
            </Link>
            <span className="font-mono text-[11px] text-muted-foreground">
              成员通行证
            </span>
          </div>

          {/* Form Center Container */}
          <div className="mx-auto my-auto w-full max-w-[380px] py-8 sm:max-w-[420px]">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                申请协作账号
              </h2>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                创建团队成员账号以参与候选人材料初审与流转
              </p>
            </div>

            {/* Error / Success Feedback */}
            {error && (
              <Alert variant="destructive" className="mb-6 py-2.5">
                <AlertCircle className="size-4" />
                <AlertTitle className="text-xs font-medium">注册校验未通过</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/10 py-2.5 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <AlertTitle className="text-xs font-medium">账号创建成功</AlertTitle>
                <AlertDescription className="text-xs">
                  正在初始化工作区并进入概览看板...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs font-medium">
                  真实姓名 / 成员昵称
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="size-4 text-muted-foreground" aria-hidden="true" />
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
                <Label htmlFor="reg-email" className="text-xs font-medium">
                  工作邮箱
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@codepaint.studio"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              {/* Role Selection Surface */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  申请角色权限
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("recruiter")}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all ${
                      role === "recruiter"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">招新主管</span>
                    <span className={`text-[10px] leading-tight ${role === "recruiter" ? "text-background/80" : "text-muted-foreground"}`}>
                      完整候选人初筛与岗位管理
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all ${
                      role === "user"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">评审打分专家</span>
                    <span className={`text-[10px] leading-tight ${role === "user" ? "text-background/80" : "text-muted-foreground"}`}>
                      查阅档案与提供专业打分
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-xs font-medium">
                  登录密码 (不少于 6 位)
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm" className="text-xs font-medium">
                  确认密码
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="reg-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full gap-2 text-xs font-semibold"
                isDisabled={authLoading || success}
              >
                {authLoading ? (
                  "正在创建账号..."
                ) : (
                  <>
                    创建账号并进入工作台 <ArrowRight className="size-3.5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
              <span>已有成员账号？</span>{" "}
              <Link
                to="/login"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                返回登录
              </Link>
            </div>
          </div>

          {/* Footer Provenance */}
          <div className="flex items-center justify-between border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-muted-foreground/70" />
              评审数据严格保密
            </span>
            <span className="font-mono">CP-ONBOARDING</span>
          </div>
        </main>
      </div>
    </div>
  );
}
