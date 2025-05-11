
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  
  useEffect(() => {
    // Show logo with delay for smooth animation
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    
    // Navigate to login after splash screen timer
    const navigationTimer = setTimeout(() => {
      navigate('/login');
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
      <Logo animated size="lg" className="mb-8" />
      <p className={`mt-6 text-nox-textSecondary text-sm transition-all duration-1000 delay-500 ${
        showLogo ? 'opacity-100' : 'opacity-0'
      }`}>
        Seu dinheiro, sua liberdade.
      </p>
    </div>
  );
};

export default SplashScreen;
