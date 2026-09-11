# Plan and Execute

This is the mandatory workflow for non-trivial changes. A trivial local change
may use the same artifacts in abbreviated form, but it still needs verification
and a truthful completion record.

## 1. Intake and classification

Write a short objective and classify the change across all seven dimensions:

```text
scope: local | module | cross-module | system
api_impact: none | internal | public
data_impact: none | additive | destructive
security_impact: none | possible | direct
ambiguity: low | medium | high
reversibility: easy | moderate | hard
architecture_impact: none | possible | direct
```

When a dimension is unknown, record it as unknown during intake and escalate
the planner. Do not treat unknown as none. For this repository, also identify
whether the change crosses `apps/`, `packages/`, `backend/`, `migrations/`,
`deploy/`, or `docs/` boundaries.

## 2. Context pack

Before planning, gather only the context needed for the change:

- relevant files and symbols
- existing tests and commands
- frontend workspace scripts and backend Go commands
- public contracts and consumers
- constraints from `AGENTS.md` and `harness`
- dependency, data, security, and rollback considerations
- known assumptions and unresolved questions

The context pack is passed to the coder with the task. The coder should not
need to rediscover the whole repository or infer unstated acceptance criteria.

## 3. Plan

Create `runtime/plans/<plan-id>.yaml` from the plan schema. The plan must state
the objective, scope and exclusions, affected paths, assumptions, risks,
acceptance criteria, validation commands, rollback, model assignments, task
IDs, and approval status. Every acceptance criterion needs a verification
method.

Split work into small tasks with explicit dependencies. A task should have one
clear outcome and a reviewable diff. Parallelize only tasks with disjoint write
sets and no data or ordering dependency.

## 4. Plan validation and approval

Before execution, check that:

- every task has allowed paths and acceptance criteria
- task dependencies form an acyclic graph
- the selected route satisfies the highest-risk dimension
- required checks and rollback are present
- approval requirements are satisfied

Do not execute an artifact in `draft` or `needs_replan`. High-risk routes wait
for the required human approval before a write task starts.

## 5. Execution

The coder may modify only its task's `allowed_paths`. It must:

- read the plan, task, and context pack first
- make the smallest complete change
- avoid changing policy to make a check pass
- stop on missing requirements, scope violations, or contradictory evidence
- update task state and record evidence after each meaningful step

If the implementation exposes a plan defect, use `blocked` or `needs_replan`.
Do not invent a new requirement or silently edit another task.

## 6. Verification and review

Move the task to `verifying` before running checks. Run the commands declared by
the plan and record exit codes. Distinguish code failures, test failures,
environment failures, and missing tooling.

Review compares the diff against the plan, not just the final output. The
reviewer checks scope, behavior, edge cases, security, compatibility, tests,
and residual risk. Strong review is mandatory for routes that require it.

Only move to `completed` when acceptance criteria, required checks, and review
evidence are all present. A model's statement that it is done is not evidence.
For frontend changes, run the root pnpm checks. For backend changes, run the
backend check even when no database or Redis service is required.

## 7. Failure, retry, and replanning

- Retry at most the configured limit and only with a concrete hypothesis.
- A deterministic failure after the retry limit becomes `failed` or
  `needs_replan`, not an endless loop.
- Replanning creates a new plan revision or records a new plan artifact while
  preserving the previous evidence.
- Never erase failed attempts; they are part of the audit trail.

## Durable state

Use the state schema to record the current plan status, task statuses, attempts,
timestamps, active task, blockers, and evidence references. Valid terminal
states are `completed`, `failed`, and `cancelled`. A plan cannot jump from
`executing` directly to `completed`; it must pass verification and review.
