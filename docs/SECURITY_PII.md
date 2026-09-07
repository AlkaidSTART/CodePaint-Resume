# ResumeFlow 隐私保护与安全合规规范 (SECURITY_PII.md)

> 文档版本：v1.0  
> 适用范围：所有涉及用户简历、联系方式、敏感凭证的代码实现  
> 规范等级：红线约束（CI 门禁必检）

---

## 1. 个人可识别信息 (PII) 分级

| 级别 | 包含数据 | 处理规范 | 存储策略 |
| :--- | :--- | :--- | :--- |
| **L1 (公开数据)** | 招新方向、岗位要求、工作室简介 | 可公开读取，无鉴权 | CDN / 浏览器长期缓存 |
| **L2 (受控业务)** | 候选人毕业院校、专业、技能标签、匹配度评分 | 需 `recruiter` 角色鉴权 | PostgreSQL 关系表明文存储 |
| **L3 (敏感 PII)** | 姓名、手机号、个人邮箱、出生年份、身份证件照 | 需 `recruiter` 角色鉴权 + 访问审计 | PostgreSQL 存储，日志强制脱敏 |
| **L4 (核心凭证)** | 招新邮箱授权码、飞书 Webhook Secret、JWT Secret | 仅系统内部后台可用，严禁暴露给前端 | **AES-256-GCM 密文落库** 或环境变量注入 |

---

## 2. 简历文件存储安全规范

1. **绝对禁止公开读 Bucket**：
   - 存储简历和作品集的对象存储 Bucket **必须设置为 Private (私有读写)**。
   - 严禁拼接公网固定 URL 存入数据库供前端直接访问。
2. **临时预签名 URL (Presigned URL)**：
   - 前端查看或下载简历附件时，必须请求专用接口：`GET /api/v1/workspace/resumes/:id/download-url`。
   - 后端核验租户与权限后，生成带有有效期的临时签名 URL：
     - 查看预览有效期：**最长 15 分钟**。
     - 打包批量下载有效期：**最长 60 分钟**。
3. **本地开发存储兜底安全**：
   - 当 `STORAGE_DRIVER=local` 时，静态文件目录必须由 Go 鉴权路由（`c.File()`）代理输出，禁止使用 `r.Static()` 无鉴权直接挂载。

---

## 3. 日志与终端脱敏过滤器 (Log Redaction)

在 Go 后端日志组件中，必须注册脱敏拦截器。凡输出包含敏感字段的 JSON 或文本，必须按以下规则掩码：

- **手机号 (Phone)**：保留前 3 后 4，中间 4 位打星号。
  - 正则：`1[3-9]\d{9}` $\to$ `138****1234`
- **电子邮箱 (Email)**：保留首字母与域名后缀，其余掩码。
  - 示例：`z****n@example.com`
- **身份证号 (ID Card)**：如简历含身份证号，仅保留前 6 后 4。
  - 示例：`110101********1234`
- **严禁打印原始文件流**：禁止将 Base64、PDF 原始二进制 Buffer 或全文文本打进日志系统。

---

## 4. 敏感凭证加密存储规范 (AES-256-GCM)

用户在后台配置的邮箱 IMAP 授权码、飞书 Webhook Key 等凭据，禁止明文落库：

1. 加密算法：`AES-256-GCM` 带随机生成 12 字节 Nonce。
2. 秘钥来源：由 `DATA_ENCRYPTION_KEY` 环境变量提供（32 字节）。
3. 落库格式：`base64(nonce + ciphertext + tag)`。
4. 数据库字段命名规范：必须带 `_encrypted` 后缀（如 `mailbox_password_encrypted`）。

---

## 5. 多租户数据隔离防越权 (Tenant Boundary)

1. **强行挂载 WorkspaceID**：
   - 任何涉及 `candidates`、`resumes`、`applications` 的 SQL 查询，`WHERE` 条件必须显式包含 `workspace_id = $1`。
   - 严禁出现仅靠主键 `WHERE id = $1` 进行更新或删除的操作（防止水平越权 IDOR）。
2. **审计日志写入**：
   - 凡涉及**下载简历、导出报表、删除候选人、批量修改状态**的操作，必须无条件向 `audit_events` 表同步写入一条记录：
     - `actor_user_id`（操作人）
     - `action`（动作）
     - `resource_type` / `resource_id`
     - `client_ip` / `user_agent`
