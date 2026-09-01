.PHONY: dev-public dev-admin api worker infra

dev-public:
	pnpm dev:public

dev-admin:
	pnpm dev:admin

api:
	cd apps/api && go run ./cmd/api

worker:
	cd apps/api && go run ./cmd/worker

infra:
	docker compose -f deploy/compose/docker-compose.yml up -d
