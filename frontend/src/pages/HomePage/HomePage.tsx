import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import { useAuth } from '../../context/AuthContext';
import StartConversationCard from './components/StartConversationCard';
import RecentConversations from './components/RecentConversations';
import ActivityStats from './components/ActivityStats';
import MobileHeader from '../../components/MobileHeader';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <main className="min-h-screen bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />
        <div className="px-5 pb-28 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
          <section className="mx-auto w-full max-w-7xl">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-blue-400">Welcome back</p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {currentUser?.name || 'there'} 👋
              </h1>

              <p className="mt-3 text-base leading-6 text-slate-400 sm:text-lg">
                Ready for your next conversation?
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <StartConversationCard />
              <RecentConversations />
            </div>

            <ActivityStats />
          </section>
        </div>
      </div>

      <MobileNavigation />
    </main>
  );
}

export default HomePage;
