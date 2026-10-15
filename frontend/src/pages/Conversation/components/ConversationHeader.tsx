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
  elapsedSeconds: number;
};

export default function ConversationHeader({
  partnerName = 'Waiting for partner',
  partnerPhoto = null,
  topics,
  selectedTopicId,
  onTopicChange,
  isLive = false,
  elapsedSeconds
}: ConversationHeaderProps) {


  
function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}


  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-blue-500/40 bg-[#0b142b] px-3 py-3 sm:min-h-[78px] sm:px-5 sm:py-4">
      {/* Back button and partner */}
      <div className="flex min-w-0 flex-1 basis-[220px] items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/5 sm:h-10 sm:w-10"
          aria-label="Go back"
        >
          ←
        </button>

        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-blue-400/30 bg-indigo-500/20 sm:h-11 sm:w-11">
          {partnerPhoto ? (
            <img
              src={partnerPhoto}
              alt={partnerName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-base font-semibold text-indigo-300 sm:text-lg">
              {partnerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">Partner</p>
          <p className="truncate text-sm font-semibold text-white sm:text-base">
            {partnerName}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="order-2 ml-auto flex shrink-0 items-center gap-2 sm:order-3 sm:gap-3">
        {isLive && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-2 py-1.5 sm:px-3 sm:py-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs text-white sm:text-sm">Live</span>
          </div>
        )}

        <span className="text-xs tabular-nums text-slate-300 sm:text-sm">
          {formatDuration(elapsedSeconds)}
        </span>
      </div>

      {/* Topic selector: visible on mobile and desktop */}
      <div className="order-3 w-full min-w-0 sm:order-2 sm:w-auto sm:flex-1">
        <label
          htmlFor="conversation-topic"
          className="mb-1 block text-xs text-slate-400"
        >
          Practice topic
        </label>

        <select
          id="conversation-topic"
          value={selectedTopicId}
          onChange={(event) => onTopicChange(event.target.value)}
          className="w-full min-w-0 rounded-xl border border-blue-400/25 bg-[#101b36] px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 [color-scheme:dark] sm:max-w-[320px] sm:rounded-full"
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
    </header>
  );
}
