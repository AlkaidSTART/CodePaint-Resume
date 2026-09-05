# Backend API Rules

- 路径使用 `/api/v1` 版本前缀，资源使用一致的复数名词；
- 成功、分页和错误响应保持统一结构，并在 `docs/API.md` 登记；
- HTTP 状态码表达结果，认证失败、无权限、资源不存在、校验失败和冲突不可混用；
- 日期使用 ISO 8601，枚举值集中定义；
- 所有 path、query、body、header 和 multipart 字段均在边界校验；
- 分页、排序、筛选、搜索和导出必须有上限；
- 资源 id 不能替代当前用户/workspace 范围条件；
- 错误信息不得泄露 SQL、文件路径、Token 或 Provider 响应。

