import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  Users, 
  MessageCircle, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  FileText, 
  Award, 
  Lock,
  Phone,
  Mail,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Settings } from '../types';

interface LandingPageProps {
  onNavigateToAdmin: () => void;
}

export default function LandingPage({ onNavigateToAdmin }: LandingPageProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for WhatsApp redirect
  const [contactName, setContactName] = useState('');
  const [contactQuery, setContactQuery] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Error al conectar con el servidor.');
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching settings:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getSubLink = () => {
    if (settings?.aliasMercadoPago) {
      return `https://link.mercadopago.com.ar/${settings.aliasMercadoPago}`;
    }
    // Fallback to inquiry support WhatsApp directly
    return `https://wa.me/5491122334455?text=Hola,%20quiero%20inscribirme%20a%20la%20curso de capacitación%20práctica%20del%20Dr.%20Méndez`;
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hola Dr. Luis Ángel Méndez. Mi nombre es ${contactName}. Tengo una consulta sobre la Curso de Capacitación Penal Práctica: ${contactQuery}`);
    window.open(`https://wa.me/5491122334455?text=${text}`, '_blank');
  };

  const pillars = [
    {
      icon: <Scale className="w-6 h-6 text-amber-400" id="icon-scale-1" />,
      title: "Clínica de Casos Vivos y Reales",
      desc: "El aprendizaje no es teórico; se discuten, planifican y supervisan expedientes y casos reales aportados por los propios alumnos, ofreciendo coaching personalizado para audiencias y escritos."
    },
    {
      icon: <Users className="w-6 h-6 text-amber-400" id="icon-users-1" />,
      title: "Comunidad VIP y Soporte Urgente",
      desc: "Acceso directo y continuo a un grupo exclusivo de WhatsApp para evacuar dudas procesales críticas antes de ingresar a un estrado o presentar una defensa de urgencia."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-amber-400" id="icon-book-1" />,
      title: "Especializaciones de Alta Demanda (2026)",
      desc: "Entrenamiento intensivo en litigio práctico adaptado al marco legal vigente: Litigio estratégico bajo la nueva Ley Penal Juvenil Argentina, Tácticas avanzadas en Habeas Data, y Limpieza Legal de Perfil Crediticio (Veraz/Nosis/BCRA)."
    }
  ];

  const modules = [
    { num: "01", name: "Análisis Integral del Caso y Carpeta Técnica", duration: "Módulo Inicial" },
    { num: "02", name: "Simulación de Audiencias Orales de Excarcelación", duration: "Práctica en Estraño" },
    { num: "03", name: "Estrategias de Litigio Penal Juvenil Argentino", duration: "Leyes Vigentes" },
    { num: "04", name: "Habeas Data y Reclamos ante Veraz, Nosis y BCRA", duration: "Sustanciación" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-400 overflow-x-hidden" id="landing-root">
      
      {/* Upper Premium Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300" id="landing-header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center shadow-lg shadow-amber-500/15">
              <span className="text-slate-950 font-bold text-xl font-serif">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-wide text-lg font-bold text-amber-500" id="mendez-title">
                Méndez <span className="text-slate-400 font-light font-sans text-sm tracking-normal">Legal</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-slate-500 uppercase font-mono">Curso de Capacitación Penal Práctica</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-400 uppercase tracking-widest" id="landing-nav-links">
            <a href="#pilares" className="hover:text-amber-400 transition-colors tracking-widest text-[11px]">Ejes Prácticos</a>
            <a href="#programa" className="hover:text-amber-400 transition-colors tracking-widest text-[11px]">Especialidades</a>
            <a href="#estrat" className="hover:text-amber-400 transition-colors tracking-widest text-[11px]">Casos Reales</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors tracking-widest text-[11px]">Mensaje Directo</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateToAdmin}
              className="text-[10px] uppercase tracking-widest hover:text-amber-405 hover:bg-white/5 transition-all px-4 py-2 border border-slate-800/80 hover:border-amber-500/30 rounded bg-white/[0.02] text-slate-400 cursor-pointer"
              id="admin-portal-btn"
            >
              Control Interno
            </button>
            <a
              href="#suscripcion"
              className="hidden sm:inline-flex text-[10px] uppercase tracking-widest bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/10 hover:bg-amber-400 hover:shadow-amber-500/20 active:scale-95 transition-all duration-200"
              id="sticky-subscribe-btn"
            >
              Inscribirse
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex flex-col items-center justify-center border-b border-slate-800/50 overflow-hidden" id="hero-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-2" />
            INSCRIBIENDO AL CICLO PRACTICO 2026
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-6 leading-[1.1]"
            id="hero-heading"
          >
            Curso de Capacitación Penal Práctica <br />
            <span className="text-amber-500 italic font-normal">Dr. Ángel Méndez</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
            id="hero-subtext"
          >
            De la teoría a los tribunales. Transformá la inseguridad del abogado recién graduado en la pericia de un experto. Aprendé a defender en la trinchera jurídica y a resolver casos reales desde el primer día bajo la supervisión de un penalista senior.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            id="hero-actions"
          >
            {loading ? (
              <div className="px-8 py-4 bg-zinc-900 border border-white/5 rounded-full text-slate-400 text-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                Cargando pasarela de pago...
              </div>
            ) : (
              <a
                href={getSubLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/20 active:scale-95 duration-200 group cursor-pointer"
                id="main-cta-btn"
              >
                <span>Suscribirse a la Curso de Capacitación</span>
                <ArrowRight className="ml-2 w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            <a 
              href="#pilares"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-sm tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
              id="secondary-cta-btn"
            >
              Ver Propuesta de Valor
            </a>
          </motion.div>

          {/* Quick trust metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-white/5 text-center"
            id="trust-metrics"
          >
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-amber-500">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">Litigio Práctico</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-white">Clínica</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">De Casos Vivos</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-white">VIP</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">Soporte WhatsApp</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-amber-500">2026</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">Leyes Actualizadas</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section with Glassmorphism Cards */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="pilares">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase font-bold">METODOLOGÍA DE ALTO IMPACTO</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 text-white">Ejes Clave de la Curso de Capacitación</h2>
          <span className="w-16 h-0.5 bg-amber-500 block mx-auto mb-6" />
          <p className="text-slate-400 text-sm sm:text-base">
            Diseñamos un método dinámico enfocado en entregarte las herramientas técnicas que el ejercicio del Derecho Penal en Argentina exige para destacar en Tribunales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="benefits-grid">
          {pillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-md flex flex-col justify-between"
              id={`benefit-card-${idx}`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-4 text-white leading-snug">{pillar.title}</h3>
                <p className="text-slate-450 text-slate-405 text-sm leading-relaxed text-slate-420">{pillar.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs text-amber-500 font-semibold tracking-wider uppercase">
                <span>Trinchera Profesional</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Program content Syllabi */}
      <section className="py-24 bg-zinc-950/30 border-y border-slate-800/50 relative overflow-hidden" id="programa">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.02)_0,transparent_55%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-4 lg:pr-6">
              <span className="font-serif text-amber-500 text-sm font-bold tracking-widest uppercase block mb-3">PROGRAMA ACADÉMICO</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-white leading-tight">Capacitación Práctica en Procesos de Complejidad</h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                Formamos defensores altamente técnicos e independientes. Revisarás en profundidad los flujos procesales, la estructura técnica de apelaciones, las nuevas normativas de defensa juvenil y contenciosos comerciales.
              </p>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-350 leading-normal font-sans">
                  <strong className="text-white block mb-0.5">Certificado por Letrado</strong>
                  La finalización de los módulos te da derecho a una certificación honorífica de postgrado emitida por el Dr. Ángel Méndez.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4" id="modules-grid">
              {modules.map((m, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white/[0.01] border border-slate-800/80 hover:border-amber-500/20 hover:bg-white/[0.02] transition-all flex flex-col justify-between h-44 group">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600 font-mono text-xs tracking-widest uppercase font-bold group-hover:text-amber-500 transition-colors">PLENO {m.num}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{m.duration}</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">{m.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-2 font-mono">Estudio Jurídico Dr. Méndez & Soc.</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Strategy and real testimonial / Brand philosophy */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center" id="estrat">
        <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.01] to-transparent border border-slate-800/80 backdrop-blur-lg relative">
          <span className="text-slate-800 font-serif text-9xl absolute -top-4 left-6 pointer-events-none select-none">“</span>
          
          <p className="font-serif text-lg md:text-xl text-slate-350 relative z-10 leading-relaxed mb-8 italic">
            "En el Derecho Penal, el mínimo error procesal le cuesta la libertad a tu cliente. La curso de capacitación práctica del Dr. Méndez provee ese entrenamiento bajo fuego que la universidad nunca te dió: aprender a reaccionar, recusar bases fiscales y consolidar una teoría del caso indestructible en audiencias orales reales."
          </p>

          <div className="mt-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-serif font-bold text-lg rounded-full mb-3 shadow">
              AM
            </div>
            <h4 className="font-serif text-base font-semibold text-white">Dr. Ángel Méndez</h4>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-1 font-mono">Socio Fundador — Especialista en Litigación Penal</p>
          </div>
        </div>
      </section>

      {/* Subscribe/Checkout block with MP link or WhatsApp fallback */}
      <section className="py-24 border-t border-slate-800/50 relative" id="suscripcion">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.01] to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-8 md:p-12 rounded-3xl bg-zinc-900 border border-amber-500/20 relative shadow-2xl">
            <div className="absolute top-0 right-12 transform -translate-y-1/2">
              <span className="px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest bg-amber-500 text-slate-950 rounded-full shadow-lg">ACCESO MENSUAL COLECTIVO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-7">
                <span className="text-xs font-bold font-mono tracking-widest text-amber-500 uppercase block mb-2">ADMISIÓN DE ABOGADOS MATRICULADOS</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">Suscripción Regular Mensual</h3>
                
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Clases magistrales de Clínica de Casos recurrentes</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Espacios de evacuación de dudas inmediatas vía WhatsApp</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Soporte prioritario y plantillas de impugnaciones penales</span>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-5 bg-black/45 border border-slate-800/70 p-6 rounded-2xl text-center">
                <span className="text-slate-500 text-xs tracking-widest uppercase block mb-1">PROGRAMA COMPLETO</span>
                <p className="text-4xl font-serif font-bold text-white mb-2">AR$ 35.000<span className="text-sm font-sans text-slate-400 font-normal"> / mes</span></p>
                <p className="text-[11px] text-slate-550 mb-6 leading-relaxed">Alta segura automática desde la pasarela nacional homologada de Mercado Pago.</p>
                
                {loading ? (
                  <div className="w-full bg-zinc-900 py-3 rounded-xl border border-white/5 text-slate-400 text-sm flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Cargando link...
                  </div>
                ) : (
                  <a
                    href={getSubLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
                  >
                    <span>Suscribirse a la Curso de Capacitación</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </a>
                )}
                
                {!settings?.aliasMercadoPago && (
                  <p className="text-[10px] text-amber-500/80 mt-2 font-mono">Modo seguro: redirección WhatsApp de inscripción inmediata activa.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Inquiry contact form */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-slate-800/50" id="contacto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 p-8 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="font-serif text-amber-500 text-sm font-bold tracking-widest uppercase block mb-2">ESTUDIO CENTRAL</span>
              <h3 className="font-serif text-2xl font-bold text-white mb-6">Asesoramiento Directo Personalizado</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Dejale una consulta directa sobre las especialidades 2026 o el plan formativo al equipo de coordinación del Dr. Luis Ángel Méndez para resolver tu admisión.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-400 pt-6 border-t border-slate-800/50">
              <div className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <span>+54 9 11 2233-4455 (WhatsApp Consultas)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <span>consultas@drluisangelmendez.com.ar</span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <span>Matrículas Certificadas & Control de Privacidad Homologado</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
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
                <MessageCircle className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* High-End Footer matching the Elegant Dark scheme */}
      <footer className="mt-auto border-t border-slate-800/50 bg-slate-950 py-12 text-slate-600 text-[10px] tracking-widest uppercase font-mono" id="landing-footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Scale className="text-amber-500/50 w-4.5 h-4.5" />
            <span className="font-serif tracking-widest text-xs text-slate-400">ESTUDIO DR. ÁNGEL MÉNDEZ</span>
          </div>

          <p className="text-center md:text-left leading-relaxed max-w-md text-[9px] text-slate-500">
            &copy; {new Date().getFullYear()} Curso de Capacitación Penal Práctica. Todos los derechos reservados. <br />
            Litigación penal y asesoramiento de alta complejidad. Acceso restringido • Servidores NeonDB.
          </p>

          <div className="flex space-x-6">
            <a href="#contacto" className="hover:text-amber-400 transition-colors text-[9px]">Código Penal Arg.</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors text-[9px]">Ética de Foro</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
