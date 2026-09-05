# Security Rules

- 前端权限控制只改善体验，不能承担安全职责。
- 防止越权读取：查询条件必须包含当前用户或 workspace 范围。
- 对上传文件校验大小、MIME、扩展名和内容解析失败路径。
- 对 HTML、Markdown、简历文本和邮件内容进行输出编码，避免 XSS。
- Cookie、CSRF、CORS、速率限制和审计策略按部署形态配置并测试。

