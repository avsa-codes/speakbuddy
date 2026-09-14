import { ArrowRight, MessageCircle } from 'lucide-react';

function RecentConversations() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">
          Recent Conversations
        </h2>

        <button
          type="button"
          className="hidden items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300 sm:flex"
        >
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
          <MessageCircle size={25} />
        </div>

        <h3 className="mt-5 text-base font-semibold text-white">
          No conversations yet
        </h3>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Start your first conversation and your recent activity will appear
          here.
        </p>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Start a conversation
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

export default RecentConversations;
