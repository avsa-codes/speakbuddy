import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import GroupCard from './components/GroupCard';
import type { Group } from '../../types/group';
import MobileHeader from '../../components/MobileHeader';

function GroupsPage() {


  const groups: Group[] = [
    {
      id: '1',
      topic: 'Job Interviews',
      description:
        'Practice common interview questions and build confidence speaking English.',
      participants: 3,
      maxParticipants: 6,
    },
    {
      id: '2',
      topic: 'Daily English',
      description:
        'Have relaxed conversations and improve your everyday English fluency.',
      participants: 4,
      maxParticipants: 6,
    },
    {
      id: '3',
      topic: 'Technology & AI',
      description:
        'Discuss technology, AI, and the latest ideas while practicing English.',
      participants: 2,
      maxParticipants: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />
        <div className="px-5 pb-28 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:pb-16">
          <section className="mx-auto w-full max-w-7xl">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-blue-400">
                Practice together
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Groups
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Join a group discussion and practice speaking English with
                multiple people.
              </p>
            </div>

            <div className="mt-10">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Available Groups
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a discussion and practice speaking together.
                </p>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNavigation />
    </main>
  );
}

export default GroupsPage;
