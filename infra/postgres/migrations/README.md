The canonical migrations live in the repository root at `migrations/`.

`docker-compose.dev.yml` mounts that directory into the Postgres init directory;
`init.sql` includes `migrations/001_init.sql` when a fresh volume is created.
Keep this directory as the documented infra boundary without duplicating schema
files.
