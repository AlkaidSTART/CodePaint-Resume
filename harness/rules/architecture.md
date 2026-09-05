# Architecture Rules

- 以 `docs/TDD.md` 的两套 UI + Go API 架构为基线。
- UI 不直连数据库、Redis、对象存储或 AI Provider。
- API client 和领域类型集中共享，业务依赖方向为 UI -> packages -> API contract。
- 新增跨应用能力前先判断是否真的属于共享层；业务差异留在对应应用。
- 影响边界、存储、权限或异步模型的决策必须记录 ADR。

