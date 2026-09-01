# 04 Test Validation

按可用性依次执行：

```text
Lint -> TypeCheck -> Build -> Unit/Integration Test -> API verification -> Browser smoke test
```

失败时保留命令、错误摘要、影响范围和是否阻断发布。没有现成脚本时，不要虚构测试已通过。

