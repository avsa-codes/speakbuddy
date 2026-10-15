import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import MobileHeader from '../../components/MobileHeader';
import ProfileHeader from './components/ProfileHeader';
import ProfileInformation from './components/ProfileInformation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="px-4 pb-28 pt-8 sm:px-6 sm:pb-28 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-12">
          <section className="mx-auto w-full max-w-5xl">
            <header>
              <p className="text-sm font-medium text-blue-400">Your profile</p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Profile
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your personal information and language preferences.
              </p>
            </header>

            <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              <ProfileHeader />
              <ProfileInformation />
            </div>

            <div className="mt-8 flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200 sm:w-auto"
              >
                Log out
              </button>
            </div>
          </section>
        </div>
      </div>

      <MobileNavigation />
    </main>
  );
}

export default ProfilePage;
