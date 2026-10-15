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
  return (
    <section className="flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-blue-500/25 bg-[#0b142b] p-2 sm:gap-4 sm:p-4">
      <button
        type="button"
        onClick={onCameraClick}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-slate-800/70 text-lg transition hover:bg-slate-700 sm:h-14 sm:w-14 sm:text-xl"
        aria-label="Toggle camera"
      >
        📹
      </button>

      <button
        type="button"
        onClick={onMicClick}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-slate-800/70 text-lg transition hover:bg-slate-700 sm:h-14 sm:w-14 sm:text-xl"
        aria-label="Toggle microphone"
      >
        🎤
      </button>

      <button
        type="button"
        className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-slate-800/70 text-xl transition hover:bg-slate-700 sm:flex"
        aria-label="Share screen"
      >
        🖥️
      </button>

      <button
        type="button"
        className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-slate-800/70 text-xl transition hover:bg-slate-700 sm:flex"
        aria-label="Raise hand"
      >
        ✋
      </button>

      <button
        type="button"
        onClick={onCallAction}
        className="min-w-0 shrink rounded-xl bg-red-500 px-3 py-3 text-xs font-semibold text-white transition hover:bg-red-600 sm:px-6 sm:text-base"
      >
        {callState === 'idle' && 'Start Call'}
        {callState === 'matching' && 'Cancel Match'}
        {callState === 'active' && 'End Call'}
      </button>
    </section>
  );
}
