import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" }>) {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer";
  const variants = {
    primary: "bg-sky-400 text-slate-950 shadow-xs hover:bg-sky-300 active:scale-[0.98]",
    secondary: "bg-white/10 text-slate-100 hover:bg-white/15 active:scale-[0.98]",
    outline: "border border-white/15 bg-white/[0.04] text-slate-100 shadow-xs hover:bg-white/[0.08] hover:border-white/25 active:scale-[0.98]",
    ghost: "text-slate-300 hover:bg-white/10 hover:text-white active:scale-[0.98]",
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
    neutral: "bg-white/10 text-slate-200 border-white/10",
    blue: "bg-sky-500/15 text-sky-300 border-sky-400/20",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    red: "bg-rose-500/15 text-rose-300 border-rose-400/20",
    amber: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  }[tone ?? "neutral"];

  const dotClass = {
    neutral: "bg-slate-400",
    blue: "bg-sky-500",
    green: "bg-emerald-500",
    red: "bg-rose-500",
    amber: "bg-amber-500",
  }[tone ?? "neutral"];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight ${toneClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">
      {children}
    </p>
  );
}
