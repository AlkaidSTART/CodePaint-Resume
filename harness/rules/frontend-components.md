# Frontend Component Rules

- 页面负责编排，业务组件负责领域交互，基础组件只负责视觉和通用行为；
- 共享 UI 不依赖任一应用的业务类型、路由和权限判断；
- 组件 props 使用明确类型，避免无约束的 `any` 和过度透传；
- 表格、表单、Dialog、上传和状态 Badge 必须定义 loading、empty、error 和 disabled 行为；
- 可复用组件需有键盘、焦点、ARIA 和窄屏行为说明或测试；
- 复杂组件拆分必须降低职责或测试复杂度，避免为拆分而拆分。

