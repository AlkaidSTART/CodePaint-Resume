import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" }>) {
  const base = "inline-flex min-h-10 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-ink text-white hover:bg-slate-800",
    secondary: "bg-accent-soft text-accent-strong hover:bg-cyan-100",
    outline: "border border-line bg-surface text-ink hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-muted hover:bg-slate-100 hover:text-ink",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function StatusMark({
  children,
  tone = "neutral",
}: PropsWithChildren<{ tone?: "neutral" | "blue" | "green" | "red" | "amber" }>) {
  const toneClass = {
    neutral: "border-line bg-slate-50 text-slate-700",
    blue: "border-cyan-200 bg-cyan-50 text-cyan-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-rose-200 bg-rose-50 text-rose-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone ?? "neutral"];

  const dotClass = {
    neutral: "bg-slate-400",
    blue: "bg-cyan-600",
    green: "bg-emerald-600",
    red: "bg-rose-600",
    amber: "bg-amber-600",
  }[tone ?? "neutral"];

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${toneClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}
