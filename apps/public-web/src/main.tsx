import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Header } from "./components/Header";
import { ApplyForm } from "./components/ApplyForm";
import "./index.css";

gsap.registerPlugin(useGSAP);


function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLElement>(null);
  const [showApply, setShowApply] = useState(false);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".page-item", { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.12, ease: "power3.out" });
  }, { scope: pageRef });

  function revealApply() {
    setShowApply(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#fffffc] text-black">
      <Header onApply={revealApply} />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-10 sm:pt-48">
        <section className="page-item mb-28 max-w-4xl sm:mb-40" aria-labelledby="intro-title">
          <h1 id="intro-title" className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-7xl">一起把想法，做成真正能运行的作品。</h1>
          <div className="mt-8 flex max-w-2xl gap-4 text-base leading-8 text-black/60 sm:mt-10 sm:text-lg"><span className="mt-3 h-px w-10 shrink-0 bg-black/40" aria-hidden="true" /><p>我们寻找愿意动手、愿意协作，也愿意把问题想清楚的新成员。</p></div>
        </section>
        {showApply && (
          <section ref={applyRef} className="page-item scroll-mt-32" aria-labelledby="apply-title">
            <div className="mb-8 flex items-end justify-between gap-4"><h2 id="apply-title" className="text-xl font-semibold sm:text-2xl">开始投递</h2><span className="text-xs text-black/40">01 / 01</span></div>
            <ApplyForm />
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
