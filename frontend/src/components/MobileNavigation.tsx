import { House, UserRound, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function MobileNavigation() {
  const location = useLocation();

  const isHomeActive = location.pathname === '/home';
  const isGroupsActive = location.pathname.startsWith('/groups');
  const isProfileActive = location.pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#070B1A]/95 px-4 py-3 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <Link
          to="/home"
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            isHomeActive
              ? 'text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <House size={21} />
          Home
        </Link>

        <Link
          to="/groups"
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            isGroupsActive
              ? 'text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users size={21} />
          Groups
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            isProfileActive
              ? 'text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <UserRound size={21} />
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default MobileNavigation;
