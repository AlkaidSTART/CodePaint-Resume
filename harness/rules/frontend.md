# Frontend Rules

- `public-web` 和 `admin-web` 分别拥有自己的 Layout、路由、导航和业务组件。
- 共享包只放无业务倾向的基础 UI、类型、API client、认证和工具。
- 所有页面实现 loading、empty、error、success 和权限不足状态。
- 表单必须有可访问 Label、字段级错误、提交中状态和重复提交保护。
- 颜色不能是唯一状态信号；键盘焦点必须清晰。
- 管理后台优先扫描、筛选和批量操作，公开端优先信息层级和报名完成率。

