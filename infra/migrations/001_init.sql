CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 租户工作区
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 用户与凭证
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 系统与租户角色
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('user', 'recruiter')),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  workspace_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id, role_id)
);

-- 会话鉴权
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions (expires_at);

-- 招新方向
CREATE TABLE IF NOT EXISTS recruitment_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recruitment_roles_workspace_idx ON recruitment_roles (workspace_id, is_public);

-- 报名申请
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  applicant_user_id UUID NOT NULL REFERENCES users(id),
  intended_role_id UUID NOT NULL REFERENCES recruitment_roles(id),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'contacted', 'closed')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS applications_owner_idx ON applications (applicant_user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS applications_workspace_status_idx ON applications (workspace_id, status, updated_at DESC);

-- 附件与简历
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  application_id UUID REFERENCES applications(id),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  sha256 TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attachments_workspace_idx ON attachments (workspace_id, created_at DESC);

CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  application_id UUID REFERENCES applications(id),
  attachment_id UUID NOT NULL REFERENCES attachments(id),
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'ready', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS resumes_workspace_idx ON resumes (workspace_id, updated_at DESC);

-- 结构化抽取模板与版本
CREATE TABLE IF NOT EXISTS resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'resume' CHECK (type IN ('resume', 'screening')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS resume_templates_workspace_idx ON resume_templates (workspace_id, status);

CREATE TABLE IF NOT EXISTS resume_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES resume_templates(id),
  version INTEGER NOT NULL CHECK (version > 0),
  schema_json JSONB NOT NULL,
  prompt TEXT NOT NULL DEFAULT '',
  rules_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (template_id, version)
);

-- 解析运行记录与流水线任务
CREATE TABLE IF NOT EXISTS resume_parse_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  resume_id UUID NOT NULL REFERENCES resumes(id),
  template_version_id UUID REFERENCES resume_template_versions(id),
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  provider TEXT,
  model TEXT,
  parser_version TEXT,
  source_text TEXT,
  structured_json JSONB,
  validation_errors JSONB,
  error_code TEXT,
  latency_ms INTEGER CHECK (latency_ms >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS resume_parse_runs_workspace_idx ON resume_parse_runs (workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resume_parse_runs_resume_idx ON resume_parse_runs (resume_id, created_at DESC);

CREATE TABLE IF NOT EXISTS processing_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  resume_id UUID REFERENCES resumes(id),
  parse_run_id UUID REFERENCES resume_parse_runs(id),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS processing_tasks_workspace_status_idx ON processing_tasks (workspace_id, status, updated_at DESC);

-- 审计日志
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_workspace_idx ON audit_events (workspace_id, created_at DESC);

-- 初始基础数据种子
INSERT INTO workspaces (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'CodePaint Studio')
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (code, name)
VALUES ('user', '普通用户'), ('recruiter', '招新成员')
ON CONFLICT (code) DO NOTHING;

INSERT INTO recruitment_roles (workspace_id, slug, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'engineering', '工程', '做产品、工具和实验，把想法变成可使用的东西。'),
  ('00000000-0000-0000-0000-000000000001', 'design', '设计', '让复杂的想法变得清楚、好用，也有自己的性格。'),
  ('00000000-0000-0000-0000-000000000001', 'content', '内容', '把正在发生的事情讲清楚，让好想法被更多人看见。')
ON CONFLICT (slug) DO NOTHING;
