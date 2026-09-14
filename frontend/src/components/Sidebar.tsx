import { House, Users, UserRound, LogOut, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === '/home';
  const isGroupsActive = location.pathname.startsWith('/groups');
  const isProfileActive = location.pathname === '/profile';

  async function handleLogout() {
    try {
      navigate('/');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-white/10 bg-[#070B1A] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="px-7 py-7">
        <Link
          to="/home"
          className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <MessageCircle size={22} strokeWidth={2.2} />
          </div>
          SpeakBuddy
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-5">
        <div className="space-y-2">
          <Link
            to="/home"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isHomeActive
                ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-950/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <House size={20} strokeWidth={2} />
            Home
          </Link>

          <Link
            to="/groups"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isGroupsActive
                ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-950/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={20} strokeWidth={2} />
            Groups
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isProfileActive
                ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-950/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserRound size={20} strokeWidth={2} />
            Profile
          </Link>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-300">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {currentUser?.name || 'User'}
            </p>

            <p className="truncate text-xs text-slate-500">
              @{currentUser?.username || 'username'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={20} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
