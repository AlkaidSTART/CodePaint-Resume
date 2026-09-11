# Repository Agent Instructions

## Scope

These instructions apply to the repository rooted at this file. The `harness`
directory is the authoritative development control plane. Read its README,
workflow rules, applicable politics, and the relevant schemas before making a
non-trivial change.

## Project facts

- Stack: pnpm workspace monorepo with React 19, TypeScript, Vite, and Go/Gin.
- Package manager: pnpm `11.17.0`; use `pnpm-lock.yaml` and do not introduce a
  second lockfile or switch package managers without an approved plan.
- Public frontend: `apps/public-web/`; admin frontend: `apps/admin-web/`.
- Shared TypeScript packages live under `packages/` and are linked through the
  workspace.
- The backend Go module lives under `backend/`; commands are in
  `backend/cmd/` and tests are colocated under `backend/`.
- Repository-wide TypeScript settings are in `tsconfig.json`; frontend package
  configs extend it and include shared package sources.
- Configuration contracts are documented in `docs/ENV_MATRIX.md`. Never read,
  print, commit, or modify `.env` files or credential material.

## Required workflow

For a non-trivial request:

1. Inspect the relevant code, configuration, tests, and documentation.
2. Classify the request using `harness/politics/routing.yaml`.
3. Create a plan under `harness/runtime/plans/` and task artifacts under
   `harness/runtime/tasks/` using the schemas and templates.
4. Declare affected paths, exclusions, acceptance criteria, dependencies,
   validation commands, risks, rollback, and model assignments.
5. Obtain approval when the route or permissions policy requires it.
6. Execute only ready tasks and only within each task's `allowed_paths`.
7. Run the checks required by the plan and record command, exit code, and result
   in state/evidence artifacts.
8. Review the diff against the plan and complete only after acceptance criteria,
   verification, and review evidence are present.

For a small, isolated change, a concise plan and task record are sufficient, but
the scope boundary and verification evidence are still required. If the plan
becomes invalid, stop and mark the task `needs_replan`; do not expand scope
silently.

## Editing and safety rules

- Follow `harness/rules/coding.md` for TypeScript, React, and Go changes.
- Keep frontend changes within the relevant `apps/` or `packages/` boundary;
  keep backend changes within `backend/` unless the plan explicitly includes
  migrations, deployment, or documentation.
- Never read, print, commit, or modify secrets, `.env` files, private keys, or
  credential directories.
- Do not modify `harness/politics`, `harness/rules`, schemas, or check scripts
  as part of an ordinary feature task. Those are policy changes and need their
  own reviewed plan.
- Keep diffs focused. Preserve unrelated user changes and existing behavior.
- Do not use destructive Git commands or rewrite history as a shortcut.
- Do not claim tests or checks passed without the recorded command and result.

## Local verification

From the repository root, use:

```bash
bash harness/checks/validate.sh
bash harness/checks/lint.sh
bash harness/checks/typecheck.sh
bash harness/checks/test.sh
bash harness/checks/backend.sh
bash harness/checks/build.sh
```

`bash harness/checks/verify.sh` runs the full sequence. `test.sh` runs the
backend Go tests because the root package currently has no `scripts.test`.
Frontend package `lint` scripts currently perform TypeScript checking; keep
that repository behavior explicit until a dedicated linter is introduced.
