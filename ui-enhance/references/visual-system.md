# Visual system

## Typography

Use a neutral, highly legible UI sans by default. Prefer the product's existing typeface; otherwise use a system stack. Use at most two font families and normally one. Avoid display fonts for dense application UI.

| Role | Size / line height | Weight | Use |
|---|---:|---:|---|
| Display | `clamp(40px, 5vw, 72px)` / `0.98–1.08` | 600–700 | Marketing hero only; usually one per page |
| H1 | `clamp(32px, 3.5vw, 48px)` / `1.08–1.18` | 600–700 | Page title; one semantic `h1` |
| H2 | `clamp(24px, 2.3vw, 32px)` / `1.15–1.25` | 600–650 | Major section |
| H3 | `20–24px` / `1.25–1.35` | 600 | Subsection or grouped content |
| H4 | `17–18px` / `1.35–1.45` | 600 | Dense panels only |
| Lead | `18–21px` / `1.5–1.65` | 400–500 | One short introductory paragraph |
| Body | `16px` / `1.55–1.75` | 400 | Default prose and controls |
| Compact UI | `14px` / `1.4–1.55` | 400–600 | Tables, metadata, secondary controls |
| Caption | `12–13px` / `1.4–1.5` | 400–500 | Dates, provenance, auxiliary notes; never primary action |

For CJK text, body defaults to `1.7`, lead to `1.65`, and headings no lower than `1.15`. Do not use all caps or artificial letter spacing on Chinese. Latin uppercase labels, when semantically justified, remain short and use `0.04–0.08em` tracking.

### Hierarchy rules

- Make levels distinguishable through at least two of size, weight, spacing, position, or color—not bold alone.
- The H1 identifies the page. H2 names meaningful sections; H3 subdivides them. Do not skip heading levels for appearance.
- Keep prose measure around `45–75ch`; use `60–68ch` by default. Formal paragraphs remain regular weight. Use a new sentence or callout instead of frequent inline bold.
- Heading-to-body gap: `12–20px`. Section-to-section gap: `64–112px` on desktop and `40–72px` on mobile. Related items sit closer than unrelated items.
- Use sentence case and concrete verbs/nouns. Button labels describe the result: “保存更改”, not “确定”.

## Spacing and grid

Use a 4px base unit with common steps `4, 8, 12, 16, 24, 32, 48, 64, 80, 96`.

- Page gutter: `20px` at 320–479px, `24px` at 480–767px, `32–48px` at 768–1279px, `48–80px` above 1280px.
- Content max width: `1120–1280px`; prose: `680–760px`; dense dashboard may extend to `1440px`.
- Prefer 12 columns on desktop, 8 on tablet, and 4 on mobile. Use optical alignment for type and imagery.
- Preserve deliberate asymmetry when it supports content. Avoid making every object equally wide, padded, and rounded.
- Default corner radii: `4–8px` for controls, `8–12px` for substantial surfaces. Use `999px` only for true pills with semantic purpose.
- Prefer spacing, tonal change, and a single-pixel border over shadows. If elevation is necessary, use one restrained shadow level.

## Color

- Begin with one background, one surface, primary and secondary text, one border, one accent, and semantic success/warning/error colors.
- Text contrast: at least `4.5:1` for normal text and `3:1` for large text; component boundaries and focus indicators at least `3:1` against adjacent colors.
- Never use color as the only state cue. Pair it with copy, icon, shape, position, or pattern.
- Avoid pure black on pure white across large areas when the brand does not demand it, but do not lower contrast to look refined.
- Gradients are allowed only when they represent lighting, depth, data, or established identity. A generic violet-blue hero gradient is not a direction.

## Text and image composition

- **Side by side:** when text explains one image. Desktop ratio defaults to `5:7`, `6:6`, or `7:5`; align text to the image's meaningful area rather than always centering.
- **Stacked:** for mobile, long prose, panoramic imagery, or when the image must precede explanation. Use a `20–32px` related-content gap.
- **Image-led:** when the image is evidence or the product. Give it `55–70%` of section width and keep copy concise.
- **Text-led:** when imagery is contextual. Keep the image smaller or crop it as a supporting counterweight.

When copy is short beside a tall image, do not inflate type or add filler. Adjust max width, line height, paragraph spacing, alignment, and crop; optionally add one genuine action or datum. When copy is long, stack the layout or constrain the image rather than creating a narrow text column.

Images use meaningful `alt` when informative and empty `alt` when decorative. Captions add provenance or interpretation. Maintain focal points with `object-position`; do not crop faces, controls, labels, or important edges.

## Header, main, and footer

Use semantic regions based on structure, not because every template has them.

- Use a site header for identity, global navigation, search, account access, or a persistent primary action. Keep it `56–72px` for apps and `64–88px` for public sites.
- Omit a full header on focused auth, checkout, onboarding, embed, print, kiosk, or single-task flows. Retain minimal brand/back/exit orientation when needed.
- Use a footer for public, editorial, commerce, legal, or multi-route sites needing secondary navigation, policy, contact, provenance, or copyright.
- Omit the footer in authenticated workspaces, infinite-scroll tools, modals, focused tasks, and pages where it duplicates persistent navigation.
- Separate regions with whitespace or a quiet border. Do not put header, main, and footer into three giant rounded containers.

## Responsive behavior

Design from content breakpoints, not device names.

- At 320 CSS px, preserve all core tasks without horizontal page scrolling.
- Stack text/image before either column becomes cramped; do not merely shrink everything.
- Reorder only when reading and focus order remain logical. DOM order matches the meaningful mobile sequence.
- Tables may scroll horizontally, prioritize columns, or use a row alternative; never hide essential values without disclosure.
- Support text zoom to 200% and layout reflow at 400% without clipped controls or lost content.
