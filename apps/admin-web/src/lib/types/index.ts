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
  description?: string;
  accent?: string;
  details?: string[];
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

// --- LLM Extraction & Processing Types (from docs/SCHEMA.md) ---

export interface CandidateBasics {
  name: string;
  email?: string;
  phone?: string;
  gender?: "male" | "female" | "other" | "unknown";
  birth_year?: number;
  work_years: number;
  current_company?: string;
  current_title?: string;
  city?: string;
  summary?: string;
}

export interface EducationItem {
  school: string;
  major?: string;
  degree: "doctor" | "master" | "bachelor" | "junior_college" | "high_school" | "other";
  start_date?: string;
  end_date?: string;
}

export interface WorkExperienceItem {
  company: string;
  title: string;
  start_date?: string;
  end_date?: string;
  responsibilities?: string;
  achievements?: string[];
}

export interface ProjectExperienceItem {
  name: string;
  role?: string;
  description?: string;
  tech_stack?: string[];
  highlights?: string[];
}

export interface ScreeningAssessment {
  match_score: number;
  highlights: string[];
  risks: string[];
}

export type CriterionStatus = "met" | "partial" | "not_met" | "unknown";
export type ReviewPriority = "high" | "medium" | "low";

export interface CriterionEvidence {
  page: number;
  quote: string;
}

export interface CriterionItem {
  id: string;
  name?: string;
  weight?: number;
  status: CriterionStatus;
  confidence: number;
  reason: string;
  evidence: CriterionEvidence[];
  is_overridden?: boolean;
  human_status?: CriterionStatus | null;
  override_reason?: string;
}

export interface CriteriaAssessment {
  summary: string;
  criteria: CriterionItem[];
  strengths: string[];
  concerns: string[];
  suggested_interview_questions: string[];
  review_priority: ReviewPriority;
  calculated_score?: number;
}

export interface ResumeExtractionResult {
  basics: CandidateBasics;
  education: EducationItem[];
  work_experience?: WorkExperienceItem[];
  project_experience?: ProjectExperienceItem[];
  skills: string[];
  screening_assessment?: ScreeningAssessment;
  criteria_assessment?: CriteriaAssessment;
}

export interface PluginInfo {
  name: string;
  display_name: string;
  enabled: boolean;
  config_masked: Record<string, unknown>;
  last_delivery_at?: string;
}

