import { useAuth } from '../../context/AuthContext';
import MobileNavigation from '../../components/MobileNavigation';
import MobileHeader from '../../components/MobileHeader';
import { Navbar } from '../../components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import LandingMobileNavigation from '../../components/LandingMobileNavigation';
import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';

function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  const [connectionCount, setConnectionCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchConnectionCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stats/connections`);
        if (!response.ok) return;

        const data: { count: number } = await response.json();
        setConnectionCount(data.count);
      } catch (error) {
        console.error('Failed to fetch connection count:', error);
      }
    };

    fetchConnectionCount();

    const interval = setInterval(fetchConnectionCount, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#070B1A] text-white">
      <MobileHeader to="/" />
      <Navbar />
      <HeroSection connectionCount={connectionCount} />
      <HowItWorks />

      {!isLoading &&
        (isAuthenticated ? <MobileNavigation /> : <LandingMobileNavigation />)}
    </main>
  );
}

export default LandingPage;
