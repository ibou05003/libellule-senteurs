"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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

      <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-widest uppercase text-blanc-casse/80">
        <a href="#histoire" className="hover:text-or-luxe transition-colors duration-300">
          Notre Histoire
        </a>
        <a href="#collection" className="hover:text-or-luxe transition-colors duration-300">
          Collection
        </a>
        <a href="#experience" className="hover:text-or-luxe transition-colors duration-300">
          Expérience
        </a>
        <a href="#contact" className="hover:text-or-luxe transition-colors duration-300">
          Contact
        </a>
      </div>

      <a
        href="#contact"
        className="hidden md:block px-6 py-2 border border-or-luxe/40 text-or-luxe text-xs tracking-widest uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-300"
      >
        Nous contacter
      </a>
    </nav>
  );
}
