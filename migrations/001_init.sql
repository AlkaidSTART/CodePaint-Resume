CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS recruitment_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_user_id UUID NOT NULL REFERENCES users(id),
  intended_role_id UUID NOT NULL REFERENCES recruitment_roles(id),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'contacted', 'closed')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS applications_owner_idx ON applications (applicant_user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status, updated_at DESC);

INSERT INTO roles (code, name) VALUES ('user', '普通用户'), ('recruiter', '招新成员') ON CONFLICT (code) DO NOTHING;
INSERT INTO recruitment_roles (slug, name, description) VALUES
  ('engineering', '工程', '做产品、工具和实验，把想法变成可使用的东西。'),
  ('design', '设计', '让复杂的想法变得清楚、好用，也有自己的性格。'),
  ('content', '内容', '把正在发生的事情讲清楚，让好想法被更多人看见。')
ON CONFLICT (slug) DO NOTHING;
