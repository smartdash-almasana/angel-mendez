'use client';

import React, { useState, useTransition } from 'react';
import { 
  toggleSubscriber, 
  deleteSubscriber, 
  updateAlias, 
  addSubscriber 
} from './actions';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
}

interface Settings {
  id: string;
  aliasMercadoPago: string;
}

interface AdminDashboardClientProps {
  initialSubscribers: Subscriber[];
  initialSettings: Settings | null;
}

export default function AdminDashboardClient({ 
  initialSubscribers, 
  initialSettings 
}: AdminDashboardClientProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [settings, setSettings] = useState<Settings | null>(initialSettings);
  
  // Form states
  const [aliasInput, setAliasInput] = useState(settings?.aliasMercadoPago || '');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newMonths, setNewMonths] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string) => {
    startTransition(async () => {
      // Optimistic update
      setSubscribers(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
        }
        return s;
      }));

      const res = await toggleSubscriber(id);
      if (!res.success) {
        // Revert
        setSubscribers(prev => prev.map(s => {
          if (s.id === id) {
            return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
          }
          return s;
        }));
        alert("Error al cambiar el estado: " + res.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar a este suscriptor?')) return;
    
    startTransition(async () => {
      const original = [...subscribers];
      setSubscribers(prev => prev.filter(s => s.id !== id));

      const res = await deleteSubscriber(id);
      if (!res.success) {
        setSubscribers(original);
        alert("Error al eliminar: " + res.error);
      }
    });
  };

  const handleUpdateAlias = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await updateAlias(aliasInput);
      if (res.success) {
        setSuccessMsg("Configuración del alias de Mercado Pago guardada correctamente.");
        setSettings(prev => prev ? { ...prev, aliasMercadoPago: aliasInput } : { id: 'global_config', aliasMercadoPago: aliasInput });
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg("Error al guardar alias: " + res.error);
      }
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newName || !newEmail || !newWhatsapp) {
      setErrorMsg("Por favor, complete todos los campos obligatorios.");
      return;
    }

    startTransition(async () => {
      const res = await addSubscriber({
        name: newName,
        email: newEmail,
        whatsapp: newWhatsapp,
        months: newMonths
      });

      if (res.success) {
        // Clean fields
        setNewName('');
        setNewEmail('');
        setNewWhatsapp('');
        setNewMonths(1);
        setIsAddOpen(false);
        setSuccessMsg("Suscriptor matriculado exitosamente.");
        setTimeout(() => setSuccessMsg(null), 4000);
        
        // Refresh local subscribers list
        window.location.reload();
      } else {
        setErrorMsg("Error al añadir suscriptor: " + res.error);
      }
    });
  };

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const inactiveCount = subscribers.filter(s => s.status === 'inactive').length;
  const estimatedRevenue = activeCount * 35000;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="admin-root-dashboard">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-amber-500">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="14" y1="2" x2="14" y2="26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="4" y1="6" x2="24" y2="6" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="14" cy="6" r="1.5" fill="#D4AF37"/>
              </svg>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif tracking-widest text-base font-bold text-white">MÉNDEZ</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">ADMINISTRACIÓN CRM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="/"
              className="text-xs font-semibold hover:text-amber-400 text-slate-300 transition px-3 py-1.5"
            >
              Ver Web Pública
            </a>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-10 w-full">
        
        {/* Messages */}
        {successMsg && (
          <div className="p-4 bg-green-500/10 border border-green-500/25 text-green-400 text-sm rounded-lg text-center font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Action Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-white/5">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">Panel de Control CRM</h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-mono">Control de causa, matriculados y pasarela Mercado Pago</p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg active:scale-95 cursor-pointer"
          >
            Añadir Matriculado
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Total Matriculados</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-white">{subscribers.length}</span>
              <span className="text-xs text-slate-500 font-mono">Letrados</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Activos</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-green-400">{activeCount}</span>
              <span className="text-xs text-slate-500 font-mono">Vigentes</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Inactivos</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-red-400">{inactiveCount}</span>
              <span className="text-xs text-slate-500 font-mono">Bajas</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Estimación Mensual</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-serif font-bold text-amber-400">AR${estimatedRevenue.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-mono">Bruto</span>
            </div>
          </div>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table */}
          <div className="lg:col-span-8 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-5 border-b border-white/5 bg-zinc-900">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Planilla de Alumnos VIP</h3>
            </div>

            {subscribers.length === 0 ? (
              <div className="p-20 text-center text-slate-500 text-sm">
                No hay matriculados con suscripciones activas registradas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-xs tracking-wider uppercase font-mono text-slate-400">
                      <th className="px-6 py-4">Matriculado</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4">Vigencia</th>
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
                              className="text-amber-500 hover:underline inline-flex items-center"
                            >
                              <span>{sub.whatsapp}</span>
                            </a>
                          </td>
                          <td className="px-6 py-4 space-y-0.5">
                            <p className="text-slate-400">Inicio: {start}</p>
                            <p className="text-[11px] text-slate-500 font-mono">Fin: {end}</p>
                          </td>
                          <td className="px-6 py-4">
                            {sub.status === 'active' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5" />
                                Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleToggle(sub.id)}
                                disabled={isPending}
                                className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase border text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer ${
                                  sub.status === 'active' 
                                    ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700' 
                                    : 'bg-green-950/40 border-green-800/50 hover:bg-green-900/50 text-green-300'
                                }`}
                              >
                                {sub.status === 'active' ? 'Suspender' : 'Habilitar'}
                              </button>
                              
                              <button
                                onClick={() => handleDelete(sub.id)}
                                disabled={isPending}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded transition cursor-pointer"
                              >
                                Eliminar
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

          {/* Config sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl">
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/5">Pasarela Mercado Pago</h3>

              <form onSubmit={handleUpdateAlias} className="space-y-6">
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
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Cambiar este alias modificará automáticamente el vínculo del botón "Suscribirse" en la Landing Page pública a: <br />
                    <code className="text-amber-400 font-mono text-[9px] mt-1 block select-all">
                      https://link.mercadopago.com.ar/{aliasInput || '[alias]'}
                    </code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Add Matriculado Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-8 relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Añadir Profesional Mentee</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-6">
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
                <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">WhatsApp</label>
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
                <label className="block text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-2 font-mono">Suscripción Inicial</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setNewMonths(m)}
                      className={`py-2 px-3 border rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        newMonths === m 
                          ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' 
                          : 'border-white/10 bg-white/[0.02] text-slate-350 hover:bg-white/[0.04]'
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
                  className="py-3 px-5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all font-serif uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-serif uppercase tracking-wider transition-all cursor-pointer"
                >
                  Confirmar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-[11px] text-slate-500">
        &copy; {new Date().getFullYear()} Mentoría Penal Práctica — Panel CRM Privado.
      </footer>
    </div>
  );
}
