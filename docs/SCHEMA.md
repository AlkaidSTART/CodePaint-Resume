# ResumeFlow 核心数据契约与状态机规范 (SCHEMA.md)

> 文档版本：v1.0  
> 适用范围：后端 Go、前端 Web、异步 Worker、LLM 抽取管线、插件系统  
> 状态：生产级规范 (Single Source of Truth)

---

## 1. 大模型结构化抽取 JSON Schema

此 Schema 作为 LLM 调用的严格约束（Strict Mode），输出必须 100% 校验通过，直接映射到 Go 结构体与数据库 JSONB。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ResumeExtractionResult",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "basics",
    "education",
    "skills"
  ],
  "properties": {
    "basics": {
      "type": "object",
      "additionalProperties": false,
      "required": ["name"],
      "properties": {
        "name": { "type": "string", "description": "候选人姓名" },
        "email": { "type": "string", "format": "email", "description": "候选人邮箱，未找到则为空字符串" },
        "phone": { "type": "string", "description": "手机号码（支持国际格式），未找到则为空字符串" },
        "gender": { "type": "string", "enum": ["male", "female", "other", "unknown"], "description": "性别" },
        "birth_year": { "type": "integer", "minimum": 1950, "maximum": 2026, "description": "出生年份" },
        "work_years": { "type": "integer", "minimum": 0, "maximum": 60, "description": "总工作年限，在校生填 0" },
        "current_company": { "type": "string", "description": "当前或最近就职公司/在读院校" },
        "current_title": { "type": "string", "description": "当前岗位职称/身份（如 前端工程师、大三学生）" },
        "city": { "type": "string", "description": "现居城市" },
        "summary": { "type": "string", "description": "一句话个人简介或职业概述（不超过 200 字）" }
      }
    },
    "education": {
      "type": "array",
      "description": "教育经历列表，按时间倒序排列",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["school", "degree"],
        "properties": {
          "school": { "type": "string", "description": "毕业/就读院校全称" },
          "major": { "type": "string", "description": "所学专业" },
          "degree": {
            "type": "string",
            "enum": ["doctor", "master", "bachelor", "junior_college", "high_school", "other"],
            "description": "学历层次"
          },
          "start_date": { "type": "string", "pattern": "^\\d{4}(-\\d{2})?$", "description": "入学时间 YYYY 或 YYYY-MM" },
          "end_date": { "type": "string", "pattern": "^(\\d{4}(-\\d{2})?|present)$", "description": "毕业时间 YYYY 或 YYYY-MM 或 present" }
        }
      }
    },
    "work_experience": {
      "type": "array",
      "description": "工作/实习经历，按时间倒序排列",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["company", "title"],
        "properties": {
          "company": { "type": "string", "description": "公司/组织名称" },
          "title": { "type": "string", "description": "岗位/职责角色" },
          "start_date": { "type": "string", "pattern": "^\\d{4}(-\\d{2})?$" },
          "end_date": { "type": "string", "pattern": "^(\\d{4}(-\\d{2})?|present)$" },
          "responsibilities": { "type": "string", "description": "主要工作职责" },
          "achievements": {
            "type": "array",
            "items": { "type": "string" },
            "description": "量化产出、项目成果或技术亮点"
          }
        }
      }
    },
    "project_experience": {
      "type": "array",
      "description": "核心项目经历",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name"],
        "properties": {
          "name": { "type": "string", "description": "项目名称" },
          "role": { "type": "string", "description": "担任角色" },
          "description": { "type": "string", "description": "项目背景与目标" },
          "tech_stack": { "type": "array", "items": { "type": "string" }, "description": "使用技术栈" },
          "highlights": { "type": "array", "items": { "type": "string" }, "description": "个人核心贡献与成果" }
        }
      }
    },
    "skills": {
      "type": "array",
      "items": { "type": "string" },
      "description": "标准化技能标签列表（如 Go, React, PostgreSQL, Docker, Redis）"
    },
    "screening_assessment": {
      "type": "object",
      "additionalProperties": false,
      "required": ["match_score", "highlights", "risks"],
      "properties": {
        "match_score": { "type": "integer", "minimum": 0, "maximum": 100, "description": "综合评估分 0-100" },
        "highlights": { "type": "array", "items": { "type": "string" }, "description": "候选人主要亮点（2-4条）" },
        "risks": { "type": "array", "items": { "type": "string" }, "description": "潜在风险或疑点（如 频繁跳槽、专业不符、工作断档）" }
      }
    }
  }
}
```

---

## 2. 生产级有限状态机模型 (FSM)

### 2.1 申请单状态机 (Application FSM)

```text
[received] ──(自动初筛/人工初阅)──> [screening] ──(安排面试)──> [interview]
     │                                │                           │
     ├──(直接录用)──────┐            ├──(初筛淘汰)──┐            ├──(面试淘汰)──┐
     │                  │            │              │            │              │
     ▼                  ▼            ▼              ▼            ▼              ▼
 [passed] <─────────────┴──────── [passed]      [rejected] <─────┴──────── [rejected]
```

- **合法跃迁规则表**：

| 当前状态 | 目标状态 | 触发条件 | 副作用 (Side Effects) |
| :--- | :--- | :--- | :--- |
| `received` | `screening` | HR 开始初筛复核 | 无 |
| `received` | `rejected` | 硬性条件不符快速淘汰 | 记录审计日志 |
| `screening` | `interview` | 确定安排面试时间 | 产生通知任务 |
| `screening` | `rejected` | 初筛未通过 | 记录审计日志 |
| `interview` | `passed` | 面试通过，决定录取 | **触发 Event Bus: 投递飞书拉群/录取通知** |
| `interview` | `rejected` | 面试未通过 | 记录审计日志 |
| `*` | `passed` | 超级管理员强制覆盖 | 记录高危审计日志并触发插件 |

- **非法跃迁**：禁止从终态 `passed` 或 `rejected` 逆向跳回 `received`（必须通过显式 Re-open 审核接口并记录重开原因）。

---

### 2.2 简历解析状态机 (Resume Parse FSM)

```text
[received] ──> [queued] ──> [extracting] ──> [llm_parsing] ──> [ready]
                   │              │                │
                   └──────────────┴────────────────┴─────────> [failed]
```

- `received`: 文件已上传/拉取到对象存储，校验通过（MD5/SHA256 生成）。
- `queued`: 任务已入 Asynq 队列，等待 Worker 消费。
- `extracting`: Worker 正在提取本地 PDF/Word 纯文本。
- `llm_parsing`: 正在请求大模型并校验 JSON Schema。
- `ready`: 校验通过，结构化数据落库完成。
- `failed`: 任意环节异常终结（记录 `error_code` 与 `error_message`）。

---

## 3. 插件系统与事件总线契约 (Event Bus Specification)

### 3.1 事件标准信封 (Base Event Envelope)

```json
{
  "event_id": "evt_01J98K2MN3P4Q5R6S7T8U9V0W1",
  "event_type": "application.status.changed",
  "occurred_at": "2026-09-06T12:00:00Z",
  "workspace_id": "00000000-0000-0000-0000-000000000001",
  "producer": "resumeflow-backend",
  "data": {}
}
```

### 3.2 核心事件载荷定义

#### 事件 1：`application.status.changed`（状态流转）
```json
{
  "event_type": "application.status.changed",
  "data": {
    "application_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "candidate_id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "candidate_name": "李明",
    "email": "liming@example.com",
    "phone": "13800138000",
    "target_role": "全栈工程师",
    "old_status": "interview",
    "new_status": "passed",
    "operator_id": "user_01J8...",
    "reason": "代码测试与现场面试综合评级 A+"
  }
}
```
*飞书插件行为*：根据 `target_role` 映射到对应的飞书群组 Webhook，发送交互式富文本录取卡片。

#### 事件 2：`resume.parse.completed`（解析完成）
```json
{
  "event_type": "resume.parse.completed",
  "data": {
    "resume_id": "res_01J...",
    "application_id": "app_01J...",
    "source": "email",
    "match_score": 88,
    "top_skills": ["Go", "React", "Docker"],
    "highlights": ["曾独立负责高并发网关重构", "在校ACM银牌"]
  }
}
```
