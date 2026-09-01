export type Role = "guest" | "user" | "recruiter";
export type UserStatus = "invited" | "active" | "suspended";
export type ApplicationStatus = "submitted" | "processing" | "contacted" | "closed";
export type TaskStatus = "queued" | "processing" | "completed" | "failed";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  status: UserStatus;
}

export interface RecruitmentRole {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  accent: string;
  details: string[];
}

export interface Application {
  id: string;
  applicantName: string;
  role: string;
  roleSlug: string;
  status: ApplicationStatus;
  submittedAt: string;
  summary: string;
  skills?: string[];
  score?: number;
}

export interface TaskRecord {
  id: string;
  title: string;
  status: TaskStatus;
  stage: string;
  updatedAt: string;
}

export interface DashboardSummary {
  pendingReview: number;
  processing: number;
  failed: number;
  newThisWeek: number;
  recentApplications: Application[];
  tasks: TaskRecord[];
}

export interface ApiResponse<T> {
  data: T;
  request_id: string;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; page_size: number; total: number; total_pages: number };
}
