import { MessageCircle, Star, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function ActivityStats() {
  const { currentUser } = useAuth();

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      {/* Rating */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Star size={21} />
        </div>

        <p className="mt-5 text-sm font-medium text-slate-400">Your Rating</p>

        <p className="mt-1 text-3xl font-bold text-white">
          {currentUser?.totalRatings ? currentUser.rating.toFixed(1) : '—'}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {currentUser?.totalRatings
            ? `Based on ${currentUser.totalRatings} ratings`
            : 'No ratings yet'}
        </p>
      </div>

      {/* Conversations */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <MessageCircle size={21} />
        </div>

        <p className="mt-5 text-sm font-medium text-slate-400">Conversations</p>

        <p className="mt-1 text-3xl font-bold text-white">—</p>

        <p className="mt-1 text-xs text-slate-500">
          Start your first conversation
        </p>
      </div>

      {/* Groups */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Users size={21} />
        </div>

        <p className="mt-5 text-sm font-medium text-slate-400">Groups</p>

        <p className="mt-1 text-3xl font-bold text-white">—</p>

        <p className="mt-1 text-xs text-slate-500">Join your first group</p>
      </div>
    </section>
  );
}

export default ActivityStats;
