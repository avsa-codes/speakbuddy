export default function VideoPanel() {
  return (
    <section className="relative h-[min(56vh,580px)] overflow-hidden rounded-2xl border border-blue-500/40 bg-[#0b142b]">
      {/* Main video placeholder */}
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/15 text-3xl text-indigo-300">
            🎥
          </div>

          <p className="mt-4 text-lg font-medium text-white">
            Video will appear here
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Video calling will be available soon
          </p>
        </div>
      </div>

      {/* Partner video placeholder */}
      <div className="absolute bottom-4 right-4 flex h-28 w-40 items-center justify-center rounded-xl border border-blue-400/40 bg-[#101b36] shadow-lg sm:h-32 sm:w-48">
        <span className="text-sm text-slate-400">Your video</span>
      </div>
    </section>
  );
}
