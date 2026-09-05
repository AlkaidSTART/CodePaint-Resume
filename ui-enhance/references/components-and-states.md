# Components and states

## Universal interaction model

Every interactive element needs default, hover when applicable, focus-visible, active, disabled, and pending behavior. Selected, checked, expanded, current, error, and success are separate semantic states.

- Minimum pointer target: `24×24px` with separation; prefer `40–44px` for primary touch controls.
- Focus is visible, high contrast, and not obscured. Never remove outlines without a stronger replacement.
- Hover may preview but cannot reveal the only path to essential content. Keyboard and touch receive equivalent access.
- Disabled controls remain legible and are used only when action truly cannot occur. Explain a non-obvious reason nearby or on attempted action.
- Pending actions retain outcome context, prevent duplicate submission, and expose progress to assistive technology.

## Buttons and links

- One visually dominant action per decision area. Secondary actions are quieter; destructive actions are distinct and require proportional confirmation.
- Default height: `40–44px`; compact data UI may use `32–36px` if touch is not primary. Horizontal padding `14–20px`.
- Avoid pill buttons by default. Use `6–10px` radii unless an established system says otherwise.
- Buttons perform actions; links navigate. Use specific labels rather than “Learn more” when possible.
- Icon-only buttons require a familiar symbol, accessible name, tooltip on hover/focus, and at least a `40px` hit area where practical.

## Forms

- Keep persistent visible labels above fields. Placeholder text is an example or hint, never the only label.
- Field height `40–48px`; textarea starts at 3–6 lines. Group related controls with `fieldset` and `legend`.
- Put help before error. On error, preserve input, identify the field, state what failed, and tell users how to fix it.
- Mark optional or required consistently, not both. Do not add helper text to every field.
- Use native input types, autocomplete tokens, input modes, and browser semantics where appropriate.
- Multi-step forms show meaningful progress and allow safe back navigation. Do not split a short form merely to seem easier.

## Navigation

- Global navigation shows current location with more than color alone. Labels are concrete and stable.
- Use breadcrumbs for hierarchy and tabs for peer views of the same object, not unrelated destinations.
- Mobile navigation preserves the primary action. Close overlays on Escape, return focus to the trigger, and trap focus only inside true modal dialogs.
- Sticky navigation must not cover anchors, focused controls, or validation messages.

## Cards, lists, and tables

- A card is justified when content is one selectable, movable, comparable, or independently actionable unit. Otherwise use sections, rows, or plain groups.
- Do not nest cards or combine border, radius, shadow, and tinted background all at once.
- Cards in one comparison set share internal alignment, but content determines height unless equal height improves scanning.
- Use lists for homogeneous items and tables for cross-row/column comparison. Headers remain semantic and sorting state is announced.
- Row actions appear consistently. Do not hide the only action on hover. Bulk selection reveals contextual actions without unexpected layout shift.

## Feedback and overlays

- Prefer inline confirmation near the changed object. Use toast for non-blocking confirmation; never make it the sole location of an actionable error.
- Use a modal only for a blocking answer, destructive confirmation, or tightly scoped subtask. Otherwise use inline expansion, popover, drawer, or page.
- Dialogs have a clear title, initial focus, safe Escape behavior, focus return, and consistent action order.
- Skeletons mirror the actual layout and appear only when structure is known. Delay loaders briefly for fast operations to avoid flashing.

## State vocabulary

| State | Direct expression |
|---|---|
| Current | Position + shape/weight + `aria-current`; not color alone |
| Selected | Persistent selection mark/background + accessible state |
| Loading | Preserve geometry; progress or skeleton matching expected content |
| Empty | Say what is absent and give the next relevant action; no decorative essay |
| Error | Name the problem, affected object, and recovery action |
| Success | Confirm the completed result near its source; avoid celebratory clutter |
| Disabled | Reduced emphasis but readable; reason available when unclear |
| Offline | State that data may be stale and what remains possible |
| Destructive | Name the object and consequence; explicitly confirm irreversible action |

Status copy is the state itself—“已同步”, “同步失败”, “等待审核”—rather than a decorative chip preceded by “STATUS”. Reserve chips for compact filtering or scanning when the container shape materially improves grouping.
