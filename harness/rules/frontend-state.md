# Frontend State Rules

- 服务端状态使用 TanStack Query 管理，业务资源不得复制到全局 store；
- UI 瞬时状态使用组件 state，跨页面状态仅在确有必要时使用 Zustand；
- 认证身份、角色和 workspace 由统一 auth 工具提供，页面不得自行解析 Token；
- 具有 owner/workspace 范围的 query key 必须包含范围标识；
- 登出、角色变化或 workspace 切换时清除旧范围缓存；
- mutation 成功后只失效受影响的 query，并处理竞态和重复提交；
- 不把敏感材料、访问令牌或邮箱凭据持久化到 `localStorage`。

