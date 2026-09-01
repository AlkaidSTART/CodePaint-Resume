# System Architecture

```text
public-web ─┐
            ├─ Go/Gin API ─ PostgreSQL
admin-web ──┘              ├─ Redis/Asynq
                           ├─ Object Storage
                           └─ Parser/OCR/LLM providers
```

认证和 RBAC 在 API 层执行。解析任务异步运行，原始文件与解析结果分开保存，失败可重试并保留历史。

