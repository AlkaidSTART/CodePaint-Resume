import { useState, type PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
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
  Menu,
  PanelLeftClose,
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
  user?: {
    name: string;
    role?: string;
    initials?: string;
    status?: "online" | "away";
  };
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
      <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
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
                {item.badge && <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">{item.badge}</Badge>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function UserStatus({ user, compact = false }: { user: NonNullable<AdminShellProps["user"]>; compact?: boolean }) {
  const initials = user.initials ?? user.name.slice(0, 1);
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <Avatar size={compact ? "sm" : "default"} className="bg-foreground text-background">
        <AvatarFallback className="bg-foreground text-background">{initials}</AvatarFallback>
        <AvatarBadge className={user.status === "away" ? "bg-amber-400" : "bg-emerald-500"} />
      </Avatar>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{user.role ?? "招新管理员"}</span>
        </span>
      )}
    </div>
  );
}

function WorkspaceSwitcher({ workspaceName }: { workspaceName: string }) {
  return (
    <DropdownMenuTrigger>
      <Button variant="outline" size="sm" className="max-w-44 gap-2 bg-background font-medium">
        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
        <span className="truncate">{workspaceName}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </Button>
      <DropdownMenu className="w-56">
        <DropdownMenuLabel>切换工作区</DropdownMenuLabel>
        <DropdownMenuItem textValue="CodePaint 招新组"><Check className="text-primary" />CodePaint 招新组</DropdownMenuItem>
        <DropdownMenuItem textValue="设计项目组">设计项目组</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="新建工作区">+ 新建工作区</DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}

function UserMenu({ user }: { user: NonNullable<AdminShellProps["user"]> }) {
  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="打开用户菜单">
        <UserStatus user={user} compact />
      </Button>
      <DropdownMenu className="w-52" placement="bottom end">
        <DropdownMenuLabel>
          <span className="block">{user.name}</span>
          <span className="mt-1 block text-[11px] font-normal text-muted-foreground">{user.role ?? "招新管理员"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem textValue="账号设置">账号设置</DropdownMenuItem>
        <DropdownMenuItem textValue="退出登录">退出登录</DropdownMenuItem>
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
  user = { name: "林默", role: "超级管理员", initials: "林", status: "online" },
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const content = renderContent ? renderContent() : children;

  return (
    <div className="min-h-screen bg-muted/40 text-foreground selection:bg-cyan-100 selection:text-cyan-950">
      <a href="#main-content" className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-transform focus:translate-y-0">跳至主要内容</a>

      <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 flex-col border-r bg-background px-4 py-5 lg:flex">
        <div className="px-2"><ProductBrand /></div>
        <div className="mt-10 flex-1"><Navigation items={navigation} /></div>
        <div className="space-y-3 border-t pt-4">
          <NavLink to="/workspace/settings" className="flex min-h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Settings className="size-4" aria-hidden="true" /><span>系统设置与权限</span></NavLink>
          <UserStatus user={user} />
        </div>
      </aside>

      <div className="min-w-0 lg:fixed lg:inset-y-0 lg:left-64 lg:right-0 lg:overflow-y-auto">
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="打开导航" onPress={() => setMobileOpen(true)}>
                <Menu aria-hidden="true" />
              </Button>
              <div className="lg:hidden"><ProductBrand compact /></div>
              <nav aria-label="面包屑" className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
                <Link to="/workspace/dashboard" className="font-medium text-muted-foreground transition-colors hover:text-foreground">{contextLabel}</Link>
                <span className="text-muted-foreground/40" aria-hidden="true">/</span>
                <span className="truncate font-semibold text-foreground" aria-current="page">{pageLabel}</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden sm:block"><WorkspaceSwitcher workspaceName={workspaceName} /></div>
              <TooltipTrigger delay={300}>
                <Button variant={notificationOpen ? "secondary" : "ghost"} size="icon" aria-label="查看通知" onPress={() => setNotificationOpen((open) => !open)}>
                  <Bell aria-hidden="true" />
                </Button>
                <Tooltip>查看通知</Tooltip>
              </TooltipTrigger>
              <div className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
              <div className="hidden md:block"><UserMenu user={user} /></div>
            </div>
          </div>
          {notificationOpen && (
            <div className="absolute right-4 top-[4.25rem] z-30 w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-background p-4 shadow-lg sm:right-6">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">通知中心</p><p className="mt-1 text-xs text-muted-foreground">当前有 3 项需要关注</p></div><Badge variant="secondary">实时</Badge></div>
              <div className="mt-4 space-y-3 text-xs"><p className="border-l-2 border-amber-400 pl-3 text-muted-foreground">1 份简历解析失败，建议优先重试。</p><p className="border-l-2 border-cyan-500 pl-3 text-muted-foreground">张嘉琳的申请仍在视觉分析中。</p></div>
            </div>
          )}
        </header>

        <div className="border-b bg-background/90 px-4 py-2.5 lg:hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><PanelLeftClose className="size-3.5" aria-hidden="true" /><span>{contextLabel}</span><span className="text-muted-foreground/40" aria-hidden="true">/</span><span className="truncate text-foreground">{pageLabel}</span></div>
        </div>

        <main id="main-content" className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <div className="mx-auto w-full max-w-[90rem]">{content}</div>
        </main>
      </div>

      <SheetContent isOpen={mobileOpen} onOpenChange={setMobileOpen} side="left" className="w-[min(20rem,88vw)] max-w-none p-0 sm:max-w-sm">
        <SheetHeader className="border-b px-5 py-5 pr-14">
          <SheetTitle><ProductBrand /></SheetTitle>
          <SheetDescription>选择一个工作区页面</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-6"><Navigation items={navigation} onNavigate={() => setMobileOpen(false)} /></div>
        <div className="border-t px-5 py-4"><UserStatus user={user} /></div>
      </SheetContent>
    </div>
  );
}

export { DEFAULT_NAVIGATION };
