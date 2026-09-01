import type { ApiResponse, DashboardSummary, RecruitmentRole, User } from "@codepaint/types";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";

export class ApiError extends Error {
	readonly status: number;
	readonly requestId?: string;
	readonly code?: string;

	constructor(status: number, message: string, requestId?: string, code?: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.requestId = requestId;
		this.code = code;
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { credentials: "include", ...init });
  const body = await response.json().catch(() => ({})) as ApiResponse<T> & { error?: { code?: string; message?: string } };
  if (!response.ok) {
	throw new ApiError(response.status, body.error?.message ?? `API request failed: ${response.status}`, body.request_id, body.error?.code);
  }
  return body.data;
}

export const api = {
  getRecruitment: () => request<{ title: string; intro: string }>("/public/recruitment"),
  getRoles: () => request<RecruitmentRole[]>("/public/recruitment/roles"),
  getDashboard: () => request<DashboardSummary>("/workspace/dashboard"),
  getMe: () => request<User>("/auth/me"),
};
