import { useState, type PropsWithChildren } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "../../store/authStore";

export type AdminShellNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  section?: "core" | "system";
};

export type AdminShellProps = PropsWithChildren<{
  workspaceName?: string;
  contextLabel?: string;
  pageLabel?: string;
  navigation?: AdminShellNavItem[];
  renderContent?: () => React.ReactNode;
}>;

const DEFAULT_NAVIGATION: AdminShellNavItem[] = [
  { label: "概览看板", href: "/workspace/dashboard", icon: LayoutDashboard, section: "core" },
  { label: "报名收件箱", href: "/workspace/inbox", icon: Inbox, badge: "12", section: "core" },
  { label: "候选人档案库", href: "/workspace/applicants", icon: Users, section: "core" },
  { label: "招募岗位管理", href: "/workspace/roles", icon: BriefcaseBusiness, section: "core" },
  { label: "简历解析模板", href: "/workspace/templates", icon: FileText, section: "system" },
  { label: "异步解析队列", href: "/workspace/tasks", icon: Clock3, section: "system" },
  { label: "系统设置", href: "/workspace/settings", icon: Settings, section: "system" },
];

function ProductBrand() {
  return (
    <Link
      to="/workspace/dashboard"
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="CodePaint 招新管理控制台"
    >
      <img
        src="/logo.png"
        alt="CodePaint Studio Logo"
        className="size-8 rounded-lg object-contain shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-foreground">
            CODEPAINT
          </span>
          <Badge variant="outline" className="border-border/60 bg-muted/30 px-1 py-0 text-[9px] font-mono text-muted-foreground">
            PRO
          </Badge>
        </div>
        <span className="block truncate text-[11px] font-medium text-muted-foreground">
          招新与评审控制台
        </span>
      </div>
    </Link>
  );
}

function WorkspaceSwitcher({ workspaceName }: { workspaceName: string }) {
  return (
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-between gap-2 border-border/70 bg-card/50 text-xs font-medium hover:bg-muted/40"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">{workspaceName}</span>
        </div>
        <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />
      </Button>
      <DropdownMenu className="w-56" placement="bottom start">
        <DropdownMenuLabel>切换活动周期</DropdownMenuLabel>
        <DropdownMenuItem textValue="2026 秋季招新">
          <Check className="size-3.5 text-primary" />
          2026 秋季招新 (当前)
        </DropdownMenuItem>
        <DropdownMenuItem textValue="2026 春季招新归档">
          2026 春季招新归档
        </DropdownMenuItem>
        <DropdownMenuItem textValue="极客夏令营 2025">
          极客夏令营 2025
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="新建招募周期">
          + 创建新招新周期
        </DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}

function SidebarNav({ items }: { items: AdminShellNavItem[] }) {
  const coreItems = items.filter((i) => i.section !== "system");
  const systemItems = items.filter((i) => i.section === "system");

  const renderNavGroup = (title: string, groupItems: AdminShellNavItem[]) => (
    <div className="space-y-1">
      <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
        {title}
      </p>
      <ul className="space-y-0.5">
        {groupItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  [
                    "group relative flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent/80 font-semibold text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary"
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      className={`size-4 shrink-0 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="h-4 min-w-4 px-1 text-[10px] font-mono tabular-nums"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <nav className="flex-1 space-y-5 px-3 py-4" aria-label="侧边栏主导航">
      {renderNavGroup("核心工作台 / CORE", coreItems)}
      {renderNavGroup("系统与流水线 / PIPELINE", systemItems)}
    </nav>
  );
}

function UserMenu({
  user,
  onLogout,
}: {
  user: { name: string; email?: string; role?: string; initials?: string };
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2.5 px-2 py-2 hover:bg-muted/60 text-left"
        aria-label="打开用户设置与退出菜单"
      >
        <Avatar size="sm" className="border bg-muted">
          <AvatarFallback className="text-xs font-semibold">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-foreground">
            {user.name}
          </span>
          <span className="block truncate text-[10px] text-muted-foreground">
            {user.email ?? "admin@codepaint.studio"}
          </span>
        </div>
        <ChevronDown className="size-3 text-muted-foreground" />
      </Button>

      <DropdownMenu className="w-56" placement="top start">
        <DropdownMenuLabel>
          <span className="block text-xs font-semibold">{user.name}</span>
          <span className="text-[10px] text-muted-foreground">{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="全局设置" onAction={() => navigate("/workspace/settings")}>
          <Settings className="size-3.5 mr-2" />
          工作台全局设置
        </DropdownMenuItem>
        <DropdownMenuItem textValue="退出登录" onAction={onLogout} className="text-destructive">
          <LogOut className="size-3.5 mr-2" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}

export function AdminShell({
  children,
  workspaceName = "2026 秋季招新",
  contextLabel = "CodePaint 招新",
  pageLabel = "概览看板",
  navigation = DEFAULT_NAVIGATION,
  renderContent,
}: AdminShellProps) {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const user = {
    name: authUser?.name ?? "林默",
    email: authUser?.email ?? "admin@codepaint.studio",
    role: authUser?.roles.includes("recruiter") ? "招新管理员" : "评审专家",
    initials: (authUser?.name ?? "林").slice(0, 1),
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const content = renderContent ? renderContent() : children;

  return (
    <div className="min-h-screen bg-muted/30 text-foreground selection:bg-cyan-100 selection:text-cyan-950">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-transform focus:translate-y-0"
      >
        跳至主要内容
      </a>

      {/* Desktop Persistent Refined Studio Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/70 bg-card/60 backdrop-blur-xl md:flex"
        aria-label="工作室管理导航"
      >
        {/* Brand & Workspace Switcher Header */}
        <div className="border-b border-border/60 p-4 space-y-3">
          <ProductBrand />
          <WorkspaceSwitcher workspaceName={workspaceName} />
        </div>

        {/* Scrollable Nav List */}
        <SidebarNav items={navigation} />

        {/* Studio Status & User Card Footer */}
        <div className="border-t border-border/60 p-3 space-y-2.5 bg-card/30">
          <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-cyan-600" />
              <span>OCR & LLM 管线</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">ONLINE</span>
          </div>

          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="size-7 rounded-md object-contain" />
          <span className="font-mono text-xs font-bold tracking-wider">CODEPAINT</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={notificationOpen ? "secondary" : "ghost"}
            size="icon-xs"
            aria-label="通知中心"
            onPress={() => setNotificationOpen((v) => !v)}
          >
            <Bell className="size-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="退出登录"
            onPress={handleLogout}
          >
            <LogOut className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Mobile Horizontal Navigation Rail (Eliminates drawer, fast tap switching) */}
      <nav
        aria-label="移动端工作台导航"
        className="sticky top-14 z-20 flex gap-1 overflow-x-auto border-b border-border/60 bg-card/80 px-3 py-2 backdrop-blur-md md:hidden"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")
              }
            >
              <Icon className="size-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 rounded-full bg-background/20 px-1 py-0.2 font-mono text-[9px]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Main Content Area Offset by Desktop Sidebar */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Desktop Breadcrumb & Notifications Bar */}
        <header className="sticky top-0 z-20 hidden min-h-12 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:flex">
          <nav aria-label="面包屑导航" className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{contextLabel}</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-semibold text-foreground">{pageLabel}</span>
          </nav>

          <div className="flex items-center gap-3">
            <TooltipTrigger delay={300}>
              <Button
                variant={notificationOpen ? "secondary" : "ghost"}
                size="icon-xs"
                aria-label="查看通知中心"
                onPress={() => setNotificationOpen((open) => !open)}
              >
                <Bell className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </Button>
              <Tooltip>通知中心</Tooltip>
            </TooltipTrigger>
          </div>

          {/* Desktop Notifications Popover */}
          {notificationOpen && (
            <div className="absolute right-6 top-11 z-40 w-80 rounded-xl border border-border bg-card p-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-semibold">通知中心</span>
                <Badge variant="secondary" className="text-[10px]">3 条新动态</Badge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <p className="rounded-lg border-l-2 border-emerald-500 bg-muted/30 p-2">
                  林思齐的「前端开发工程」初审任务已被评审员认领。
                </p>
                <p className="rounded-lg border-l-2 border-amber-500 bg-muted/30 p-2">
                  有 1 份 PDF 作品集解析异常，需手动触发重新抽取。
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Viewport */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[94rem]">{content}</div>
        </main>
      </div>
    </div>
  );
}

export { DEFAULT_NAVIGATION };
