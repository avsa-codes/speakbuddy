import { ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StartConversationCard() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-indigo-400/25 bg-gradient-to-br from-[#111936] via-[#0C1329] to-[#090E1E] p-6 shadow-xl shadow-indigo-950/20 sm:p-8 lg:p-10">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full border border-indigo-400/10" />
      <div className="pointer-events-none absolute -right-6 -top-14 h-40 w-40 rounded-full border border-blue-400/10" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-40 w-40 rounded-full border border-blue-400/10 bg-blue-500/[0.03]" />

      <div className="relative z-10 flex min-h-[280px] items-center justify-between gap-6 sm:min-h-[300px] lg:min-h-[320px]">
        <div className="max-w-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/15 text-indigo-300">
            <MessageCircle size={25} strokeWidth={1.8} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 sm:text-sm">
            Practise together
          </p>

          <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Ready for a{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              conversation?
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
            Talk to someone who wants to practise their English too.
          </p>

          <button
            type="button"
            onClick={() => navigate('/conversation')}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0C1329]"
          >
            Start a conversation
            <ArrowRight size={19} />
          </button>
        </div>

        {/* Speech-wave illustration, hidden on narrow screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-8 hidden h-48 w-52 items-center justify-center sm:flex lg:right-12"
        >
          <div className="absolute right-14 top-2 h-32 w-32 rounded-full border border-blue-400/10" />
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-violet-400/10" />

          <div className="absolute left-1 top-5 flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-400/25 bg-blue-500/10 text-blue-400 shadow-xl shadow-blue-950/20">
            <div className="flex items-center gap-1">
              {[12, 24, 36, 18, 30, 14].map((height, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-blue-400"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-1 right-0 flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-400/25 bg-violet-500/10 text-violet-400 shadow-xl shadow-violet-950/20">
            <div className="flex items-center gap-1">
              {[14, 26, 18, 36, 22, 12].map((height, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-violet-400"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartConversationCard;
