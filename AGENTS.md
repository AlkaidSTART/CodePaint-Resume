# CodePaint ResumeFlow — AGENTS.md

> 适用：Claude Code、Codex、Hermes Agent 及所有协作开发者
> 约束：最高强约束。Agent 必须无条件遵循。

---

## 1. 裁决优先级

1. **用户当轮显式指令**
2. **本文件 (AGENTS.md)**
3. **`docs/*` 契约** (PRD / API / SCHEMA / ENV_MATRIX / ERROR_CODES / SECURITY / OBSERVABILITY / TDD)
4. **现有代码实现模式**
5. **Agent 默认偏好**（最低，严禁脑补）

> 代码永不得反向覆盖 `docs/*` 契约。冲突以 docs 为准；需变更契约必须同步更新文档。

---

## 2. 项目 Skills (.skills/)

```
.skills/
├── grilling/          # 决策质询 — 见下方强制规则
├── frontend-design/   # 前端设计美学规范
├── gsap-suite/        # GSAP 动画指南 (含 references/)
└── redis-suite/       # Redis 架构与建模 (含 references/)
```

### Grilling 强制规则

**任何新功能、架构变更、技术选型，大模型在输出 plan 或写代码之前，必须先执行 `.skills/grilling/SKILL.md` 的质询流程。** 质询完毕、用户确认共识后才能进入实现阶段。以下场景跳过质询：
- hotfix / ≤3 文件 bug 修复
- 纯样式微调
- 文档更新

### Skill 按需加载

- 前端开发 → 读 `frontend-design/SKILL.md` + `gsap-suite/SKILL.md`
- 后端涉及 Redis → 读 `redis-suite/SKILL.md` 及对应 references/
- 不相关的 skill 不要加载，节省 context

---

## 3. 任务分级与 Plan 机制

| 级别 | 条件 | 流程 |
|---|---|---|
| **直接执行** | hotfix / ≤3 文件 / 有明确报错 | 读本文件 → 改代码 → 跑门禁 → 交付 |
| **需要 Plan** | 新功能 / 跨模块 / 模糊需求 | 大模型先写 `.plans/active/xxx.md` → 人工确认 → 小模型执行 → 门禁 → 归档到 `.plans/archive/` |

### Plan 格式要求

```markdown
# <任务名>
- **goal**: 一句话目标
- **scope**: [文件/目录列表] (用于并行隔离检查)
- **steps**: 实现步骤 (每步 ≤1 个关注点)
- **verify**: 验证命令
- **risk**: 可能影响的其他模块
```

### 并行隔离

- Plan 必须声明 scope
- 两个 plan scope 有交集 → 人工 review 后才能并行
- 门禁全局统一，每个分支 push 前必须全量跑

---

## 4. 架构边界 (Blast-Radius Control)

pnpm + Go 混合 Monorepo：

```
CodePaint-Resume/
├── apps/
│   ├── public-web      # 候选人端 (React + Vite)
│   └── admin-web       # 招聘官端 (React + Vite)
├── backend/            # Go 单体 (Gin / Asynq / pgxpool / Postgres / Redis)
├── packages/
│   ├── types           # TS 类型唯一定义源 (@codepaint/types)
│   ├── api-client      # 统一 API 客户端
│   ├── auth-client     # 统一鉴权工具库
│   ├── ui              # 共享基础 UI
│   └── assets / utils  # 静态资源 / 工具函数
├── docs/               # 8 大权威契约
├── migrations/         # SQL 迁移脚本
└── .plans/             # 动态任务计划 (active/ + archive/)
```

**隔离红线**：
- `public-web` ↔ `admin-web` 严禁互相引用（业务 Layout、路由、私有状态）
- 跨模块类型必须定义在 `packages/types`，严禁组件内 ad-hoc interface
- 后端单向依赖：`cmd/` → `httpserver` & `task` → `service` → `repository` → `domain`。domain 严禁反向依赖

**只读保护**（未经显式要求严禁擅改）：
- `docs/*.md`
- `migrations/*.sql`、`backend/internal/migrations/*.go`
- `pnpm-lock.yaml`、`backend/go.sum`（仅包管理工具更新）

---

## 5. 红线对照表

| 领域 | ❌ FORBIDDEN | ✅ REQUIRED |
|---|---|---|
| 多租户 | `WHERE id = $1` | `WHERE id = $1 AND workspace_id = $2` |
| 异步解析 | HTTP 同步执行 PDF/LLM 解析 | 投递 Asynq 任务，200ms 内返回 `202 Accepted` |
| 简历防护 | 静态公开目录或直链 | 私有 Bucket + Presigned URL ≤15min |
| 环境变量 | 未在 `docs/ENV_MATRIX.md` 登记 | 先登记再使用 |
| 凭证安全 | 明文存储授权码/Secret；日志打印 PII | AES-256-GCM 密文 (`_encrypted`)；日志脱敏 |
| TS 类型 | `any` | Strict Mode，显式类型 |
| Go 错误 | `_ = err` 或裸 panic | `fmt.Errorf("action: %w", err)` 包装 |
| UI 视觉 | 内联 CSS、金色系堆砌 | 黑白冷灰筑基，品牌蓝点睛，GSAP 微交互 |
| YAGNI | 借修复之名重构无关模块 | 手术刀改动；标准库 & 已有依赖优先 |

---

## 6. 质量门禁 (exit 0 否则禁止宣称完成)

### 前端 (仓库根目录)
```bash
pnpm lint && pnpm typecheck && pnpm build
```

### 后端 (backend/)
```bash
cd backend && go vet ./... && go test ./... && go build -o /dev/null ./cmd/api && go build -o /dev/null ./cmd/worker
```

---

## 7. Git 安全

- 严禁 `git push -f`
- Conventional Commits：`feat:` / `fix:` / `refactor:` / `chore:` / `docs:`
- 绝对禁止提交 `.env`、凭证、私钥、候选人真实简历
- 涉及接口或字段变动：先改 `packages/types` 或 Go `domain`，再改业务代码
