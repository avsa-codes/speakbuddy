import { ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StartConversationCard() {

  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent p-6 shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
      {/* Decorative conversation bubbles */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-indigo-400/10 bg-indigo-500/5" />

      <div className="pointer-events-none absolute right-16 top-16 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/5 text-blue-400/30">
        <MessageCircle size={28} />
      </div>

      <div className="pointer-events-none absolute -bottom-10 right-28 h-24 w-24 rounded-full border border-blue-400/10 bg-blue-500/5" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
          <MessageCircle size={24} strokeWidth={2} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-400">
          Practice together
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ready for a conversation?
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Talk to someone who wants to practice their language too.
        </p>

        <button
          type="button"
          onClick={() => navigate('/conversation')}
          className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
        >
          Start Conversation
          <ArrowRight size={19} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}

export default StartConversationCard;
