import React from 'react';
import { PrismaClient } from '@prisma/client';
import HeaderClient from './HeaderClient';
import ContactFormClient from './ContactFormClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings() {
  const prisma = new PrismaClient();
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global_config' }
    });
    return settings;
  } catch (error) {
    console.error("Prisma settings retrieve error:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function Page() {
  const settings = await getSettings();
  
  // Dynamic CTA Link logic
  const getCtaLink = () => {
    if (settings?.aliasMercadoPago && settings.aliasMercadoPago.trim() !== '') {
      return `https://link.mercadopago.com.ar/${settings.aliasMercadoPago.trim()}`;
    }
    // Fallback if empty
    return 'https://wa.me/5491138641863?text=Quiero%20inscribirme%20en%20el%20Curso%20Penal%20Pr%C3%A1ctico';
  };

  const ctaLink = getCtaLink();

  return (
    <div className="bg-midnight text-text-primary min-h-screen relative overflow-x-hidden font-sans">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true"></div>

      {/* Glassmorphic Header */}
      <HeaderClient />

      {/* ============================================================
           HERO SECTION
      ============================================================ */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-vieja.html/am1.jpg"
            alt="Dr. Luis Ángel Méndez en su despacho"
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay absolute inset-0"></div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-midnight to-transparent"></div>
        </div>

        {/* Decorative geometric lines */}
        <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" aria-hidden="true"></div>
        <div className="absolute bottom-1/3 left-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden lg:block" aria-hidden="true"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Eyebrow label */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="section-line"></div>
              <span className="text-gold text-xs sm:text-sm font-sans font-bold tracking-widest uppercase">Curso Penal Práctico</span>
            </div>

            {/* Main headline */}
            <h1 className="font-sans font-black leading-none tracking-tight mb-5 sm:mb-6" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}>
              DEJÁ DE<br />
              <span className="text-gold-gradient">LITIGAR EN</span><br />
              SOLEDAD
            </h1>

            {/* Subheadline */}
            <p className="font-serif italic mb-6 sm:mb-8" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#D4AF37' }}>
              Curso Penal Práctico: De la teoría a la trinchera
            </p>

            {/* Body copy */}
            <p className="text-text-secondary font-sans font-light leading-relaxed mb-8 sm:mb-10 max-w-xl" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Tu primer caso penal no tiene por qué ser una batalla solitaria. Seguridad jurídica y respaldo técnico para el abogado que recién empieza.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={ctaLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2"
                aria-label="Empezar mi curso ahora"
              >
                <span>EMPEZAR MI CURSO</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </a>
              <a 
                href="#beneficios"
                className="btn-ghost px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2"
                aria-label="Ver beneficios del curso"
              >
                <span>Ver Beneficios</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4"/></svg>
              </a>
            </div>

            {/* Trust badge */}
            <div className="mt-10 sm:mt-12 flex items-center gap-4">
              <div className="flex -space-x-2" aria-hidden="true">
                <div className="w-8 h-8 rounded-full bg-surface-2 border border-gold/20 flex items-center justify-center text-xs text-gold font-bold">A</div>
                <div className="w-8 h-8 rounded-full bg-surface-2 border border-gold/20 flex items-center justify-center text-xs text-gold font-bold">M</div>
                <div className="w-8 h-8 rounded-full bg-surface-2 border border-gold/20 flex items-center justify-center text-xs text-gold font-bold">P</div>
              </div>
              <p className="text-xs sm:text-sm text-text-muted font-sans">
                <span className="text-gold font-semibold">Cupos limitados</span> — Calidad garantizada de seguimiento
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-xs text-text-muted tracking-widest uppercase font-sans">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent"></div>
        </div>
      </section>

      {/* ============================================================
           STATEMENT / INTRO STRIP
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
           BENEFITS — El Ecosistema de Defensa
      ============================================================ */}
      <section id="beneficios" className="py-20 sm:py-28 lg:py-36 bg-midnight" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section header */}
          <div className="mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="section-line"></div>
              <span className="text-gold text-xs font-sans font-bold tracking-widest uppercase">Ecosistema de Defensa</span>
            </div>
            <h2 id="benefits-heading" class="font-sans font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
              Todo lo que necesitás desde el inicio<br />
              <span className="text-gold-gradient">de la defensa en tu primer día de trabajo</span>
            </h2>
            <p className="text-text-secondary font-sans font-light max-w-xl" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
              Un programa diseñado para transformar la incertidumbre del inicio en dominio procesal concreto.
            </p>
          </div>

          {/* Benefits Grid 3x2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1: Acompañamiento Individual */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Acompañamiento Individual">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2a4 4 0 100 8 4 4 0 000-8z"/>
                    <path d="M2 18c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Acompañamiento Individual</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Curso y seguimiento personalizado de tus casos reales. No sos un número — sos un profesional en formación con respaldo directo del Dr. Méndez.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Personalizado</span>
              </div>
            </article>

            {/* Card 2: Canal de Consultas 24/7 */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Canal de Consultas 24/7">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="8"/>
                    <path d="M10 6v4l3 3"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Canal de Consultas 24/7</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Soporte constante ante dudas procesales de urgencia. Porque en derecho penal, los plazos no esperan y las decisiones se toman en tiempo real.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Siempre disponible</span>
              </div>
            </article>

            {/* Card 3: Formación Práctica */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Formación Práctica">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5l8-3 8 3v6c0 4-8 7-8 7S2 15 2 11V5z"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Formación Práctica</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Herramientas concretas para la defensa efectiva desde el inicio. Técnicas procesales, estrategia de audiencias y manejo de prueba en casos reales.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Aplicable desde el día 1</span>
              </div>
            </article>

            {/* Card 4: Casos Vivos */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Casos Vivos">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="16" height="14" rx="1"/>
                    <path d="M7 3v14M13 3v14M2 8h16M2 13h16"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Casos Vivos</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Acceso al calendario y análisis de casos actuales del Dr. Méndez. Observá la estrategia en tiempo real y aprendé de situaciones que están ocurriendo ahora.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Tiempo real</span>
              </div>
            </article>

            {/* Card 5: Comunidad VIP */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Comunidad VIP">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8c0 4-7 9-7 9S3 12 3 8a7 7 0 0114 0z"/>
                    <circle cx="10" cy="8" r="2.5"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Comunidad VIP</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Grupo de WhatsApp exclusivo para debate técnico y networking con colegas. Construí tu red profesional desde el primer día junto a otros abogados penalistas.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Red exclusiva</span>
              </div>
            </article>

            {/* Card 6: Flexibilidad */}
            <article className="benefit-card p-7 sm:p-8" aria-label="Flexibilidad de modalidad">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)' }} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="8"/>
                    <path d="M10 2c0 0-4 4-4 8s4 8 4 8"/>
                    <path d="M2 10h16"/>
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-text-primary mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>Flexibilidad Total</h3>
              </div>
              <p className="text-text-secondary font-sans font-light leading-relaxed text-sm sm:text-base">
                Modalidad Virtual o Presencial en Pcia. de Buenos Aires. El curso se adapta a tu realidad, no al revés. Elegí el formato que mejor se ajuste a tu práctica.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-4 h-px bg-gold opacity-60"></div>
                <span className="text-gold text-xs font-sans font-semibold tracking-wider uppercase font-semibold">Virtual · Presencial</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
           AUTHORITY SECTION — Dr. Méndez
      ============================================================ */}
      <section id="autoridad" className="py-20 sm:py-28 lg:py-36 bg-gradient-section overflow-hidden" aria-labelledby="authority-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image column */}
            <div className="relative order-2 lg:order-1">
              <div className="editorial-frame relative z-10">
                <img 
                  src="/landing-vieja.html/am2.jpg"
                  alt="Dr. Luis Ángel Méndez — Abogado Penalista"
                  className="w-full max-w-sm mx-auto lg:max-w-none object-cover rounded-sm shadow-elevation-3"
                  style={{ aspectRatio: '3/4', objectPosition: 'top' }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/10 rounded-sm hidden lg:block" aria-hidden="true"></div>
              <div className="absolute -top-6 -left-6 w-20 h-20 border border-gold/15 rounded-sm hidden lg:block" aria-hidden="true"></div>
            </div>

            {/* Content column */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="section-line"></div>
                <span className="text-gold text-xs font-sans font-bold tracking-widest uppercase">Autoridad & Trayectoria</span>
              </div>

              <h2 id="authority-heading" class="font-sans font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                La experiencia que<br />
                <span className="text-gold-gradient">marca la diferencia</span>
              </h2>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="stat-card p-5">
                  <div className="authority-number">+20</div>
                  <p className="text-text-secondary text-sm font-sans font-light mt-1 leading-snug">años de experiencia en tribunales</p>
                </div>
                <div className="stat-card p-5">
                  <div className="authority-number" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>100%</div>
                  <p className="text-text-secondary text-sm font-sans font-light mt-1 leading-snug">dedicación al derecho penal argentino</p>
                </div>
              </div>

              {/* Authority text */}
              <div className="space-y-4">
                <p className="text-text-secondary font-sans font-light leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  El Dr. Luis Ángel Méndez ha construido su trayectoria en las trincheras del sistema penal argentino. Más de dos décadas y media de litigación activa, estrategia procesal y defensa técnica le otorgan una perspectiva que ningún manual puede replicar.
                </p>
                <p className="text-text-secondary font-sans font-light leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Su curso no es teoría académica — es el destilado de miles de horas en sala de audiencias, negociaciones, recursos y victorias concretas.
                </p>
              </div>

              {/* Scarcity notice */}
              <div className="mt-8 p-5 border border-gold/20 rounded-sm bg-surface/40" role="note" aria-label="Aviso de cupos limitados">
                <div className="flex items-start gap-3">
                  <div className="text-gold mt-0.5 flex-shrink-0" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 1l2 6h6l-5 3.5 2 6L9 13l-5 3.5 2-6L1 7h6z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gold font-sans font-bold text-sm mb-1">Cupos estrictamente limitados</p>
                    <p className="text-text-secondary font-sans font-light text-sm leading-relaxed">
                      Para garantizar la calidad del seguimiento individual, el programa acepta un número reducido de alumnos por cohorte. Una vez completo, el acceso se cierra.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           CTA SECTION — Final
      ============================================================ */}
      <section id="contacto" className="relative py-24 sm:py-32 overflow-hidden" aria-labelledby="cta-heading">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-vieja.html/am3.jpg"
            alt="Dr. Luis Ángel Méndez — Curso Penal Práctico"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,28,0.96) 0%, rgba(10,15,28,0.85) 50%, rgba(10,15,28,0.95) 100%)' }}></div>
        </div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold/40"></div>
            <span className="text-gold text-xs font-sans font-bold tracking-widest uppercase">Tu momento es ahora</span>
            <div className="w-8 h-px bg-gold/40"></div>
          </div>

          {/* Heading */}
          <h2 id="cta-heading" className="font-sans font-black leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            EMPEZÁ TU<br />
            <span className="text-gold-gradient">CURSO HOY</span>
          </h2>

          {/* Subtext */}
          <p className="text-text-secondary font-sans font-light leading-relaxed mb-3 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            Cada semana que pasa sin respaldo es una semana de oportunidades perdidas en sala. No esperes a que el sistema te enseñe a golpes.
          </p>
          <p className="text-text-muted font-serif italic mb-10" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)' }}>
            +20 años de experiencia en tribunales y el sistema penal argentino.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={ctaLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary px-10 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-3"
              aria-label="Empezar mi curso de capacitación penal práctica"
            >
              <span>EMPEZAR MI CURSO</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15.5 11.5c0 .3-.1.6-.2.9-.1.3-.3.6-.5.8-.3.4-.7.6-1.1.6-.3 0-.6-.1-.9-.2l-1.5-.5c-.5-.2-1-.4-1.4-.7-.9-.6-1.7-1.4-2.3-2.3-.3-.4-.5-.9-.7-1.4l-.5-1.5c-.1-.3-.2-.6-.2-.9 0-.4.2-.8.5-1.1.2-.2.5-.4.8-.5.3-.1.6-.2.9-.2.1 0 .2 0 .3.1.1.1.2.2.3.3l1 1.5c.1.1.2.3.2.4 0 .2-.1.3-.2.5l-.3.4c-.1.1-.1.2-.1.3 0 .1 0 .2.1.3.3.5.7.9 1.2 1.2.1.1.2.1.3.1.1 0 .2 0 .3-.1l.4-.3c.1-.1.3-.2.5-.2.1 0 .3.1.4.2l1.5 1.0c.1.1.2.2.3.3.1.1.1.2.1.3z"/>
              </svg>
            </a>
            <a 
              href="https://wa.me/5491138641863?text=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Curso%20Penal%20Pr%C3%A1ctico"
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-ghost px-10 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2"
              aria-label="Consultar más información"
            >
              <span>Consultar más información</span>
            </a>
          </div>

          {/* Contact info */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a 
              href="https://wa.me/5491138641863" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm font-sans"
              aria-label="WhatsApp del Dr. Méndez"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#25D366" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.5 2.5A7.5 7.5 0 001 8.5c0 1.3.3 2.6.9 3.7L1 15l2.9-.9A7.5 7.5 0 0013.5 2.5zM8 13.5c-1.2 0-2.3-.3-3.3-.9l-.2-.1-2 .5.5-1.9-.2-.2A5.5 5.5 0 1113.5 8 5.5 5.5 0 018 13.5zm3-4.1c-.2-.1-.9-.5-1.1-.5-.1 0-.3.1-.4.3l-.5.6c-.1.1-.2.1-.3.1-.1 0-.4-.1-.8-.5-.3-.3-.6-.7-.7-1 0-.1 0-.2.1-.3l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3l-.5-1.1c-.1-.2-.2-.2-.3-.2h-.3c-.1 0-.3.1-.5.3-.2.2-.7.7-.7 1.6s.7 1.9.8 2c.1.1 1.4 2.1 3.3 2.9.5.2.8.3 1.1.4.5.1.9.1 1.2.1.4-.1.9-.4 1.1-.8.2-.4.2-.7.1-.8-.1-.1-.2-.1-.4-.2z"/>
              </svg>
              +54 9 11 3864-1863
            </a>
            <span className="hidden sm:block text-text-muted/30">|</span>
            <span className="text-text-muted text-sm font-sans">Pcia. de Buenos Aires · Argentina</span>
          </div>
        </div>
      </section>

      {/* ============================================================
           FOOTER
      ============================================================ */}
      <footer role="contentinfo" className="bg-charcoal border-t border-white/5 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="text-gold opacity-60" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="14" y1="2" x2="14" y2="26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4" y1="6" x2="24" y2="6" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 6 L1 13 Q4 16 7 13 Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  <path d="M24 6 L21 13 Q24 16 27 13 Z" stroke="#D4AF37" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
                  <circle cx="14" cy="6" r="1.5" fill="#D4AF37"/>
                  <line x1="10" y1="26" x2="18" y2="26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-serif text-sm text-text-muted">Dr. Luis Ángel Méndez</p>
            </div>

            {/* Admin discrete access link */}
            <div>
              <a href="/admin" className="text-text-muted hover:text-gold text-xs transition-colors duration-255 font-mono uppercase tracking-widest">
                Acceso Staff
              </a>
            </div>

            {/* Copyright */}
            <p className="text-text-muted text-xs font-sans text-center sm:text-right">
              © {new Date().getFullYear()} Dr. Luis Ángel Méndez. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================
           WHATSAPP FLOATING BUTTON
      ============================================================ */}
      <a 
        href="https://wa.me/5491138641863?text=Quiero%20inscribirme%20en%20el%20Curso%20Penal%20Pr%C3%A1ctico"
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp al Dr. Luis Ángel Méndez"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20.5 3.5A11.5 11.5 0 001.5 13c0 2 .5 4 1.5 5.7L1.5 22.5l4-1.5A11.5 11.5 0 1020.5 3.5zM12 21.5c-1.8 0-3.5-.5-5-1.4l-.4-.2-3 .8.8-2.9-.2-.4A9.5 9.5 0 1121.5 12 9.5 9.5 0 0112 21.5zm5.2-7.1c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-.9-.4-1.7-1.1-.6-.6-1-1.2-1.1-1.5-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5l-.8-1.9c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3z"/>
        </svg>
      </a>

      {/* Inquiry Form */}
      <section className="py-20 sm:py-28 lg:py-36 bg-midnight border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 p-8 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="font-serif text-gold text-sm font-bold tracking-widest uppercase block mb-2">ESTUDIO CENTRAL</span>
                <h3 className="font-serif text-2xl font-bold text-white mb-6">Asesoramiento Directo Personalizado</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                  Dejale una consulta directa sobre las especialidades o el plan formativo al Dr. Luis Ángel Méndez para resolver tu admisión.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono text-slate-400 pt-6 border-t border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <span>+54 9 11 3864-1863 (WhatsApp Consultas)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>consultas@drluisangelmendez.com.ar</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
