# 06 CI/CD

CI 至少按以下顺序运行：

```text
Lint -> TypeCheck -> Build -> Test -> API contract check
```

生产部署还需验证环境变量、数据库迁移、对象存储、异步队列、健康检查、日志和回滚路径。

