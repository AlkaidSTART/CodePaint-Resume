# Coding Rules

These rules apply to every implementation task. Repository-specific rules in
`AGENTS.md` and the task's plan add constraints; they do not weaken these
defaults without an explicit review decision.

## TypeScript and React

- Use TypeScript strictness already configured by the repository.
- Do not use `any`. Prefer `unknown` at untrusted boundaries and narrow it with
  validation or type guards.
- Do not suppress compiler errors with `@ts-ignore`, `@ts-nocheck`, or broad
  casts unless the plan records why the boundary is safe and a reviewer accepts
  the exception.
- Keep `noUnusedLocals` and `noUnusedParameters` clean.
- Follow React hook rules and keep side effects explicit and localized.
- Keep browser-facing code free of unsanitized HTML and secrets.

## Forbidden by default

- `console.log` in committed application code. Use the repository's structured
  logging boundary when one exists; temporary diagnostics must be removed.
- Duplicated utilities or parallel implementations of an existing contract.
- Silent error swallowing, empty catch blocks, and unbounded retries.
- Unrelated formatting churn or drive-by refactors.

## Naming and structure

- Classes and React components use `PascalCase`.
- Functions, hooks, variables, and module-local values use `camelCase`.
- Exported constants use `UPPER_SNAKE_CASE` when they are true constants; use
  `camelCase` for values whose identity or meaning is local to a component.
- Functions have explicit, narrow inputs and outputs where inference does not
  make the contract obvious.
- Each function should have one reason to change. Extract a helper when it
  removes real duplication or makes a boundary testable.

## Correctness and boundaries

- Validate external input at the boundary and make invalid states explicit.
- Preserve existing public behavior unless the plan explicitly changes it.
- For API changes, document compatibility, error behavior, and migration needs.
- For asynchronous work, handle cancellation, timeout, failure, and loading
  states where those states are observable.
- Never log, commit, or copy credentials, tokens, or complete environment files.

## Tests and verification

- Add or update tests for changed behavior, regressions, and important edge
  cases. A task that changes behavior without a test needs a recorded reason.
- Prefer focused tests for the changed boundary, then run the repository-wide
  checks before completion.
- A green build is not a substitute for tests, and a passing test command is
  not evidence that lint, typecheck, or build passed.
- Record each check's command, exit code, and concise result in evidence.

## Exceptions

An exception must be narrow, stated in the task or review evidence, and include
the reason, affected path, risk, and planned follow-up. Do not turn a temporary
exception into a new default rule by copying it elsewhere.
