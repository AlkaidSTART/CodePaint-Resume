#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'HELP'
Usage: backup.sh [--output FILE]

Create a PostgreSQL custom-format backup.
Required environment: DATABASE_URL
Optional environment: BACKUP_DIR (default: ./infra/backups)
HELP
}

output=""
while (($# > 0)); do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --output|-o)
      [[ $# -ge 2 ]] || { printf '%s\n' '--output requires a file path' >&2; exit 2; }
      output="$2"
      shift 2
      ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

: "${DATABASE_URL:?DATABASE_URL is required}"
if [[ -z "$output" ]]; then
  backup_dir="${BACKUP_DIR:-./infra/backups}"
  mkdir -p "$backup_dir"
  output="$backup_dir/resumeflow-$(date -u +%Y%m%dT%H%M%SZ).dump"
else
  mkdir -p "$(dirname "$output")"
fi

pg_dump --format=custom --no-owner --file="$output" "$DATABASE_URL"
printf 'Backup written to %s\n' "$output"
