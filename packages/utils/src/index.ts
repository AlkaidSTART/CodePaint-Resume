import type { ApplicationStatus, TaskStatus } from "@codepaint/types";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(value));
}

export function applicationStatusLabel(status: ApplicationStatus): string {
  return { submitted: "已提交", processing: "材料处理中", contacted: "等待联系", closed: "已归档" }[status];
}

export function taskStatusLabel(status: TaskStatus): string {
  return { queued: "排队中", processing: "处理中", completed: "已完成", failed: "解析失败" }[status];
}
