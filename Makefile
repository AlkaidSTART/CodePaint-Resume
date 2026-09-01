.PHONY: dev-public dev-admin api worker infra

dev-public:
	pnpm dev:public

dev-admin:
	pnpm dev:admin

api:
	cd backend && go run ./cmd/api

worker:
	cd backend && go run ./cmd/worker

infra:
	docker compose -f deploy/compose/docker-compose.yml up -d
