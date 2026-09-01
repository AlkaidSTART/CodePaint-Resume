# CodePaint Studio 招新平台 — PRD

> 产品代号：ResumeFlow  
> 文档版本：v0.2  
> 文档状态：MVP 设计稿  
> 最后更新：2026-09-01

---

## 1. 产品概述

### 1.1 产品定位

ResumeFlow 是 CodePaint Studio 的招新平台，由普通用户端和招新成员后台两套 Web UI，以及一套统一 API 和异步解析服务组成。

普通用户端面向准备报名的同学，招新成员后台面向工作室内部成员，核心解决：

- 报名者无法快速了解 CodePaint 和当前招新方向；
- 报名材料提交、状态查看和后续沟通缺少统一入口；
- 招新邮箱中的简历和作品集无法高效沉淀；
- PDF / 图片简历需要人工打开、阅读、复制信息；
- AI 解析结果需要可追溯、可校验、可重新解析；
- 招新成员需要快速搜索、筛选、排序和跟进报名者。

普通用户端链路：

`公开招新页 → 注册 / 登录 → 选择方向 → 提交报名 → 查看报名状态`

招新后台链路：

`邮箱 → 简历附件 → 文件解析 → OCR（必要时）→ LLM 结构化解析 → 模板规则 → 候选人入库 → 搜索/筛选 → 岗位匹配`

两套 UI 的关系：

```text
apps/public-web  ─┐
                  ├── API / Auth / PostgreSQL / Redis / Object Storage
apps/admin-web  ──┘
```

- `public-web` 只负责公开招新、报名和普通用户个人中心；
- `admin-web` 只负责招新成员工作台和内部处理流程；
- 两套 UI 不直接访问数据库或 AI Provider；
- 两套 UI 共享 API 类型、请求客户端、权限类型和基础 UI 组件，但不共享页面 Layout 和业务路由；
- 后端根据 RBAC 对两套 UI 的所有接口进行最终鉴权。

### 1.2 产品目标

MVP 阶段目标不是做完整 ATS，而是把“简历收集 + AI 结构化 + 轻量筛选”做到稳定可用。

核心指标建议：

| 指标 | MVP 目标 |
| --- | --- |
| 简历自动入库成功率 | ≥ 95% |
| 可解析简历最终成功率 | ≥ 95% |
| 结构化字段有效率 | ≥ 90% |
| 单份普通文本 PDF 解析耗时 | ≤ 30s |
| OCR 简历解析耗时 | ≤ 90s |
| 解析失败可重试率 | 100% |
| 原始文件可追溯率 | 100% |

以上指标是工程目标，而不是已验证 SLA；上线后需通过真实数据校准。

---

## 2. 用户与使用场景

### 2.1 目标用户

平台基于 RBAC（Role-Based Access Control，基于角色的访问控制）区分普通用户与招新成员。公开页面允许未登录访客访问，但所有内部数据和管理操作都必须经过身份认证与角色授权。

#### 招聘人员

主要诉求：

- 自动收取邮箱简历；
- 批量查看候选人；
- 快速判断是否符合岗位；
- 搜索技能、学历、工作年限等信息。

#### 技术负责人 / 创业团队

主要诉求：

- 少量招聘，不需要复杂 ATS；
- 希望自己定义解析模板；
- 想快速获得结构化候选人数据；
- 希望知道 AI 为什么做出某个判断。

#### 普通用户 / 报名者

普通用户是访问公开招新页并提交报名材料的用户，主要诉求：

- 查看 CodePaint 的招新方向、报名要求和流程；
- 提交个人信息、自我介绍、作品链接和简历等材料；
- 查看自己的报名记录和处理状态；
- 在需要时补充或更新自己的报名材料。

普通用户不能查看其他报名者、内部解析结果、工作室邮箱、解析模板或招新成员操作记录。

#### 招新成员

招新成员是经过工作室授权、负责处理招新工作的内部用户，主要诉求：

- 查看和处理全部报名；
- 查看原始简历、作品集和邮件来源；
- 使用 AI 解析、匹配和人工复核；
- 管理招新方向、解析模板、邮箱和任务；
- 更新报名状态并记录后续跟进结果。

招新成员也不能绕过系统审计、直接访问未授权文件或修改原始报名材料。

### 2.2 RBAC 角色与权限

#### 角色定义

| 角色 | 身份 | 默认范围 | 说明 |
| --- | --- | --- | --- |
| `user` | 普通用户 / 报名者 | 仅本人 | 可以报名和查看自己的报名记录 |
| `recruiter` | 招新成员 | 当前工作室全部招新数据 | 可以处理报名和管理招新配置 |
| `guest` | 未登录访客 | 公开内容 | 只能访问公开招新页和公开招新方向 |

MVP 暂不引入更细的管理员、面试官或只读角色。后续如果出现多工作室或成员分工，再增加 `workspace_admin`、`reviewer` 等角色，并通过权限点扩展，不直接在业务代码中堆叠特殊用户名判断。

#### 权限矩阵

| 能力 | `guest` | `user` | `recruiter` |
| --- | --- | --- | --- |
| 浏览公开招新页 | ✅ | ✅ | ✅ |
| 查看公开招新方向 | ✅ | ✅ | ✅ |
| 创建报名 | ❌ | ✅ | ✅ |
| 查看自己的报名 | ❌ | ✅ | ✅ |
| 修改自己的报名 | ❌ | ✅（仅开放状态） | ✅ |
| 查看全部报名 | ❌ | ❌ | ✅ |
| 查看其他人的联系方式与原始材料 | ❌ | ❌ | ✅ |
| 修改报名处理状态 | ❌ | ❌ | ✅ |
| 触发解析 / OCR / 重新解析 | ❌ | ❌ | ✅ |
| 查看 AI 匹配分析与解析历史 | ❌ | 仅本人脱敏摘要（可选） | ✅ |
| 管理招新方向 | ❌ | ❌ | ✅ |
| 管理解析模板与版本 | ❌ | ❌ | ✅ |
| 查看、重试处理任务 | ❌ | ❌ | ✅ |
| 配置、测试和同步招新邮箱 | ❌ | ❌ | ✅ |

权限判断必须同时校验：

1. 用户身份是否有效；
2. 用户是否拥有目标角色；
3. 资源是否属于用户可访问的工作室或本人；
4. 当前操作是否允许在资源当前状态下执行。

#### 角色分配与状态

- 新注册用户默认角色为 `user`；
- `recruiter` 由已有招新成员或系统初始化流程授予，不允许普通用户自行申请后自动获得；
- 用户需要有 `active`、`invited`、`suspended` 状态；
- `suspended` 用户不能访问需要认证的接口，但其历史报名和原始材料不得被删除；
- 角色变更、邀请、禁用和恢复必须记录操作者、目标用户、原角色、新角色和时间；
- MVP 可以由数据库初始化脚本配置第一位招新成员，后续再提供成员管理页面。

#### 访问原则

- 默认拒绝：未明确授予的能力一律拒绝；
- 最小权限：普通用户只能访问自己的报名资源，招新成员只获得招新所需权限；
- 后端强制：所有 API 在服务端完成认证、角色和资源归属校验；
- 前端同步：根据角色隐藏无权限导航和操作，但不把前端判断视为安全边界；
- 文件保护：原始简历和作品集默认私有，下载链接必须经过角色与资源权限校验并使用短期签名 URL；
- 审计可追溯：敏感数据查看、下载、导出、状态修改和解析操作都应记录审计事件。

### 2.3 核心使用场景

#### 场景 0：普通用户报名

用户浏览公开招新页，登录或注册后填写报名表并上传材料。提交后只能看到自己的报名记录和状态，例如“已提交”“材料处理中”“等待联系”，不能看到其他报名者信息或内部 AI 评分。

招新成员在内部工作台收到该报名，系统根据招新方向和解析模板生成结构化数据，普通用户的报名状态随处理流程更新。

#### 场景 A：邮箱自动收简历

招聘邮箱收到：

`candidate@example.com`

主题：

`应聘 Go 后端工程师 - 张三`

附件：

`张三_简历.pdf`

系统自动发现附件并进入解析队列。

#### 场景 B：模板解析

用户创建：

`技术岗位简历模板 v1`

字段：

- 姓名
- 手机
- 邮箱
- 城市
- 学历
- 工作年限
- 技能
- 工作经历
- 项目经历

系统根据模板提取结构化数据。

#### 场景 C：换模板重新解析

原始简历保持不变。

用户修改模板为：

`技术岗位简历模板 v2`

选择“重新解析”。

系统生成新的解析版本，不覆盖旧版本。

#### 场景 D：岗位筛选

创建岗位：

`Go 后端工程师`

要求：

- 3 年以上经验
- Go
- Gin
- Redis
- PostgreSQL

系统依据候选人结构化数据和筛选规则计算匹配结果。

---

## 3. 产品原则

### 3.1 原始数据永不丢失

原始邮件元数据与原始简历文件是事实来源。

AI 解析结果属于派生数据，可以删除、重算、版本化。

### 3.2 AI 结果必须可解释

页面不能只有：

`匹配度 89%`

还应该能看到：

- 命中的技能；
- 工作年限依据；
- 学历依据；
- 缺失要求；
- AI 摘要；
- 使用的模板和模板版本。

### 3.3 模板优先于硬编码

解析字段、字段描述、校验规则、输出 JSON Schema、Prompt 约束都应尽量由模板驱动。

### 3.4 异步优先

所有耗时操作都进入任务系统：

- 邮件抓取；
- 文件下载；
- PDF 文本提取；
- OCR；
- LLM；
- 批量重新解析；
- 批量筛选。

---

## 4. MVP 功能范围

### 4.0.1 两套前端应用

MVP 初始化两个独立的 React 应用：

```text
apps/
├── public-web/        # 普通用户端 / 公开招新平台
└── admin-web/         # 招新成员后台管理系统
```

#### `public-web` 普通用户端

负责：

- 公开招新首页；
- 招新方向和报名要求；
- 注册、登录和退出登录；
- 报名表和材料上传；
- 我的报名列表；
- 报名详情、处理状态和成功页；
- 普通用户可见的 FAQ、流程和反馈提示。

不负责：

- 查看全部报名者；
- 内部备注和审核结论；
- 解析模板和 AI Provider 配置；
- 招新邮箱和任务管理。

#### `admin-web` 招新成员后台

负责：

- 招新概览；
- 报名收件箱；
- 报名者列表和详情；
- 原始简历、作品集和邮件来源查看；
- AI 解析、匹配分析和人工复核；
- 报名状态和内部备注；
- 招新方向、岗位、解析模板和版本；
- 处理任务、失败重试和邮箱设置。

不负责：

- 公开招新首页的展示逻辑；
- 普通用户个人中心的页面体验；
- 绕过 API 直接读写数据库、对象存储或 AI Provider。

#### 共享代码边界

两套应用共享以下包：

```text
packages/
├── api-client/        # 请求封装和 API 方法
├── types/             # User、Role、Application、Task 等类型
├── ui/                # Button、Input、Dialog、Toast 等基础组件
├── auth/              # 会话、角色和权限工具
└── utils/             # 日期、状态和格式化工具
```

不共享以下内容：

- 页面级 Layout；
- 页面路由；
- 普通用户端和后台的导航；
- 后台内部数据展示组件与公开端品牌内容组件；
- 依赖 `recruiter` 权限的页面逻辑。

### 4.0 身份认证与 RBAC

MVP 必须实现基础身份认证和 RBAC（Role-Based Access Control，基于角色的访问控制），不允许将权限系统推迟到后续阶段。

#### 普通用户能力

- 注册、登录、退出登录；
- 查看公开招新页面和招新方向；
- 创建自己的报名记录；
- 查看自己的报名状态、提交时间和处理进度；
- 在报名仍处于允许编辑的状态时补充或修改材料；
- 不能访问内部工作台、其他报名者数据、工作室邮箱配置、解析模板和任务日志。

#### 招新成员能力

- 登录内部招新工作台；
- 查看全部报名者、报名材料和原始文件；
- 修改报名处理状态和添加内部备注；
- 触发解析、OCR、重新解析和岗位匹配；
- 查看 AI 摘要、命中项、缺失项、判断依据和解析历史；
- 管理招新方向和解析模板；
- 查看、重试和追踪处理任务；
- 配置、测试和同步招新邮箱。

#### 权限失败行为

- 未登录访问认证接口返回 `401 Unauthorized`；
- 已登录但没有所需角色返回 `403 Forbidden`；
- 访问不属于自己的报名或文件，即使资源 ID 已知，也返回 `404 Not Found` 或统一的资源不可见响应，避免泄露资源是否存在；
- 前端遇到无权限路由时跳转到对应角色可访问的首页，并显示明确的无权限提示。

### 4.1 邮箱接入

#### 功能

支持通过 IMAP 接入邮箱。

配置：

- 邮箱地址
- IMAP Host
- IMAP Port
- 用户名
- 密码 / 应用专用密码
- 文件夹
- 拉取频率

MVP 推荐先支持：

- IMAP
- SSL/TLS
- INBOX

暂不实现：

- Gmail OAuth
- Microsoft Graph
- 邮件发送

#### 规则

默认只处理包含支持格式附件的邮件。

支持：

- PDF
- DOCX
- PNG/JPG（可作为后续 OCR 输入）

---

## 5. 简历接收与文件管理

### 5.0 报名与权限数据模型

公开报名记录与内部候选人数据需要区分：报名者提交的是 `Application`，系统解析后形成可供招新成员处理的 `Candidate` / `Resume` 数据。

最小关系：

```text
User 1:N Application
Application 1:N Resume
Resume 1:N ParseRun
User N:N Role
```

推荐字段：

```text
users
  id
  email
  name
  status              # invited / active / suspended
  created_at
  updated_at

roles
  id
  code                # user / recruiter
  name

user_roles
  user_id
  role_id
  workspace_id        # 招新成员所属工作室，MVP 可固定为一个 workspace
  created_at
  created_by

applications
  id
  applicant_user_id
  intended_role_id
  status
  submitted_at
  updated_at
```

规则：

- 新注册用户默认授予 `user` 角色；
- `recruiter` 只能由已有招新成员或系统初始化流程授予；
- `applicant_user_id` 用于限制普通用户只能访问自己的报名；
- `workspace_id` 用于限制招新成员只能访问所属工作室的数据，为未来多工作室扩展保留边界；
- 普通用户提交的报名不能直接覆盖原始邮件或原始文件；
- 角色变更、邀请、禁用、恢复、敏感文件查看和下载都必须保留审计记录。

### 5.1 邮件记录

需要保存：

- message_id
- from
- to
- subject
- received_at
- raw metadata
- provider
- folder

### 5.2 附件记录

需要保存：

- attachment_id
- file_name
- mime_type
- size
- sha256
- storage_key
- source_message_id

通过 `sha256` 做文件去重。

### 5.3 简历实体

简历与候选人分离。

原因：

一个候选人可以有：

- 多份不同版本简历；
- 多次投递；
- 不同模板的多次解析结果。

关系：

`Candidate 1:N Resume 1:N ParseRun`

---

## 6. AI 解析流程

### 6.1 总体流程

```text
Email
  ↓
Attachment
  ↓
Resume
  ↓
Extract Text
  ↓
Text Quality Check
  ├── OK ───────────────┐
  │                      ↓
  │                   LLM Parse
  │
  └── Bad → OCR → Text → LLM Parse
                         ↓
                    Validate JSON
                         ↓
                    Persist Result
```

### 6.2 文本提取

优先使用 PDF 原生文本层。

质量判断可使用：

- 总字符数；
- 有效字符比例；
- 空白比例；
- 可识别语言比例；
- 页面是否存在图片主导内容。

### 6.3 OCR

仅在文本不足时执行。

OCR 层应抽象为 Provider。

MVP 可以采用：

- PaddleOCR 独立服务

后续可接入：

- 云厂商 OCR；
- 商业 OCR API。

### 6.4 LLM 解析

输入：

- 简历文本；
- 模板定义；
- 模板 Prompt；
- JSON Schema；
- 额外规则。

输出：

- 结构化 JSON；
- 解析摘要；
- 可选字段级置信度；
- provider/model/version。

必须严格做 Schema 校验。

---

## 7. Template 设计

### 7.1 Template 定义

模板负责告诉系统：

> “应该从简历中提取哪些信息，以及用什么规则提取。”

模板主要包含：

- name
- description
- version
- fields
- extraction_prompt
- normalization_rules
- validation_rules
- schema

### 7.2 字段类型

MVP 支持：

- string
- number
- boolean
- enum
- array
- object

### 7.3 常用字段

默认模板建议：

```text
basic.name
basic.phone
basic.email
basic.location
basic.age

education[]
education[].school
education[].major
education[].degree
education[].start_date
education[].end_date

experience[]
experience[].company
experience[].position
experience[].start_date
experience[].end_date
experience[].description

projects[]
projects[].name
projects[].description
projects[].tech_stack

skills[]

languages[]

summary

years_of_experience
job_intention
```

### 7.4 模板版本

模板不可直接覆盖历史版本。

例如：

```text
go-backend
├── v1
├── v2
└── v3
```

解析结果必须记录：

- template_id
- template_version
- prompt_version
- parser_version
- model
- model_version

### 7.5 重新解析

用户可以：

`Resume → Re-parse → Select Template Version`

新的解析结果生成新的 ParseRun。

旧结果仍可查看。

---

## 8. 岗位筛选

### 8.1 Screening Template

岗位筛选模板与简历解析模板分开。

解析模板回答：

> 候选人是谁？

筛选模板回答：

> 候选人是否适合这个岗位？

### 8.2 Screening Rule

支持：

- required skills
- preferred skills
- min experience
- education requirement
- location
- keywords
- custom rules

### 8.3 匹配结果

示例：

```json
{
  "score": 89,
  "matched": [
    "Go",
    "Gin",
    "Redis"
  ],
  "missing": [
    "Temporal"
  ],
  "reasons": [
    "5 years backend experience",
    "3 years Go experience"
  ]
}
```

### 8.4 Score

MVP 阶段分数可以采用“规则分 + LLM 解释”的混合方式：

```text
硬性条件        60%
技能匹配        25%
经验相关性      10%
其它因素         5%
```

最终权重可配置。

LLM 不直接决定所有硬条件。

---

## 9. 候选人模块

### 9.1 列表

候选人列表显示：

- 姓名
- 当前职位
- 城市
- 工作年限
- 核心技能
- 最近更新时间
- 标签
- 匹配岗位
- 状态

支持：

- 搜索
- 技能筛选
- 工作年限
- 学历
- 城市
- 标签
- 状态
- 匹配分数排序

### 9.2 详情

候选人详情分为：

#### Overview

- AI Summary
- Match Score
- 基础信息

#### Education

教育经历

#### Experience

工作经历

#### Projects

项目经历

#### Skills

技能

#### Original Resume

原始简历预览

#### Parse History

所有解析版本

---

## 10. 状态机

### 10.1 Resume 状态

```text
pending
processing
ready
failed
archived
```

### 10.2 ParseRun 状态

```text
queued
extracting
ocr
llm_parsing
validating
completed
failed
cancelled
```

### 10.3 Candidate 状态

```text
new
reviewing
shortlisted
interviewing
offer
rejected
archived
```

---

## 11. 任务系统

MVP 使用 Redis + Asynq。

任务：

```text
email.sync
attachment.download
resume.extract_text
resume.ocr
resume.parse_llm
resume.validate
resume.persist
screening.match
resume.reparse
```

所有任务：

- 可重试；
- 有最大重试次数；
- 有超时；
- 有任务日志；
- 有最终失败状态。

---

## 12. 页面信息架构

### 12.1 普通用户端 `public-web`

```text
/
├── Recruitment Home
├── Recruitment Role Detail
├── Login / Register
├── Apply
├── Application Success
└── My Applications
    └── My Application Detail
```

### 12.2 招新成员后台 `admin-web`

```text
/workspace
├── Dashboard
├── Inbox
├── Applicants
│   └── Applicant Detail
├── Roles
├── Jobs
│   └── Job Detail
├── Templates
│   ├── Resume Templates
│   └── Screening Templates
├── Tasks
└── Settings
    ├── Members
    ├── Email
    ├── AI Providers
    ├── OCR
    └── Storage
```

路由访问规则：

- `public-web` 的公开招新页可由 `guest` 访问；
- `public-web` 的 `Apply`、`My Applications` 需要 `user` 或 `recruiter`；
- `admin-web` 的 `/workspace/*` 所有路由只允许 `recruiter`；
- 普通用户访问 `admin-web` 时应被拒绝或引导回 `public-web`，不能只依赖前端隐藏菜单；
- 招新成员可以访问普通用户端的公开页面和报名入口，但后台业务操作统一在 `admin-web` 完成；
- 角色不匹配时不能仅依靠前端隐藏菜单，API 和服务端路由必须再次校验。

---

## 13. Dashboard

MVP 不做复杂 BI。

只提供：

- 今日收到简历
- 待处理任务
- 已解析候选人
- 解析失败
- 最近候选人
- 最近任务

---

## 14. 非功能需求

### 14.1 安全

- 所有需要认证的 API 必须校验会话或 Token；
- API 必须执行角色校验和资源归属校验，前端权限判断不能作为安全边界；
- 普通用户只能读取和修改自己的报名及允许公开的处理状态；
- 招新成员只能访问所属工作室的数据；
- 角色变更、用户邀请、用户禁用、敏感信息查看、文件下载、报名状态修改和解析操作写入审计日志；
- 邮箱密码加密存储；
- API Token 不写入日志；
- 下载文件使用权限校验；
- 原始简历默认私有；
- 文件访问使用短期签名 URL；
- LLM 请求默认不记录完整简历正文到应用日志。

### 14.2 可观测性

记录：

- request_id
- task_id
- resume_id
- candidate_id
- parse_run_id
- template_version
- model
- latency
- token usage
- error code

### 14.3 可恢复性

任何 AI 流程失败都不能导致原始文件丢失。

---

## 15. MVP 不做什么

明确排除：

- 完整 ATS 流程；
- 面试日历；
- Offer 管理；
- 招聘网站；
- 简历生成；
- 大规模企业组织管理；
- Elasticsearch；
- 复杂 BI；
- 多租户计费；
- 复杂的组织层级和细粒度管理员角色。

---

## 16. MVP 验收标准

### 邮箱

- 能成功连接 IMAP；
- 能拉取新邮件；
- 能识别附件；
- 同一邮件不会重复处理。

### 文件

- PDF 能进入对象存储；
- Hash 可去重；
- 下载权限正确。

### 解析

- 文本 PDF 不经 OCR；
- 扫描 PDF 自动 OCR；
- LLM 输出符合 Schema；
- 失败后可以重试；
- 可以重新解析。

### 模板

- 可以新建模板；
- 可以编辑字段；
- 有版本；
- 可以指定模板重新解析；
- 历史解析结果可查看。

### 候选人

- 能列表查看；
- 能搜索；
- 能按基础条件筛选；
- 能查看原始简历；
- 能查看解析历史。

### 身份认证与 RBAC

- 未登录访客只能访问公开招新内容；
- 普通用户可以注册、登录、提交报名并查看自己的报名状态；
- 普通用户不能读取其他报名者、内部备注、解析模板、任务和邮箱配置；
- 招新成员可以进入内部工作台并处理全部授权范围内的报名；
- 无身份访问认证接口返回 401，无角色权限访问返回 403；
- 访问不属于自己的报名或文件不会泄露资源是否存在；
- 角色分配和敏感操作有审计记录；
- 前端隐藏无权限入口，后端 API 仍执行强制鉴权。

---

## 17. 后续路线

### Phase 2

- Gmail OAuth
- Microsoft Graph
- DOCX
- 批量导入
- JD 自动解析
- 岗位一键匹配
- 批量筛选
- CSV / Excel 导出

### Phase 3

- 多租户
- 团队协作
- 更细粒度的权限点和管理员角色
- 语义检索
- 候选人去重
- 自动招聘工作流
- AI 招聘助手

---

## 18. 核心产品判断

ResumeFlow 的竞争力不是“调用 LLM 解析 PDF”。

真正的产品壁垒应该来自：

1. **原始文件 → 结构化数据的稳定 Pipeline**
2. **用户可编辑、可版本化的 Template**
3. **解析结果的可追溯与可重新计算**
4. **规则筛选 + LLM 理解结合**
5. **极低学习成本的招聘工作台**
