.PHONY: dev-public dev-admin api worker migrate infra

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

infra:
	docker compose -f deploy/compose/docker-compose.yml up -d
