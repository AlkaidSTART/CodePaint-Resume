# Infrastructure

This directory contains reproducible local and production infrastructure for
ResumeFlow.

## Local development

```bash
make infra-up
make infra-migrate
make infra-logs
```

The development stack exposes the public web app at `http://localhost:3000`,
the API at `http://localhost:8080`, MinIO at `http://localhost:9000` and its
console at `http://localhost:9001`. Override `POSTGRES_PORT`, `REDIS_PORT`,
`MINIO_PORT`, `MINIO_CONSOLE_PORT`, `API_PORT`, or `WEB_PORT` when a host port
is already in use. Enable optional monitoring with:

```bash
docker compose -f infra/compose/docker-compose.dev.yml --profile monitoring up -d
```

## Production

Production Compose expects image and secret variables from the deployment
runtime. Do not put those values in Git. Review the rendered configuration with
`docker compose -f infra/compose/docker-compose.prod.yml config` before using
`infra/scripts/deploy.sh --confirm`.

## Operations

- `infra/scripts/backup.sh` creates a PostgreSQL custom-format dump.
- `infra/scripts/restore.sh --confirm FILE` performs an explicit destructive restore.
- `infra/scripts/deploy.sh --confirm` pulls and starts the production stack.

`infra/compose/` is the sole Compose orchestration boundary. The canonical
database migrations live in `infra/migrations/`; both the development and
production migrate services mount that directory, and fresh development
Postgres volumes initialize from `infra/migrations/001_init.sql`.
