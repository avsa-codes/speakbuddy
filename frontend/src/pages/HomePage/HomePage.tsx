import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import { useAuth } from '../../context/AuthContext';
import StartConversationCard from './components/StartConversationCard';
import ActivityStats from './components/ActivityStats';
import MobileHeader from '../../components/MobileHeader';
import { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';


function HomePage() {
  const { currentUser } = useAuth();

  const [connectionCount, setConnectionCount] = useState<number | null>(null);

  useEffect(() => {
    const handleConnectionCount = (count: number) => {
      setConnectionCount(count);
    };

    socket.on('connections:count', handleConnectionCount);

    return () => {
      socket.off('connections:count', handleConnectionCount);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="px-4 pb-28 pt-8 sm:px-6 sm:pb-28 sm:pt-12 lg:px-10 lg:py-12">
          <section className="mx-auto w-full max-w-7xl">
            <header className="mb-7 sm:mb-9">
              {connectionCount !== null && (
                <div className="mb-3 ml-auto flex w-fit shrink-0 items-center gap-2 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 px-2.5 py-1 text-xs shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute -inset-0.5 rounded-full bg-emerald-500/30 blur-xs" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                  </span>
                  <span className="tabular-nums font-mono font-medium text-emerald-400">
                    {connectionCount}
                  </span>
                  <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    live
                  </span>
                </div>
              )}
              <p className="text-sm font-medium text-blue-400">Welcome back</p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {currentUser?.name || 'there'}{' '}
                <span aria-hidden="true">👋</span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                Ready to practise your English today?
              </p>
            </header>

            <StartConversationCard />

            <ActivityStats />
          </section>
        </div>
      </div>

      <MobileNavigation />
    </main>
  );
}

export default HomePage;
