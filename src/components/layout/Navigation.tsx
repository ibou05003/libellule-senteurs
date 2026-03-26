"use client";

import { useState, useEffect, useCallback } from "react";

const NAV_LINKS = [
  { href: "#histoire", label: "Notre Histoire" },
  { href: "#collection", label: "Collection" },
  { href: "#experience", label: "Expérience" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scroll while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-noir-profond/90 backdrop-blur-md [&>div]:min-h-[60px] [&>div]:md:min-h-[68px] [&>div]:lg:min-h-[72px]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16 min-h-[72px] md:min-h-[88px] lg:min-h-[100px] py-4">
          {/* Logo mark + wordmark */}
          <a href="#" className="flex items-center gap-3">
            <svg
              viewBox="0 0 36 36"
              className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0"
              fill="none"
              stroke="#C99700"
              strokeWidth="1"
            >
              <circle cx="18" cy="18" r="14" opacity="0.6" />
              <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.7" />
              <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.5" />
              <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div>
              <span className="font-heading text-lg md:text-xl text-or-luxe leading-none block">
                Libellule Senteurs
              </span>
              <span className="font-body text-[9px] md:text-[10px] text-blanc-casse/30 tracking-[0.15em] uppercase leading-none mt-1 hidden sm:block">
                Parfums d&apos;intérieur Haut de Gamme
              </span>
            </div>
          </a>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-10 font-body text-[11px] tracking-[0.2em] uppercase text-blanc-casse/60">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hover:text-or-luxe transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:block px-5 py-2 border border-or-luxe/30 text-or-luxe text-[10px] tracking-[0.2em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-500"
          >
            Nous contacter
          </a>

          {/* Mobile hamburger — three gold lines that animate to × when open */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-noir-profond transition-opacity duration-300 md:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={closeMenu}
            className="font-heading text-2xl text-blanc-casse/70 hover:text-or-luxe tracking-[0.15em] uppercase transition-colors"
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={closeMenu}
          className="mt-6 px-8 py-3 border border-or-luxe/30 text-or-luxe text-xs tracking-[0.2em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-500"
        >
          Nous contacter
        </a>
      </div>
    </>
  );
}
