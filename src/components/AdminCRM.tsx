import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Scale, 
  Settings as SettingsIcon, 
  CheckCircle, 
  XCircle, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Database, 
  UserPlus, 
  ArrowLeft, 
  CreditCard, 
  KeyRound, 
  ExternalLink 
} from 'lucide-react';
import { Subscriber, Settings } from '../types';

interface AdminCRMProps {
  onNavigateToHome: () => void;
}

export default function AdminCRM({ onNavigateToHome }: AdminCRMProps) {
  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeaderValue, setAuthHeaderValue] = useState<string | null>(() => {
    return localStorage.getItem('mendez_admin_auth') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // CRM Data states
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [crmLoading, setCrmLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // New subscriber form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newMonths, setNewMonths] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDbActive, setIsDbActive] = useState(false);

  // Config settings form state
  const [aliasInput, setAliasInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Check existing auth on load
  useEffect(() => {
    if (authHeaderValue) {
      verifyCredentials(authHeaderValue);
    } else {
      setAuthLoading(false);
    }
  }, [authHeaderValue]);

  const verifyCredentials = (authHeader: string) => {
    setAuthLoading(true);
    setAuthError(null);
    fetch('/api/admin/verify', {
      headers: { 'Authorization': authHeader }
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Credenciales inválidas o expiradas');
        }
        if (!res.ok) {
          throw new Error('Error al verificar autenticación');
        }
        return res.json();
      })
      .then(data => {
        setIsAuthenticated(true);
        setAuthHeaderValue(authHeader);
        localStorage.setItem('mendez_admin_auth', authHeader);
        setIsDbActive(data.isPrismaActive);
        fetchCRMData(authHeader);
      })
      .catch(err => {
        console.error("Auth verification failed:", err);
        setAuthError(err.message);
        setAuthLoading(false);
        setIsAuthenticated(false);
      });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAuthError('Por favor complete todos los campos');
      return;
    }
    const token = btoa(`${username}:${password}`);
    const basicAuth = `Basic ${token}`;
    verifyCredentials(basicAuth);
  };

  const handleLogout = () => {
    localStorage.removeItem('mendez_admin_auth');
    setAuthHeaderValue(null);
    setIsAuthenticated(false);
    setSubscribers([]);
    setUsername('');
    setPassword('');
  };

  const fetchCRMData = (header: string) => {
    setCrmLoading(true);
    
    // Fetch Settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(setData => {
        setSettings(setData);
        setAliasInput(setData.aliasMercadoPago || '');
      })
      .catch(err => console.error("Error loading settings:", err));

    // Fetch Subscribers
    fetch('/api/admin/subscribers', {
      headers: { 'Authorization': header }
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron obtener los suscriptores.');
        return res.json();
      })
      .then(data => {
        setSubscribers(data);
        setCrmLoading(false);
        setAuthLoading(false);
      })
      .catch(err => {
        console.error("Error fetching CRM data:", err);
        setCrmLoading(false);
        setAuthLoading(false);
      });
  };

  const handleToggleStatus = (id: string) => {
    if (!authHeaderValue) return;

    // Optimistic UI Update
    setSubscribers(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' };
      }
      return sub;
    }));

    fetch(`/api/admin/subscribers/${id}/toggle`, {
      method: 'POST',
      headers: { 'Authorization': authHeaderValue }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cambiar de estado');
        return res.json();
      })
      .then(updated => {
        setSubscribers(prev => prev.map(s => s.id === id ? updated : s));
      })
      .catch(err => {
        console.error("Failed toggle status:", err);
        // Revert fetch
        if (authHeaderValue) fetchCRMData(authHeaderValue);
      });
  };

  const handleDeleteSubscriber = (id: string) => {
    if (!authHeaderValue) return;
    if (!confirm('¿Está seguro de que desea eliminar a este suscriptor? Se revocarán todos los accesos.')) return;

    fetch(`/api/admin/subscribers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': authHeaderValue }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        setSubscribers(prev => prev.filter(s => s.id !== id));
      })
      .catch(err => console.error("Error deleting:", err));
  };

  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeaderValue) return;
    setFormError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setFormError('Dirección de correo electrónico inválida');
      return;
    }

    setSaveLoading(true);

    fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeaderValue
      },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        whatsapp: newWhatsapp,
        months: newMonths
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || 'No se pudo añadir'); });
        }
        return res.json();
      })
      .then(created => {
        setSubscribers(prev => [created, ...prev]);
        setIsAddOpen(false);
        setNewName('');
        setNewEmail('');
        setNewWhatsapp('');
        setNewMonths(1);
        setSaveLoading(false);
      })
      .catch(err => {
        setFormError(err.message);
        setSaveLoading(false);
      });
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeaderValue) return;
    setStatusMessage(null);
    setSaveLoading(true);

    fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeaderValue
      },
      body: JSON.stringify({ aliasMercadoPago: aliasInput })
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo guardar la configuración');
        return res.json();
      })
      .then(updated => {
        setSettings(updated);
        setSaveLoading(false);
        setStatusMessage({ text: 'Configuración actualizada con éxito.', type: 'success' });
        setTimeout(() => setStatusMessage(null), 5000);
      })
      .catch(err => {
        setSaveLoading(false);
        setStatusMessage({ text: err.message, type: 'error' });
      });
  };

  // KPI Calculations
  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const inactiveCount = subscribers.filter(s => s.status === 'inactive').length;
  const estimatedRevenue = activeCount * 35000;

  // Render Login state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans relative overflow-hidden" id="login-screen-root">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0,transparent_60%)] pointer-events-none" />
        
        <div className="w-full max-w-md bg-zinc-900 border border-white/5 backdrop-blur-xl rounded-2xl p-8 relative shadow-2xl z-10" id="login-container">
          <div className="text-center mb-8">
            <Scale className="text-amber-500 w-10 h-10 mx-auto mb-4 animate-pulse" />
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white uppercase">Control de Acceso</h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Mentoría Penal Práctica — Dr. Méndez</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Usuario Administrativo</label>
              <input
                type="text"
                required
                disabled={authLoading}
                placeholder="Ej. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Contraseña de Seguridad</label>
              <input
                type="password"
                required
                disabled={authLoading}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-60 transition-all cursor-pointer shadow-lg hover:shadow-amber-500/10"
              id="login-submit-btn"
            >
              {authLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verificando...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 mr-0.5" />
                  <span>Ingresar al Sistema</span>
                </span>
              )}
            </button>
          </form>

          <button
            onClick={onNavigateToHome}
            className="w-full mt-6 inline-flex items-center justify-center px-5 py-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            id="login-cancel-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver a la Escuela Jurídica
          </button>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="admin-root-dashboard">
      
      {/* Admin Nav */}
      <header className="border-b border-white/5 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="text-amber-500 w-6 h-6" />
            <div className="flex items-baseline space-x-2">
              <span className="font-serif tracking-widest text-base font-bold text-white">MÉNDEZ</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">ADMINISTRACIÓN CRM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs px-3 py-1 rounded bg-white/5 border border-white/5 text-slate-400">
              <Database className={`w-3.5 h-3.5 ${isDbActive ? 'text-green-500' : 'text-amber-500'}`} />
              <span>{isDbActive ? 'Neon PostgreSQL Conectado' : 'Base de datos temporal activa'}</span>
            </div>

            <button
              onClick={onNavigateToHome}
              className="text-xs font-semibold hover:text-amber-400 text-slate-300 transition px-3 py-1.5"
            >
              Ver Escuela
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-400 hover:text-red-300 transition-all border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded"
              id="admin-logout-btn"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-10 w-full">
        
        {/* Header Titles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-white/5">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">Panel Académico y de Suscripciones</h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-mono">Control de causa, matriculados y pasarela Mercado Pago</p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/5 active:scale-95"
            id="add-student-btn"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Añadir Matriculado
          </button>
        </div>

        {/* Audit Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="crm-stats">
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Total Matriculados</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-white">{subscribers.length}</span>
              <span className="text-xs text-slate-500 font-mono">Abogados</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Mentorados Activos</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-green-400">{activeCount}</span>
              <span className="text-xs text-slate-500 font-mono">En Curso</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Accesos Suspendidos</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-red-400">{inactiveCount}</span>
              <span className="text-xs text-slate-500 font-mono">Inactivos</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Recaudación Mensual</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-amber-400">AR${estimatedRevenue.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-mono">Est.</span>
            </div>
          </div>
        </div>

        {/* Content Layout Grid (Table + Configuration Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel - Table list */}
          <div className="lg:col-span-8 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl" id="table-card">
            
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-zinc-900">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Planilla de Alumnos Vip</h3>
              
              <button 
                onClick={() => fetchCRMData(authHeaderValue!)}
                disabled={crmLoading}
                className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-30"
              >
                <RefreshCw className={`w-4 h-4 ${crmLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {crmLoading ? (
              <div className="p-20 text-center text-slate-400 text-sm">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-4" />
                Cargando registros académicos...
              </div>
            ) : subscribers.length === 0 ? (
              <div className="p-20 text-center text-slate-500 text-sm">
                No hay matriculados con suscripciones activas registradas. Instale nuevos alumnos usando el botón 'Añadir Matriculado'.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-xs tracking-wider uppercase font-mono text-slate-400">
                      <th className="px-6 py-4">Socio Mentee</th>
                      <th className="px-6 py-4">Contacto Directo</th>
                      <th className="px-6 py-4">Vigencia Académica</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {subscribers.map((sub) => {
                      const start = new Date(sub.startDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const end = sub.endDate 
                        ? new Date(sub.endDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                        : 'Indefinido';

                      return (
                        <tr key={sub.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="px-6 py-4 font-serif text-sm font-semibold text-white">
                            {sub.name}
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <p className="font-mono text-slate-300">{sub.email}</p>
                            <a 
                              href={`https://wa.me/${sub.whatsapp.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-amber-500 hover:underline flex items-center"
                            >
                              <span>{sub.whatsapp}</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </td>
                          <td className="px-6 py-4 space-y-0.5">
                            <p className="text-slate-400">Inicio: {start}</p>
                            <p className="text-[11px] text-slate-500 font-mono">Fin: {end}</p>
                          </td>
                          <td className="px-6 py-4">
                            {sub.status === 'active' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="w-1 h-1 rounded-full bg-green-400 mr-1.5" />
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="w-1 h-1 rounded-full bg-red-400 mr-1.5" />
                                Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleToggleStatus(sub.id)}
                                title="Cambiar Estado del Alumno"
                                className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase border text-slate-300 hover:text-white transition-colors duration-200 ${
                                  sub.status === 'active' 
                                    ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700' 
                                    : 'bg-green-950/40 border-green-800/50 hover:bg-green-900/50 text-green-300'
                                }`}
                              >
                                {sub.status === 'active' ? 'Suspender' : 'Habilitar'}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteSubscriber(sub.id)}
                                title="Dar de baja de la escuela"
                                className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right panel - Config settings */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl" id="config-card">
              <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-white/5">
                <SettingsIcon className="text-amber-500 w-5 h-5 animate-spin-slow" />
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">Pasarela Mercado Pago</h3>
              </div>

              {statusMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold mb-6 text-center border ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                    : 'bg-red-500/10 border-red-500/25 text-red-500'
                }`}>
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Alias Mercado Pago AR</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. mentoriamendez.mp"
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-sans">
                    Modificar este alias de forma inmediata cambiará el vínculo del botón "Suscribirse" en la Landing Page pública a: <br />
                    <code className="text-amber-500/90 font-mono text-[9px] mt-1 block select-all">
                      https://link.mercadopago.com.ar/{aliasInput || '[alias]'}
                    </code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 transition active:scale-95 shadow-md shadow-amber-500/5 cursor-pointer"
                  id="settings-save-btn"
                >
                  {saveLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Guardar Alias</span>
                  )}
                </button>
              </form>

              {settings && (
                <div className="mt-8 pt-6 border-t border-white/5 space-y-3.5 text-[11px] text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Configuración ID</span>
                    <span className="font-mono text-white text-[10px]">{settings.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vínculo activo</span>
                    <a 
                      href={`https://link.mercadopago.com.ar/${settings.aliasMercadoPago}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-amber-400 hover:underline inline-flex items-center"
                    >
                      <span>Probar link</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action card guide */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10">
              <h4 className="font-serif text-sm font-semibold text-amber-400 mb-2">Procedimiento Excarcelación</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toda alteración en el módulo o suspensión de matriculados afectará sus credenciales de ingreso al chat grupal de WhatsApp instantáneamente. Respete la privacidad y el ejercicio del derecho.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Add mentee modal popup panel */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/75 z-50 backdrop-blur-sm flex items-center justify-center p-6" id="add-student-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-8 relative shadow-2xl"
              id="add-student-modal animate"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Añadir Profesional Mentee</h3>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5"
                >
                  ✖
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-lg text-center font-semibold mb-6">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddSubscriberSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Nombre del Letrado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dra. Camila Martínez"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. camila@estudio.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">WhatsApp (Con Código de País)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. +549112345678"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Plazo Suscripción</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 6, 12].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setNewMonths(m)}
                        className={`py-2 px-3 border rounded-xl text-xs font-mono transition-all ${
                          newMonths === m 
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' 
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-slate-300'
                        }`}
                      >
                        {m} {m === 1 ? 'Mes' : 'Meses'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="py-3 px-5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all font-serif uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-serif uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {saveLoading ? 'Procesando...' : 'Altas del Alumno'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[11px] text-slate-500">
        &copy; {new Date().getFullYear()} Mentoría Penal Práctica — Panel CRM Privado del Dr. Luis Ángel Méndez. Acceso Protegido por Ley Penal.
      </footer>

    </div>
  );
}
