---
name: gsap-suite
description: Comprehensive GSAP (GreenSock) animation guidelines, covering Timelines, ScrollTrigger, React integration (useGSAP), framework adapters (Vue/Svelte), performance optimization, plugins, and utility helpers. Use whenever building or optimizing GSAP animations.
---

# GSAP Animation Suite

Use GSAP for robust, high-performance web animations and timeline choreography.

## Core Rules

1. **React Integration**: Always use `@gsap/react` with the `useGSAP()` hook for automatic scoping and garbage collection.
2. **Sequencing**: Build structured timelines (`gsap.timeline()`) rather than scattered `gsap.to()` calls with delay math.
3. **Scroll Animations**: Use ScrollTrigger with proper `trigger`, `start`, `end`, and `scrub` settings. Always call `ScrollTrigger.refresh()` after DOM layout shifts.
4. **Performance**: Animate GPU-accelerated properties (`transform`, `opacity`) and avoid animating `top`, `left`, `margin`, `width`, or `height`.

## Progressive Disclosure & References

Read only the references needed for the current animation task:

- **Timelines & Sequencing**: read [references/timeline.md](references/timeline.md)
- **ScrollTrigger & Scroll-Driven Motion**: read [references/scrolltrigger.md](references/scrolltrigger.md)
- **React & Next.js Integration (useGSAP)**: read [references/react.md](references/react.md)
- **Vue, Svelte, Angular Integration**: read [references/frameworks.md](references/frameworks.md)
- **Performance & Optimization**: read [references/performance.md](references/performance.md)
- **Plugins (Flip, Observer, MotionPath, etc.)**: read [references/plugins.md](references/plugins.md)
- **Utilities & Helpers (wrap, mapRange, interpolate)**: read [references/utils.md](references/utils.md)
