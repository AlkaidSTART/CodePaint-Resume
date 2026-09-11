#!/usr/bin/env bash
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
failures=0

run_check() {
  local name="$1"
  shift
  printf '\n== %s ==\n' "$name"
  if "$@"; then
    printf '%s passed\n' "$name"
  else
    printf '%s failed\n' "$name" >&2
    failures=$((failures + 1))
  fi
}

run_check validate "$SCRIPT_DIR/validate.sh"
run_check lint "$SCRIPT_DIR/lint.sh"
run_check typecheck "$SCRIPT_DIR/typecheck.sh"
run_check test "$SCRIPT_DIR/test.sh"
run_check backend "$SCRIPT_DIR/backend.sh"
run_check build "$SCRIPT_DIR/build.sh"

if (( failures > 0 )); then
  printf '\nVerification failed with %d check(s).\n' "$failures" >&2
  exit 1
fi

printf '\nVerification passed.\n'
