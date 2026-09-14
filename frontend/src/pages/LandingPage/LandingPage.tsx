import { HeroSection } from './components/HeroSection';
import { Navbar } from '../../components/Navbar';
import { HowItWorks } from './components/HowItWorks';
import LandingMobileNavigation from '../../components/LandingMobileNavigation';
import MobileHeader from '../../components/MobileHeader';

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070B1A] text-white">
      <MobileHeader to="/" />
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <LandingMobileNavigation />
    </main>
  );
}

export default LandingPage;
