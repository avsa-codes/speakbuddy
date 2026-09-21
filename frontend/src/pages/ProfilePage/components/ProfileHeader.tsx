import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function ProfileHeader() {
  const { currentUser } = useAuth();
  

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

          <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
            <Star size={17} className="fill-current text-amber-400" />

            <span className="text-sm font-semibold text-white">
              {currentUser?.totalRatings
                ? currentUser.rating.toFixed(1)
                : 'No rating yet'}
            </span>

            {currentUser?.totalRatings ? (
              <span className="text-sm text-slate-500">
                · {currentUser.totalRatings} ratings
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
