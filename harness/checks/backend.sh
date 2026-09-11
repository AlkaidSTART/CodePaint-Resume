#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

if [[ ! -f "$REPO_ROOT/backend/go.mod" ]]; then
  printf 'Missing backend/go.mod; cannot run backend checks.\n' >&2
  exit 1
fi

cd "$REPO_ROOT/backend"
go test ./...
go vet ./...
go build ./cmd/...