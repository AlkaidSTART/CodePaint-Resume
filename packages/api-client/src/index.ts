import type { ApiResponse, DashboardSummary, RecruitmentRole } from "@codepaint/types";

const baseUrl = "http://localhost:8080/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { credentials: "include", ...init });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const body = await response.json() as ApiResponse<T>;
  return body.data;
}

export const api = {
  getRecruitment: () => request<{ title: string; intro: string }>("/public/recruitment"),
  getRoles: () => request<RecruitmentRole[]>("/public/recruitment/roles"),
  getDashboard: () => request<DashboardSummary>("/workspace/dashboard"),
};
