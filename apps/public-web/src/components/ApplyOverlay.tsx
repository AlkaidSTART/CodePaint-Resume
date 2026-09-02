import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ApplyForm } from "./ApplyForm";

type ApplyOverlayProps = {
  onClose: () => void;
};

export function ApplyOverlay({ onClose }: ApplyOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".apply-overlay-backdrop", { autoAlpha: 0, duration: 0.25, ease: "power1.out" });
    gsap.from(".apply-overlay-panel", { autoAlpha: 0, y: 24, duration: 0.35, ease: "power2.out" });
  }, { scope: overlayRef });

  return (
    <div ref={overlayRef} className="apply-overlay-backdrop fixed inset-0 z-50 overflow-y-auto bg-black/20 px-4 py-28 backdrop-blur-sm sm:px-8" role="dialog" aria-modal="true" aria-labelledby="apply-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="apply-overlay-panel mx-auto w-full max-w-4xl border border-black/15 bg-[#fffffc]/95 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-10">
        <button className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-md border border-black/20 px-4 text-sm font-medium outline-offset-4 transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-black" type="button" onClick={onClose}>
          <span aria-hidden="true">←</span> 返回
        </button>
        <ApplyForm />
      </div>
    </div>
  );
}
