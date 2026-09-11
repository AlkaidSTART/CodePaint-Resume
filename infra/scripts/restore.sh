#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'HELP'
Usage: restore.sh --confirm BACKUP_FILE

Restore a PostgreSQL custom-format backup. This replaces matching schema data.
Required environment: DATABASE_URL
The --confirm flag is mandatory for this destructive operation.
HELP
}

if [[ $# -eq 1 && ("$1" == '--help' || "$1" == '-h') ]]; then
  usage
  exit 0
fi
if [[ $# -ne 2 || "$1" != '--confirm' ]]; then
  usage >&2
  exit 2
fi

: "${DATABASE_URL:?DATABASE_URL is required}"
backup_file="$2"
[[ -f "$backup_file" ]] || { printf 'Backup file not found: %s\n' "$backup_file" >&2; exit 1; }

pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" "$backup_file"
printf 'Restore completed from %s\n' "$backup_file"
