#!/usr/bin/env bash
set -euo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$HARNESS_DIR/.." && pwd)"
export HARNESS_DIR REPO_ROOT

cd "$REPO_ROOT"

has_package_script() {
  local script_name="$1"
  node -e '
    const fs = require("node:fs");
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    process.exit(packageJson.scripts && packageJson.scripts[process.argv[1]] ? 0 : 1);
  ' "$script_name"
}

run_package_script() {
  local script_name="$1"
  if ! has_package_script "$script_name"; then
    printf 'Missing package script: %s\n' "$script_name" >&2
    return 1
  fi
  bun run "$script_name"
}
