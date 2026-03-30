"use client";

import { useState } from "react";

/**
 * Minimal contact form with gold border animation on focus.
 *
 * No backend integration — the form captures intent and demonstrates
 * interaction quality. The confirmation state provides immediate feedback
 * without a page reload, preserving the luxury single-page feel.
 */
export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Shared input className — bottom-border-only keeps the form airy.
  // placeholder:/40 raises placeholder contrast from ~1.7:1 to ~2.8:1 on #000.
  // py-4 = ~56px effective touch target height — exceeds the 44px minimum.
  const inputClass =
    "w-full bg-transparent border-b border-blanc-casse/15 py-4 font-body text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:outline-none focus:border-or-luxe/70 transition-colors duration-500 leading-relaxed";

  return (
    <section
      id="contact"
      className="bg-noir-profond py-24 md:py-32 lg:py-40"
      style={{ paddingInline: "1.5rem" }}
    >
      <div className="max-w-xl mx-auto" style={{ paddingInline: "1.5rem", marginInline: "auto" }}>
        {/* Section heading — consistent two-line pattern.
            w-full ensures the text-center container spans the full column width
            so the heading is truly centred on all viewports. */}
        <div className="w-full text-center mb-16 md:mb-20">
          <p className="font-body text-xs text-blanc-casse/60 tracking-[0.35em] uppercase mb-5">
            Nous écrire
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-blanc-casse mb-5">
            Échangeons
          </h2>
          <p className="font-body text-blanc-casse/60 text-xs tracking-[0.25em] uppercase">
            Un espace à sublimer ? Écrivez-nous.
          </p>
        </div>

        {submitted ? (
          /* Confirmation — warm, on-brand, unhurried */
          <div className="text-center space-y-5 py-20">
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 40 40" fill="none" stroke="#C99700" strokeWidth="1" className="w-10 h-10" aria-hidden="true">
                <circle cx="20" cy="20" r="16" opacity="0.4" />
                <path d="M13 20 L18 25 L27 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-heading text-2xl text-blanc-casse">Message envoyé</p>
            <p className="font-body text-sm text-blanc-casse/50 leading-[1.8] max-w-xs mx-auto" style={{ marginInline: "auto" }}>
              Notre équipe vous répondra avec le soin que mérite chaque détail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            <div>
              <label htmlFor="contact-name" className="sr-only">Votre nom</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                placeholder="Votre nom"
                className={inputClass}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="sr-only">Votre email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                placeholder="Votre email"
                className={inputClass}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="sr-only">Votre message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder="Votre message"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="text-center pt-4">
              {/* Ghost button: border-only at rest, fills with gold on hover */}
              <button
                type="submit"
                className="py-3.5 min-h-[44px] border border-or-luxe/40 text-or-luxe text-[9px] tracking-[0.28em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond hover:border-or-luxe transition-all duration-500 cursor-pointer min-w-[180px]"
                style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
              >
                Envoyer
              </button>
            </div>
          </form>
        )}

        {/* Secondary contact details — low prominence, always findable */}
        {/* /45 base color raises contrast from ~2.1:1 to ~3.2:1 for this
            small decorative text; cursor-pointer added for touch clarity */}
        <div className="mt-20 md:mt-24 flex flex-col md:flex-row justify-center items-center gap-5 text-blanc-casse/60 text-xs font-body tracking-wide">
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-or-luxe transition-colors duration-400 cursor-pointer"
          >
            contacts@libellulessenteurs.com
          </a>
          <span className="hidden md:inline text-blanc-casse/30">·</span>
          <span>Dakar, Sénégal</span>
        </div>
      </div>
    </section>
  );
}
