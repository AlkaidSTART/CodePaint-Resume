# CodePaint Resume Agent Guide

本文件是仓库内 AI Agent 和开发者的项目级入口。所有变更都要保持产品边界、接口契约和用户体验一致；详细工程约束位于 `harness/`，公开端 UI 约束位于 `docs/UI-DESIGN-USER.md` 和 `ui-enhance/SKILL.md`。

## 项目边界

```text
apps/public-web  -> 访客、报名者：公开招新、报名、个人状态
apps/admin-web   -> 招新成员：报名处理、解析、筛选、跟进
backend          -> Go API、认证、RBAC、异步任务
packages/*       -> API client、类型、认证、工具和基础 UI
```

- 两个前端应用分别拥有自己的 Layout、路由、导航和业务组件。
- 共享包只放无业务倾向的类型、API client、认证、工具和基础 UI，不放应用路由或权限页面。
- 后端是唯一安全边界。前端隐藏入口不能替代服务端认证、角色和资源归属校验。
- 普通用户只能访问自己的报名；招新成员只能访问所属 workspace 的招新数据；访客只能访问公开内容。
- 原始简历、作品集和邮件附件不可被解析结果覆盖；解析必须保留版本和错误信息。

## 强制工作流

1. 判断任务类型、影响范围和优先级（P0/P1/P2）。
2. 选择主 Agent；前端任务使用 `harness/agents/frontend-agent.md`。
3. 查阅相关 `harness/rules/`、工作流和验收清单。
4. 先更新必要的类型、接口契约或测试，再修改实现。
5. 按可用性执行 Lint、TypeCheck、Build、Test 和接口验证，并如实记录失败项。
6. 检查 diff、敏感信息和变更范围；只有用户明确要求时才创建 commit。

开始工作时说明任务类型、优先级、选用 Agent、查阅的规则和验证计划。复杂任务使用 `harness/templates/` 记录计划、实现报告、Review 或 ADR。

## public-web UI 规范

公开端的首要任务是让访客快速理解 CodePaint、判断自己是否适合，并顺利开始报名。实现页面前先阅读 `docs/UI-DESIGN-USER.md` 及 `ui-enhance/references/` 中与页面相关的文档。

- 视觉方向为“白纸上的蓝色批注”：白色画布、黑色结构、天蓝色少量强调；不使用紫蓝渐变、玻璃拟态、光斑、粒子背景、装饰性统计墙或无意义英文眉标签。
- 首页首屏必须在一屏内给出品牌、具体招募主题、下一步行动，并让下一段“我们正在招募”露出一部分；Hero 文案不放进卡片。
- 优先使用真实项目、作品或工作过程内容；没有真实图片时使用克制的内容化排版，不用氛围图库填空。图片必须有合适的 `alt`。
- 招新方向使用有序编号列表或清晰分组，不默认做同质化卡片墙；不添加文档没有的 logo、评分、数字、评价或承诺。
- 页面使用语义化 landmark、唯一 `h1`、正确的 `h2`/`h3` 层级、可见 focus、键盘可操作控件和持久表单 Label。
- 每个交互控件要处理默认、hover、focus-visible、active、disabled 和 pending；状态不能只靠颜色表达，错误必须贴近相关字段或对象。
- 公开端表单使用单列优先的布局，防止重复提交，保留已填内容，并提供字段级错误、成功反馈和可恢复的失败状态。
- 服务端状态使用 TanStack Query；瞬时 UI 状态使用组件 state；不得在 localStorage 持久化 Token、敏感材料或邮箱凭据。
- 响应式至少检查 `320`、`375`、`768`、`1024`、`1440` 和接近 `1920px`：无横向滚动、无遮挡、长文本可换行，移动端主要 CTA 保持可达。
- 动画必须解释交互关系，优先 transform/opacity，支持 `prefers-reduced-motion: reduce`，不阻塞首屏内容；Canvas 仅用于真实信息或必要的连续视觉，并提供 DOM 替代。

## 质量门禁

默认验证顺序为 `pnpm --filter @codepaint/public-web typecheck`、`pnpm --filter @codepaint/public-web build`，再根据改动范围运行测试或 API 验证。交付前检查浏览器控制台、键盘焦点、空数据、加载、失败、成功、无权限和窄屏状态。

不要提交密钥、真实候选人材料、生产数据或未解释的依赖升级；不要为了美化改动无关模块。
