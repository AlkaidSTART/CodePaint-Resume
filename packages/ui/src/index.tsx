import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" }>) {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer";
  const variants = {
    primary: "bg-slate-900 text-white shadow-xs hover:bg-slate-800 active:scale-[0.98]",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98]",
    outline: "border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]",
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
    neutral: "bg-slate-100 text-slate-700 border-slate-200/60",
    blue: "bg-sky-50/80 text-sky-700 border-sky-200/60",
    green: "bg-emerald-50/80 text-emerald-700 border-emerald-200/60",
    red: "bg-rose-50/80 text-rose-700 border-rose-200/60",
    amber: "bg-amber-50/80 text-amber-700 border-amber-200/60",
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
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-600">
      {children}
    </p>
  );
}
