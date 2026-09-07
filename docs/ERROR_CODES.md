# ResumeFlow 统一错误码与重试分类字典 (ERROR_CODES.md)

> 文档版本：v1.0  
> 核心原则：错误分类决定 Worker 重试行为与 HTTP 响应状态，禁止随意抛出未分类的原始 error 字符串。

---

## 1. 错误分类与 Worker 重试策略

| 错误类别 | 英文标识 | 重试策略 (Asynq) | 处理方式 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| **瞬时故障** | `TRANSIENT` | **指数退避重试** (最多 5 次) | 挂起当前任务，按 10s, 30s, 1m, 5m, 15m 退避后重试 | 网络超时、LLM 429 限流、数据库连接闪断 |
| **永久错误** | `PERMANENT` | **立刻终结，禁止重试** | 标记任务 `failed`，写入详细错误原因，释放资源 | 文件损坏、密码错误、不支持的格式、Schema 无法匹配 |
| **业务冲突** | `CONFLICT` | **直接终结** | 记录跳过原因（如文件已存在、邮件已消费） | SHA256 重复投递、Message-ID 已入库 |

---

## 2. 错误码明细表

### 2.1 系统与认证级 (SYS / AUTH)

| 错误码 Code | HTTP 状态 | 类别 | 描述 / 触发场景 | 建议对端动作 |
| :--- | :--- | :--- | :--- | :--- |
| `SYS_INTERNAL_ERROR` | 500 | TRANSIENT | 服务器未知内部异常 | 稍后重试，查后台日志 |
| `SYS_INVALID_PARAMS` | 400 | PERMANENT | 接口参数校验失败 (缺失必填字段) | 修正入参后重新发起 |
| `AUTH_UNAUTHORIZED` | 401 | PERMANENT | 缺少身份凭证或 Token 已过期 | 跳转登录页刷新 Token |
| `AUTH_FORBIDDEN` | 403 | PERMANENT | 权限不足 (如普通用户尝试调用 HR 接口) | 检查用户角色 |
| `AUTH_WORKSPACE_DENIED`| 403 | PERMANENT | 尝试跨租户/越权访问其他工作室数据 | 拦截并记安全告警 |

### 2.2 文件与存储级 (FILE / STORAGE)

| 错误码 Code | HTTP 状态 | 类别 | 描述 / 触发场景 | 建议对端动作 |
| :--- | :--- | :--- | :--- | :--- |
| `FILE_TOO_LARGE` | 413 | PERMANENT | 上传或附件大小超过上限 (默认 20MB) | 提示用户压缩文件 |
| `FILE_UNSUPPORTED_TYPE`| 415 | PERMANENT | 非支持格式 (仅限 .pdf / .docx) | 限制上传格式 |
| `FILE_CORRUPTED` | 422 | PERMANENT | 文件破损、无法通过格式头校验 | 提示文件损坏重传 |
| `FILE_DUPLICATE_HASH` | 409 | CONFLICT | 相同文件的 SHA256 已存在 | 提示已投递，跳过解析 |
| `STORAGE_UPLOAD_FAILED`| 500 | TRANSIENT | 对象存储服务直传/写入超时 | Worker 触发重试 |
| `STORAGE_DOWNLOAD_FAILED`| 500 | TRANSIENT | Worker 拉取附件文件超时 | Worker 触发重试 |

### 2.3 文本提取与解析级 (EXTRACT / LLM)

| 错误码 Code | HTTP 状态 | 类别 | 描述 / 触发场景 | 建议对端动作 |
| :--- | :--- | :--- | :--- | :--- |
| `EXTRACT_EMPTY_TEXT` | 422 | PERMANENT | PDF 为扫描件纯图片，未提取到字符 | 引导进入 OCR 兜底分支 |
| `EXTRACT_PARSE_FAILED` | 500 | PERMANENT | pdfcpu / 解密引擎执行报错 (加密 PDF) | 提示用户移除 PDF 密码 |
| `LLM_RATE_LIMITED` | 429 | TRANSIENT | 大模型调用频次打满 (429 Too Many Requests) | Worker 退避等待重试 |
| `LLM_TIMEOUT` | 504 | TRANSIENT | 大模型推理超过设定硬超时 (60s) | Worker 退避等待重试 |
| `LLM_SCHEMA_INVALID` | 502 | PERMANENT | 模型输出未能通过 JSON Schema 严格校验 | 触发自修正提示词或人工复核 |
| `LLM_AUTH_FAILED` | 500 | PERMANENT | API Key 欠费或秘钥失效 | 告警管理员检查 Key |

### 2.4 邮箱监听级 (MAIL)

| 错误码 Code | 类别 | 描述 / 触发场景 | 处理逻辑 |
| :--- | :--- | :--- | :--- |
| `MAIL_IMAP_AUTH_FAIL` | PERMANENT | 邮箱授权码失效或账号密码错误 | 停止轮询，向管理员抛出致命告警 |
| `MAIL_CONNECTION_TIMEOUT`| TRANSIENT | 邮件服务器网络抖动或 DNS 解析失败 | 下一个轮询周期重试连线 |
| `MAIL_MESSAGE_ID_DUPLICATE`| CONFLICT | 邮件 Message-ID 已在历史表中 | 跳过该邮件，不重复处理 |
| `MAIL_NO_ATTACHMENT` | CONFLICT | 邮件正文无简历附件 | 记录忽略日志 |

### 2.5 插件与事件级 (PLUGIN)

| 错误码 Code | 类别 | 描述 / 触发场景 | 处理逻辑 |
| :--- | :--- | :--- | :--- |
| `PLUGIN_FEISHU_HOOK_FAIL`| TRANSIENT | 飞书 Webhook 响应非 200 或网络断开 | Event Bus 指数退避重试 (最多 3 次) |
| `PLUGIN_SIGN_INVALID` | PERMANENT | 飞书机器人签名秘钥配置错误 | 写入 plugin_events 失败日志 |
| `PLUGIN_DISABLED` | CONFLICT | 插件在全局配置中处于关闭状态 | 静默跳过事件消费 |

---

## 3. HTTP 统一错误响应 JSON 契约

任何非 2xx 的 HTTP 接口调用，必须严格遵循该格式返回：

```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "文件大小超过限制，单份简历不可超过 20MB",
    "category": "PERMANENT",
    "details": {
      "max_allowed_bytes": 20971520,
      "received_bytes": 25165824
    }
  },
  "request_id": "req_01J98K...",
  "timestamp": "2026-09-06T12:00:00Z"
}
```
