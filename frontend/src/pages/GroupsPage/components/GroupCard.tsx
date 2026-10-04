import { ArrowRight, Users } from 'lucide-react';
import type { Group } from '../../../types/group';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config/api';

function GroupCard({ group }: { group: Group }) {

  const navigate = useNavigate();

  const isFull = group.participantCount >= group.maxParticipants;
  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const handleReserve = async () => {
    setIsReserving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/group-discussions/${group.id}/reserve`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await response.json();

      console.log(data);
      setIsReserved(true);
    } catch (error) {
      console.error('Failed to reserve group discussion:', error);
    } finally {
      setIsReserving(false);
    }
  };

  useEffect( () => {
    const fetchReservationStatus = async () => {
      const response = await fetch(
        `${API_URL}/api/group-discussions/${group.id}/reservation`,
        {
         credentials: 'include'
        }
      );

      const data = await response.json();

      if(data.data?.status === "RESERVED"){
        setIsReserved(true);
      }

    };

    fetchReservationStatus();
  }, [group.id])

  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-white/[0.04] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Group Discussion
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            {group.topic.title}
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Users size={20} />
        </div>
      </div>

      <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-400">
        {group.topic.description}
      </p>

      <p className="mt-3 text-sm text-slate-500">
        Starts{' '}
        {new Date(group.scheduledStartAt).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users size={17} className="text-slate-500" />
            <span>
              {group.participantCount}/{group.maxParticipants}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-600">
            {isFull ? 'Group is full' : 'Spots available'}
          </p>
        </div>

        <button
          type="button"
          disabled={isFull || isReserving}
          onClick={() => {
            if (isReserved) {
              navigate(`/waiting-room/${group.id}`);
            } else {
              handleReserve();
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none"
        >
          {isFull
            ? 'Full'
            : isReserving
            ? 'Reserving...'
            : isReserved
            ? 'Waiting Room'
            : 'Join Group'}
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
