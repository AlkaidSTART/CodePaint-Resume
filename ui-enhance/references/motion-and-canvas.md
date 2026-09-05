# Motion and Canvas

Motion explains cause, continuity, hierarchy, or response. It is not filler and never delays a ready interaction.

| Motion | Default range | Notes |
|---|---:|---|
| Press, toggle, focus feedback | `80–140ms` | Immediate acknowledgement |
| Hover/color/border transition | `120–180ms` | Dense desktop menus may be instant |
| Tooltip/popover/menu | `120–200ms` | Originates from trigger; no arbitrary travel |
| Small expand/collapse | `160–240ms` | Scale to distance and content size |
| Dialog/drawer | `180–280ms` | Preserve relation with trigger/edge |
| Page/view continuity | `220–360ms` | Only when it helps orientation |
| Ambient decorative loop | `8–30s` | Low amplitude; static under reduced motion |

Avoid routine UI transitions above `400ms`. Loading animation does not justify slowing actual work. Use deceleration for entering, acceleration for exiting, and symmetric easing for state changes that remain on screen.

## Choose motion from causality

- A control response begins locally: color, shape, scale (`0.98–1`), or content update.
- A popover grows/fades from its anchor; a drawer comes from its edge; shared content keeps position or morphs when feasible.
- New list items appear at insertion and nearby items make room. Removed items collapse from their actual location.
- Data interpolates only when comparison benefits; exact values settle quickly and remain readable.
- Route changes use continuity, a brief crossfade, or no animation. Do not assign the same upward reveal to every section.
- Scroll reveal is optional and sparse. Content exists without it, triggers once, uses small opacity/transform changes, and never delays reading.

Animate `transform` and `opacity` where possible. Avoid repeated animation of `top`, `left`, `width`, or `height`; measure before using `will-change`, and remove it after the transition when practical.

## Reduced motion and interruption

Honor `prefers-reduced-motion: reduce`. Replace spatial travel, zoom, parallax, rotation, and ambient loops with an instant change or brief crossfade; do not merely shorten a vestibular trigger.

- Users can pause, stop, or hide nonessential moving content that starts automatically and lasts over five seconds.
- Never flash content more than three times per second.
- New input interrupts or retargets current motion; do not queue stale transitions.
- Keyboard focus follows task logic, never animation timing.
- Test on slower hardware and with background-tab behavior.

## Canvas decision rule

Use Canvas only when continuous procedural visuals, particles, freehand drawing, dense plots, image processing, or many animated objects materially outperform DOM/CSS/SVG. For simple lines, icons, diagrams, or a few shapes, prefer SVG; for UI and text, use semantic DOM.

Suitable restrained uses include a low-contrast field responding gently to pointer proximity, product-specific simulation, data texture derived from real values, or a drawing surface. Generic star fields, particle networks, glowing orbs, and cursor trails are prohibited unless the requested identity specifically calls for them.

## Canvas implementation contract

- Canvas is decorative or supplementary unless a complete accessible DOM alternative provides the same task and information.
- Mark decorative Canvas `aria-hidden="true"` and `pointer-events:none`. Never place essential text, links, inputs, or controls only inside it.
- Size the backing store using CSS size × `devicePixelRatio`, cap the ratio for performance, and update on resize.
- Animate with `requestAnimationFrame`, use elapsed time rather than assumed frames, cancel on unmount, and pause when `document.hidden`.
- Keep pointer sampling coarse and passive; do not track or store personal data. Support touch/keyboard alternatives for meaningful interaction.
- Bound object counts by viewport and hardware. Avoid allocations inside the frame loop, expensive blur, full redraw when partial works, and permanent high-DPI work on weak devices.
- Under reduced motion, render a static frame or no Canvas. Provide a low-power fallback after repeated long frames.
- Canvas never blocks first contentful rendering. Initialize after critical content, reserve geometry, and avoid layout shift.
- Maintain foreground contrast across every frame with masks, fixed surfaces, or local protection behind text.

## Motion acceptance test

For each animation, answer: What changed? Where did it come from? What relationship does motion clarify? Can the user interrupt it? What happens under reduced motion? If the first three answers are vague, remove it.
