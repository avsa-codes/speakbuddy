import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, currentUser, isLoading, logout } = useAuth();
  const navigate = useNavigate();

async function handleLogout() {
  try {
    navigate('/');
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

if (isLoading) {
  return null;
}
  return (
    <nav className="hidden w-full px-5 py-5 sm:block sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div>
          <a href="/" className="text-2xl font-bold tracking-tight text-white">
            SpeakBuddy
          </a>
        </div>

        <div className="hidden items-center gap-5 sm:flex sm:gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            How It Works
          </a>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-sm font-medium text-slate-300 transition hover:text-white sm:text-base"
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-slate-300 transition hover:text-white sm:text-base"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 transition hover:text-white sm:text-base"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
