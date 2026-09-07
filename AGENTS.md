# CodePaint ResumeFlow — AI Agent & Developer Guide (AGENTS.md)

> 适用主体：Claude Code、OpenAI Codex、ZCode、Hermes Agent 及所有协作开发者  
> 规范等级：**强约束 (Non-negotiable)**。任何 Agent 进入本仓库必须首先阅读并无条件遵循本文件。  
> 核心原则：**生产级标准 (Production-Ready) + 规范驱动开发 (Spec-Driven)**。禁止脱离契约自由发挥。

---

## 1. 架构总览与目录边界

本仓库为 pnpm + Go 混合 Monorepo，各模块职责边界严密隔离：

```text
CodePaint-Resume/
├── apps/
│   ├── public-web      # 普通用户端：公开招新展示、在线投递、个人状态查询 (React + Vite)
│   └── admin-web       # 招新成员后台：候选人看板、简历详情、解析重试、状态流转 (React + Vite)
├── backend/            # 后端单体服务 (Go 1.22+ / Gin / Asynq / pgxpool / PostgreSQL / Redis)
│   ├── cmd/api         # HTTP API Server
│   ├── cmd/worker      # 异步任务 Worker (PDF 文本提取 + LLM 结构化解析 + 插件消费)
│   ├── cmd/migrate     # 数据库 Schema 迁移工具
│   └── internal/       # 核心业务逻辑 (domain, repository, service, task, provider, plugin)
├── packages/
│   ├── types           # 全局 TypeScript 类型单一事实源 (@codepaint/types)
│   ├── api-client      # 前端 Axios / Fetch API 统一客户端 (@codepaint/api-client)
│   ├── auth-client     # 前端鉴权与 Session 客户端 (@codepaint/auth-client)
│   └── ui              # 跨应用共享基础 UI 组件 (@codepaint/ui)
├── docs/               # 核心规范与架构设计字典 (Single Source of Truth)
├── harness/            # 研发流程规则与评审检查清单
├── migrations/         # 生产级 SQL 数据库版本迁移脚本
└── ui-enhance/         # 前端与 UI 专属设计规范 (UI-Enhance Skill)
```

- **隔离红线**：
  - `public-web` 与 `admin-web` 严禁共享业务 Layout、页面路由与私有业务状态。
  - 前后端数据交互严格依赖 `packages/types` 与 `docs/API.md`，禁止在前端各自随意定义 interface。
  - 前端 UI 的任何开发与样式修改，**必须严格遵循 `ui-enhance/SKILL.md` 内的设计规范与质检清单**。

---

## 2. 八大权威规范文档 (Single Source of Truth)

在编写任何代码或配置前，必须强制查阅对应文档。若代码与文档存在分歧，以文档为准或显式更新文档：

1. **`docs/PRD.md`**：产品需求规格书、用户旅程、RBAC 角色范围、第 19 节插件生态。
2. **`docs/API.md`**：RESTful 接口契约、分页标准、输入输出 JSON 格式、第 17 节插件接口。
3. **`docs/SCHEMA.md`**：
   - **LLM Strict JSON Schema**：大模型结构化提取字段规范（Strict Mode）。
   - **双有限状态机 (FSM)**：申请单与简历解析合法流转规则。
   - **事件总线契约 (Event Bus)**：`application.status.changed` 等插件事件载荷。
4. **`docs/ENV_MATRIX.md`**：环境变量与配置字典。**严禁发明任何未经此文档登记的环境变量名**。
5. **`docs/ERROR_CODES.md`**：错误码字典。严格区分 `TRANSIENT` (Asynq 指数重试) 与 `PERMANENT` (立刻终结)。
6. **`docs/SECURITY_PII.md`**：安全与隐私合规。私有 Bucket、15 分钟临时 Presigned URL、AES-256-GCM 凭证加密、日志脱敏。
7. **`docs/OBSERVABILITY.md`**：链路追踪 TraceID、结构化 JSON 日志、`/healthz` 与 `/readyz` 探针、队列监控指标。
8. **`docs/TDD.md`**：技术架构设计与基础设施选型依据。

---

## 3. 生产级编码军规 (AI Coding 铁律)

### 3.1 安全与多租户隔离 (Tenant Boundary)
- **后端是唯一安全边界**：前端隐藏按钮不构成安全防护。所有接口必须在 Go 端强制校验 RBAC 角色。
- **租户隔离**：所有涉及业务数据的 SQL 查询，`WHERE` 条件必须显式包含 `workspace_id = $1`。严禁裸写 `WHERE id = $1`。
- **简历文件防护**：严禁将原始简历存储在公开访问路径，下载/预览一律请求专用接口获取临时 Presigned URL。
- **敏感字段加密**：邮箱授权码、第三方 Webhook Secret 在落库时必须采用 AES-256-GCM 密文存储（字段名带 `_encrypted`）。

### 3.2 异步与高并发处理 (Worker & Task)
- **严禁同步阻塞解析**：HTTP 接口接收到简历上传或抓取后，仅写入存储并投递 Asynq 任务，必须在 200ms 内向前端返回 `202 Accepted`。
- **防止重复解析 (幂等性)**：通过文件的 `sha256` 与邮件的 `message_id` 强唯一约束保证幂等，禁止重复消费同一份文件。
- **重试分级**：对大模型超时或网络闪断执行指数退避重试；对格式错误或破损文件立刻置为 `failed`，不浪费 Token。

### 3.3 代码风格与命名契约
- **Go 后端**：
  - 导出标识符 `PascalCase`，内部私有 `camelCase`。
  - 函数第一入参强制为 `ctx context.Context`。
  - 错误处理严禁丢弃：必须使用 `fmt.Errorf("action description: %w", err)` 包装返回。
  - 结构体 JSON 标签显式标注 `json:"snake_case"`。
- **TypeScript / 前端**：
  - 开启 TypeScript Strict Mode，严禁滥用 `any`。
  - 共享数据类型必须在 `packages/types` 中维护与导出。
  - 样式必须使用 Tailwind CSS，避免内联 CSS 或硬编码像素值。

---

## 4. 质量门禁与验证命令 (Quality Gates)

在向用户报告任务完成前，Agent 必须在终端运行并通过以下质量门禁：

### 4.1 后端验证 (Go)
```bash
cd backend
# 1. 静态检查与语法验证
go vet ./...
# 2. 单元测试与集成测试
go test -v -race ./...
# 3. 编译验证
go build -o /dev/null ./cmd/api
go build -o /dev/null ./cmd/worker
```

### 4.2 前端验证 (TypeScript / Monorepo)
```bash
# 在仓库根目录下执行
# 1. 全局 TypeScript 类型检查 (零报错)
pnpm -r exec tsc --noEmit
# 2. 代码构建检查
pnpm build
```

---

## 5. 多 Agent 协作规范 (Multi-Agent Protocol)

- **Claude Code / Codex / ZCode 切换约定**：
  - 进入仓库后，先运行 `git status` 确认当前工作分支与改动范围。
  - 不得删除已落盘的规范文档 (`docs/*.md`)。
  - 发现业务缺陷需修改架构设计时，必须同步更新 `docs/` 对应文档，保持代码与文档 100% 同步。
  - 未经用户显式指令，严禁强制推送 (`git push -f`) 或提交未测试通过的代码。
