# Harness

`harness/` 是 CodePaint Resume 的 AI 协作约束层，用于把任务分析、Agent 路由、实现、测试和交付固化为可复用流程。

```text
User Input -> AGENTS.md -> 分析 -> Agent -> 规则 -> 实现 -> 验证 -> Review -> 提交/CI
```

目录说明：

- `agents/`：角色职责和边界
- `workflows/`：标准工作阶段
- `rules/`：全局工程约束
- `skills/`：领域能力入口
- `knowledge/`：架构与决策记录
- `mcp/`：外部工具接入说明
- `prompts/`：可复用任务提示词
- `templates/`：计划、报告和决策模板
- `checklists/`：验收门禁
