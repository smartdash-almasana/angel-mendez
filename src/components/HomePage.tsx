import React, { useEffect, useState } from 'react';
import { Settings } from '../types';

interface HomePageProps {
  onNavigateToCurso: () => void;
}

export default function HomePage({ onNavigateToCurso }: HomePageProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
        setLoading(false);
      });
  }, []);

  const getCtaLink = () => {
    if (settings?.aliasMercadoPago && settings.aliasMercadoPago.trim() !== '') {
      return `https://link.mercadopago.com.ar/${settings.aliasMercadoPago.trim()}`;
    }
    return 'https://wa.me/5491138641863?text=Quiero%20inscribirme%20en%20el%20Curso%20Penal%20Pr%C3%A1ctico';
  };

  const ctaLink = getCtaLink();

  return (
    <div className="bg-midnight text-text-primary min-h-screen relative overflow-x-hidden font-sans">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true"></div>

      {/* Header */}
      <header role="banner" className="glass fixed top-0 left-0 right-0 z-50 transition-all duration-300" id="main-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Branding */}
            <a href="#inicio" className="flex items-center gap-3 group" aria-label="Dr. Luis Ángel Méndez - Inicio">
              <div className="text-gold opacity-80 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="14" y1="2" x2="14" y2="26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4" y1="6" x2="24" y2="6" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 6 L1 13 Q4 16 7 13 Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  <path d="M24 6 L21 13 Q24 16 27 13 Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  <circle cx="14" cy="6" r="1.5" fill="#D4AF37"/>
                  <line x1="10" y1="26" x2="18" y2="26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-serif text-base sm:text-lg leading-tight text-text-primary tracking-wide">Dr. Luis Ángel Méndez</p>
                <p className="text-xs text-text-muted tracking-widest uppercase font-sans font-medium">Derecho Penal</p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
              <button onClick={onNavigateToCurso} className="text-sm text-amber-500 hover:text-gold transition-colors duration-200 tracking-wide font-bold cursor-pointer">
                Programa Completo
              </button>
              <a href="#beneficios" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Beneficios</a>
              <a href="#autoridad" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Experiencia</a>
              <a href="#contacto" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Contacto</a>
              <a href="/admin" className="text-sm text-text-muted hover:text-gold transition-colors duration-200 tracking-wide font-medium">Acceso Staff</a>
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5 py-2 text-sm" aria-label="Inscribite ahora en el Curso Penal Práctico">
                Inscribite Ahora
              </a>
            </nav>

            {/* Mobile menu button */}
            <button 
              id="menu-toggle" 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-text-secondary hover:text-gold transition-colors p-2" 
              aria-label="Abrir menú" 
              aria-expanded={menuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`transition-all duration-300 overflow-hidden md:hidden ${
              menuOpen ? 'max-h-[300px] opacity-100 pb-5 pt-4 border-t border-white/5' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setMenuOpen(false); onNavigateToCurso(); }}
                className="text-left text-amber-500 hover:text-gold transition-colors text-sm font-bold tracking-wide"
              >
                Programa Completo
              </button>
              <a href="#beneficios" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>Beneficios</a>
              <a href="#autoridad" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>Experiencia</a>
              <a href="#contacto" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>Contacto</a>
              <a href="/admin" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={() => setMenuOpen(false)}>Acceso Staff</a>
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5 py-2.5 text-sm text-center w-full" onClick={() => setMenuOpen(false)}>
                Inscribite Ahora
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
           HERO SECTION
      ============================================================ */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        <div className="absolute inset-0 z-0">
          <img src="/am1.jpg" alt="Dr. Luis Ángel Méndez en su despacho" className="w-full h-full object-cover object-center" />
          <div className="hero-overlay absolute inset-0"></div>
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-midnight to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="section-line"></div>
              <span className="text-gold text-xs sm:text-sm font-sans font-bold tracking-widest uppercase">Curso Penal Práctico</span>
            </div>

            <h1 className="font-sans font-black leading-none tracking-tight mb-5 sm:mb-6" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}>
              DEJÁ DE<br />
              <span className="text-gold-gradient">LITIGAR EN</span><br />
              SOLEDAD
            </h1>

            <p className="font-serif italic mb-6 sm:mb-8" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#D4AF37' }}>
              Curso de Capacitación Penal Práctica: De la teoría a la trinchera
            </p>

            <p className="text-text-secondary font-sans font-light leading-relaxed mb-8 sm:mb-10 max-w-xl" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Tu primer caso penal no tiene por qué ser una batalla solitaria. Seguridad jurídica y respaldo técnico para el abogado que recién empieza.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onNavigateToCurso}
                className="btn-primary px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VER CAPACITACIÓN Y PROGRAMA</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </button>
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="btn-ghost px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2">
                <span>Inscribirse Directo</span>
              </a>
            </div>

            <div className="mt-10 sm:mt-12 flex items-center gap-4">
              <p className="text-xs sm:text-sm text-text-muted font-sans">
                <span className="text-gold font-semibold">Cupos limitados</span> — Calidad garantizada de seguimiento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           STATEMENT
      ============================================================ */}
      <section className="relative py-16 sm:py-20 bg-gradient-section overflow-hidden" aria-label="Declaración de valor">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="ornament-line">
            <blockquote className="editorial-quote text-center px-4 sm:px-8">
              <p className="font-serif italic text-text-primary" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', lineHeight: 1.7 }}>
                "La diferencia entre un abogado que fracasa en su primer caso y uno que triunfa no es el talento —<br className="hidden sm:block" />
                <span className="text-gold">es el respaldo que tiene detrás."</span>
              </p>
              <footer className="mt-4 text-text-muted text-sm font-sans tracking-wide">— Dr. Luis Ángel Méndez</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ============================================================
           BENEFITS
      ============================================================ */}
      <section id="beneficios" className="py-20 sm:py-28 lg:py-36 bg-midnight" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="section-line"></div>
              <span className="text-gold text-xs font-sans font-bold tracking-widest uppercase">Ecosistema de Defensa</span>
            </div>
            <h2 id="benefits-heading" className="font-sans font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
              Todo lo que necesitás desde el inicio<br />
              <span className="text-gold-gradient">de la defensa en tu primer día de trabajo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <article className="benefit-card p-7 sm:p-8" aria-label="Acompañamiento Individual">
              <h3 className="font-sans font-bold text-text-primary mb-2 text-lg">Acompañamiento Individual</h3>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm">
                Curso y seguimiento personalizado de tus casos reales. No sos un número — sos un profesional en formación con respaldo directo del Dr. Méndez.
              </p>
            </article>

            <article className="benefit-card p-7 sm:p-8" aria-label="Canal de Consultas 24/7">
              <h3 className="font-sans font-bold text-text-primary mb-2 text-lg">Canal de Consultas 24/7</h3>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm">
                Soporte constante ante dudas procesales de urgencia. Porque en derecho penal, los plazos no esperan y las decisiones se toman en tiempo real.
              </p>
            </article>

            <article className="benefit-card p-7 sm:p-8" aria-label="Formación Práctica">
              <h3 className="font-sans font-bold text-text-primary mb-2 text-lg">Formación Práctica</h3>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm">
                Herramientas concretas para la defensa efectiva desde el inicio. Técnicas procesales, estrategia de audiencias y manejo de prueba en casos reales.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
           AUTHORITY SECTION
      ============================================================ */}
      <section id="autoridad" className="py-20 sm:py-28 lg:py-36 bg-gradient-section overflow-hidden" aria-labelledby="authority-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="editorial-frame relative z-10">
                <img src="/am2.jpg" alt="Dr. Luis Ángel Méndez — Abogado Penalista" className="w-full max-w-sm mx-auto lg:max-w-none object-cover rounded-sm shadow-elevation-3" style={{ aspectRatio: '3/4', objectPosition: 'top' }} />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="section-line"></div>
                <span className="text-gold text-xs font-sans font-bold tracking-widest uppercase">Autoridad & Trayectoria</span>
              </div>

              <h2 id="authority-heading" className="font-sans font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                La experiencia que<br />
                <span className="text-gold-gradient">marca la diferencia</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="stat-card p-5">
                  <div className="authority-number">+20</div>
                  <p className="text-text-secondary text-sm font-sans font-light mt-1">años de experiencia en tribunales</p>
                </div>
                <div className="stat-card p-5">
                  <div className="authority-number" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>100%</div>
                  <p className="text-text-secondary text-sm font-sans font-light mt-1">dedicación al derecho penal argentino</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           CTA SECTION
      ============================================================ */}
      <section id="contacto" className="relative py-24 sm:py-32 overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 z-0">
          <img src="/am3.jpg" alt="Dr. Luis Ángel Méndez — Curso Penal Práctico" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,28,0.96) 0%, rgba(10,15,28,0.85) 50%, rgba(10,15,28,0.95) 100%)' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 id="cta-heading" className="font-sans font-black leading-tight mb-5 text-4xl sm:text-5xl">
            EMPEZÁ TU<br />
            <span className="text-gold-gradient">CURSO HOY</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button onClick={onNavigateToCurso} className="btn-primary px-10 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-3 cursor-pointer">
              <span>VER PROGRAMA COMPLETO</span>
            </button>
            <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="btn-ghost px-10 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2">
              <span>Inscribirse Directo</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" className="bg-charcoal border-t border-white/5 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-serif text-sm text-text-muted">Dr. Luis Ángel Méndez</p>
            <a href="/admin" className="text-text-muted hover:text-gold text-xs transition-colors duration-250 font-mono uppercase tracking-widest">
              Acceso Staff
            </a>
            <p className="text-text-muted text-xs">
              © {new Date().getFullYear()} Dr. Luis Ángel Méndez. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
