#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

if has_package_script test; then
  run_package_script test
  exit 0
fi

if [[ -f "$REPO_ROOT/backend/go.mod" ]]; then
  (cd "$REPO_ROOT/backend" && go test ./...)
  exit 0
fi

printf 'No test runner is configured and no backend Go module was found. Add a test command or record an approved exception in the plan.\n' >&2
exit 1
