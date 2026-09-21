type CallState = 'idle' | 'matching' | 'active';

type CallControlsProps = {
  callState: CallState;
  onCallAction: () => void;
};

export default function CallControls({
  callState,
  onCallAction,
}: CallControlsProps) {
  return (
    <section className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-blue-500/40 bg-[#0b142b] p-4 sm:gap-5">
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/30 bg-slate-800/70 text-xl transition hover:bg-slate-700"
        aria-label="Toggle camera"
      >
        📹
      </button>

      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/30 bg-slate-800/70 text-xl transition hover:bg-slate-700"
        aria-label="Toggle microphone"
      >
        🎤
      </button>

      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/30 bg-slate-800/70 text-xl transition hover:bg-slate-700"
        aria-label="Share screen"
      >
        🖥️
      </button>

      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/30 bg-slate-800/70 text-xl transition hover:bg-slate-700"
        aria-label="Raise hand"
      >
        ✋
      </button>

      <button
        type="button"
        onClick={onCallAction}
  
        className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {callState === 'idle' && 'Start Call'}
        {callState === 'matching' && 'Cancel Match'}
        {callState === 'active' && 'End Call'}
      </button>
    </section>
  );
}
