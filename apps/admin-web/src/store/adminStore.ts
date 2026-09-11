import { create } from "zustand";
import { api } from "../lib/api-client";
import type { DashboardSummary } from "../lib/types";

const mockDashboard: DashboardSummary = {
  pendingReview: 14,
  processing: 3,
  failed: 1,
  newThisWeek: 28,
  recentApplications: [
    {
      id: "app-1",
      applicantName: "李思睿",
      role: "大前端项目组",
      roleSlug: "frontend",
      status: "submitted",
      submittedAt: "10分钟前",
      summary: "熟练掌握 React 18, TypeScript, Tailwind，有个人开源博客与组件库沉淀。",
      skills: ["React", "TypeScript", "Next.js"],
      score: 92,
    },
    {
      id: "app-2",
      applicantName: "张嘉琳",
      role: "UI / UX 设计项目组",
      roleSlug: "ui-ux",
      status: "processing",
      submittedAt: "35分钟前",
      summary: "精通 Figma 设计系统，曾获全国高校数艺大赛省级二等奖，产出完整交互原型作品集。",
      skills: ["Figma", "Design System", "交互设计"],
      score: 88,
    },
    {
      id: "app-3",
      applicantName: "赵云天",
      role: "办公室运营与策划组",
      roleSlug: "office",
      status: "submitted",
      submittedAt: "1小时前",
      summary: "有大型学生技术沙龙与迎新活动策划组织经验，熟练掌握飞书多维表格与协同知识库管理。",
      skills: ["活动统筹", "飞书知识库", "组织协同"],
      score: 85,
    },
    {
      id: "app-4",
      applicantName: "王逸飞",
      role: "大前端项目组",
      roleSlug: "frontend",
      status: "contacted",
      submittedAt: "2小时前",
      summary: "深入研究 Vue3 与前端工程化，已完成初筛沟通，学习自驱力强。",
      skills: ["Vue3", "Vite", "Pinia"],
      score: 90,
    },
  ],
  tasks: [
    {
      id: "task-101",
      title: "李思睿_前端开发个人简历.pdf (OCR & LLM 结构化提取)",
      status: "completed",
      stage: "LLM 信息抽取完成",
      updatedAt: "19:24:10",
    },
    {
      id: "task-102",
      title: "张嘉琳_UI交互设计作品集.pdf (多模态视觉版面识别)",
      status: "processing",
      stage: "视觉模块特征编码中 (78%)",
      updatedAt: "19:28:45",
    },
    {
      id: "task-103",
      title: "陈思远_个人简历_v2.docx (格式转化与内容对齐)",
      status: "failed",
      stage: "DOCX 损坏或编码异常",
      updatedAt: "19:15:02",
    },
  ],
};

type AdminState = {
  dashboard: DashboardSummary | null;
  loading: boolean;
  filterRole: string;
  load: () => Promise<void>;
  setFilterRole: (filterRole: string) => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  dashboard: null,
  loading: true,
  filterRole: "all",
  load: async () => {
    set({ loading: true });
    try {
      const dashboard = await api.getDashboard();
      set({ dashboard });
    } catch {
      set({ dashboard: mockDashboard });
    } finally {
      set({ loading: false });
    }
  },
  setFilterRole: (filterRole) => set({ filterRole }),
}));
