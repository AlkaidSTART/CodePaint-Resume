#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

# There is no typecheck script in this repository, so invoke the local compiler
# directly through Bun and keep the command deterministic.
bunx tsc -b --pretty false
