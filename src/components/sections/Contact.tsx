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

  // Shared input className — bottom-border-only keeps the form airy
  const inputClass =
    "w-full bg-transparent border-b border-blanc-casse/20 py-4 font-body text-sm text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-or-luxe transition-colors duration-500";

  return (
    <section
      id="contact"
      className="bg-noir-profond py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-or-luxe mb-4">
            Échangeons
          </h2>
          <p className="font-body text-blanc-casse/40 text-[10px] tracking-[0.3em] uppercase">
            Un espace à sublimer ? Écrivez-nous.
          </p>
        </div>

        {submitted ? (
          /* Confirmation — warm, on-brand, unhurried */
          <div className="text-center space-y-4 py-16">
            <p className="font-heading text-2xl text-or-luxe">Message envoyé</p>
            <p className="font-body text-sm text-blanc-casse/60 leading-relaxed">
              Notre équipe vous répondra avec le soin que mérite chaque détail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <input
                type="text"
                name="name"
                required
                placeholder="Votre nom"
                className={inputClass}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Votre email"
                className={inputClass}
              />
            </div>

            <div>
              <textarea
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
                className="px-12 py-3 border border-or-luxe/40 text-or-luxe text-[10px] tracking-[0.25em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-500"
              >
                Envoyer
              </button>
            </div>
          </form>
        )}

        {/* Secondary contact details — low prominence, always findable */}
        <div className="mt-20 md:mt-24 flex flex-col md:flex-row justify-center items-center gap-6 text-blanc-casse/30 text-[11px] font-body tracking-wide">
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-or-luxe transition-colors duration-300"
          >
            contacts@libellulessenteurs.com
          </a>
          <span className="hidden md:inline opacity-40">·</span>
          <span>(+221) 77 000 00 00</span>
          <span className="hidden md:inline opacity-40">·</span>
          <span>Dakar, Sénégal</span>
        </div>
      </div>
    </section>
  );
}
