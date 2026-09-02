import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import videoSource from "../assets/codepaint.mp4";

export function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".hero-video", { autoAlpha: 0, duration: 1, ease: "power2.out" });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative isolate h-screen min-h-[600px] w-full overflow-hidden" aria-label="CodePaint Studio 介绍视频">
      <video className="hero-video absolute inset-0 h-full w-full object-cover" src={videoSource} autoPlay muted playsInline preload="auto" aria-hidden="true" />
    </section>
  );
}
