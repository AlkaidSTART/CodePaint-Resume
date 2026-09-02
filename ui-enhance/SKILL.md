---
name: ui-design
description: Design, implement, or review frontend pages with clear hierarchy, restrained minimalism, natural editorial composition, accessible interaction, and no generic AI-generated visual tropes. Use for landing pages, content sites, dashboards, forms, detail pages, and responsive web UI.
---

# UI-Design

Create interfaces that feel deliberately art-directed rather than assembled from fashionable defaults. Make the page easy to understand before making it visually expressive.

## Working contract

1. Infer the page type, primary user, primary task, content density, and dominant state from the request and existing product. Ask only when a missing fact would materially change the information architecture.
2. Inspect the existing code, design system, and assets before changing them. Preserve established brand cues that do not conflict with usability.
3. Write a one-sentence visual rationale tied to the actual content. Do not invent decorative brand copy, English eyebrow text, fake metrics, fake testimonials, or extra sections.
4. Establish hierarchy and layout before decoration. Use semantic HTML, responsive behavior, keyboard operation, visible focus, and state clarity as completion requirements.
5. Implement the smallest coherent visual system needed by the page. Reuse tokens and components, but avoid making every section the same card.
6. Verify at narrow mobile, wide mobile, tablet, laptop, and wide desktop sizes. Test normal, hover, focus, active, loading, empty, error, success, disabled, and destructive states when applicable.
7. End with a short design audit: what is primary, what was intentionally omitted, and which responsive/accessibility checks passed.

## Non-negotiable visual rules

- Minimalism means fewer competing decisions, not empty space without purpose. Every visible element must support comprehension, action, identity, or orientation.
- Do not use decorative pills, category chips, floating badges, glass panels, gradient blobs, neon glows, excessive rounded cards, oversized generic hero copy, or icon confetti as default styling.
- Do not label visual regions with meta words such as `DESIGN`, `FEATURE`, `SYSTEM`, or `EXPERIENCE` merely to make the page seem branded.
- Do not add explanatory microcopy that repeats what the heading, value, icon, or state already communicates.
- Render state through the component itself: checked controls are visibly checked, selected rows visibly selected, progress visibly progressing, and errors attached to their field. Never rely on color alone.
- “No element labels” applies to ornamental tags and redundant annotations. Keep real form labels, accessible names, table headers, legends, units, and status text when users need them.
- Use bold selectively for headings, short lead-ins, key values, and the most important action. Do not sprinkle bold phrases through formal body paragraphs.
- Use one dominant composition idea per page. Avoid repeating identical centered heading + paragraph + three-card grids.
- Prefer real product imagery, diagrams, screenshots, or content-specific illustration. Do not add stock imagery merely to fill space.

## Route to the relevant specification

Read only the references needed for the current task:

- For typography, spacing, color, imagery, header/footer decisions, and responsive composition, read [visual-system.md](references/visual-system.md).
- For buttons, links, forms, navigation, tables, cards, feedback, and state behavior, read [components-and-states.md](references/components-and-states.md).
- For landing, content, detail, listing, dashboard, settings, authentication, form, and empty/error pages, read [page-patterns.md](references/page-patterns.md).
- Whenever the page includes transitions, loading motion, scroll effects, or Canvas, read [motion-and-canvas.md](references/motion-and-canvas.md).
- Before handing off implementation or a design review, read [quality-gates.md](references/quality-gates.md).

## Decision priorities

When rules compete, prioritize in this order:

1. Meaning and task completion
2. Accessibility and legibility
3. Existing product consistency
4. Content-responsive composition
5. Visual distinctiveness
6. Decorative motion

Treat numeric values in the references as defaults, not a reason to fight existing coherent design tokens. Deviate when the content, platform, language, or established system requires it; keep the hierarchy ratios and document the reason.
