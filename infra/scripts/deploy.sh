#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'HELP'
Usage: deploy.sh --confirm

Pull and start the production Compose stack.
Required environment: POSTGRES_PASSWORD, DATABASE_URL, DEFAULT_WORKSPACE_ID,
STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, and STORAGE_SECRET_KEY.
The --confirm flag is mandatory.
HELP
}

if [[ $# -eq 1 && ("$1" == '--help' || "$1" == '-h') ]]; then
  usage
  exit 0
fi
if [[ $# -ne 1 || "$1" != '--confirm' ]]; then
  usage >&2
  exit 2
fi

compose_file="infra/compose/docker-compose.prod.yml"
docker compose -f "$compose_file" config >/dev/null
docker compose -f "$compose_file" pull
docker compose -f "$compose_file" up -d --remove-orphans
printf 'Production Compose stack deployed.\n'
