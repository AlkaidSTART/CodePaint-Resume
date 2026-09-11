import {
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
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
  PanelLeftClose,
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
import { cn } from "@/lib/utils";
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

function ProductBrand({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Link
      to="/workspace/dashboard"
      className={cn(
        "group flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
        isCollapsed ? "justify-center" : "gap-2.5"
      )}
      aria-label="CodePaint 招新管理控制台"
    >
      <img
        src="/logo.png"
        alt="CodePaint Studio Logo"
        className="size-7 shrink-0 rounded-md object-contain"
      />
      {!isCollapsed && (
        <div className="min-w-0">
          <span className="block font-mono text-xs font-semibold tracking-wider text-foreground">
            CODEPAINT
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            招新评审控制台
          </span>
        </div>
      )}
    </Link>
  );
}

function WorkspaceSwitcher({
  workspaceName,
  isCollapsed,
}: {
  workspaceName: string;
  isCollapsed: boolean;
}) {
  return (
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "w-full border-border/70 bg-card/50 text-xs font-medium hover:bg-muted/40 transition-all duration-200",
          isCollapsed ? "justify-center px-0 size-9" : "justify-between gap-2 px-2.5"
        )}
        aria-label="切换活动周期"
      >
        {isCollapsed ? (
          <span className="font-mono text-xs font-bold text-foreground">
            {workspaceName.slice(0, 2)}
          </span>
        ) : (
          <>
            <span className="truncate">{workspaceName}</span>
            <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />
          </>
        )}
      </Button>
      <DropdownMenu className="w-56" placement={isCollapsed ? "right top" : "bottom start"}>
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

function SidebarNav({
  items,
  isCollapsed,
}: {
  items: AdminShellNavItem[];
  isCollapsed: boolean;
}) {
  const coreItems = items.filter((i) => i.section !== "system");
  const systemItems = items.filter((i) => i.section === "system");

  const renderNavGroup = (title: string, groupItems: AdminShellNavItem[]) => (
    <div className="space-y-1">
      {!isCollapsed && (
        <p className="px-2.5 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80 transition-opacity duration-200">
          {title}
        </p>
      )}
      <ul className="space-y-0.5">
        {groupItems.map((item) => {
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                  isCollapsed
                    ? "size-9 justify-center mx-auto"
                    : "min-h-9 w-full gap-2.5 px-3",
                  isActive
                    ? "bg-foreground/[0.08] dark:bg-foreground/[0.14] font-semibold text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left accent indicator bar aligned directly with the active row */}
                  {isActive && !isCollapsed && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors duration-150",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {!isCollapsed && (
                    <>
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
                </>
              )}
            </NavLink>
          );

          if (isCollapsed) {
            return (
              <li key={item.href} className="flex justify-center">
                <TooltipTrigger delay={200}>
                  {linkContent}
                  <Tooltip placement="right">{item.label}</Tooltip>
                </TooltipTrigger>
              </li>
            );
          }

          return <li key={item.href}>{linkContent}</li>;
        })}
      </ul>
    </div>
  );

  return (
    <nav
      className={cn(
        "flex-1 space-y-5 py-3 overflow-y-auto transition-all duration-200",
        isCollapsed ? "px-2" : "px-3"
      )}
      aria-label="侧边栏主导航"
    >
      {renderNavGroup("工作台", coreItems)}
      {renderNavGroup("流水线与系统", systemItems)}
    </nav>
  );
}

function UserMenu({
  user,
  onLogout,
  isCollapsed,
}: {
  user: { name: string; email?: string; role?: string; initials?: string };
  onLogout: () => void;
  isCollapsed: boolean;
}) {
  const navigate = useNavigate();

  return (
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        className={cn(
          "w-full hover:bg-muted/60 transition-all duration-150 active:scale-[0.98]",
          isCollapsed
            ? "justify-center px-0 size-9"
            : "justify-start gap-2.5 px-2 py-2 text-left"
        )}
        aria-label="打开用户设置与退出菜单"
      >
        <Avatar size="sm" className="border bg-muted shrink-0">
          <AvatarFallback className="text-xs font-semibold">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block truncate text-[10px] text-muted-foreground">
                {user.email ?? "admin@codepaint.studio"}
              </span>
            </div>
            <ChevronDown className="size-3 text-muted-foreground" />
          </>
        )}
      </Button>

      <DropdownMenu
        className="w-56"
        placement={isCollapsed ? "right bottom" : "top start"}
      >
        <DropdownMenuLabel>
          <span className="block text-xs font-semibold">{user.name}</span>
          <span className="text-[10px] text-muted-foreground">{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          textValue="全局设置"
          onAction={() => navigate("/workspace/settings")}
        >
          <Settings className="size-3.5 mr-2" />
          工作台全局设置
        </DropdownMenuItem>
        <DropdownMenuItem
          textValue="退出登录"
          onAction={onLogout}
          className="text-destructive"
        >
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Keyboard shortcut (Cmd+B / Ctrl+B) to toggle sidebar like Apple macOS apps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

      {/* Desktop Apple-style Fluid Persistent Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border/70 bg-card/65 backdrop-blur-2xl transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:flex",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
        aria-label="工作室管理导航"
      >
        {/* Brand & Workspace Switcher Header */}
        <div className="border-b border-border/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <ProductBrand isCollapsed={isCollapsed} />
            {!isCollapsed && (
              <TooltipTrigger delay={400}>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onPress={() => setIsCollapsed(true)}
                  className="text-muted-foreground hover:text-foreground active:scale-90 transition-transform"
                  aria-label="收起侧边栏 (⌘B)"
                >
                  <PanelLeftClose className="size-3.5" />
                </Button>
                <Tooltip>收起侧边栏 (⌘B)</Tooltip>
              </TooltipTrigger>
            )}
          </div>
          <WorkspaceSwitcher
            workspaceName={workspaceName}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Scrollable Nav List with Gliding Indicator */}
        <SidebarNav items={navigation} isCollapsed={isCollapsed} />

        {/* Studio Status & User Card Footer */}
        <div className="border-t border-border/60 p-3 space-y-2.5 bg-card/30">
          {!isCollapsed ? (
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-cyan-600" />
                <span>OCR & LLM 管线</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">ONLINE</span>
            </div>
          ) : (
            <TooltipTrigger delay={300}>
              <div className="flex justify-center py-1">
                <Sparkles className="size-3.5 text-cyan-600" />
              </div>
              <Tooltip placement="right">OCR & LLM 管线 ONLINE</Tooltip>
            </TooltipTrigger>
          )}

          <UserMenu
            user={user}
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
          />
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

      {/* Mobile Horizontal Navigation Rail with Smooth Touch Action */}
      <nav
        aria-label="移动端工作台导航"
        className="sticky top-14 z-20 flex gap-1 overflow-x-auto border-b border-border/60 bg-card/80 px-3 py-2 backdrop-blur-md md:hidden scrollbar-none"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
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
      <div
        className={cn(
          "flex flex-col min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isCollapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        {/* Desktop Breadcrumb & Notifications Bar */}
        <header className="sticky top-0 z-20 hidden min-h-12 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:flex">
          <div className="flex items-center gap-3">
            {isCollapsed && (
              <TooltipTrigger delay={400}>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onPress={() => setIsCollapsed(false)}
                  className="text-muted-foreground hover:text-foreground active:scale-90 transition-transform"
                  aria-label="展开侧边栏 (⌘B)"
                >
                  <PanelLeft className="size-3.5" />
                </Button>
                <Tooltip>展开侧边栏 (⌘B)</Tooltip>
              </TooltipTrigger>
            )}

            <nav aria-label="面包屑导航" className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{contextLabel}</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-semibold text-foreground">{pageLabel}</span>
            </nav>
          </div>

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
            <div
              role="dialog"
              aria-label="通知中心"
              className="absolute right-6 top-11 z-40 w-84 rounded-lg border border-neutral-100 bg-white shadow-sm p-4 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">系统动态</span>
                  <span className="font-mono text-[11px] text-muted-foreground">3 条未读</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  className="rounded p-0.5 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="关闭通知面板"
                >
                  ✕
                </button>
              </div>
              <ul className="mt-2.5 space-y-2 text-xs">
                <li className="rounded border-l-2 border-emerald-600 bg-muted/40 p-2.5">
                  <p className="font-medium text-foreground">初审认领</p>
                  <p className="mt-0.5 text-muted-foreground">
                    林思齐的「前端开发工程」初审已被评审员认领。
                  </p>
                </li>
                <li className="rounded border-l-2 border-amber-600 bg-muted/40 p-2.5">
                  <p className="font-medium text-foreground">解析异常提示</p>
                  <p className="mt-0.5 text-muted-foreground">
                    1 份 PDF 作品集解析超时，需在异步队列中手动重试。
                  </p>
                </li>
                <li className="rounded border-l-2 border-border bg-muted/20 p-2.5">
                  <p className="font-medium text-foreground">岗位配额变动</p>
                  <p className="mt-0.5 text-muted-foreground">
                    大前端项目组投递已达 18 份，接近设定配额警戒线。
                  </p>
                </li>
              </ul>
              <div className="mt-3 border-t border-border/60 pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  全部标为已读
                </button>
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

