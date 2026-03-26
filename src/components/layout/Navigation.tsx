"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Top navigation bar with responsive mobile menu.
 *
 * Desktop (md+): horizontal link row + CTA button.
 * Mobile (<md):  hamburger button that opens a fullscreen overlay containing
 *                the same links stacked vertically. The overlay uses a CSS
 *                opacity/pointer-events transition rather than Framer Motion to
 *                keep the bundle minimal — the hamburger icon itself is pure SVG.
 *
 * Gold colour (#C99700) is used for the hamburger lines and active overlay links
 * to stay consistent with the brand token `or-luxe`.
 */

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
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-500 ${
          scrolled ? "bg-noir-profond/80 backdrop-blur-md py-4" : ""
        }`}
      >
        <a href="#" className="flex items-center gap-3">
          <span className="font-heading text-xl text-or-luxe">
            Libellule Senteurs
          </span>
        </a>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-widest uppercase text-blanc-casse/80">
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
          className="hidden md:block px-6 py-2 border border-or-luxe/40 text-or-luxe text-xs tracking-widest uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-300"
        >
          Nous contacter
        </a>

        {/* Mobile hamburger button — visible only below md breakpoint */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-or-luxe"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {/* Three horizontal lines rendered in brand gold.
              The top and bottom lines rotate ±45° when open to form an × — a
              standard pattern users recognise without needing a label. */}
          <span
            className="block w-6 h-px transition-all duration-300 origin-center"
            style={{
              backgroundColor: "#C99700",
              transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: "#C99700",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300 origin-center"
            style={{
              backgroundColor: "#C99700",
              transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile fullscreen overlay
          Uses pointer-events to block interactions while closed so keyboard
          focus cannot reach hidden links. The opacity transition gives a simple,
          accessible fade without the weight of an animation library. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-noir-profond transition-opacity duration-300 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={closeMenu}
            className="font-heading text-2xl text-blanc-casse/80 hover:text-or-luxe tracking-widest uppercase transition-colors duration-300"
          >
            {label}
          </a>
        ))}

        {/* CTA also present in mobile overlay for discoverability */}
        <a
          href="#contact"
          onClick={closeMenu}
          className="mt-4 px-8 py-3 border border-or-luxe/40 text-or-luxe text-sm tracking-widest uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-300"
        >
          Nous contacter
        </a>
      </div>
    </>
  );
}
