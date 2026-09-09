# CodePaint ResumeFlow — AGENTS.md

> 适用：Claude Code、Codex、Hermes Agent 及所有协作开发者
> 约束：最高强约束。Agent 必须无条件遵循。

---

## 1. 裁决优先级

1. **用户当轮显式指令**
2. **本文件 (AGENTS.md)**
3. **`docs/*` 契约** (PRD / API / SCHEMA / ENV_MATRIX / ERROR_CODES / SECURITY / OBSERVABILITY / TDD)
4. **`.skills/*` 领域规范**
5. **现有代码实现模式**
6. **Agent 默认偏好**（最低，严禁脑补）

> 代码永不得反向覆盖 `docs/*` 契约。冲突以 docs 为准；需变更契约必须同步更新文档。

---

## 2. 任务分级与 Plan 机制

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

## 3. Skills 路由与加载规则

项目级规范统一存放于 `.skills/`（本地优先，缺失回退 `~/.agents/skills/`）。**严禁全局常驻或全量预载**，仅当命中下列触发条件时按需读取：

| 触发场景 | Skill | 相对路径 | 核心约束 |
|---|---|---|---|
| 新功能 / 架构改动 / 选型 / 重大重构 | `grilling` | `.skills/grilling/SKILL.md` | **强门禁**。大模型必须先发起质询对齐共识，确认后方可出 plan 或写代码；hotfix/微调跳过 |
| 官网动效 / 全屏转场 / 滚动动画 | `gsap-suite` | `.skills/gsap-suite/SKILL.md` | 涉及 `apps/public-web`。Timeline 编排、ScrollTrigger 隔离、防内存泄漏、适配减弱动画 |
| 界面设计 / UI 组件 / 视觉规范 | `frontend-design` | `.skills/frontend-design/SKILL.md` | 涉及 `apps/*` 与 `packages/ui`。暗色微质感、黑白冷灰筑基、品牌蓝点睛，严禁模板套话风 |
| 数据库迁移 / SQL 调优 / 模式变更 | `supabase-postgres-best-practices` | `.skills/supabase-postgres-best-practices/SKILL.md` | 涉及 `migrations/*.sql` 与 pgxpool。强制租户隔离、索引验证、避免全表锁与大事务 |
| 异步队列 / 缓存策略 / 分布式锁 | `redis-suite` | `.skills/redis-suite/SKILL.md` | 涉及 `backend/internal/task` (Asynq) 与 Redis。防 BigKey、TTL 治理、连接池与雪崩防护 |
| 核心业务逻辑 / API Client / 鉴权 | `test-driven-development` | `.skills/test-driven-development/SKILL.md` | 对齐 `docs/TDD.md`。红-绿-重构循环，测试先行，测试红灯后才准写实现 |
| 疑难 Bug / 门禁修复连续失败 ≥2 次 | `systematic-debugging` | `.skills/systematic-debugging/SKILL.md` | 4 阶段根因排查（对齐契约-定位根因-微创修复-门禁验证），严禁盲猜试错 |

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
├── .skills/            # 项目级 Skills (按需加载，严禁滥载)
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
