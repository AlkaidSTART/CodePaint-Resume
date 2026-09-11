# ResumeFlow / CodePaint Studio

CodePaint Studio 招新平台的 monorepo。项目由两个 React + Tailwind CSS 前端应用和一个 Go/Gin API 组成。

设计说明：[UI 设计文档](docs/UI_DESIGN.md)；业务与技术约定见 [PRD](docs/PRD.md)、[TDD](docs/TDD.md) 和 [API](docs/API.md)。

## 快速开始

```bash
pnpm install

# 终端 1：启动 Go API，默认 http://localhost:8080
make api

# 终端 2：启动公开报名端
pnpm dev:public   # http://localhost:5173

# 或启动 recruiter 管理端
pnpm dev:admin    # http://localhost:5174
```

管理端也可以直接从 workspace 过滤运行：

```bash
pnpm --filter @codepaint/admin-web dev
pnpm --filter @codepaint/admin-web typecheck
pnpm --filter @codepaint/admin-web build
```

本地依赖可通过 `make infra` 启动 PostgreSQL、Redis 和 MinIO。数据库迁移可从仓库根目录执行 `make migrate`，也可通过 `MIGRATIONS_DIR` 指定迁移目录。

## 目录

```text
apps/
  public-web/   公开招新、报名和个人状态
  admin-web/    recruiter 招新管理工作台
backend/        Go/Gin API、auth/RBAC 和 worker 入口
packages/       workspace 内共享的 TypeScript 包
infra/          开发与生产 Compose、数据库迁移和运维脚本
docs/           PRD、TDD、API、环境矩阵和 UI 设计约定
harness/        开发流程、检查脚本和任务证据
```

`apps/admin-web` 的主要入口：

- `src/main.tsx`：工作台导航、摘要、申请队列和后台任务队列
- `src/index.css`：Tailwind CSS v4 主题 token 和全局基础样式
- `src/lib/ui/index.tsx`：按钮、状态标记等基础组件
- `src/lib/api-client/index.ts`：API 请求封装
- `src/store/adminStore.ts`：Zustand 状态、加载流程和筛选状态

## 前端行为

两个前端应用各自独立：类型、API client、auth-client、工具和基础 UI 分别维护在各应用自己的 `src/lib` 下，状态分别由应用内的 Zustand store（`src/store`）管理，应用之间不共享源码或 store。

公开端方向列表和后台概览通过各应用的 `src/lib/api-client` 读取 Go API，并提供加载、空数据、失败和重试状态。配置 `DATABASE_URL` 后 API 使用 PostgreSQL repository 和 HttpOnly session；未配置数据库时只保留公开 Demo 数据，登录接口返回未配置提示。`ALLOW_DEMO_AUTH=true` 仅用于本地开发，生产环境必须关闭。

管理端概览保留现有 API、Zustand store、加载回退和岗位筛选语义；UI 重构遵循 [docs/UI_DESIGN.md](docs/UI_DESIGN.md) 中的层级、响应式、无障碍和状态约定。

Worker 已接入 Asynq、校验稳定任务 ID 并避免把任务 payload 写入日志；OCR、LLM、对象存储和解析结果持久化仍需在真实 Provider 配置后接通。

## 验证

```bash
bash harness/checks/validate.sh
bash harness/checks/lint.sh
bash harness/checks/typecheck.sh
bash harness/checks/test.sh
bash harness/checks/backend.sh
bash harness/checks/build.sh
bash harness/checks/verify.sh
```
