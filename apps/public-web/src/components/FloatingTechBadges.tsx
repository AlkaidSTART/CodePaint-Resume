export function FloatingTechBadges() {
  const tags = [
    "React 19", "TypeScript", "Next.js", "AI Agent", "RAG", "Three.js", "LLM Flow", "Tailwind CSS", "Go API", "WebGL"
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
      {tags.map((t, idx) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full border border-sky-500/20 bg-slate-900/60 px-3 py-1 text-[11px] font-mono font-medium text-slate-300 backdrop-blur-md shadow-xs transition hover:border-sky-400/50 hover:bg-slate-800/80 hover:text-sky-200"
          style={{
            animation: `pulse 3s ease-in-out ${idx * 0.2}s infinite alternate`
          }}
        >
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          {t}
        </span>
      ))}
    </div>
  );
}
