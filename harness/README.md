# Harness

`harness` is the repository's development control plane. It defines how work is
classified, planned, executed, verified, reviewed, and recorded. It is
model-agnostic: `small`, `medium`, and `strong` are capability levels, not
provider-specific model names. This repository is a pnpm workspace containing
two Vite frontends, shared TypeScript packages, and a Go backend.

## Source of truth

| Path | Responsibility |
| --- | --- |
| `politics/models.yaml` | Capability levels and role responsibilities |
| `politics/routing.yaml` | Risk-based model routing and escalation |
| `politics/permissions.yaml` | Read, write, execute, and approval boundaries |
| `politics/state-machine.yaml` | Valid plan/task states and transitions |
| `rules/coding.md` | Code quality and implementation rules |
| `rules/workflow.md` | Plan-and-execute operating procedure |
| `schemas/*.schema.yaml` | Machine-readable artifact contracts |
| `templates/*.yaml` | Copy-ready starting points for runtime artifacts |
| `checks/` | Repository and Harness verification commands |
| `runtime/plans/` | One plan artifact per change |
| `runtime/tasks/` | One task artifact per executable unit |
| `runtime/states/` | Durable state and evidence for resumability |

Runtime artifacts are generated state, not policy. Policy files must not be
rewritten by a coder task. Runtime artifacts must never contain secrets,
credentials, complete environment files, or unnecessary source dumps.

## Repository boundaries

| Area | Paths | Primary commands |
| --- | --- | --- |
| Public frontend | `apps/public-web/` | `pnpm --filter @codepaint/public-web ...` |
| Admin frontend | `apps/admin-web/` | `pnpm --filter @codepaint/admin-web ...` |
| Shared packages | `packages/` | Included by frontend workspace scripts |
| Go backend | `backend/` | `go test ./...`, `go vet ./...`, `go build ./cmd/...` |
| Runtime dependencies | `deploy/compose/` | `make infra` when integration services are needed |

The root `package.json` is the frontend aggregation boundary. The root
`pnpm-lock.yaml` is authoritative. Do not introduce Bun commands or a Bun
lockfile into plans, templates, permissions, or checks.

## Operating model

Every non-trivial change follows this lifecycle:

```text
intake -> classify -> gather context -> plan -> validate plan
      -> approve when required -> execute tasks -> verify
      -> review -> complete
```

If the plan is invalid, the task is outside its declared scope, or verification
fails for a reason the current plan cannot resolve, stop and use `needs_replan`.
Do not silently expand scope. A task may be retried only when the failure is
transient or the retry has a concrete, recorded hypothesis.

## Risk routing

The routing decision is made from the task's risk dimensions, not from a single
keyword. Use the highest-risk matching route. If two rules have the same
priority, choose the stronger model. If classification is incomplete or
ambiguous, escalate to `strong` and require review.

At minimum, the planner records:

- `scope`: local, module, cross-module, or system
- `api_impact`: none, internal, or public
- `data_impact`: none, additive, or destructive
- `security_impact`: none, possible, or direct
- `ambiguity`: low, medium, or high
- `reversibility`: easy, moderate, or hard
- `architecture_impact`: none, possible, or direct

Strong planning and review are mandatory for direct security work, destructive
data changes, public API compatibility changes, architecture changes, and
production-affecting work. Human approval is required wherever the routing
policy says so.

## Runtime artifact naming

Use a lowercase kebab-case `plan_id` and these paths:

```text
runtime/plans/<plan-id>.yaml
runtime/tasks/<plan-id>--<task-id>.yaml
runtime/states/<plan-id>.yaml
runtime/states/<plan-id>--<task-id>.evidence.yaml
```

The schemas and templates are normative. A plan references task IDs; a task
references its plan and allowed paths; evidence records commands, exit codes,
changed files, tests, review, and remaining risks. A task is not complete merely
because its model says it is complete: its required checks and evidence must be
present.

## Verification

From the repository root:

```bash
bash harness/checks/validate.sh
bash harness/checks/lint.sh
bash harness/checks/typecheck.sh
bash harness/checks/test.sh
bash harness/checks/backend.sh
bash harness/checks/build.sh
```

`verify.sh` runs the complete sequence. The test check intentionally fails with
an actionable message only when no repository test surface exists. At present,
the Go backend tests are the repository test surface; frontend test coverage is
still a documented gap.

The checks are location-independent and resolve the repository root from their
own path. Keep the repository's package-manager choice consistent with
`package.json`; this repository uses pnpm. Backend checks run from `backend/`
so Go module resolution remains deterministic.
