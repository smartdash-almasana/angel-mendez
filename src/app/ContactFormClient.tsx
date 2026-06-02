'use client';

import React, { useState } from 'react';

export default function ContactFormClient() {
  const [contactName, setContactName] = useState('');
  const [contactQuery, setContactQuery] = useState('');

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hola Dr. Luis Ángel Méndez. Mi nombre es ${contactName}. Tengo una consulta sobre el Curso de Capacitación Penal Práctica: ${contactQuery}`);
    window.open(`https://wa.me/5491138641863?text=${text}`, '_blank');
  };

  return (
    <form onSubmit={handleConsultationSubmit} className="p-8 rounded-2xl bg-zinc-950 border border-slate-800/80 flex flex-col space-y-6 shadow-xl">
      <h4 className="font-serif text-lg font-bold text-white pb-3 border-b border-slate-800/55">Contacto de Consulta Inmediata</h4>
      
      <div>
        <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2 font-mono">Nombre Completo o Matrícula Profesional</label>
        <input 
          type="text" 
          required
          placeholder="Ej. Dra. Florencia Bianchi" 
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.02] border border-slate-800/80 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all focus:bg-white/[0.04]"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2 font-mono">Asunto / Consulta Académica o de Causas</label>
        <textarea 
          required
          rows={4}
          placeholder="Escribí acerca de tus inquietudes, casos pendientes a revisar, o compatibilidad para las derivaciones..." 
          value={contactQuery}
          onChange={(e) => setContactQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.02] border border-slate-800/80 rounded-xl focus:border-amber-500/50 outline-none text-sm text-white transition-all focus:bg-white/[0.04] resize-none"
        />
      </div>

      <button 
        type="submit"
        className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-[0.98] transition-all cursor-pointer shadow-lg hover:shadow-amber-500/10"
      >
        <span>Enviar Consulta por WhatsApp Directo</span>
        {/* MessageCircle icon SVG */}
        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </form>
  );
}
