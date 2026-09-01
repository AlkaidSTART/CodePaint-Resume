import type { RefObject } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface RevealOptions {
  stagger?: number;
  distance?: number;
  start?: string;
}

/**
 * 滚动显现：scope 内所有 [data-reveal] 元素进入视口后依次淡入上移（仅一次）。
 */
export function useReveal(
  scope: RefObject<HTMLElement | null>,
  options: RevealOptions = {},
) {
  useGSAP(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;

    const distance = options.distance ?? 24;
    gsap.set(items, { autoAlpha: 0, y: distance });
    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: options.stagger ?? 0.08,
      scrollTrigger: {
        trigger: root,
        start: options.start ?? "top 78%",
        once: true,
      },
    });
  }, { scope });
}

/**
 * 数字滚动：将 scope 内 [data-count] 元素中的数值滚动到目标值，
 * 起始展示为 0，保留 data-suffix（如 % 或 +）。
 */
export function useCountUp(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count ?? 0);
      const suffix = el.dataset.suffix ?? "";
      el.textContent = `0${suffix}`;
      const progress = { value: 0 };

      gsap.to(progress, {
        value: target,
        duration: 1.4,
        ease: "power1.out",
        snap: { value: 1 },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(progress.value)}${suffix}`;
        },
      });
    });
  }, { scope });
}
