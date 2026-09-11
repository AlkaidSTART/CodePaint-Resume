The canonical migrations live in `infra/migrations/`.

`infra/compose/docker-compose.dev.yml` mounts that directory into the Postgres
init directory, and `infra/postgres/init.sql` includes
`migrations/001_init.sql` when a fresh volume is created. The development and
production migrate services mount the same directory into their configured
container path.

Do not duplicate schema files here; this directory contains documentation only.
