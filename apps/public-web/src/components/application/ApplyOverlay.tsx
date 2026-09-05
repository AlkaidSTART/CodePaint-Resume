import { useEffect, useRef } from "react";
import { ApplyForm } from "./ApplyForm";

type ApplyOverlayProps = {
  onClose: () => void;
};

export function ApplyOverlay({ onClose }: ApplyOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  function handleClose() {
    onClose();
    window.requestAnimationFrame(() => previousActiveElementRef.current?.focus());
  }

  useEffect(() => {
    if (!previousActiveElementRef.current && document.activeElement instanceof HTMLElement) {
      previousActiveElementRef.current = document.activeElement;
    }
    const focusableSelector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusableElements = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex min-h-full items-start justify-center overflow-y-auto overscroll-contain bg-black/65 px-2 py-2 sm:px-6 sm:py-8 lg:items-center lg:px-8 lg:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
      aria-describedby="apply-intro"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="mx-auto max-h-[calc(100dvh-1rem)] w-full max-w-[1080px] overflow-y-auto rounded-xl border border-black/10 bg-[#fffffc] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:max-h-[calc(100dvh-2rem)] sm:p-7 lg:max-h-[calc(100dvh-4rem)] lg:p-10">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/10 pb-5 sm:mb-10">
          <p className="text-sm font-medium text-black/50">CodePaint Studio</p>
          <button
            ref={closeButtonRef}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-black/20 px-3 text-sm font-medium outline-offset-4 transition-[background-color,color] hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-sky-500 sm:px-4"
            type="button"
            onClick={handleClose}
          >
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>
        </div>
        <ApplyForm />
      </div>
    </div>
  );
}
