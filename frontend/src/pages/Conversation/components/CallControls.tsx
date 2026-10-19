type CallState = 'idle' | 'matching' | 'active';

type CallControlsProps = {
  callState: CallState;
  onCallAction: () => void;
  onCameraClick: () => void;
  onMicClick: () => void;
};

export default function CallControls({
  callState,
  onCallAction,
  onCameraClick,
  onMicClick,
}: CallControlsProps) {
  const isCallActive = callState === 'active';
  const isMatching = callState === 'matching';

  const controlClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-[#151E33] text-slate-300 shadow-sm transition-all duration-200 hover:border-violet-400/40 hover:bg-[#202B45] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:h-12 sm:w-12';

  return (
    <section className="flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0B1224] p-3 sm:gap-3 sm:p-4">
      <button
        type="button"
        onClick={onCameraClick}
        disabled={!isCallActive}
        className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Toggle camera"
        title="Toggle camera"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="3" y="6" width="13" height="12" rx="2.5" />
          <path d="m16 10 5-3v10l-5-3" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onMicClick}
        disabled={!isCallActive}
        className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Toggle microphone"
        title="Toggle microphone"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onCallAction}
        className={`min-w-0 shrink rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1224] active:scale-[0.98] sm:px-7 sm:text-base ${
          isMatching
            ? 'bg-slate-700 shadow-slate-950/20 hover:bg-slate-600 focus-visible:ring-slate-400'
            : isCallActive
            ? 'bg-rose-600 shadow-rose-950/20 hover:bg-rose-500 focus-visible:ring-rose-400'
            : 'bg-violet-600 shadow-violet-950/30 hover:bg-violet-500 focus-visible:ring-violet-400'
        }`}
      >
        {callState === 'idle' && 'Start Call'}
        {callState === 'matching' && 'Cancel Match'}
        {callState === 'active' && 'End Call'}
      </button>
    </section>
  );
}
