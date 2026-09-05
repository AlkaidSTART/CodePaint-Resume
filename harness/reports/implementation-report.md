# Implementation Report

## Scope

根据 PRD/TDD/API/UI 文档完成 ResumeFlow monorepo 的第一阶段架构落地：React + Tailwind CSS 双前端、顶层 `backend/` Go/Gin API、共享 TypeScript 包、PostgreSQL 迁移、持久化会话、Asynq Worker 边界、对象存储和文档解析 Provider 接口。

## Implemented

- 将后端从 `apps/api` 调整为顶层 `backend/`，保留 `cmd/api`、`cmd/worker`、`cmd/migrate` 三个运行入口。
- 增加 workspace、附件、简历、解析运行、处理任务和审计事件迁移，并为用户会话增加 token hash 和过期时间。
- 增加 PostgreSQL repository、bcrypt 密码哈希、HttpOnly session Cookie 和服务端 recruiter 权限校验。
- 增加迁移执行器，支持按文件名排序、事务应用、重复跳过和 `MIGRATIONS_DIR` 配置。
- 增加 Asynq resume parse 任务构造器和 Worker payload 校验；日志不输出任务内容。
- 增加 MinIO/S3 兼容存储接口，以及可替换的文本提取、OCR、LLM 接口。
- 公开端从 API 加载招新方向，后台从 API 加载 dashboard，并覆盖加载、空结果、错误、重试和未授权状态。

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `go test ./...`
- API smoke test: `/healthz`、公开岗位接口和未认证 workspace 访问
- `git diff --check`

## Residual Risk

尚未完成真实基础设施运行验证，当前环境未启动 PostgreSQL、Redis、MinIO。Worker 目前完成任务边界和 payload 校验，但还没有连接对象存储读取原始材料、执行 OCR/LLM、校验结构化结果并更新 `resume_parse_runs` / `processing_tasks`；文件上传 API、报名表单、个人报名接口和完整登录页面也仍是下一阶段。当前 API 的 `X-Demo-Role` 只有在 `ALLOW_DEMO_AUTH=true` 时启用，不能用于生产。
