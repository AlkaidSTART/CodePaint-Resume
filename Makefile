.PHONY: dev-public dev-admin api worker migrate infra infra-up infra-down infra-logs infra-migrate

dev-public:
	pnpm dev:public

dev-admin:
	pnpm dev:admin

api:
	cd backend && go run ./cmd/api

worker:
	cd backend && go run ./cmd/worker

migrate:
	cd backend && go run ./cmd/migrate

infra: infra-up

infra-up:
	docker compose -f infra/compose/docker-compose.dev.yml up -d --build

infra-down:
	docker compose -f infra/compose/docker-compose.dev.yml down

infra-logs:
	docker compose -f infra/compose/docker-compose.dev.yml logs -f --tail=100

infra-migrate:
	docker compose -f infra/compose/docker-compose.dev.yml run --rm migrate
