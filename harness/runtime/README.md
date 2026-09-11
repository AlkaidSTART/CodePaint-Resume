# Runtime artifacts

Runtime files are durable plan, task, state, and evidence records. Use the
schemas in `harness/schemas/` and copy the templates from `harness/templates/`.

Do not store credentials, complete environment files, or large source dumps in
runtime artifacts. Preserve failed attempts and append new evidence rather than
overwriting history.

Each plan must name its affected and excluded repository boundaries. For this
monorepo, distinguish frontend (`apps/`, `packages/`), backend (`backend/`),
data (`migrations/`), deployment (`deploy/`), and documentation (`docs/`).
Evidence should record frontend and backend checks separately so a passing
frontend build cannot conceal a failing Go test or vet run.
