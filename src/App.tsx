import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminCRM from './components/AdminCRM';

export default function App() {
  // Sync view state with browser path natively
  const [view, setView] = useState<'landing' | 'admin'>(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'landing';
  });

  // Listen to browser forward/backward popstate events
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setView('admin');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = (targetView: 'landing' | 'admin') => {
    setView(targetView);
    const targetPath = targetView === 'admin' ? '/admin' : '/';
    // Push history item so browser back/forward buttons continue to work
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {view === 'landing' ? (
        <LandingPage onNavigateToAdmin={() => handleNavigate('admin')} />
      ) : (
        <AdminCRM onNavigateToHome={() => handleNavigate('landing')} />
      )}
    </div>
  );
}
