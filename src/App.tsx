import { useEffect, useState } from 'react';
import AdminCRM from './components/AdminCRM';

type View = 'home' | 'admin';

export default function App() {
  const [view, setView] = useState<View>(() =>
    window.location.pathname.startsWith('/admin') ? 'admin' : 'home'
  );

  useEffect(() => {
    const handlePopState = () => {
      setView(window.location.pathname.startsWith('/admin') ? 'admin' : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToHome = () => {
    setView('home');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  if (view === 'admin') {
    return <AdminCRM onNavigateToHome={navigateToHome} />;
  }

  return (
    <iframe
      title="Dr. Luis Ángel Méndez — Curso Penal Práctico"
      src="/landing.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 0,
        display: 'block',
        backgroundColor: '#0A0F1C',
      }}
    />
  );
}
