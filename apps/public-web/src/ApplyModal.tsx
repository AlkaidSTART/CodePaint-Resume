import { useState, useRef } from "react";
import { Button } from "@codepaint/ui";
import { X, CheckCircle, Send, UploadCloud, FileText, Trash2, AlertCircle } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export function ApplyModal({ isOpen, onClose, defaultRole = "dev" }: ApplyModalProps) {
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [gradeMajor, setGradeMajor] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [intro, setIntro] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setPdfError("请上传 PDF 格式的简历文件 (.pdf)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setPdfError("简历文件大小不能超过 20MB");
      return;
    }
    setPdfError(null);
    setPdfFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setPdfError("请上传你的 PDF 简历");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0a0a0d] p-6 shadow-xl border border-white/10 sm:p-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">报名材料及简历已成功提交</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              简历文件 <strong className="text-slate-100 font-medium">[{pdfFile?.name}]</strong> 已成功解析并归档。<br />
              导师与方向负责人将尽快审阅，请留意联系方式通知。
            </p>
            <Button
              className="mt-6 w-full h-10 text-xs font-semibold"
              onClick={() => {
                setSubmitted(false);
                setPdfFile(null);
                onClose();
              }}
            >
              完成并返回
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <img src="/cp.webp" alt="CodePaint Logo" className="h-5 w-5 rounded object-cover" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                  APPLICATION FORM
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                加入 CodePaint（码绘）工作室
              </h3>
              <p className="text-xs text-slate-400">
                请选择意向招新方向并上传 PDF 简历。
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  意向方向 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "dev", label: "开发方向 (前端/全栈)", desc: "React/Vue/TS/架构" },
                    { id: "aigc", label: "AIGC 创新方向", desc: "Agent/多模态/大模型应用" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                        role === r.id
                          ? "border-sky-400/70 bg-sky-500/15 text-sky-200 font-semibold shadow-2xs"
                          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xs font-bold">{r.label}</span>
                      <span className="mt-0.5 text-[10px] text-slate-400">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="你的名字"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">
                    年级 / 专业 <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={gradeMajor}
                    onChange={(e) => setGradeMajor(e.target.value)}
                    placeholder="如: 24级数媒 / 计科"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  联系方式 (手机 / 微信 / 邮箱) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="方便我们及时向你同步初筛及面试安排"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900 focus:outline-hidden"
                />
              </div>

              {/* PDF Resume Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-200">
                    PDF 简历上传 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500">仅支持 .pdf 格式，20MB 以内</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                {!pdfFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
                      isDragging
                        ? "border-sky-400/70 bg-sky-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-sky-400/60 hover:bg-sky-500/10"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 transition group-hover:scale-105">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-100">
                      点击选择或拖拽 PDF 简历到此处
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      支持个人简历、项目经历或作品集 PDF
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-sky-400/20 bg-sky-500/[0.08] p-3.5">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white shadow-2xs">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <p className="truncate text-xs font-bold text-white">
                          {pdfFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB · PDF Document
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPdfFile(null)}
                      className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition shrink-0"
                      title="移除重新选择"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {pdfError && (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {pdfError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  补充说明 / 代码仓库链接 / 意向备注
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="选填：可附上你的 GitHub / Gitee、近期感兴趣的技术或想对导师说的话..."
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-10 text-xs font-semibold shadow-xs">
                <Send className="mr-1.5 h-3.5 w-3.5" /> 提交招新报名材料
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
