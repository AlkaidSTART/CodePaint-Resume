# ADR-0003 Backend as a Top-Level System

## Status

Accepted

## Decision

Move the Go API and Worker from `apps/api` to a top-level `backend` directory.
Keep `apps` limited to independently deployed user interfaces: `public-web` and
`admin-web`. Keep API and Worker in one Go module with separate `cmd` entrypoints.

OCR, email, storage and LLM implementations remain backend providers until they
need independent deployment or scaling. The HTTP API paths and shared frontend
package boundaries do not change.

## Consequences

- Go module and import paths change from `.../apps/api` to `.../backend`.
- Make targets, Docker/CI paths and backend documentation use `backend`.
- The API and Worker can share domain, task and provider interfaces without
  creating premature network boundaries.
