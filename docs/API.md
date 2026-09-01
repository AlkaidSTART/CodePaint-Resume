# CodePaint Studio 招新平台 API 文档

> 产品代号：ResumeFlow  
> 文档版本：v0.1  
> 文档状态：MVP API 设计  
> 最后更新：2026-09-01

本文档描述 CodePaint Studio 招新平台可能用到的 HTTP API。接口分为公开招新、普通用户报名、招新成员工作台和异步解析任务四部分。

---

# 1. 基础约定

## 1.1 Base URL

```text
/api/v1
```

开发环境示例：

```text
http://localhost:8080/api/v1
```

## 1.2 Content-Type

JSON 请求：

```http
Content-Type: application/json
Accept: application/json
```

文件上传使用：

```http
Content-Type: multipart/form-data
```

## 1.3 认证方式

MVP 推荐使用 HttpOnly、Secure、SameSite=Lax Cookie 保存会话。若前后端部署完全分离，也可以使用：

```http
Authorization: Bearer <access_token>
```

不要把 access token、邮箱密码或对象存储签名 URL 写入普通日志，也不要把 token 保存到 `localStorage`。

## 1.4 角色

| 角色 | 说明 | 资源范围 |
| --- | --- | --- |
| `guest` | 未登录访客 | 公开招新内容 |
| `user` | 普通用户 / 报名者 | 本人的报名和公开状态 |
| `recruiter` | 招新成员 | 所属工作室的全部招新数据 |

所有内部接口都必须在服务端校验身份、角色、工作室范围和资源归属。前端隐藏菜单不构成安全边界。

## 1.5 分页

列表接口统一支持：

```http
GET /resource?page=1&page_size=20
```

响应中的 `pagination`：

```json
{
  "page": 1,
  "page_size": 20,
  "total": 128,
  "total_pages": 7
}
```

`page_size` 默认 `20`，最大 `100`。

## 1.6 统一响应

成功：

```json
{
  "data": {},
  "request_id": "req_01J..."
}
```

列表：

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 0,
    "total_pages": 0
  },
  "request_id": "req_01J..."
}
```

异步任务：

```json
{
  "data": {
    "task_id": "task_01J...",
    "status": "queued"
  },
  "request_id": "req_01J..."
}
```

---

# 2. 错误与状态码

| HTTP 状态码 | 含义 |
| --- | --- |
| `200` | 请求成功 |
| `201` | 创建成功 |
| `202` | 请求已接受，异步处理 |
| `204` | 成功且无响应体 |
| `400` | 请求格式错误 |
| `401` | 未登录或会话失效 |
| `403` | 已登录但无权限 |
| `404` | 资源不存在或对当前用户不可见 |
| `409` | 状态冲突或重复资源 |
| `422` | 参数校验失败 |
| `429` | 请求频率过高 |
| `500` | 服务端错误 |

错误响应：

```json
{
  "error": {
    "code": "APPLICATION_NOT_EDITABLE",
    "message": "当前报名状态不允许修改",
    "fields": {
      "status": "submitted"
    }
  },
  "request_id": "req_01J..."
}
```

常用错误码：

```text
AUTH_REQUIRED
INVALID_CREDENTIALS
ACCOUNT_SUSPENDED
FORBIDDEN
RESOURCE_NOT_FOUND
VALIDATION_FAILED
APPLICATION_NOT_EDITABLE
FILE_TYPE_NOT_SUPPORTED
FILE_TOO_LARGE
TASK_NOT_RETRYABLE
TEMPLATE_INVALID
MAILBOX_CONNECTION_FAILED
RATE_LIMITED
INTERNAL_ERROR
```

---

# 3. 认证与当前用户

## 3.1 注册

```http
POST /auth/register
```

权限：`guest`

请求：

```json
{
  "email": "student@example.com",
  "password": "strong-password",
  "name": "林同学"
}
```

规则：

- 邮箱必须唯一；
- 密码必须在服务端哈希后存储；
- 新用户默认角色为 `user`，状态为 `active`；
- 不允许通过请求体指定 `recruiter` 角色。

响应：`201 Created`

```json
{
  "data": {
    "user": {
      "id": "usr_01J...",
      "email": "student@example.com",
      "name": "林同学",
      "roles": ["user"],
      "status": "active"
    }
  },
  "request_id": "req_01J..."
}
```

## 3.2 登录

```http
POST /auth/login
```

权限：`guest`

请求：

```json
{
  "email": "student@example.com",
  "password": "strong-password"
}
```

成功：`200 OK`，写入会话 Cookie 或返回 access token。

```json
{
  "data": {
    "user": {
      "id": "usr_01J...",
      "email": "student@example.com",
      "name": "林同学",
      "roles": ["user"],
      "status": "active"
    },
    "redirect_to": "/my-applications"
  },
  "request_id": "req_01J..."
}
```

招新成员登录后的 `redirect_to` 应为 `/workspace`。

## 3.3 退出登录

```http
POST /auth/logout
```

权限：已登录

响应：`204 No Content`

## 3.4 获取当前用户

```http
GET /auth/me
```

权限：已登录

响应：

```json
{
  "data": {
    "id": "usr_01J...",
    "email": "recruiter@codepaint.example",
    "name": "CodePaint 招新组",
    "roles": ["recruiter"],
    "status": "active",
    "workspaces": [
      {
        "id": "ws_01J...",
        "name": "CodePaint Studio"
      }
    ]
  },
  "request_id": "req_01J..."
}
```

## 3.5 招新成员邀请

```http
POST /workspace/members/invitations
```

权限：`recruiter`

MVP 可以只允许系统初始化流程调用；若开放为业务接口，必须限制为已有招新成员，并记录审计日志。

请求：

```json
{
  "email": "member@example.com",
  "name": "周同学",
  "role": "recruiter"
}
```

响应：`201 Created`

```json
{
  "data": {
    "invitation_id": "invite_01J...",
    "email": "member@example.com",
    "role": "recruiter",
    "status": "invited",
    "expires_at": "2026-09-08T10:00:00Z"
  },
  "request_id": "req_01J..."
}
```

---

# 4. 公开招新接口

## 4.1 获取公开招新配置

```http
GET /public/recruitment
```

权限：`guest`

返回首页展示所需的工作室介绍、招新主张、报名流程、FAQ 和当前招新周期。

```json
{
  "data": {
    "studio": {
      "name": "CodePaint Studio",
      "description": "一起把想法做成真正能运行的作品",
      "introduction": "我们在寻找愿意动手、愿意协作，也愿意把问题想清楚的新成员。"
    },
    "campaign": {
      "id": "campaign_01J...",
      "title": "2026 秋季招新",
      "status": "open",
      "deadline": "2026-09-30T23:59:59+08:00"
    },
    "application_guide": {
      "materials": ["自我介绍", "作品链接", "简历或补充材料"],
      "steps": ["提交报名", "材料审核", "联系沟通"]
    },
    "faqs": []
  },
  "request_id": "req_01J..."
}
```

## 4.2 获取公开招新方向

```http
GET /public/recruitment/roles
```

权限：`guest`

查询参数：`campaign_id`、`status=open`

响应中的方向只返回公开字段，不返回内部解析模板、筛选规则或内部备注。

```json
{
  "data": [
    {
      "id": "role_01J...",
      "slug": "engineering",
      "name": "工程",
      "name_en": "Engineering",
      "summary": "做产品、工具和实验，把想法变成可使用的东西。",
      "fit_for": ["对技术感兴趣", "愿意动手实践"],
      "expected_materials": ["项目链接", "GitHub", "简历"],
      "status": "open"
    }
  ],
  "request_id": "req_01J..."
}
```

## 4.3 获取单个公开招新方向

```http
GET /public/recruitment/roles/:role_id
```

权限：`guest`

返回某一招新方向的公开详情。

---

# 5. 普通用户报名接口

## 5.1 创建报名

```http
POST /applications
```

权限：`user`、`recruiter`

请求建议使用 `multipart/form-data`，文本字段和文件一起提交。

字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `campaign_id` | string | 是 | 招新周期 ID |
| `intended_role_id` | string | 是 | 意向方向 ID |
| `name` | string | 是 | 姓名或昵称 |
| `contact` | string | 是 | 联系方式 |
| `student_status` | string | 否 | 年级或当前状态 |
| `introduction` | string | 是 | 自我介绍 |
| `portfolio_url` | string | 否 | 作品链接 |
| `github_url` | string | 否 | GitHub 链接 |
| `expectation` | string | 否 | 对 CodePaint 的期待 |
| `file` | binary | 否 | 简历或补充材料 |

响应：`201 Created`

```json
{
  "data": {
    "application": {
      "id": "app_01J...",
      "status": "submitted",
      "intended_role": {
        "id": "role_01J...",
        "name": "工程"
      },
      "submitted_at": "2026-09-01T10:00:00Z"
    }
  },
  "request_id": "req_01J..."
}
```

创建报名后，材料解析应通过异步任务启动。接口只保证报名记录和原始文件成功保存，不等待 OCR 或 LLM 完成。

## 5.2 获取我的报名列表

```http
GET /me/applications?page=1&page_size=20
```

权限：`user`、`recruiter`

普通用户只返回本人记录。招新成员如需查看全部报名，应使用工作台接口，不使用该接口绕过工作室范围控制。

## 5.3 获取我的报名详情

```http
GET /me/applications/:application_id
```

权限：`user`、`recruiter`

普通用户响应只包含脱敏后的公开处理状态，不返回内部备注、完整 AI 评分、其他报名者信息或内部筛选规则。

```json
{
  "data": {
    "id": "app_01J...",
    "status": "processing",
    "status_label": "材料处理中",
    "intended_role": "工程",
    "submitted_at": "2026-09-01T10:00:00Z",
    "updated_at": "2026-09-01T10:00:08Z",
    "timeline": [
      {"status": "submitted", "at": "2026-09-01T10:00:00Z"},
      {"status": "processing", "at": "2026-09-01T10:00:08Z"}
    ]
  },
  "request_id": "req_01J..."
}
```

## 5.4 修改我的报名

```http
PATCH /me/applications/:application_id
```

权限：`user`、`recruiter`

普通用户只能在 `draft` 或产品明确开放编辑的状态下修改本人报名，不允许修改 `status`、解析结果、内部备注或审核结论。

请求：

```json
{
  "introduction": "补充后的自我介绍",
  "portfolio_url": "https://example.com/portfolio"
}
```

## 5.5 上传报名材料

```http
POST /me/applications/:application_id/files
```

权限：`user`、`recruiter`

支持格式：`pdf`、`docx`、`png`、`jpg`。服务端校验 MIME、扩展名、文件大小和内容签名，不使用原始文件名作为唯一 key。

响应：`201 Created`

```json
{
  "data": {
    "file": {
      "id": "file_01J...",
      "name": "resume.pdf",
      "mime_type": "application/pdf",
      "size": 182034,
      "status": "uploaded"
    }
  },
  "request_id": "req_01J..."
}
```

## 5.6 删除或替换报名材料

```http
DELETE /me/applications/:application_id/files/:file_id
```

权限：`user`、`recruiter`

仅允许删除尚未进入不可变处理阶段的本人文件。删除操作不应物理删除审计记录；如果文件已作为原始材料进入处理流程，应改为逻辑归档或创建新版本。

---

# 6. 招新成员工作台接口

以下接口全部需要 `recruiter` 角色，并且服务端必须按 `workspace_id` 过滤数据。

## 6.1 招新概览

```http
GET /workspace/dashboard
```

查询参数：`campaign_id`、`from`、`to`

返回待查看报名、解析中、解析失败、本周新报名、待联系等摘要。

## 6.2 报名收件箱

```http
GET /workspace/inbox?page=1&page_size=20&status=unread
GET /workspace/inbox/:inbox_item_id
PATCH /workspace/inbox/:inbox_item_id
```

支持筛选：`status`、`has_file`、`campaign_id`、`received_from`、`received_to`。

PATCH 示例：

```json
{
  "is_read": true
}
```

## 6.3 报名者列表

```http
GET /workspace/applicants?page=1&page_size=20
```

查询参数：

```text
q
campaign_id
intended_role_id
status
city
min_experience
skill
min_score
sort
```

示例：

```http
GET /workspace/applicants?intended_role_id=role_01J...&min_score=80&sort=-submitted_at
```

## 6.4 报名者详情

```http
GET /workspace/applicants/:applicant_id
PATCH /workspace/applicants/:applicant_id
```

PATCH 仅允许更新招新处理字段，例如：

```json
{
  "status": "reviewing",
  "internal_note": "作品集需要进一步沟通"
}
```

不允许通过此接口覆盖原始简历、原始邮件或历史解析结果。

## 6.5 更新报名处理状态

```http
POST /workspace/applicants/:applicant_id/status-events
```

请求：

```json
{
  "status": "shortlisted",
  "note": "完成初筛，准备联系"
}
```

状态建议：

```text
new
reviewing
shortlisted
interviewing
offer
rejected
archived
```

状态变更必须记录操作者和时间，普通用户只能看到映射后的公开状态。

## 6.6 获取原始材料访问地址

```http
GET /workspace/applicants/:applicant_id/files/:file_id/url
```

权限：`recruiter`

返回短期有效的签名 URL，不直接暴露对象存储路径。

```json
{
  "data": {
    "url": "https://storage.example/signed-url",
    "expires_at": "2026-09-01T10:15:00Z"
  },
  "request_id": "req_01J..."
}
```

查看和下载操作都应写入审计日志。

---

# 7. 招新方向与岗位接口

## 7.1 招新方向

```http
GET /workspace/roles
POST /workspace/roles
GET /workspace/roles/:role_id
PATCH /workspace/roles/:role_id
POST /workspace/roles/:role_id/publish
POST /workspace/roles/:role_id/archive
```

创建请求：

```json
{
  "campaign_id": "campaign_01J...",
  "name": "工程",
  "name_en": "Engineering",
  "slug": "engineering",
  "summary": "做产品、工具和实验，把想法变成可使用的东西。",
  "fit_for": ["对技术感兴趣", "愿意动手实践"],
  "expected_materials": ["项目链接", "简历"]
}
```

已被报名记录引用的方向不应直接删除，使用 `archived` 状态保留历史关系。

## 7.2 岗位筛选

保留 TDD 中的岗位接口：

```http
GET /workspace/jobs
POST /workspace/jobs
GET /workspace/jobs/:job_id
PATCH /workspace/jobs/:job_id
POST /workspace/jobs/:job_id/screen
GET /workspace/jobs/:job_id/results
```

`screen` 为异步操作，返回 `202 Accepted` 和 `task_id`。

---

# 8. 解析模板接口

## 8.1 模板

```http
GET /workspace/templates
POST /workspace/templates
GET /workspace/templates/:template_id
PATCH /workspace/templates/:template_id
```

查询参数：`type=resume|screening`、`status=active|archived`。

## 8.2 模板版本

```http
GET /workspace/templates/:template_id/versions
POST /workspace/templates/:template_id/versions
GET /workspace/templates/:template_id/versions/:version
POST /workspace/templates/:template_id/versions/:version/activate
```

创建版本请求：

```json
{
  "description": "增加作品链接和项目贡献字段",
  "fields": [
    {
      "key": "basic.name",
      "label": "姓名",
      "type": "string",
      "required": true,
      "description": "报名者姓名或昵称"
    }
  ],
  "schema": {},
  "extraction_prompt": ""
}
```

已激活版本不可直接覆盖，只能创建新版本。激活操作应记录操作者和版本变更。

---

# 9. 简历、解析与 AI 接口

## 9.1 简历详情

```http
GET /workspace/resumes/:resume_id
GET /workspace/resumes/:resume_id/parse-runs
```

权限：`recruiter`

## 9.2 发起重新解析

```http
POST /workspace/resumes/:resume_id/reparse
```

请求：

```json
{
  "template_version_id": "tplv_01J...",
  "force_ocr": false
}
```

响应：`202 Accepted`

```json
{
  "data": {
    "parse_run_id": "parse_01J...",
    "task_id": "task_01J...",
    "status": "queued"
  },
  "request_id": "req_01J..."
}
```

新的 ParseRun 不覆盖旧结果，必须保留模板版本、Prompt 版本、模型、模型版本和处理时间。

## 9.3 获取解析结果

```http
GET /workspace/resumes/:resume_id/parse-runs/:parse_run_id
```

返回：

```json
{
  "data": {
    "id": "parse_01J...",
    "status": "completed",
    "structured_data": {},
    "summary": "有 2 年工具开发经验。",
    "confidence": {},
    "template_version": "工程方向 v2",
    "model": "provider-model",
    "completed_at": "2026-09-01T10:02:00Z"
  },
  "request_id": "req_01J..."
}
```

## 9.4 获取匹配分析

```http
GET /workspace/applicants/:applicant_id/match-analysis
```

返回命中技能、缺失要求、经验依据、AI 摘要和规则分。结果必须标明是辅助判断，不能表达为自动录取结论。

---

# 10. 任务接口

## 10.1 查询任务

```http
GET /workspace/tasks?page=1&page_size=20
GET /workspace/tasks/:task_id
```

查询参数：`status`、`type`、`resume_id`、`created_from`、`created_to`。

任务类型：

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

## 10.2 重试任务

```http
POST /workspace/tasks/:task_id/retry
```

权限：`recruiter`

响应：`202 Accepted`

```json
{
  "data": {
    "task_id": "task_01J-new",
    "source_task_id": "task_01J-old",
    "status": "queued"
  },
  "request_id": "req_01J..."
}
```

只有最终失败且允许重试的任务可以重试。原任务日志不可修改。

## 10.3 任务事件

```http
GET /workspace/tasks/:task_id/events
```

用于展示：读取材料、提取文字、OCR、AI 分析、校验和完成等阶段。

---

# 11. 邮箱设置接口

## 11.1 邮箱配置

```http
GET /workspace/mailboxes
POST /workspace/mailboxes
GET /workspace/mailboxes/:mailbox_id
PATCH /workspace/mailboxes/:mailbox_id
DELETE /workspace/mailboxes/:mailbox_id
```

权限：`recruiter`

创建请求：

```json
{
  "name": "CodePaint 招新邮箱",
  "provider": "imap",
  "host": "imap.example.com",
  "port": 993,
  "username": "join@example.com",
  "password": "application-password",
  "folder": "INBOX",
  "tls": true,
  "sync_interval_minutes": 5
}
```

响应中不得返回密码。密码必须加密存储，修改时单独提交或通过安全表单处理。

## 11.2 测试邮箱连接

```http
POST /workspace/mailboxes/:mailbox_id/test
```

响应：

```json
{
  "data": {
    "status": "success",
    "message": "邮箱连接成功"
  },
  "request_id": "req_01J..."
}
```

## 11.3 手动同步邮箱

```http
POST /workspace/mailboxes/:mailbox_id/sync
```

响应：`202 Accepted`，返回 `task_id`。同一邮箱已有同步任务运行时返回 `409` 或复用正在运行的任务。

---

# 12. RBAC 与资源授权规则

## 12.1 公开接口

以下接口不需要登录：

```text
GET  /public/recruitment
GET  /public/recruitment/roles
GET  /public/recruitment/roles/:role_id
POST /auth/register
POST /auth/login
```

## 12.2 普通用户接口

普通用户只能访问：

```text
GET   /auth/me
POST  /auth/logout
POST  /applications
GET   /me/applications
GET   /me/applications/:id
PATCH /me/applications/:id
POST  /me/applications/:id/files
DELETE /me/applications/:id/files/:file_id
```

服务端必须通过当前会话中的用户 ID 校验 `applicant_user_id`，不能信任请求体中的用户 ID。

## 12.3 招新成员接口

所有 `/workspace/*` 接口需要 `recruiter`。涉及报名、简历、文件、任务和邮箱的查询，必须附加：

```text
resource.workspace_id IN current_user.workspace_ids
```

## 12.4 权限错误

- 未登录：`401 AUTH_REQUIRED`；
- 已登录无角色：`403 FORBIDDEN`；
- 资源不属于本人或工作室：统一返回 `404 RESOURCE_NOT_FOUND`；
- 已归档资源是否可读由具体接口定义，但归档不等于无审计、无历史。

---

# 13. 文件与异步处理约定

## 13.1 文件安全

- 支持格式、大小和内容签名必须由服务端校验；
- 使用 `sha256` 去重；
- 对象存储默认 `private`；
- 浏览器通过权限校验后的短期签名 URL 访问；
- 原始文件不能被解析结果覆盖；
- 文件名仅作展示，不作为唯一标识或路径。

## 13.2 幂等性

创建报名、上传文件、邮箱同步和发起重新解析等可能重试的请求建议支持：

```http
Idempotency-Key: <unique-key>
```

服务端在同一用户和接口范围内保存幂等结果，避免网络重试产生重复报名或重复任务。

## 13.3 异步状态

统一使用：

```text
queued
processing
completed
failed
cancelled
```

任务详情需要关联：

```text
task_id
request_id
application_id
resume_id
parse_run_id
template_version_id
```

---

# 14. 审计日志

以下事件必须记录：

```text
auth.login
auth.logout
role.invited
role.granted
role.revoked
user.suspended
user.reactivated
application.created
application.updated
application.status_changed
file.viewed
file.downloaded
resume.reparsed
template.version_activated
task.retried
mailbox.updated
```

审计字段：

```text
id
actor_user_id
workspace_id
action
resource_type
resource_id
metadata
ip
user_agent
created_at
```

审计日志只允许追加，不允许普通业务接口修改或删除。

---

# 15. MVP 接口优先级

## P0

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
GET  /public/recruitment
GET  /public/recruitment/roles
POST /applications
GET  /me/applications
GET  /me/applications/:id
GET  /workspace/dashboard
GET  /workspace/applicants
GET  /workspace/applicants/:id
PATCH /workspace/applicants/:id
GET  /workspace/applicants/:id/files/:file_id/url
GET  /workspace/tasks
GET  /workspace/tasks/:id
POST /workspace/tasks/:id/retry
GET  /workspace/mailboxes
POST /workspace/mailboxes
POST /workspace/mailboxes/:id/test
POST /workspace/mailboxes/:id/sync
```

## P1

```text
招新方向管理
岗位筛选
解析模板与版本管理
匹配分析详情
审计日志查询
招新成员邀请与管理
```

---

# 16. 与 TDD 的对应关系

TDD 中已有的基础接口可以映射为：

```text
/api/v1/candidates              → /workspace/applicants
/api/v1/resumes                 → /workspace/resumes
/api/v1/templates               → /workspace/templates
/api/v1/jobs                    → /workspace/jobs
/api/v1/tasks                   → /workspace/tasks
/api/v1/mailboxes               → /workspace/mailboxes
```

这样既保留 TDD 中的领域接口，又通过 `/workspace` 明确招新成员的权限边界。实现时可以选择保留旧路径作为内部别名，但对前端公开的 API 建议统一使用本文档路径。
