'use client';

import React, { useState, useEffect } from 'react';

export default function HeaderClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <header 
      role="banner" 
      className={`glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.6)]' : ''
      }`}
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Branding */}
          <a href="#inicio" className="flex items-center gap-3 group" aria-label="Dr. Luis Ángel Méndez - Inicio">
            {/* Scales icon */}
            <div className="text-gold opacity-80 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="14" y1="2" x2="14" y2="26" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="6" x2="24" y2="6" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
                {/* Left pan */}
                <path d="M4 6 L1 13 Q4 16 7 13 Z" stroke="#D4AF37" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
                {/* Right pan */}
                <path d="M24 6 L21 13 Q24 16 27 13 Z" stroke="#D4AF37" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
                <circle cx="14" cy="6" r="1.5" fill="#D4AF37"/>
                <line x1="10" y1="26" x2="18" y2="26" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-serif text-base sm:text-lg leading-tight text-text-primary tracking-wide">Dr. Luis Ángel Méndez</p>
              <p className="text-xs text-text-muted tracking-widest uppercase font-sans font-medium">Derecho Penal</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
            <a href="#beneficios" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Beneficios</a>
            <a href="#autoridad" class="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Experiencia</a>
            <a href="#contacto" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200 tracking-wide font-medium">Contacto</a>
            <a href="/admin" className="text-sm text-text-muted hover:text-gold transition-colors duration-200 tracking-wide font-medium">Panel</a>
            <a href="#contacto" className="btn-ghost px-5 py-2 text-sm" aria-label="Inscribite ahora en el Curso Penal Práctico">
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
            aria-controls="mobile-menu"
          >
            <svg id="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu" 
          role="navigation" 
          aria-label="Menú móvil"
          className={`transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-[300px] opacity-100 pb-5 pt-4 border-t border-white/5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4">
            <a href="#beneficios" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={closeMobileMenu}>Beneficios</a>
            <a href="#autoridad" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={closeMobileMenu}>Experiencia</a>
            <a href="#contacto" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={closeMobileMenu}>Contacto</a>
            <a href="/admin" className="text-text-secondary hover:text-gold transition-colors text-sm font-medium tracking-wide" onClick={closeMobileMenu}>Panel Staff</a>
            <a href="#contacto" className="btn-ghost px-5 py-2.5 text-sm text-center w-full" onClick={closeMobileMenu}>
              Inscribite Ahora
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
