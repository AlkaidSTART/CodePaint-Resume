# ADR-0002: Separate Client Auth Helpers From API Authentication

## Status

Accepted

## Context

The monorepo has two React applications and a Go API. A shared TypeScript package named `auth` was easy to confuse with the server authentication module, even though it only contained client-side role helpers.

## Decision

- Rename the frontend-only package to `@codepaint/auth-client`.
- Keep authentication, principal construction, session parsing and RBAC middleware in `backend/internal/auth`.
- Frontend role checks may hide or redirect UI, but never authorize API access.
- The current `X-Demo-Role` parser remains development-only and must be replaced by HttpOnly session or bearer-token validation before production.

## Consequences

The dependency direction is explicit: React apps depend on `packages/auth-client`; Go handlers depend on `backend/internal/auth`; neither side imports the other implementation.
