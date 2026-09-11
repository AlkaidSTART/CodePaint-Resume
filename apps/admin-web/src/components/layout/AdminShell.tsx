import { useEffect, useId, useState, type PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Briefcase,
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
  X,
} from "lucide-react";

export type AdminShellNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type AdminShellProps = PropsWithChildren<{
  /** The current workspace label shown in the context switcher. */
  workspaceName?: string;
  /** The secondary context shown in the top bar. */
  contextLabel?: string;
  /** Optional route title rendered in the desktop top bar. */
  pageLabel?: string;
  /** Optional navigation override for products embedding the shell. */
  navigation?: AdminShellNavItem[];
  /** Optional main content render slot for consumers that prefer a function. */
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
  { label: "招募岗位管理", href: "/workspace/roles", icon: Briefcase },
  { label: "简历解析模板", href: "/workspace/templates", icon: FileText },
  { label: "后台异步队列", href: "/workspace/tasks", icon: Clock3 },
];

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    "group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium",
    "transition-[background-color,color,box-shadow] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    isActive
      ? "bg-accent-soft text-accent-strong shadow-[inset_0_0_0_1px_rgba(15,113,134,0.1)]"
      : "text-muted hover:bg-slate-50 hover:text-ink",
  ].join(" ");

function ProductBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/workspace/dashboard"
      className="group flex min-h-10 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label="CodePaint 招新管理工作台"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink font-mono text-[11px] font-bold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-cyan-300/20" aria-hidden="true" />
        CP
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold tracking-[0.18em] text-ink">CODEPAINT</span>
          <span className="mt-0.5 block truncate text-[11px] font-medium text-muted">招新管理工作台</span>
        </span>
      )}
    </Link>
  );
}

function Navigation({ items, onNavigate }: { items: AdminShellNavItem[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="工作区导航">
      <p className="mb-3 px-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">Workspace</p>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <NavLink to={item.href} className={navLinkClass} onClick={onNavigate}>
                <Icon className="h-[18px] w-[18px] shrink-0 text-subtle transition-colors group-hover:text-muted" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted group-[.active]:bg-white/60 group-[.active]:text-accent-strong">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function UserStatus({ user }: { user: NonNullable<AdminShellProps["user"]> }) {
  const initials = user.initials ?? user.name.slice(0, 1);
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white" aria-hidden="true">
        {initials}
        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${user.status === "away" ? "bg-amber-400" : "bg-emerald-500"}`} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
        <span className="block truncate text-[11px] text-muted">{user.role ?? "招新评审员"}</span>
      </span>
    </div>
  );
}

function WorkspaceSwitcher({ workspaceName }: { workspaceName: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        className="group flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-left transition-[border-color,box-shadow] hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle sm:block">Workspace</span>
        <span className="max-w-36 truncate text-sm font-semibold text-ink">{workspaceName}</span>
        <ChevronDown className={`h-4 w-4 text-subtle transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 rounded-2xl border border-line bg-surface p-2 shadow-[0_18px_50px_rgba(23,33,43,0.12)]">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">切换工作区</p>
          <button type="button" role="menuitem" className="flex w-full items-center gap-3 rounded-xl bg-accent-soft px-3 py-2.5 text-left text-sm font-medium text-accent-strong">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink font-mono text-[9px] font-bold text-white">CP</span>
            <span className="min-w-0 flex-1 truncate">{workspaceName}</span>
            <Check className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" role="menuitem" className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-slate-50 hover:text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-subtle">+</span>
            <span>新建工作区</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminShell({
  children,
  renderContent,
  workspaceName = "2026 秋季招新",
  contextLabel = "招募管理",
  pageLabel = "概览看板",
  navigation = DEFAULT_NAVIGATION,
  user = { name: "招新评审员", role: "Workspace admin", initials: "招", status: "online" },
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const content = renderContent ? renderContent() : children;

  return (
    <div className="min-h-screen bg-workspace text-ink selection:bg-cyan-100 selection:text-cyan-950">
      <a href="#main-content" className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0">
        跳至主要内容
      </a>

      <aside className="sticky top-0 z-30 hidden h-screen w-[17.5rem] shrink-0 flex-col border-r border-line bg-surface/95 px-4 py-5 backdrop-blur lg:flex">
        <div className="px-2"><ProductBrand /></div>
        <div className="mt-10 flex-1"><Navigation items={navigation} /></div>
        <div className="space-y-4 border-t border-line pt-4">
          <Link to="/workspace/settings" className="flex min-h-10 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-muted transition-colors hover:bg-slate-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            <Settings className="h-[18px] w-[18px] text-subtle" aria-hidden="true" />
            <span>系统设置与权限</span>
          </Link>
          <UserStatus user={user} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="移动端工作区导航">
          <button type="button" className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(20rem,88vw)] flex-col border-r border-line bg-surface px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between px-2"><ProductBrand /><button type="button" className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="关闭导航" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" aria-hidden="true" /></button></div>
            <div className="mt-10 flex-1"><Navigation items={navigation} onNavigate={() => setMobileOpen(false)} /></div>
            <div className="border-t border-line pt-4"><UserStatus user={user} /></div>
          </aside>
        </div>
      )}

      <div className="min-w-0 lg:fixed lg:inset-y-0 lg:left-[17.5rem] lg:right-0 lg:overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-xl">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" className="rounded-xl border border-line bg-surface p-2.5 text-muted shadow-sm hover:border-slate-300 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden" aria-label="打开导航" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="lg:hidden"><ProductBrand compact /></div>
              <nav aria-label="面包屑" className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
                <Link to="/workspace/dashboard" className="font-medium text-muted transition-colors hover:text-ink">{contextLabel}</Link>
                <span className="text-slate-300" aria-hidden="true">/</span>
                <span className="truncate font-semibold text-ink" aria-current="page">{pageLabel}</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <WorkspaceSwitcher workspaceName={workspaceName} />
              <button type="button" className="hidden rounded-xl p-2.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex" aria-label="查看通知">
                <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <div className="hidden h-7 w-px bg-line sm:block" aria-hidden="true" />
              <div className="hidden md:block"><UserStatus user={user} /></div>
            </div>
          </div>
        </header>

        <div className="border-b border-line bg-surface/90 px-4 py-2.5 lg:hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-muted"><PanelLeftClose className="h-3.5 w-3.5 text-subtle" aria-hidden="true" /><span>{contextLabel}</span><span className="text-slate-300" aria-hidden="true">/</span><span className="truncate text-ink">{pageLabel}</span></div>
        </div>

        <main id="main-content" className="min-h-[calc(100vh-4.5rem)] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-[90rem]">{content}</div>
        </main>
      </div>
    </div>
  );
}

export { DEFAULT_NAVIGATION };
