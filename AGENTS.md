# CodePaint Resume Agent Guide

本文件是仓库内 AI Agent 和开发者的项目级入口。所有代码、配置和文档变更都应遵循本文件；详细约束位于 `harness/`。

## 项目边界

CodePaint Studio 招新平台采用两个 React 应用、一个 Go API 和共享 TypeScript 包的结构：

```text
apps/public-web  -> 普通用户端：公开招新、报名、个人状态
apps/admin-web   -> 招新成员后台：报名处理、解析、筛选、跟进
backend         -> Go/Gin API、认证、RBAC、异步任务
packages/*       -> API client、类型、基础 UI、认证和工具
```

产品和接口约定以 `docs/PRD.md`、`docs/TDD.md`、`docs/API.md` 及 UI 文档为准。若代码与文档冲突，先记录差异，再决定是否同步更新文档，不得默默改变业务契约。

## 强制工作流

每个任务必须按以下顺序执行：

1. 任务分析：判断任务类型、影响范围和优先级（P0/P1/P2）。
2. Agent 选择：选择一个主 Agent；跨领域任务明确协作边界。
3. 约束查阅：读取相关 `harness/rules/`、工作流和验收清单。
4. 实现：先更新必要的类型、接口契约或测试，再修改实现。
5. 测试验证：依次执行可用的 Lint、TypeCheck、Build、Test 和接口验证。
6. 代码提交：检查 diff、敏感信息和提交范围；只有用户明确要求时才创建 commit。
7. CI/CD：按仓库现有流水线执行，任一质量门禁失败都不得宣称完成。

开始工作时，在沟通中说明：任务类型、优先级、选用 Agent、查阅的规则和验证计划。

## Agent 路由

| 任务 | 主 Agent | 必看约束 |
| --- | --- | --- |
| 通用功能或 Bug | `dev-agent` | `architecture.md`、`code-quality.md`、`security.md` |
| `public-web` / `admin-web` | `frontend-agent` | `frontend.md`、`frontend-state.md`、`frontend-components.md`、`frontend-performance.md` |
| `backend` / 数据 / 任务 | `backend-agent` | `backend.md`、`backend-api.md`、`backend-service.md`、`backend-database.md`、`security.md` |
| 测试、验证、质量门禁 | `test-agent` | `code-quality.md`、`error-handling.md`、相关 checklist |
| Review | `review-agent` | `review` checklist、全部相关规则 |
| 部署和流水线 | `deploy-agent` | `git.md`、`release` checklist、`security.md` |
| 运行环境和事故 | `ops-agent` | `security.md`、`backend.md`、`release` checklist |

## 不可违反的项目规则

- 后端是唯一安全边界；前端隐藏菜单不能替代服务端 RBAC。
- `user` 只能访问本人报名；`recruiter` 只能访问所属 workspace 的招新数据；`guest` 只能访问公开内容。
- 原始简历、作品集和邮件附件不可被解析结果覆盖，解析必须保留版本和错误信息。
- 两套 UI 共享 API client、类型、认证工具和基础 UI，不共享业务 Layout、导航和页面路由。
- 公开端优先转化和可读性，后台优先信息密度、筛选效率和可追溯性。
- 白色为主、黑色建立结构、淡蓝/天蓝色做少量装饰和重点状态；避免无意义渐变和大面积装饰。
- 不提交密钥、邮箱密码、访问令牌、真实候选人材料或生产数据。
- 修改 API、RBAC、数据模型或页面状态时，必须补充对应测试或明确记录无法测试的原因。

## 质量门禁

默认顺序为：`Lint -> TypeCheck -> Build -> Test -> API verification`。命令以各应用实际 `package.json`、Go module 和 CI 配置为准；项目尚未初始化时，至少执行文档/结构校验和可用的静态检查。

## 变更记录

使用 `harness/templates/` 中的模板记录计划、实现报告、Review 和架构决策。复杂任务应在 `harness/knowledge/decisions/` 增加 ADR，而不是将关键决策只留在聊天记录中。
