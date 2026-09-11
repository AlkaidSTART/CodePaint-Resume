import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from "react";
import { useState } from "react";

type ClassName = string | false | null | undefined;

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "quiet" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type StatusTone = "neutral" | "blue" | "green" | "red" | "amber" | "violet";

function cx(...classes: ClassName[]): string {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-ink bg-ink text-white shadow-[0_1px_1px_rgb(15_23_42/0.12),0_8px_20px_rgb(15_23_42/0.10)] hover:-translate-y-px hover:bg-slate-800 hover:shadow-[0_3px_2px_rgb(15_23_42/0.12),0_12px_24px_rgb(15_23_42/0.14)] active:translate-y-0 active:shadow-sm",
  secondary:
    "border border-accent-soft bg-accent-soft text-accent-strong hover:-translate-y-px hover:border-cyan-200 hover:bg-cyan-100 active:translate-y-0",
  outline:
    "border border-line bg-surface text-ink shadow-[0_1px_1px_rgb(15_23_42/0.03)] hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:translate-y-0",
  ghost: "border border-transparent text-muted hover:bg-slate-100 hover:text-ink active:bg-slate-200",
  quiet: "border border-transparent text-subtle hover:bg-slate-50 hover:text-ink active:bg-slate-100",
  danger:
    "border border-rose-200 bg-rose-600 text-white shadow-[0_1px_1px_rgb(190_24_93/0.16)] hover:-translate-y-px hover:bg-rose-700 active:translate-y-0",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-8 rounded-lg px-3 text-xs",
  md: "min-h-10 rounded-xl px-4 text-sm",
  lg: "min-h-11 rounded-xl px-5 text-sm",
  icon: "h-10 w-10 rounded-xl p-0",
};

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx("ui-spinner", className)}
      aria-hidden="true"
    />
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
  }
>) {
  return (
    <button
      className={cx(
        "ui-button inline-flex cursor-pointer select-none items-center justify-center gap-2 font-medium tracking-[-0.01em] transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      aria-busy={loading || undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    variant?: ButtonVariant;
    size?: Exclude<ButtonSize, "lg">;
  }
>) {
  return (
    <Button
      {...props}
      className={cx("shrink-0", className)}
      variant={variant}
      size={size}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function Surface({
  children,
  className,
  elevated = false,
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    elevated?: boolean;
  }
>) {
  return (
    <div
      className={cx(
        "ui-surface rounded-2xl border border-line bg-surface",
        elevated && "shadow-[0_12px_40px_rgb(15_23_42/0.06)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Panel({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <Surface className={cx("overflow-hidden", className)} elevated {...props}>
      {children}
    </Surface>
  );
}

export function PanelHeader({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cx("flex flex-wrap items-start justify-between gap-4 border-b border-line/80 px-5 py-4 sm:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelTitle({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h2 className={cx("text-[15px] font-semibold tracking-[-0.02em] text-ink", className)} {...props}>
      {children}
    </h2>
  );
}

export function PanelDescription({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p className={cx("mt-1 text-sm leading-5 text-muted", className)} {...props}>
      {children}
    </p>
  );
}

export function PanelContent({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cx("px-5 py-5 sm:px-6", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelFooter({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cx("flex flex-wrap items-center justify-between gap-3 border-t border-line/80 px-5 py-4 sm:px-6", className)} {...props}>
      {children}
    </div>
  );
}

const statusStyles: Record<StatusTone, { badge: string; dot: string }> = {
  neutral: { badge: "border-line bg-slate-50 text-slate-700", dot: "bg-slate-400" },
  blue: { badge: "border-cyan-200 bg-cyan-50 text-cyan-800", dot: "bg-cyan-600" },
  green: { badge: "border-emerald-200 bg-emerald-50 text-emerald-800", dot: "bg-emerald-600" },
  red: { badge: "border-rose-200 bg-rose-50 text-rose-800", dot: "bg-rose-600" },
  amber: { badge: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-600" },
  violet: { badge: "border-violet-200 bg-violet-50 text-violet-800", dot: "bg-violet-600" },
};

export function StatusMark({
  children,
  tone = "neutral",
  className,
  pulse = false,
}: PropsWithChildren<{
  tone?: StatusTone;
  className?: string;
  pulse?: boolean;
}>) {
  const styles = statusStyles[tone];
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", styles.badge, className)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", styles.dot, pulse && "ui-pulse-dot")} aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  className,
  as: Element = "p",
}: PropsWithChildren<{
  className?: string;
  as?: "p" | "h2" | "h3";
}>) {
  return (
    <Element className={cx("mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle", className)}>
      {children}
    </Element>
  );
}

export function Progress({
  value,
  label,
  className,
  indicatorClassName,
  showValue = false,
}: {
  value: number;
  label?: string;
  className?: string;
  indicatorClassName?: string;
  showValue?: boolean;
}) {
  const clampedValue = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("w-full", className)}>
      {label || showValue ? (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-muted">
          {label ? <span>{label}</span> : <span />}
          {showValue ? <span className="tabular-nums text-ink">{Math.round(clampedValue)}%</span> : null}
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clampedValue)}
      >
        <div
          className={cx("h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none", indicatorClassName)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export function Avatar({
  alt,
  src,
  fallback,
  size = "md",
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClass = { sm: "h-7 w-7 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" }[size];
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span className={cx("ui-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-slate-100 font-semibold text-muted shadow-[0_0_0_1px_rgb(15_23_42/0.06)]", sizeClass, className)}>
      {showImage ? (
        <img
          {...props}
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden={alt ? undefined : true}>{fallback ?? alt?.slice(0, 1).toUpperCase() ?? "?"}</span>
      )}
    </span>
  );
}

export function AvatarGroup({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cx("flex -space-x-2", className)} {...props}>
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cx("h-px w-full bg-line/80", className)} role="separator" />;
}
