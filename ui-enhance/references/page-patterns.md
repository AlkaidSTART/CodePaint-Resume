# Page patterns

Select the pattern matching the user's task. Do not add every optional region.

## Public landing page

Use identity/navigation when needed, clear proposition, evidence or product view, explanation, and primary action. Add pricing, FAQ, testimonials, or footer only when real content and user decisions require them.

- Hero answers what it is, who it helps, and what to do next within one viewport where practical.
- Prefer a product screenshot, meaningful illustration, or typographic composition over floating gradient ornaments.
- Vary section composition according to content. Do not repeat three equal cards across the page.
- Place evidence next to its claim. Never invent logos, ratings, numbers, or quotes.

## Editorial/article page

Use a restrained header, specific H1, optional standfirst, authorship/date when meaningful, readable body column, figures with captions, and related navigation only when it helps continuation.

- Body width `60–72ch`; paragraph spacing `0.8–1.2em`; use real heading hierarchy.
- Pull quotes are rare and add emphasis rather than repeat nearby sentences.
- Use a table of contents for long structured material; keep it subordinate to reading.
- Footer can provide provenance, correction/contact, and related material.

## Listing/search page

Lead with title, search/filter/sort controls, result count or query context, and results. Preserve filters in the URL when useful.

- Filters describe actual dimensions. Do not turn every filter into a colorful chip.
- Loading preserves the result region; empty query, no matches, and service failure are distinct states.
- Pagination suits bounded lookup; load-more suits browsing; infinite scroll requires restored position and an accessible path to footer content.

## Detail page

Identify the object, current status, core attributes, primary action, and supporting history or relationships. Keep object-level navigation near the title.

- Place irreversible or rare actions away from the primary action.
- Use definition lists or aligned key-value rows for attributes, not a grid of tiny cards.
- Long histories use timeline, table, or list based on comparison needs, not ornamental lines by default.

## Dashboard/workspace

Prioritize next decisions, exceptions, and recent changes. Summary metrics lead to actionable detail.

- Use a persistent app shell only when routes and repeated tasks justify it.
- Do not put every metric in a rounded card. Group related measures on shared surfaces and use whitespace/dividers.
- Charts require a real comparison or trend, labeled axes/units, text alternatives, and a tabular route for exact values.
- Avoid decorative Canvas in dense work areas unless it communicates live state without harming scan speed.
- Footer is normally omitted; account, help, legal, and version links may live in navigation or settings.

## Settings page

Group settings by user mental model, use plain section headings, describe consequences before risky choices, and save at the smallest sensible scope.

- Use immediate save for reversible isolated toggles; explicit save for interdependent fields or high-consequence changes.
- Show current values and save state. Keep destructive account actions in a separate final section.
- Avoid a card per field and nested tabs deeper than one level.

## Authentication/onboarding

Keep the task focused: minimal identity, one H1, necessary fields/options, recovery path, and legal consent when required. Omit full navigation and footer unless policy links are needed.

- Do not add a decorative split-screen image if it crowds the form. If used, it reinforces identity and disappears cleanly on small screens.
- Preserve password-manager support, paste, autocomplete, and accessible errors. Never block paste for verification codes or passwords.
- Ask only what is necessary now and explain why sensitive information is requested.

## Data-entry form/checkout

Use a single column by default. Put short, tightly related fields in two columns only while their relationship remains clear; collapse early on mobile.

- Provide progress for genuinely long flows, summary before commitment, and failure recovery without lost data.
- Keep totals, fees, delivery, and irreversible consequences visible before the final action.
- Reduce footer and global navigation when they distract from completion, but retain a safe exit.

## Empty, error, and system pages

The page directly expresses the state with a specific title, concise explanation, and useful recovery action.

- Distinguish first-use empty, filtered empty, permission denied, not found, offline, rate limited, and server failure.
- Avoid giant generic illustrations, cute mascots, error-code theatrics, or invented prose unless established by the brand.
- Preserve global orientation for recoverable route errors. Reserve full-screen states for page-level failure.

## Responsive composition questions

At each breakpoint, decide:

1. What remains primary?
2. What stacks, wraps, scrolls, condenses, or moves to disclosure?
3. Does reading order still match focus order?
4. Are key actions reachable without precision tapping?
5. Does imagery remain meaningful after crop?

Do not solve mobile by scaling down desktop. Recompose it.
