import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">CodePaint 公共端</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
        基础脚手架已就绪，应用内容待搭建。
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
