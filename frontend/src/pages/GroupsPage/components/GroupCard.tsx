import { ArrowRight, Users } from 'lucide-react';
import type { Group } from '../../../types/group';

function GroupCard({ group }: { group: Group }) {
  const isFull = group.participants >= group.maxParticipants;

  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-white/[0.04] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Group Discussion
          </p>

          <h2 className="mt-2 truncate text-xl font-bold text-white">
            {group.topic}
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Users size={20} />
        </div>
      </div>

      <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-400">
        {group.description}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users size={17} className="text-slate-500" />
            <span>
              {group.participants}/{group.maxParticipants}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-600">
            {isFull ? 'Group is full' : 'Spots available'}
          </p>
        </div>

        <button
          type="button"
          disabled={isFull}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none"
        >
          {isFull ? 'Full' : 'Join Group'}
          {!isFull && (
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </div>
    </article>
  );
}

export default GroupCard;
