import type {
  ApiResponse,
  Application,
  DashboardSummary,
  RecruitmentRole,
  Role,
  TaskRecord,
  User,
} from "../types";

const baseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "/api/v1";

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

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

type ErrorBody = { error?: { code?: string; message?: string } };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    ...init,
  });

  // 204 / empty body must not go through response.json().
  const raw = response.status === 204 ? "" : await response.text();
  let body: (ApiResponse<T> & ErrorBody) | null = null;
  if (raw) {
    try {
      body = JSON.parse(raw) as ApiResponse<T> & ErrorBody;
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error?.message ?? `请求失败（HTTP ${response.status}）`,
      body?.request_id,
      body?.error?.code,
    );
  }

  return (body?.data ?? null) as T;
}

export type RegisterInput = { email: string; name: string; password: string };
export type LoginInput = { email: string; password: string };
export type SessionUser = { user: User };
export type Principal = { id: string; roles: Role[] };

export const api = {
  // --- public ---
  getRecruitment: () =>
    request<{ title: string; intro: string }>("/public/recruitment"),
  getRoles: () => request<RecruitmentRole[]>("/public/recruitment/roles"),

  // --- auth ---
  register: (input: RegisterInput) =>
    request<SessionUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: LoginInput) =>
    request<SessionUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () =>
    request<null>("/auth/logout", {
      method: "POST",
    }),
  getPrincipal: () => request<Principal>("/auth/me"),

  // --- workspace (requires recruiter role) ---
  getDashboard: () => request<DashboardSummary>("/workspace/dashboard"),
  getApplicants: () => request<Application[]>("/workspace/applicants"),
  getTasks: () => request<TaskRecord[]>("/workspace/tasks"),
};
