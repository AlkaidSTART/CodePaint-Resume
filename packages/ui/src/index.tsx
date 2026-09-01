import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({ children, className = "", ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[#111] px-5 text-sm font-medium text-white transition hover:bg-[#2e4559] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

export function StatusMark({ children, tone = "neutral" }: PropsWithChildren<{ tone?: "neutral" | "blue" | "green" | "red" }>) {
  const toneClass = { neutral: "bg-slate-100 text-slate-700", blue: "bg-sky-50 text-sky-800", green: "bg-emerald-50 text-emerald-800", red: "bg-rose-50 text-rose-800" }[tone];
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{children}</span>;
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{children}</p>;
}
