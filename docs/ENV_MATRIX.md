# ResumeFlow 环境变量与配置字典 (ENV_MATRIX.md)

> 文档版本：v1.0  
> 规范等级：强制约束  
> 核心原则：禁止在代码中硬编码任何未经本字典定义的配置键名。

---

## 1. 核心环境变量矩阵表

| 变量名 | 类型 | 必填 | 默认值 | 校验规则 / 格式 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **基础服务** | | | | | |
| `ENV` | string | 是 | `local` | `local` \| `compose` \| `production` | 运行环境标识 |
| `PORT` | int | 否 | `8080` | 1024 - 65535 | HTTP 服务监听端口 |
| `WORKSPACE_ID` | uuid | 否 | `00000000-0000-0000-0000-000000000001` | UUIDv4 | 默认工作区/租户隔离 ID |
| `LOG_LEVEL` | string | 否 | `info` | `debug` \| `info` \| `warn` \| `error` | 日志输出级别 |
| `LOG_FORMAT` | string | 否 | `json` | `json` \| `console` | 本地调试推荐 console，线上 json |
| **存储层 (Database)** | | | | | |
| `DATABASE_URL` | string | 是 | - | `postgres://user:pass@host:5432/db?sslmode=disable` | PostgreSQL 统一连接串 |
| `DB_MAX_OPEN_CONNS` | int | 否 | `25` | 5 - 100 | 连接池最大打开数 |
| `DB_MAX_IDLE_CONNS` | int | 否 | `5` | 2 - 25 | 连接池空闲数 |
| `DB_CONN_MAX_LIFETIME` | duration | 否 | `30m` | 如 `15m`, `1h` | 连接最大存活时间 |
| **任务队列 (Redis / Asynq)** | | | | | |
| `REDIS_URL` | string | 是 | `redis://127.0.0.1:6379/0` | 标准 Redis URI | 消息队列与分布式锁 |
| `WORKER_CONCURRENCY`| int | 否 | `10` | 1 - 50 | Worker 协程并发上限 |
| `TASK_TIMEOUT_SECONDS` | int | 否 | `180` | 30 - 600 | 单个解析任务硬超时 |
| **对象存储 (Storage)** | | | | | |
| `STORAGE_DRIVER` | string | 否 | `local` | `local` \| `s3` \| `qiniu` | 存储驱动类型 |
| `STORAGE_LOCAL_DIR` | string | 否 | `./uploads` | 绝对或相对路径 | local 驱动存储目录 |
| `STORAGE_ENDPOINT` | string | 条件 | - | URL / Host | s3 / MinIO 访问端点 |
| `STORAGE_BUCKET` | string | 条件 | `resumeflow-resumes` | 字母小写中划线 | 私有附件桶名称 |
| `STORAGE_ACCESS_KEY` | string | 条件 | - | 明文字符串 | 访问秘钥 |
| `STORAGE_SECRET_KEY` | string | 条件 | - | 明文字符串 | 签名秘钥 |
| **AI 结构化解析 (LLM)** | | | | | |
| `LLM_PROVIDER` | string | 否 | `openai_compatible`| `openai_compatible` \| `mock` | 模型适配器 |
| `LLM_API_KEY` | string | 条件 | - | 非空字符串 | 大模型 API Key |
| `LLM_BASE_URL` | string | 否 | `https://api.openai.com/v1` | URL | 兼容接口地址 (如 DashScope/DeepSeek) |
| `LLM_MODEL` | string | 否 | `gpt-4o-mini` | 字符串 | 解析选用模型名 |
| `LLM_TEMPERATURE` | float | 否 | `0.1` | 0.0 - 0.5 | 结构化抽取需保持确定性低温 |
| **邮箱监听同步 (Mailbox)** | | | | | |
| `MAILBOX_ENABLED` | bool | 否 | `false` | `true` \| `false` | 是否启动后台邮件自动拉取 |
| `MAILBOX_IMAP_HOST` | string | 条件 | - | Host (如 `imap.qq.com`) | IMAP 服务器地址 |
| `MAILBOX_IMAP_PORT` | int | 否 | `993` | 143 \| 993 | IMAP 端口 (993 SSL) |
| `MAILBOX_USER` | string | 条件 | - | 邮箱地址 | 招新邮箱账号 |
| `MAILBOX_PASS` | string | 条件 | - | 授权码 (非登录密码) | 邮箱客户端授权码 |
| `MAILBOX_POLL_INTERVAL`| duration | 否 | `60s` | 如 `30s`, `5m` | 轮询新邮件间隔 |
| **邮件发送服务 (SMTP)** | | | | | |
| `SMTP_ENABLED` | bool | 否 | `false` | `true` \| `false` | 是否开启异步状态邮件发送 |
| `SMTP_HOST` | string | 条件 | - | Host (如 `smtp.163.com`) | SMTP 服务器地址 |
| `SMTP_PORT` | int | 否 | `465` | 465 (SSL) \| 587 (STARTTLS) | SMTP 端口 (严禁填 993/143) |
| `SMTP_USER` | string | 条件 | - | 邮箱地址 | 发件邮箱账号 |
| `SMTP_PASS` | string | 条件 | - | 授权码 | 发件邮箱客户端授权码 |
| `SMTP_FROM` | string | 条件 | - | `CodePaint <job@example.com>` | 发件人署名格式 |
| **外部插件集成 (Plugins)** | | | | | |
| `PLUGIN_FEISHU_ENABLED`| bool | 否 | `false` | `true` \| `false` | 是否开启飞书联动插件 |
| `PLUGIN_FEISHU_WEBHOOK`| string | 条件 | - | `https://open.feishu.cn/open-apis/bot/v2/hook/...` | 飞书自定义机器人 Webhook |
| `PLUGIN_FEISHU_SECRET` | string | 否 | - | 字符串 | 飞书签名校验安全秘钥 |
| **安全与认证 (Security)** | | | | | |
| `JWT_SECRET` | string | 是 | - | ≥ 32 字符随机串 | 用户鉴权签名 Token |
| `DATA_ENCRYPTION_KEY` | string | 是 | - | 32 字符 (256-bit) | 敏感信息 (邮箱授权码等) AES-GCM 秘钥 |
| `COOKIE_SECURE` | bool | 否 | `false` | 生产必须 true | HttpOnly Cookie 传输安全控制 |

---

## 2. 环境差异矩阵 (Environment Tiers)

| 环境变量名 | Local 本地裸跑 | Compose 容器环境 | Production 云端生产 |
| :--- | :--- | :--- | :--- |
| `ENV` | `local` | `compose` | `production` |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/resumeflow?sslmode=disable` | `postgres://resumeflow:resumeflow@postgres:5432/resumeflow?sslmode=disable` | 云数据库直连 (开启 SSL) |
| `REDIS_URL` | `redis://127.0.0.1:6379/0` | `redis://redis:6379/0` | 云 Redis 实例 (带密码认证) |
| `STORAGE_DRIVER`| `local` | `local` 或 `s3` (MinIO) | `s3` / `qiniu` (云对象存储) |
| `COOKIE_SECURE` | `false` | `false` | `true` (强制 HTTPS) |
| `LOG_FORMAT` | `console` | `json` | `json` |

---

## 3. 启动快速失败规则 (Fail-Fast Validation)

后端服务在 `main.go` 加载配置时，必须执行强校验：
1. 若 `DATABASE_URL` 或 `REDIS_URL` 为空，直接 `panic` 终止启动。
2. 若 `JWT_SECRET` 长度小于 32 位，直接报错退出。
3. 若 `MAILBOX_ENABLED=true`，但缺少 `MAILBOX_IMAP_HOST` 或 `MAILBOX_USER`，阻止启动。
4. 若 `STORAGE_DRIVER=s3`，必须检验 `STORAGE_ENDPOINT`、`STORAGE_BUCKET`、`STORAGE_ACCESS_KEY` 均非空。
