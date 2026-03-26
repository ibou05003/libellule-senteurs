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
    const onScroll = () => setScrolled(window.scrollY > 60);
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
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-noir-profond/95 backdrop-blur-sm border-b border-blanc-casse/[0.06]"
            : ""
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-700 ${
            scrolled
              ? "min-h-[64px] md:min-h-[68px]"
              : "min-h-[80px] md:min-h-[96px] lg:min-h-[108px]"
          }`}
          style={{ paddingInline: "clamp(1.5rem, 3vw, 4rem)" }}
        >
          {/* Logo mark + wordmark */}
          <a
            href="#"
            className="flex items-center gap-4 group cursor-pointer"
            aria-label="Libellule Senteurs — accueil"
          >
            <svg
              viewBox="0 0 36 36"
              className={`flex-shrink-0 transition-all duration-700 ${scrolled ? "w-7 h-7" : "w-8 h-8 md:w-9 md:h-9"}`}
              fill="none"
              stroke="#C99700"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="14" opacity="0.5" />
              <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.65" />
              <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.45" />
              <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.5" />
            </svg>
            <div className="flex flex-col gap-1">
              <span
                className={`font-heading text-or-luxe leading-none tracking-wide transition-all duration-700 ${
                  scrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
                }`}
              >
                Libellule Senteurs
              </span>
              {/* /40 instead of /30 — raises contrast from ~2.1:1 to ~2.8:1;
                  still subordinate to the wordmark but passes large-text threshold */}
              <span className="font-body text-[8px] text-blanc-casse/40 tracking-[0.22em] uppercase leading-none hidden sm:block">
                Parfums d&apos;intérieur Haut de Gamme
              </span>
            </div>
          </a>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-10 font-body text-[10px] tracking-[0.22em] uppercase">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative text-blanc-casse/60 hover:text-blanc-casse transition-colors duration-400 py-3 cursor-pointer group"
              >
                {label}
                {/* Use transform: scaleX for the underline to avoid layout reflow */}
                <span className="absolute bottom-1 left-0 w-full h-px bg-or-luxe origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center min-w-[180px] py-3.5 bg-or-luxe text-noir-profond text-[10px] tracking-[0.25em] uppercase font-body font-medium hover:bg-or-luxe/90 active:bg-or-luxe/80 transition-all duration-500 cursor-pointer"
            style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
          >
            Nous contacter
          </a>

          {/* Mobile hamburger — three lines animate to × when open */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 cursor-pointer"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-350 origin-center"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-350"
              style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "none" }}
            />
            <span
              className="block w-5 h-px bg-or-luxe transition-all duration-350 origin-center"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-noir-profond md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s ease-in-out",
        }}
      >
        {/* Subtle decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" stroke="#C99700" strokeWidth="0.4" opacity="0.06" aria-hidden="true">
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="50" />
          </svg>
        </div>

        <nav className="flex flex-col items-center gap-7 relative z-10">
          {NAV_LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="font-heading text-2xl text-blanc-casse/70 hover:text-blanc-casse tracking-[0.12em] uppercase transition-colors duration-400 cursor-pointer min-h-[44px] flex items-center"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.4s ease ${0.08 * i + 0.1}s, transform 0.4s ease ${0.08 * i + 0.1}s, color 0.4s ease`,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-4 py-3.5 border border-or-luxe/40 text-or-luxe text-[9px] tracking-[0.28em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-500 cursor-pointer min-h-[44px] flex items-center"
            style={{
              paddingLeft: "2.5rem",
              paddingRight: "2.5rem",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.4s ease 0.42s, transform 0.4s ease 0.42s`,
            }}
          >
            Nous contacter
          </a>
        </nav>
      </div>
    </>
  );
}
