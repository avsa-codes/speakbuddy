import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import { useAuth } from '../../context/AuthContext';
import StartConversationCard from './components/StartConversationCard';
import ActivityStats from './components/ActivityStats';
import MobileHeader from '../../components/MobileHeader';


function HomePage() {
  const { currentUser } = useAuth();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="px-4 pb-28 pt-8 sm:px-6 sm:pb-28 sm:pt-12 lg:px-10 lg:py-12">
          <section className="mx-auto w-full max-w-7xl">
            <header className="mb-7 sm:mb-9">
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
