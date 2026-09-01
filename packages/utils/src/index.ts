import type { ApplicationStatus, TaskStatus } from "@codepaint/types";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(value));
}

export function applicationStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = { submitted: "已提交", processing: "材料处理中", contacted: "等待联系", closed: "已归档" };
  return labels[status];
}

export function taskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = { queued: "排队中", processing: "处理中", completed: "已完成", failed: "解析失败" };
  return labels[status];
}
