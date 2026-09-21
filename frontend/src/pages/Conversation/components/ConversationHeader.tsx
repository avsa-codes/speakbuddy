type Topic = {
  id: string;
  title: string;
  description: string;
};

type ConversationHeaderProps = {
  partnerName?: string;
  partnerPhoto?: string | null;
  topics: Topic[];
  selectedTopicId: string;
  onTopicChange: (topicId: string) => void;
  isLive?: boolean;
};

export default function ConversationHeader({
  partnerName = 'Waiting for partner',
  partnerPhoto = null,
  topics,
  selectedTopicId,
  onTopicChange,
  isLive = false,
}: ConversationHeaderProps) {
  return (
    <header className="flex min-h-[78px] items-center gap-4 rounded-2xl border border-blue-500/40 bg-[#0b142b] px-4 py-3 sm:px-5">
      {/* Back */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/5"
        aria-label="Go back"
      >
        ←
      </button>

      {/* Partner */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-blue-400/30 bg-indigo-500/20">
          {partnerPhoto ? (
            <img
              src={partnerPhoto}
              alt={partnerName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-indigo-300">
              {partnerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">Partner</p>
          <p className="truncate text-base font-semibold text-white">
            {partnerName}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-10 w-px bg-blue-400/20 sm:block" />

      {/* Topic */}
      <div className="hidden min-w-0 sm:block">
        <p className="text-xs text-slate-400">Practice: Topic</p>

        <select
          value={selectedTopicId}
          onChange={(event) => onTopicChange(event.target.value)}
          className="mt-1 rounded-full border border-blue-400/20 bg-[#101b36] px-3 py-2 text-sm text-white outline-none [color-scheme:dark]"
        >
          <option value="">Select a topic</option>

          {topics.map((topic) => (
            <option
              key={topic.id}
              value={topic.id}
              className="bg-[#101b36] text-white"
            >
              {topic.title}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {isLive && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="hidden text-sm text-white sm:inline">Live</span>
          </div>
        )}

        <span className="hidden text-sm text-slate-300 md:inline">
          00:00:00
        </span>
      </div>
    </header>
  );
}
