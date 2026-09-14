import { Home, Info, LogIn, UserPlus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type LandingMobileNavigationProps = {
  showHome?: boolean;
};

function LandingMobileNavigation({
  showHome = false,
}: LandingMobileNavigationProps) {

  const location = useLocation();

  const isLoginActive = location.pathname === '/login';
  const isRegisterActive = location.pathname === '/register';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#070B1A]/95 px-4 py-3 backdrop-blur-lg sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <a
          href={showHome ? '/' : '#how-it-works'}
          className="flex flex-col items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          {showHome ? <Home size={20} /> : <Info size={20} />}

          <span>{showHome ? 'Home' : 'How It Works'}</span>
        </a>

        <a
          href="/login"
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            isLoginActive
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LogIn size={20} />
          <span>Log in</span>
        </a>

        <a
          href="/register"
          className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
            isRegisterActive
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus size={20} />
          <span>Register</span>
        </a>
      </div>
    </nav>
  );
}

export default LandingMobileNavigation;
