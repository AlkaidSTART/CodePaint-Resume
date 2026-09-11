-- Canonical migrations live in infra/migrations/ and are mounted by Compose as
-- the migrations/ directory so the official Postgres image can initialize a
-- fresh development volume.
\ir migrations/001_init.sql
