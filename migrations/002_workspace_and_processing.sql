-- Establish the tenant boundary before adding recruiter-facing resources.
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id, role_id)
);

INSERT INTO workspaces (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'CodePaint Studio')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE recruitment_roles ADD COLUMN IF NOT EXISTS workspace_id UUID;
UPDATE recruitment_roles SET workspace_id = '00000000-0000-0000-0000-000000000001' WHERE workspace_id IS NULL;
ALTER TABLE recruitment_roles ALTER COLUMN workspace_id SET NOT NULL;
DO $$ BEGIN
  ALTER TABLE recruitment_roles ADD CONSTRAINT recruitment_roles_workspace_fk
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS recruitment_roles_workspace_idx ON recruitment_roles (workspace_id, is_public);

ALTER TABLE applications ADD COLUMN IF NOT EXISTS workspace_id UUID;
UPDATE applications SET workspace_id = '00000000-0000-0000-0000-000000000001' WHERE workspace_id IS NULL;
ALTER TABLE applications ALTER COLUMN workspace_id SET NOT NULL;
DO $$ BEGIN
  ALTER TABLE applications ADD CONSTRAINT applications_workspace_fk
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS applications_workspace_status_idx ON applications (workspace_id, status, updated_at DESC);

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
