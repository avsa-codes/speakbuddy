import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Clock, Users, Video } from 'lucide-react';

type GroupDiscussion = {
  id: string;
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  scheduledStartAt: string | null;
  maxParticipants: number;
  participantCount: number;
  topic: {
    title: string;
  };
};

function AdminDashboardPage() {
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDiscussions = useCallback(async () => {
    const response = await fetch(
      'http://localhost:5000/api/group-discussions/admin',
      { credentials: 'include' }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load discussions.');
    }

    setDiscussions(data.data);
  }, []);

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        await fetchDiscussions();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load discussions.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [fetchDiscussions]);

  const handleSessionAction = async (
    groupDiscussionId: string,
    action: 'start' | 'end'
  ) => {
    const actionLabel = action === 'start' ? 'start' : 'end';

    if (
      !window.confirm(`Are you sure you want to ${actionLabel} this session?`)
    ) {
      return;
    }

    setProcessingId(groupDiscussionId);
    setActionError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/group-discussions/${groupDiscussionId}/${action}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${actionLabel} session.`);
      }

      await fetchDiscussions();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : `Failed to ${actionLabel} session.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const scheduledCount = discussions.filter(
    (discussion) => discussion.status === 'WAITING'
  ).length;

  const activeCount = discussions.filter(
    (discussion) => discussion.status === 'ACTIVE'
  ).length;

  const totalReservations = discussions.reduce(
    (total, discussion) => total + discussion.participantCount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              SPEAKBUDDY ADMIN
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Group Discussions
            </h1>
            <p className="mt-2 text-slate-400">
              Manage scheduled sessions and monitor participation.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <Video size={18} className="text-indigo-400" />
            <span className="text-sm font-medium text-white">
              Session Management
            </span>
          </div>
        </header>

        <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={<CalendarDays size={21} />}
            label="Scheduled Sessions"
            value={String(scheduledCount)}
            description="Waiting to start"
          />
          <SummaryCard
            icon={<Clock size={21} />}
            label="Active Sessions"
            value={String(activeCount)}
            description="Currently in progress"
          />
          <SummaryCard
            icon={<Users size={21} />}
            label="Total Reservations"
            value={String(totalReservations)}
            description="Across all sessions"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">All Sessions</h2>
            <p className="mt-1 text-sm text-slate-400">
              View scheduled discussions and control their lifecycle.
            </p>
          </div>

          {actionError && (
            <p className="border-b border-slate-800 px-6 py-4 text-sm text-red-400">
              {actionError}
            </p>
          )}

          {isLoading ? (
            <p className="px-6 py-12 text-center text-slate-300">
              Loading sessions...
            </p>
          ) : error ? (
            <p className="px-6 py-12 text-center text-red-400">{error}</p>
          ) : discussions.length === 0 ? (
            <p className="px-6 py-12 text-center text-slate-300">
              No group discussions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Topic</th>
                    <th className="px-6 py-4 font-medium">Scheduled At</th>
                    <th className="px-6 py-4 font-medium">Participants</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {discussions.map((discussion) => (
                    <tr key={discussion.id}>
                      <td className="px-6 py-5 font-medium text-white">
                        {discussion.topic.title}
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {discussion.scheduledStartAt
                          ? new Date(
                              discussion.scheduledStartAt
                            ).toLocaleString()
                          : 'Not scheduled'}
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {discussion.participantCount}/
                        {discussion.maxParticipants}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={discussion.status} />
                      </td>

                      <td className="px-6 py-5">
                        {discussion.status === 'WAITING' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSessionAction(discussion.id, 'start')
                            }
                            disabled={processingId !== null}
                            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processingId === discussion.id
                              ? 'Starting...'
                              : 'Start Session'}
                          </button>
                        )}

                        {discussion.status === 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSessionAction(discussion.id, 'end')
                            }
                            disabled={processingId !== null}
                            className="rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processingId === discussion.id
                              ? 'Ending...'
                              : 'End Session'}
                          </button>
                        )}

                        {(discussion.status === 'COMPLETED' ||
                          discussion.status === 'CANCELLED') && (
                          <span className="text-sm text-slate-500">
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: GroupDiscussion['status'] }) {
  const styles = {
    WAITING: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    ACTIVE: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    COMPLETED: 'border-slate-600 bg-slate-800 text-slate-300',
    CANCELLED: 'border-red-500/20 bg-red-500/10 text-red-300',
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default AdminDashboardPage;
