# Quality gates

Do not hand off a design or implementation until applicable checks pass.

## Anti-AI visual audit

- No generic gradient blob, glowing orb, particle network, glass card wall, or unexplained dark-purple palette.
- No decorative English eyebrow labels, fake terminal snippets, fake dashboards, fake social proof, or invented statistics.
- No giant vague H1 paired with three equal feature cards by reflex.
- No pill-shaped treatment applied indiscriminately to buttons, tags, nav, and statuses.
- No icon where precise text is clearer; no emoji as a substitute for visual direction unless the product voice calls for it.
- No every-section entrance animation, excessive stagger, cursor follower, or scroll hijacking.
- No extra copy whose only job is to fill whitespace.
- At least one compositional choice clearly follows the actual content or task.

## Hierarchy and content

- The page purpose and primary action are identifiable within five seconds.
- H1/H2/H3 remain distinguishable when color is removed and follow semantic order.
- Body paragraphs use regular weight; bold is sparse and purposeful.
- Labels, names, values, units, and states are concrete. There is no redundant “status”, “design”, “feature”, or “experience” decoration.
- Related text and imagery explain each other; crop, order, and spacing remain meaningful at all breakpoints.
- Empty/error/loading/success states use real task language and avoid layout jumps.

## Accessibility

- Semantic landmarks, headings, lists, tables, buttons, links, labels, and dialogs match behavior.
- Keyboard operates every control in logical order; focus is visible and unobscured; dialogs return focus.
- Text contrast is at least `4.5:1` normally or `3:1` for large text; required non-text boundaries and focus cues reach `3:1`.
- Color is not the only state cue. Informative images have alternatives; decorative images are ignored.
- Core targets are at least `24×24px` with spacing and preferably `40–44px` for touch.
- At 200% text zoom and 400% reflow, content/actions remain available without two-dimensional page scrolling.
- Reduced-motion mode removes nonessential spatial/ambient animation; no flashing or autoplay trap remains.

## Responsive and visual QA

Test at minimum `320`, `375`, `768`, `1024`, `1440`, and near `1920px`, plus content-driven breakpoints.

- No accidental horizontal page scroll, clipped focus ring, overlapping sticky region, orphaned heading, or unreadably long line.
- Navigation, tables, dialogs, images, and forms have deliberate narrow-screen behavior.
- Long translations, large numbers, missing images, one-item lists, and unusually long headings do not break composition.
- The page remains coherent with slow network, image failure, empty data, and validation errors.
- Canvas/animation does not delay interaction, spike sustained CPU, or run in hidden tabs.

## Implementation quality

- Reuse tokens for type, spacing, color, radius, and motion; avoid one-off values without a visual reason.
- Prefer CSS/HTML for UI, SVG for scalable finite graphics, and Canvas only for justified continuous rendering.
- Avoid dependencies or animation libraries for simple transitions.
- No console errors, hydration mismatch, missing keys, broken routes, or inaccessible click-only containers.
- Preserve existing product behavior and user data. Do not invent backend behavior for a mockup.

## Handoff format

Report briefly:

1. Page type and primary task.
2. Content-specific composition choice.
3. Intentional omissions preventing generic AI styling.
4. Responsive, keyboard, contrast, reduced-motion, and state checks performed.
5. Known limitation or content dependency.
