---
name: redis-suite
description: Comprehensive Redis architecture, modeling, clustering, connection pooling, search/vector indexing, semantic caching, security/ACLs, and observability. Use when designing, optimizing, or debugging Redis solutions.
---

# Redis Engineering Suite

Comprehensive Redis engineering guidance split into focused modules. Read only the module that matches the current Redis problem, then follow links inside that module for deep details.

## Core Principles

1. Choose data structures by access pattern, not by object shape.
2. Use predictable, colon-separated key names with a clear namespace.
3. In clusters, keep multi-key operations inside hash tags `{...}`.
4. Configure connection pooling, timeouts, and pipelining for resilient clients.

## Module Router

Read only the module needed for the current task:

- **Core Data Modeling & Key Naming**: read [references/redis-core/SKILL.md](references/redis-core/SKILL.md)
- **Clustering & Replication**: read [references/redis-clustering/SKILL.md](references/redis-clustering/SKILL.md)
- **Connections, Pipelining & Pooling**: read [references/redis-connections/SKILL.md](references/redis-connections/SKILL.md)
- **Full-Text & Vector Search**: read [references/redis-search/SKILL.md](references/redis-search/SKILL.md)
- **Security, TLS & ACLs**: read [references/redis-security/SKILL.md](references/redis-security/SKILL.md)
- **Semantic Caching & LLM Memory**: read [references/redis-semantic-cache/SKILL.md](references/redis-semantic-cache/SKILL.md)
- **Metrics & Observability**: read [references/redis-observability/SKILL.md](references/redis-observability/SKILL.md)
- **Iris Development & Official Specs**: read [references/iris-development/SKILL.md](references/iris-development/SKILL.md)
