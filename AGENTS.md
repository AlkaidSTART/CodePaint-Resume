# CodePaint ResumeFlow — AI Agent & Developer Operating Guide (AGENTS.md)

> **适用范围**：Claude Code、OpenAI Codex、Hermes Agent、ZCode 及所有协作开发者  
> **约束等级**：**最高强约束 (Non-negotiable Zero-Tolerance)**。任何 Agent 必须无条件遵循。  
> **核心原则**：契约优先 (Spec-Driven)、最小改动 (Surgical Diff)、真实验证 (Verifiable Quality Gate)。

---

## 1. 优先级阶梯 (Instruction Precedence)

当指令、文档与代码发生冲突时，严格按以下层级裁决，高优先级无条件覆盖低优先级：

1. **User Explicit Prompt**（用户当轮显式指令）
2. **`AGENTS.md`**（本文件：仓库全局治理、安全红线、质量门禁）
3. **`docs/*` 权威规范**（`PRD.md`、`API.md`、`SCHEMA.md`、`ENV_MATRIX.md` 等单一事实源）
4. **`harness/rules/*` & `ui-enhance/SKILL.md`**（领域研发规范与 UI 设计规范）
5. **现有代码实现模式**
6. **Agent 默认偏好 / 模型假设**（最低优先级，严禁脑补）

> **红线规则**：代码永不得反向覆盖 `docs/*` 契约。若发现代码与文档冲突，以 `docs/*` 为准；确需变更契约必须显式同步更新文档。

---

## 2. 架构与边界隔离红线 (Blast-Radius Control)

本仓库为 pnpm + Go 混合 Monorepo，严禁跨越以下架构红线：

```text
CodePaint-Resume/
├── apps/
│   ├── public-web      # 候选人端：招新展示、在线报名、状态查询 (React + Vite)
│   └── admin-web       # 招聘官端：候选人看板、简历详情、解析重试 (React + Vite)
├── backend/            # 后端核心单体 (Go 1.22+ / Gin / Asynq / pgxpool / Postgres / Redis)
├── packages/
│   ├── types           # 全局 TS 类型唯一定义源 (@codepaint/types)
│   ├── api-client      # 统一 API 客户端 (@codepaint/api-client)
│   ├── auth-client     # 统一鉴权工具库 (@codepaint/auth-client)
│   └── ui              # 跨应用共享纯基础 UI (@codepaint/ui)
├── docs/               # 8 大权威事实源 (PRD/API/SCHEMA/ENV_MATRIX/ERROR_CODES/SECURITY/OBSERVABILITY/TDD)
├── harness/            # 研发流程引擎 (checklists, rules, workflows, knowledge)
└── ui-enhance/         # UI 设计专属规范 (SKILL.md)
```

- **双前端绝对物理隔离**：`public-web` 与 `admin-web` 严禁互相引用，严禁共享业务 Layout、页面路由及私有状态。
- **类型单一事实源**：所有跨模块业务数据模型必须在 `packages/types` 中定义并导出。**严禁在前端组件内擅自定义 ad-hoc 接口**。
- **后端单向依赖分层**：`cmd/` → `internal/httpserver` & `internal/task` → `internal/service` → `internal/repository` → `internal/domain`。`domain` 严禁反向依赖外层。
- **保护性只读清单（未经显式要求严禁擅改）**：
  - `docs/*.md` 契约文件
  - 已生效的历史迁移脚本 `backend/internal/migrations/*.go` / `migrations/*.sql`
  - 依赖锁文件 `pnpm-lock.yaml`、`backend/go.sum`（仅允许包管理工具自动更新，严禁人工/Agent 手写编辑）

---

## 3. 不可逾越的八大生产级军规 (Ironclad Rules)

| 领域 | ❌ 严禁行为 (FORBIDDEN - 审查即拒绝) | ✅ 合规标准 (REQUIRED PATTERN) |
|---|---|---|
| **多租户隔离** | 业务查询裸写 `WHERE id = $1` | 所有租户数据查询强制绑定 `WHERE id = $1 AND workspace_id = $2` |
| **异步解析** | HTTP 请求中同步执行 PDF 抽取或 LLM 解析 | 仅写库并投递 Asynq 任务，HTTP 接口在 200ms 内响应 `202 Accepted` |
| **简历与材料防护** | 将原始简历存放在静态公开目录或暴露直接外链 | 存入私有 Bucket，下载/预览仅分发有效期 ≤ 15 分钟的 Presigned URL |
| **环境变量管理** | 在代码中随意使用未经登记的环境变量 | 任何环境变量必须已在 `docs/ENV_MATRIX.md` 中注册，严禁擅自发明 |
| **凭证与敏感数据** | 明文存储邮箱授权码/Webhook Secret；日志打印 PII | 必须使用 AES-256-GCM 密文存储（字段名带 `_encrypted`），日志严格脱敏 |
| **代码与错误控制** | TS 滥用 `any`；Go 忽略错误 (`_ = err`) 或裸抛 panic | 开启 TS Strict Mode；Go 必须使用 `fmt.Errorf("action: %w", err)` 包装链路 |
| **UI 与视觉规范** | 随手写内联 CSS、大面积炫目渐变、金色系堆砌 | 严格遵照 `ui-enhance/SKILL.md`，黑白冷灰筑基，品牌蓝点睛，GSAP 流畅微交互 |
| **改动膨胀 (YAGNI)**| 借修复之名重构无关模块、随意新增三方依赖 | 手术刀式精准修改；优先利用语言标准库与已有依赖；无关文件零修改 |

---

## 4. 确定性研发工作流 (5-Phase Execution Loop)

Agent 承接任务必须按阶段推进，严禁未经验证提前宣称完成：

1. **阶段 1：对齐契约 (Align & Inspect)**
   - 运行 `git status` 确认当前工作分支与改动上下文。
   - 研读涉及模块对应的 `docs/*` 契约与 `harness/rules/*` 规则。
2. **阶段 2：契约先行 (Contract First)**
   - 涉及字段或接口变动，优先修改 `packages/types` 或 Go `domain` 结构体，而非直接扑向业务实现。
3. **阶段 3：微创实现 (Surgical Diff)**
   - 编写满足需求的最小代码，严禁不必要的抽象工厂或冗余样板代码。
4. **阶段 4：执行质量门禁 (Quality Gate Enforcement)**
   - 必须在终端运行第 5 节对应的验证命令，**检查退出码必须为 0**。
   - 命令失败立即排查修复，严禁无视编译报错或类型告警。
5. **阶段 5：客观透明交付 (Verifiable Report)**
   - 向用户汇报：实际改动文件列表、门禁执行真实结果与遗留风险。禁止编造输出。

---

## 5. 质量门禁与验证命令 (Quality Gates)

在向用户汇报任务交付前，必须在终端执行并通过对应门禁（命令必须真实退出 0）：

### 5.1 前端门禁 (在仓库根目录执行)
```bash
# 1. 静态检查
pnpm lint

# 2. 全局 TypeScript 严格类型检查 (零报错)
pnpm typecheck

# 3. 构建编译检查
pnpm build
```

### 5.2 后端门禁 (在 `backend/` 目录下执行)
```bash
cd backend

# 1. 静态语法与 Vet 检查
go vet ./...

# 2. 单元测试验证
go test ./...

# 3. API 与 Worker 编译验证
go build -o /dev/null ./cmd/api
go build -o /dev/null ./cmd/worker
```

---

## 6. 多 Agent 协作与 Git 安全规范

- **角色路由索引**：
  - 前端开发：必读 `ui-enhance/SKILL.md` + `harness/rules/frontend.md`。
  - 后端开发：必读 `docs/API.md` + `docs/SCHEMA.md` + `harness/rules/backend.md`。
  - 架构决策：复杂架构调整在 `harness/knowledge/decisions/` 沉淀 ADR。
- **Git 安全红线**：
  - 严禁执行 `git push -f` 强推或破坏性覆盖操作。
  - 提交信息必须遵循 Conventional Commits：`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`。
  - 绝对禁止提交任何 `.env` 文件、真实凭证、公私钥或候选人真实简历文件。
