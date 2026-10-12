import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function ProfileHeader() {
  const { currentUser } = useAuth();

  const totalRatings = currentUser?.totalRatings ?? 0;
  const averageRating = currentUser?.rating ?? 0;
  const hasRatings = totalRatings > 0;

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
        {/* Profile photo */}
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-indigo-400/20 bg-indigo-500/10">
          {currentUser?.profilePhotoUrl ? (
            <img
              src={currentUser.profilePhotoUrl}
              alt={`${currentUser.name}'s profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-indigo-300">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* User information */}
        <div className="mt-5 sm:ml-6 sm:mt-0">
          <h2 className="text-2xl font-bold text-white">
            {currentUser?.name || 'User'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            @{currentUser?.username || 'username'}
          </p>

          <div
            className="mt-4 flex items-center justify-center gap-2 sm:justify-start"
            aria-label={
              hasRatings
                ? `Rated ${averageRating.toFixed(
                    1
                  )} out of 5 from ${totalRatings} ratings`
                : 'This user has not received any ratings yet'
            }
          >
            <Star
              size={17}
              className="fill-current text-amber-400"
              aria-hidden="true"
            />

            <span className="text-sm font-semibold text-white">
              {hasRatings ? averageRating.toFixed(1) : 'No rating yet'}
            </span>

            {hasRatings && (
              <span className="text-sm text-slate-500">
                · {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
