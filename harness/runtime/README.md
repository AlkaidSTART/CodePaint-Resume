# Runtime artifacts

Runtime files are durable plan, task, state, and evidence records. Use the
schemas in `harness/schemas/` and copy the templates from `harness/templates/`.

Do not store credentials, complete environment files, or large source dumps in
runtime artifacts. Preserve failed attempts and append new evidence rather than
overwriting history.
