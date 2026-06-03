import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import AdminCRM from './components/AdminCRM';

export default function App() {
  // Sync view state with browser path natively
  const [view, setView] = useState<'home' | 'landing' | 'admin'>(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    if (window.location.pathname.startsWith('/curso')) {
      return 'landing';
    }
    return 'home';
  });

  // Listen to browser forward/backward popstate events
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setView('admin');
      } else if (window.location.pathname.startsWith('/curso')) {
        setView('landing');
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = (targetView: 'home' | 'landing' | 'admin') => {
    setView(targetView);
    let targetPath = '/';
    if (targetView === 'admin') {
      targetPath = '/admin';
    } else if (targetView === 'landing') {
      targetPath = '/curso';
    }
    
    // Push history item so browser back/forward buttons continue to work
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0F1C' }}>
      {view === 'home' && (
        <HomePage onNavigateToCurso={() => handleNavigate('landing')} />
      )}
      {view === 'landing' && (
        <LandingPage onNavigateToAdmin={() => handleNavigate('admin')} />
      )}
      {view === 'admin' && (
        <AdminCRM onNavigateToHome={() => handleNavigate('home')} />
      )}
    </div>
  );
}
