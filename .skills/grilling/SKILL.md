---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

# Grilling

Stress-test a plan, decision, or idea by interviewing the user until nothing is left silently assumed.

## Mechanism

Map the subject as a **design tree**: every decision branches into the decisions that hang off it. Work the tree in **rounds**.

The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round. Two questions never share a round if one depends on the other.

### Round Format

```
❓ **Q1** - **<question title>**: <question body>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward. Recompute the frontier and ask the next round.

### Facts vs Decisions

- **Facts** are YOUR job: when a frontier question needs something the environment can settle (filesystem, tools, docs, web), dispatch a sub-agent to find it. Don't ask the user for anything you could look up yourself.
- **Decisions** are THE USER'S: put each to them and wait. An agent that answers its own decisions has broken the skill.
- A running exploration is an unsettled prerequisite: only downstream questions wait for it. Ask the rest of the frontier now.

## When to Use

Type `/grilling`, or the agent reaches for it on its own when a task fits. Also triggered by:
- "grill me on this"
- "stress test this idea"
- "poke holes in this plan"
- Any variant of asking to be challenged on a decision

## Anti-Patterns

### Passive Agreement
The failure mode is passivity: answering "agreed, agreed, agreed" for forty questions and coming out with a plan the agent wrote and you nodded at. It feels productive because it was long. Nothing was actually decided. Being active means steering: push back, say "I don't know", redirect scope.

### Ungrillable Questions
Some questions cannot be answered by talking. "How should this interaction feel?" or "one long form or three pages?" need something to react to. When you hit one, stop grilling. Build the throwaway version (prototype), look at it, then come back and answer in one line.

### Scope Explosion
200 questions = scope too large. Break the work into smaller pieces first, then grill each one. Very long sessions also drift into the dumb zone where context window saturation degrades question quality.

## Session Lifecycle

1. User presents idea/plan/decision
2. Agent maps the design tree
3. Rounds proceed until frontier is empty
4. Agent asks user to confirm shared understanding
5. **Do NOT act on anything until user confirms**

The session is done when the frontier is empty AND the user confirms. An agent that starts building when questions run out has broken the gate.

## Common Questions

**Can I go back to one question at a time?**
Yes. Tell the agent: "ask one question at a time." The round-based default is genuinely contested; sequential is supported, not merely tolerated.

**It answered its own questions instead of asking me.**
Bug in the run. Facts are the agent's job; decisions are the user's. Most common when another skill runs grilling inside a task frame.

**Can I cap the number of questions?**
No. Some plans need three questions, some need fifty. Steer in plain language: tell it to wrap up, or stop and accept the plan where it stands.

**How do I know it's working?**
- You disagree with something (a session with no pushback from you is a session you didn't need)
- Questions arrive in a few rounds, later rounds build on earlier answers
- You end up somewhere you didn't expect
- At the end you could defend each choice to someone who wasn't there
- Question count stays high while round count stays low
