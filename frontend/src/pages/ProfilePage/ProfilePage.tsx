import Sidebar from '../../components/Sidebar';
import MobileNavigation from '../../components/MobileNavigation';
import ProfileHeader from './components/ProfileHeader';
import ProfileInformation from './components/ProfileInformation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/MobileHeader';
function ProfilePage() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      navigate('/')
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />
        <div className="px-5 pb-28 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:pb-16">
          <section className="mx-auto w-full max-w-4xl">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-blue-400">Your profile</p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Profile
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Manage your personal information and language preferences.
              </p>
            </div>
            <ProfileHeader />
            <ProfileInformation />
            <div className="mt-6 flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 hover:text-red-200"
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
