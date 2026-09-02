import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function ApplyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".apply-panel", { autoAlpha: 0, y: 24, duration: 0.8, delay: 0.25, ease: "power3.out" });
  }, { scope: formRef });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    setSubmitted(false);
    if (!file) { setFileName(""); return; }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      event.target.value = "";
      setFileName("");
      setFileError("请上传 PDF 格式的文件。");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      setFileName("");
      setFileError("文件大小不能超过 10MB。");
      return;
    }
    setFileName(file.name);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileName) { setFileError("请先选择要投递的 PDF 文件。"); return; }
    setSubmitted(true);
  }

  return (
    <form ref={formRef} className="apply-panel mx-auto w-full max-w-3xl" onSubmit={handleSubmit}>
      <div className="grid gap-10 border-y border-black/15 py-8 sm:grid-cols-[0.72fr_1.28fr] sm:gap-14 sm:py-12">
        <div>
          <h2 className="max-w-xs text-3xl font-semibold leading-[1.16] tracking-[-0.03em] sm:text-4xl">把你的作品，交给我们。</h2>
          <p className="mt-5 max-w-xs text-sm leading-7 text-black/60">留下姓名、邮箱和一份 PDF 简历或作品集。我们会从你的材料开始认识你。</p>
          <div className="mt-8 flex items-center gap-3 text-xs text-black/45"><span className="h-px w-8 bg-black/35" aria-hidden="true" /><span>PDF / 最大 10MB</span></div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">姓名</label>
            <input className="w-full border-b border-black/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-black/30 hover:border-black/50 focus:border-black" id="name" name="name" type="text" placeholder="你的姓名或昵称" autoComplete="name" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">邮箱</label>
            <input className="w-full border-b border-black/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-black/30 hover:border-black/50 focus:border-black" id="email" name="email" type="email" placeholder="name@example.com" autoComplete="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="resume">简历或作品集 PDF</label>
            <label className={`flex min-h-24 cursor-pointer items-center justify-between gap-4 border border-dashed px-4 py-4 outline-offset-2 transition-colors hover:border-black ${fileError ? "border-red-600 bg-red-50/40" : "border-black/30 bg-white/25"}`} htmlFor="resume">
              <span className="min-w-0 text-sm"><span className="block truncate">{fileName || "选择一个 PDF 文件"}</span><span className="mt-1 block text-xs text-black/45">支持单个文件上传</span></span>
              <span className="shrink-0 border border-black/20 px-3 py-2 text-xs font-medium">浏览文件</span>
            </label>
            <input className="sr-only" id="resume" name="resume" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} />
            {fileError && <p className="mt-2 text-sm text-red-700" role="alert">{fileError}</p>}
          </div>
          <div className="flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-5 text-black/45">提交前请确认材料中包含有效的联系方式。</p>
            <button className="min-h-11 rounded-md border border-black bg-black px-5 text-sm font-medium text-white outline-offset-4 transition-[background-color,color] hover:bg-white hover:text-black active:bg-black active:text-white focus-visible:outline-2 focus-visible:outline-black" type="submit">提交材料 <span className="ml-2" aria-hidden="true">↗</span></button>
          </div>
          {submitted && <p className="border-l-2 border-black px-3 py-1 text-sm" role="status">材料已通过本地校验，等待接入提交接口。</p>}
        </div>
      </div>
    </form>
  );
}
