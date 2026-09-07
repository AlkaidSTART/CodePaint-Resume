# ResumeFlow 可观测性与监控告警规范 (OBSERVABILITY.md)

> 文档版本：v1.0  
> 适用范围：服务部署、运维排障、链路分析、告警规则  
> 规范等级：推荐与实施标准

---

## 1. 结构化日志规范 (Structured JSON Logging)

后端统一采用 Go 标准库 `log/slog` 或 `uber-go/zap` 输出单行 JSON 格式日志。

### 1.1 基础日志字段定义 (Common Fields)

```json
{
  "timestamp": "2026-09-06T12:00:00.123Z",
  "level": "INFO",
  "service": "resumeflow-api",
  "trace_id": "c8d3f1a2e9b04758",
  "span_id": "a1b2c3d4",
  "msg": "resume parse task finished",
  "workspace_id": "00000000-0000-0000-0000-000000000001",
  "duration_ms": 1420
}
```

- **HTTP 请求日志**：必须包含 `http_method`、`http_path`、`status_code`、`client_ip`、`latency_ms`。
- **Worker 消费日志**：必须包含 `task_id`、`task_type`、`queue`、`retry_count`、`latency_ms`。

---

## 2. 分布式链路追踪规范 (Tracing Context)

1. **入口生成**：
   - HTTP 请求：由全局中间件读取 Header `X-Trace-ID`；若无则自动生成 16 字节十六进制随机串，并通过响应 Header `X-Trace-ID` 回传给前端。
   - 邮箱抓取：由 Mailbox Watcher 在扫描到新邮件时生成以 `mail_` 为前缀的 TraceID。
2. **跨系统传播**：
   - 投递 Asynq 队列时，TraceID 必须序列化进 `asynq.Task` 的 Payload 元数据中。
   - Worker 消费时解出 TraceID 并注入到 Worker Goroutine 的 `context.Context` 中。
   - 请求第三方 API (大模型、飞书 Webhook) 时，请求 Header 携带该 TraceID。

---

## 3. 健康检查与探针规范 (Health Probes)

### 3.1 存活探针：`GET /healthz` (Liveness Probe)
- **用途**：Kubernetes / Docker 检查进程是否卡死。
- **响应**：仅返回 `200 OK`，不执行深度数据库 IO，防止依赖抖动导致容器被无故重启。
```json
{ "status": "ok", "service": "resumeflow-api" }
```

### 3.2 就绪探针：`GET /readyz` (Readiness Probe)
- **用途**：反向代理流量切入前，检查核心依赖是否可用。
- **检查项**：
  1. PostgreSQL 连接池 `db.Ping(ctx)`。
  2. Redis 连接 `redis.Ping(ctx)`。
- **响应状态**：全正常返回 `200 OK`；任一异常返回 `503 Service Unavailable`。
```json
{
  "status": "ready",
  "checks": {
    "postgres": "ok",
    "redis": "ok"
  }
}
```

---

## 4. 队列监控与告警指标 (Queue Observability)

基于 Asynq 的内置 Inspector 暴露队列运行态指标（供管理后台或 Prometheus 抓取）：

| 指标项 | 说明 | 正常范围 | 告警阈值 | 处理方案 |
| :--- | :--- | :--- | :--- | :--- |
| `queue_pending_count` | 队列当前堆积待处理任务数 | < 50 | > 200 | 考虑临时扩容 Worker 协程并发数 |
| `queue_failed_count` | 彻底进入死信队列的失败任务数 | 0 | > 5 | 查看失败原因，排查大模型欠费或服务挂掉 |
| `task_latency_seconds` | 单任务平均端到端解析耗时 | 2s - 8s | > 30s | 检查大模型 API 响应延迟与并发限流 |
| `mailbox_last_poll_time` | 邮箱最后一次成功轮询时间 | < 3m | > 10m | 检查 IMAP 网络连通性与账号密码状态 |
