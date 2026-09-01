
# ResumeFlow / CodePaint Studio

CodePaint Studio 招新平台的 monorepo 脚手架，按 PRD 拆分为两个 React + Tailwind CSS 前端应用、一个 Go/Gin API 和共享 TypeScript 包。

## 快速开始

```bash
pnpm install
pnpm dev:public   # http://localhost:5173
pnpm dev:admin    # http://localhost:5174
make api          # http://localhost:8080
```

本地依赖可通过 `make infra` 启动 PostgreSQL、Redis 和 MinIO。数据库初始化脚本位于 `migrations/001_init.sql`。

## 目录

- `apps/public-web`: 公开招新、报名和个人状态
- `apps/admin-web`: recruiter 工作台
- `apps/api`: Go/Gin API、后端 auth/RBAC 和 worker 入口
- `packages/*`: 类型、API client、前端 auth-client、工具和基础 UI
- `docs`: PRD、TDD、API 与 UI 设计约定

当前前端使用少量 demo 数据展示核心信息架构；API 已提供 `/api/v1` 公开资源、认证占位和 recruiter 受保护工作台骨架。`packages/auth-client` 只服务前端展示和路由体验，真正的认证与 RBAC 位于 `apps/api/internal/auth`，下一步接入 PostgreSQL repository、持久化会话和 Asynq pipeline。
