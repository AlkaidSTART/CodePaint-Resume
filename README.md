
# ResumeFlow / CodePaint Studio

CodePaint Studio 招新平台的 monorepo 脚手架，按 PRD 拆分为两个 React + Tailwind CSS 前端应用、一个 Go/Gin API 和共享 TypeScript 包。

## 快速开始

```bash
pnpm install
pnpm dev:public   # http://localhost:5173
pnpm dev:admin    # http://localhost:5174
make api          # http://localhost:8080
```

本地依赖可通过 `make infra` 启动 PostgreSQL、Redis 和 MinIO。数据库迁移可从仓库根目录执行 `make migrate`，也可通过 `MIGRATIONS_DIR` 指定迁移目录。

## 目录

- `apps/public-web`: 公开招新、报名和个人状态
- `apps/admin-web`: recruiter 工作台
- `backend`: Go/Gin API、后端 auth/RBAC 和 worker 入口
- `packages/*`: 类型、API client、前端 auth-client、工具和基础 UI
- `docs`: PRD、TDD、API 与 UI 设计约定

公开端方向列表和后台概览已经通过 `packages/api-client` 读取 Go API，并提供加载、空数据、失败和重试状态。配置 `DATABASE_URL` 后 API 使用 PostgreSQL repository 和 HttpOnly session；未配置数据库时只保留公开 Demo 数据，登录接口返回未配置提示。`ALLOW_DEMO_AUTH=true` 仅用于本地开发，生产环境必须关闭。

Worker 已接入 Asynq、校验稳定任务 ID 并避免把任务 payload 写入日志；OCR、LLM、对象存储和解析结果持久化仍需在真实 Provider 配置后接通。
