import { useAuth } from '../../context/AuthContext';
import MobileNavigation from '../../components/MobileNavigation';
import MobileHeader from '../../components/MobileHeader';
import { Navbar } from '../../components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import LandingMobileNavigation from '../../components/LandingMobileNavigation';


function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <main className="min-h-screen bg-[#070B1A] text-white">
      <MobileHeader to="/" />
      <Navbar />
      <HeroSection />
      <HowItWorks />

      {!isLoading &&
        (isAuthenticated ? <MobileNavigation /> : <LandingMobileNavigation />)}
    </main>
  );
}

export default LandingPage;
