# 02 Agent Selection

选择一个主 Agent，按任务范围补充专项协作：

- 前端页面和交互：`frontend-agent`
- Go API、数据库和异步任务：`backend-agent`
- 通用实现：`dev-agent`
- 质量验证：`test-agent`
- 独立审查：`review-agent`
- 发布流水线：`deploy-agent`

主 Agent 对最终变更负责，专项 Agent 不得越权修改不属于自己的边界。

