export function FloatingTechBadges() {
  const tags = [
    "React 19", "TypeScript", "Next.js", "AI Agent", "RAG", "Three.js", "LLM Flow", "Tailwind CSS", "Go API", "WebGL"
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {tags.map((t, idx) => (
        <span
          key={t}
          className="inline-flex items-center rounded-md border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur-xs shadow-2xs hover:border-sky-300 hover:text-sky-700 transition"
          style={{
            animation: `pulse 3s ease-in-out ${idx * 0.2}s infinite alternate`
          }}
        >
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-sky-500/80" />
          {t}
        </span>
      ))}
    </div>
  );
}
