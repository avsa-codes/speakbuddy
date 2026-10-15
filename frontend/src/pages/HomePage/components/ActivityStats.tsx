import { MessageCircle, Star, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function ActivityStats() {
  const { currentUser } = useAuth();

  const stats = [
    {
      label: 'Your Rating',
      value: currentUser?.totalRatings ? currentUser.rating.toFixed(1) : '—',
      description: currentUser?.totalRatings
        ? `Based on ${currentUser.totalRatings} ratings`
        : 'No ratings yet',
      Icon: Star,
    },
    {
      label: 'Conversations',
      value: currentUser?.totalRatings,
      description: 'Your conversation activity',
      Icon: MessageCircle,
    },
    {
      label: 'Groups',
      value: '—',
      description: 'Explore group discussions',
      Icon: Users,
    },
  ];

  return (
    <section
      aria-label="Your activity"
      className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-6"
    >
      {stats.map(({ label, value, description, Icon }) => (
        <div
          key={label}
          className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-indigo-400/20 hover:bg-white/[0.04] sm:items-start sm:gap-0 sm:p-5 lg:flex-row lg:items-center lg:gap-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/15 text-indigo-300 sm:mb-4 lg:mb-0">
            <Icon size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-400">{label}</p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {value}
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ActivityStats;
