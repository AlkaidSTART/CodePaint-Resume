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
  PanelLeft,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "../../store/authStore";

export type AdminShellNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type AdminShellProps = PropsWithChildren<{
  workspaceName?: string;
  contextLabel?: string;
  pageLabel?: string;
  navigation?: AdminShellNavItem[];
  renderContent?: () => React.ReactNode;
}>;

const DEFAULT_NAVIGATION: AdminShellNavItem[] = [
  { label: "概览看板", href: "/workspace/dashboard", icon: LayoutDashboard },
  { label: "报名收件箱", href: "/workspace/inbox", icon: Inbox, badge: "12" },
  { label: "候选人列表", href: "/workspace/applicants", icon: Users },
  { label: "招募岗位管理", href: "/workspace/roles", icon: BriefcaseBusiness },
  { label: "简历解析模板", href: "/workspace/templates", icon: FileText },
  { label: "后台异步队列", href: "/workspace/tasks", icon: Clock3 },
];

function ProductBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/workspace/dashboard"
      className="group flex min-h-10 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="CodePaint 招新管理工作台"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground font-mono text-[11px] font-bold tracking-tight text-background shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        <span className="absolute -right-3 -top-3 size-8 rounded-full bg-cyan-300/20" aria-hidden="true" />
        CP
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold tracking-[0.16em] text-foreground">CODEPAINT</span>
          <span className="mt-0.5 block truncate text-[11px] font-medium text-muted-foreground">招新管理工作台</span>
        </span>
      )}
    </Link>
  );
}

function Navigation({ items, onNavigate }: { items: AdminShellNavItem[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="工作区导航">
      <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Workspace Views
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function UserStatus({
  user,
  compact = false,
  onLogout,
}: {
  user: { name: string; email?: string; role?: string; initials?: string };
  compact?: boolean;
  onLogout?: () => void;
}) {
  const initials = user.initials ?? user.name.slice(0, 1);
  return (
    <div className={`flex items-center justify-between ${compact ? "gap-2" : "gap-3"}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar size={compact ? "sm" : "default"} className="bg-foreground text-background">
          <AvatarFallback className="bg-foreground text-background">{initials}</AvatarFallback>
          <AvatarBadge className="bg-emerald-500" />
        </Avatar>
        {!compact && (
          <div className="min-w-0">
            <span className="block truncate text-xs font-semibold text-foreground">{user.name}</span>
            <span className="block truncate text-[10px] text-muted-foreground">{user.email ?? user.role ?? "招新管理员"}</span>
          </div>
        )}
      </div>

      {onLogout && !compact && (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="退出登录"
          onPress={onLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

function WorkspaceSwitcher({ workspaceName }: { workspaceName: string }) {
  return (
    <DropdownMenuTrigger>
      <Button variant="outline" size="sm" className="max-w-44 gap-2 bg-background font-medium">
        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
        <span className="truncate text-xs">{workspaceName}</span>
        <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />
      </Button>
      <DropdownMenu className="w-56">
        <DropdownMenuLabel>切换工作区</DropdownMenuLabel>
        <DropdownMenuItem textValue="CodePaint 2026 秋招">
          <Check className="text-primary size-4" />
          CodePaint 2026 秋招
        </DropdownMenuItem>
        <DropdownMenuItem textValue="设计与视觉创新组">设计与视觉创新组</DropdownMenuItem>
        <DropdownMenuItem textValue="技术架构孵化营">技术架构孵化营</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="创建招新工作区">+ 新建招新工作区</DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
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
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="打开用户菜单">
        <UserStatus user={user} compact />
      </Button>
      <DropdownMenu className="w-56" placement="bottom end">
        <DropdownMenuLabel>
          <span className="block text-sm font-semibold">{user.name}</span>
          <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
            {user.email ?? "admin@codepaint.studio"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="账号设置" onAction={() => navigate("/workspace/settings")}>
          <Settings className="size-3.5 mr-2" />
          账号与全局设置
        </DropdownMenuItem>
        <DropdownMenuItem textValue="退出登录" onAction={onLogout} className="text-destructive">
          <LogOut className="size-3.5 mr-2" />
          退出当前账号
        </DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}

export function AdminShell({
  children,
  workspaceName = "2026 秋季招新",
  contextLabel = "CodePaint 招新组",
  pageLabel = "概览看板",
  navigation = DEFAULT_NAVIGATION,
  renderContent,
}: AdminShellProps) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    <div className="min-h-screen bg-muted/40 text-foreground selection:bg-cyan-100 selection:text-cyan-950">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-transform focus:translate-y-0"
      >
        跳至主要内容
      </a>

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-md">
        <div className="flex min-h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Left section: Drawer Toggle + Brand/Breadcrumb */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Drawer Sidebar Trigger Button - visible on all devices */}
            <TooltipTrigger delay={200}>
              <Button
                variant="outline"
                size="icon"
                aria-label={drawerOpen ? "关闭导航抽屉" : "打开侧边导航抽屉"}
                onPress={() => setDrawerOpen((open) => !open)}
                className="gap-1.5"
              >
                <PanelLeft className="size-4" aria-hidden="true" />
              </Button>
              <Tooltip>侧边栏抽屉导航</Tooltip>
            </TooltipTrigger>

            <ProductBrand />

            <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

            <nav aria-label="面包屑导航" className="hidden min-w-0 items-center gap-2 text-xs sm:flex">
              <Link
                to="/workspace/dashboard"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {contextLabel}
              </Link>
              <span className="text-muted-foreground/40" aria-hidden="true">/</span>
              <span className="truncate font-semibold text-foreground" aria-current="page">
                {pageLabel}
              </span>
            </nav>
          </div>

          {/* Right section: Workspace switcher + Notifications + User Menu */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <WorkspaceSwitcher workspaceName={workspaceName} />
            </div>

            <TooltipTrigger delay={300}>
              <Button
                variant={notificationOpen ? "secondary" : "ghost"}
                size="icon"
                aria-label="查看通知中心"
                onPress={() => setNotificationOpen((open) => !open)}
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <Tooltip>通知中心</Tooltip>
            </TooltipTrigger>

            <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>

        {/* Real-time Notifications Popover */}
        {notificationOpen && (
          <div className="absolute right-4 top-[3.75rem] z-40 w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-background p-4 shadow-xl sm:right-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold">通知中心</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">当前有 3 项需要关注</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">实时</Badge>
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <p className="rounded-lg border-l-2 border-amber-400 bg-amber-50/50 p-2 text-muted-foreground">
                1 份简历解析失败，建议进入任务队列优先重试。
              </p>
              <p className="rounded-lg border-l-2 border-cyan-500 bg-cyan-50/50 p-2 text-muted-foreground">
                张嘉琳的作品集视觉多模态版面特征识别已完成。
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content - Full Screen Width */}
      <main id="main-content" className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-[92rem]">{content}</div>
      </main>

      {/* Sidebar as Drawer (抽屉栏) */}
      <SheetContent
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        side="left"
        className="w-[min(20rem,88vw)] max-w-xs p-0 shadow-2xl"
      >
        <SheetHeader className="border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <ProductBrand />
          </div>
          <SheetTitle className="sr-only">工作区抽屉导航</SheetTitle>
          <SheetDescription className="sr-only">快速流转切换管理视图</SheetDescription>
        </SheetHeader>

        {/* Drawer Workspace Switcher */}
        <div className="border-b bg-muted/20 px-5 py-3">
          <WorkspaceSwitcher workspaceName={workspaceName} />
        </div>

        {/* Drawer Nav links */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <Navigation items={navigation} onNavigate={() => setDrawerOpen(false)} />
        </div>

        {/* Drawer Bottom Bar: Settings & User Profile */}
        <div className="space-y-3 border-t bg-muted/10 p-4">
          <NavLink
            to="/workspace/settings"
            onClick={() => setDrawerOpen(false)}
            className="flex min-h-9 items-center gap-3 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-4" aria-hidden="true" />
            <span>系统设置与权限</span>
          </NavLink>

          <div className="border-t pt-3">
            <UserStatus user={user} onLogout={handleLogout} />
          </div>
        </div>
      </SheetContent>
    </div>
  );
}

export { DEFAULT_NAVIGATION };
