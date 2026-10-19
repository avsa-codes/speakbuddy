type ConversationTipsProps = {
  stage: 1 | 2 | 3;
  onDismiss: () => void;
};

export default function ConversationTips({
  stage,
  onDismiss,
}: ConversationTipsProps) {
  const content = {
    1: {
      eyebrow: 'A LITTLE REMINDER',
      title: "You don't need perfect English.",
      message:
        "Take your time. It's okay to pause, search for words, or make mistakes. The goal is to communicate, not to be perfect.",
    },
    2: {
      eyebrow: 'KEEP IT GOING',
      title: 'Keep getting curious!',
      message:
        "Ask open-ended questions like “What's something you've always wanted to learn?” Great conversations go both ways.",
    },
    3: {
      eyebrow: 'TIME TO WRAP UP',
      title: "Time flies when you're talking!",
      message:
        'You have 2 minutes left. Share any final thoughts, wrap up your conversation, and say your goodbyes.',
    },
  }[stage];

  const isWarning = stage === 3;

  return (
    <div
      className={
        isWarning
          ? 'fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          : 'fixed left-2 right-2 top-2 z-[90] w-auto max-w-none animate-in fade-in slide-in-from-top-2 duration-500 sm:left-4 sm:right-auto sm:top-4 sm:w-full sm:max-w-xs'
      }
    >
      <div
        role={isWarning ? 'alertdialog' : 'status'}
        aria-labelledby="conversation-tip-title"
        className={
          isWarning
            ? 'w-full max-w-sm rounded-2xl border border-violet-400/20 bg-[#171720] p-5 text-white shadow-2xl'
            : 'rounded-2xl border border-violet-400/15 bg-[#171720] p-3 text-white shadow-xl sm:p-4'
        }
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
              {content.eyebrow}
            </p>

            <h3
              id="conversation-tip-title"
              className="mt-1 text-sm font-semibold leading-snug sm:mt-1.5 sm:text-base"
            >
              {content.title}
            </h3>
          </div>

          {isWarning && (
            <span className="shrink-0 rounded-lg bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-300">
              02:00 left
            </span>
          )}

          {!isWarning && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss conversation tip"
              className="shrink-0 rounded-md px-1.5 text-lg leading-none text-gray-500 transition hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        <p className="text-xs leading-4 text-gray-400 sm:text-sm sm:leading-5">
          {content.message}
        </p>

        {isWarning && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-5 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
