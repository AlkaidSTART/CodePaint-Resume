import { useState, type ChangeEvent, type FormEvent } from "react";

const inputClassName =
  "min-h-12 w-full rounded-lg border border-black/15 bg-[#fffffc] px-4 text-base outline-none transition-[border-color,box-shadow] placeholder:text-black/30 hover:border-black/30 focus:border-sky-500 focus-visible:ring-4 focus-visible:ring-sky-500/15";

function RequiredMark() {
  return <span className="text-sky-600" aria-hidden="true">*</span>;
}

export function ApplyForm() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    setSubmitted(false);

    if (!file) {
      setFileName("");
      return;
    }

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
    if (!fileName) {
      setFileError("请先选择要投递的 PDF 文件。");
      return;
    }

    setIsSubmitting(true);
    setSubmitted(true);
    window.setTimeout(() => setIsSubmitting(false), 450);
  }

  return (
    <form className="mx-auto w-full max-w-[1040px]" onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)] lg:gap-x-14">
        <div className="flex flex-col lg:pr-4">
          <div>
            <div className="mb-5 flex items-center gap-3 text-sm font-medium text-black/50">
              <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
              <span>投递材料</span>
            </div>
            <h2 id="apply-title" className="max-w-sm text-4xl font-semibold leading-[1.18] tracking-normal sm:text-5xl">
              把你的作品，交给我们。
            </h2>
            <p id="apply-intro" className="mt-5 max-w-sm text-base leading-7 text-black/60">
              留下姓名、邮箱和一份 PDF 简历或作品集。我们会从你的材料开始认识你。
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3 border-t border-black/10 pt-4 text-sm text-black/50 lg:mt-auto">
            <span className="h-px w-8 bg-sky-400" aria-hidden="true" />
            <span>PDF / 最大 10MB</span>
          </div>
        </div>

        <div className="border-t border-black/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1">
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="sr-only">联系方式</legend>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/65" htmlFor="name">
                姓名 <RequiredMark />
              </label>
              <input
                className={inputClassName}
                id="name"
                name="name"
                type="text"
                placeholder="你的姓名或昵称"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/65" htmlFor="email">
                邮箱 <RequiredMark />
              </label>
              <input
                className={inputClassName}
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="mb-2 block text-sm font-medium text-black/65">
              简历或作品集 PDF <RequiredMark />
            </legend>
            <input
              className="peer sr-only"
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              aria-invalid={Boolean(fileError)}
              aria-describedby={fileError ? "resume-help resume-error" : "resume-help"}
            />
            <label
              className={`group flex min-h-32 cursor-pointer items-center justify-between gap-5 rounded-lg border border-dashed px-4 py-4 outline-none transition-[border-color,background-color,box-shadow] hover:border-black/45 hover:bg-[#fffffc] peer-focus-visible:border-sky-500 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-500/15 sm:px-5 ${fileError ? "border-red-600 bg-red-50/40" : "border-black/20 bg-[#fffffc]/60"}`}
              htmlFor="resume"
            >
              <span className="min-w-0 text-base">
                <span className="block break-all font-medium">{fileName || "选择一个 PDF 文件"}</span>
                <span id="resume-help" className="mt-1 block text-sm leading-6 text-black/50">
                  支持单个文件，大小不超过 10MB
                </span>
              </span>
              <span className="shrink-0 rounded-md border border-black/15 px-3 py-2 text-sm font-medium transition-[background-color,color] group-hover:bg-black group-hover:text-white">
                浏览文件
              </span>
            </label>
            {fileError && (
              <p id="resume-error" className="mt-2 flex gap-2 text-sm leading-6 text-red-700" role="alert">
                <span aria-hidden="true">!</span>
                <span>{fileError}</span>
              </p>
            )}
          </fieldset>

          <div className="mt-7 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-sm text-sm leading-6 text-black/50">
              提交前请确认材料中包含有效的联系方式。
            </p>
            <button
              className="min-h-11 w-full rounded-lg border border-black bg-black px-5 text-sm font-medium text-white outline-offset-4 transition-[background-color,color,transform] hover:bg-sky-400 hover:text-black active:translate-y-px focus-visible:outline-2 focus-visible:outline-sky-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-32"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "正在检查…" : "提交材料"}
              <span className="ml-2" aria-hidden="true">↗</span>
            </button>
          </div>

          {submitted && (
            <p className="mt-5 border-l-2 border-sky-500 bg-sky-50/60 px-3 py-2 text-sm leading-6" role="status">
              <span className="font-medium">材料已通过本地校验。</span> 当前等待接入提交接口。
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
