// import Sidebar from '../../components/Sidebar';
// import MobileNavigation from '../../components/MobileNavigation';
// import GroupCard from './components/GroupCard';
// import type { Group } from '../../types/group';
// import MobileHeader from '../../components/MobileHeader';
// import { useEffect, useState } from 'react';
// import { API_URL } from '../../config/api';

// function GroupsPage() {


//   const [groups, setGroups] = useState<Group[]>([]);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       const response = await fetch(
//         `${API_URL}/api/group-discussions`,
//         {
//           credentials: 'include',
//         }
//       );

//       const data = await response.json();

//       setGroups(data.data);
//     };

//     fetchGroups();
//   }, []);


//   return (
//     <main className="min-h-screen bg-[#070B1A] text-white lg:flex">
//       <Sidebar />

//       <div className="min-w-0 flex-1">
//         <MobileHeader />
//         <div className="px-5 pb-28 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:pb-16">
//           <section className="mx-auto w-full max-w-7xl">
//             <div className="text-center sm:text-left">
//               <p className="text-sm font-medium text-blue-400">
//                 Practice together
//               </p>

//               <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
//                 Groups
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//                 Join a group discussion and practice speaking English with
//                 multiple people.
//               </p>
//             </div>

//             <div className="mt-10">
//               <div>
//                 <h2 className="text-lg font-semibold text-white">
//                   Available Groups
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Choose a discussion and practice speaking together.
//                 </p>
//               </div>

//               <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//                 {groups.map((group) => (
//                   <GroupCard key={group.id} group={group} />
//                 ))}
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>

//       <MobileNavigation />
//     </main>
//   );
// }

// export default GroupsPage;

import { Clock3, MessageCircle, Users } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import MobileHeader from '../../components/MobileHeader';

function GroupsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="flex min-h-[calc(100vh-64px)] flex-col px-4 pb-28 pt-8 sm:px-6 sm:pt-12 lg:min-h-screen lg:justify-center lg:px-10 lg:pb-16">
          <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
            <div className="mb-8 text-center sm:mb-10">
              <p className="text-sm font-medium text-blue-400">
                Something to look forward to
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Group Discussions
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                Practise speaking with multiple learners in one conversation.
                We're working on it.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 via-blue-500/[0.04] to-transparent px-5 py-10 text-center shadow-2xl shadow-indigo-950/20 sm:px-10 sm:py-14">
              {/* Subtle decorative rings */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border border-indigo-400/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-blue-400/10"
              />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-950/30">
                <Users size={36} strokeWidth={1.6} />

                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/20 bg-[#111A33] text-blue-300">
                  <MessageCircle size={16} />
                </span>
              </div>

              <div className="relative mt-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
                  <Clock3 size={15} />
                  Coming Soon
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Better conversations, together.
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                  Group practice is on its way. For now, you can build your
                  confidence through one-to-one conversations.
                </p>
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
