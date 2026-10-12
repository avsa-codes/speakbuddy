import { useState } from 'react';
import type { User } from '../../../types/user';

type RatingModalProps = {
  user: User;
  onSubmit: (rating: number) => Promise<void>;
  onClose: () => void;
};

export default function RatingModal({
  user,
  onSubmit,
  onClose,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating < 1 || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await onSubmit(rating);
    } catch {
      setError('Could not submit your rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-title"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b142b] p-6 text-center shadow-2xl sm:p-8"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 text-3xl">
          ⭐
        </div>

        <h2
          id="rating-title"
          className="mt-5 text-2xl font-semibold text-white"
        >
          How was your partner's English?
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Share your experience with {user.name}.
        </p>

        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="mx-auto mt-5 h-16 w-16 rounded-full border-2 border-blue-400/40 object-cover"
          />
        ) : (
          <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-xl font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
        )}

        <div
          className="mt-6 flex justify-center gap-2"
          role="group"
          aria-label="Rate this user from 1 to 5 stars"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoveredRating || rating);

            return (
              <button
                key={star}
                type="button"
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                aria-pressed={rating === star}
                onMouseEnter={() => setHoveredRating(star)}
                onFocus={() => setHoveredRating(star)}
                onBlur={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className={`rounded-lg p-1 text-4xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  active ? 'text-amber-400' : 'text-slate-600'
                }`}
              >
                ★
              </button>
            );
          })}
        </div>

        <p className="mt-3 min-h-5 text-sm text-slate-300">
          {rating === 1 && 'Needs improvement'}
          {rating === 2 && 'Below expectations'}
          {rating === 3 && 'It was okay'}
          {rating === 4 && 'Great conversation'}
          {rating === 5 && 'Excellent conversation!'}
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={rating === 0 || submitting}
          onClick={() => void handleSubmit()}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit rating'}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="mt-3 w-full rounded-xl px-5 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
