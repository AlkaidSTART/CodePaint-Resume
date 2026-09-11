-- The repository root migrations remain canonical. This include lets the
-- official Postgres image initialize a fresh development volume.
\ir migrations/001_init.sql
