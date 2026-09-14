export function LiveDiscussionCard() {
  return (
    <article className="w-full max-w-[340px] rounded-2xl border border-blue-400/40 bg-slate-950/90 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-red-400"
            aria-hidden="true"
          />

          <span className="truncate text-xs font-semibold text-white">
            Live Group Discussion Room
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          ● Live
        </span>
      </div>

      {/* Topic */}
      <div className="mt-3">
        <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
          Topic
        </p>

        <h3 className="mt-1 text-sm font-semibold leading-5 text-white">
          Should AI replace entry-level coding jobs?
        </h3>

        <span className="mt-2 inline-flex rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-300">
          Placement GD
        </span>
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center border-y border-white/10 py-2.5">
        <div className="pr-5">
          <p className="text-base font-bold text-white">6/8</p>
          <p className="text-[9px] text-slate-400">Students</p>
        </div>

        <div className="h-7 w-px bg-white/10" />

        <div className="pl-5">
          <p className="text-base font-bold text-white">4.8</p>
          <p className="text-[9px] text-slate-400">Avg. Rating</p>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="mt-3 w-full rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
      >
        Join Room
      </button>
    </article>
  );
}
