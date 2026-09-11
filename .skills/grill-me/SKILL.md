---
name: grill-me
description: A relentless interview to sharpen a loose idea, plan, or design before committing to code. Use when the user types /grill-me or asks to be grilled.
disable-model-invocation: true
---

# Grill Me

Stress-test a loose idea, architecture, or plan before building. Stateless interview loop that turns ambiguity into concrete decisions.

## Core Principles

1. **Rounds & The Frontier**: Do not ask one question at a time, and do not ask everything at once. Group all questions whose prerequisites are already settled into one round.
2. **Format**: Numbered list behind `❓`, body, and your recommendation alone on a `➡️` line.
3. **Facts vs Decisions**:
   - **Facts**: Look them up yourself (grep code, read docs, check environment). Never ask what you can check.
   - **Decisions**: The user's alone. Never answer your own decisions.
4. **Anti-Passivity**: A session where the user nods along ("agreed, agreed") is a failed session. Surface real trade-offs and challenge weak assumptions.
5. **Ungrillables**: UI look-and-feel or visual details cannot be settled by talking. Stop and prototype instead.
6. **No Building Without Confirmation**: Stop when the frontier is empty and ask the user to confirm shared understanding. Never start implementing autonomously.

## Round Format

```
❓ **Q1** - **<question title>**: <question body>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <your recommended answer>
```

## Session Lifecycle

1. User presents idea/plan/decision
2. Agent maps the design tree
3. Rounds proceed until frontier is empty
4. Agent asks user to confirm shared understanding
5. **Do NOT act on anything until user confirms**
