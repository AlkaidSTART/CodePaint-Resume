#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

if ! has_package_script test; then
  printf 'No test runner is configured. Add package.json scripts.test or record an approved exception in the plan.\n' >&2
  exit 1
fi
run_package_script test
