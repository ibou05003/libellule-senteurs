"use client";

import { useState } from "react";

/**
 * Minimal contact form with gold border animation on focus.
 *
 * No backend integration — the form captures intent and demonstrates
 * interaction quality. The confirmation state provides immediate feedback
 * without a page reload, which keeps the luxury single-page feel intact.
 */
export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="min-h-screen flex items-center bg-noir-profond py-section px-8">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="font-heading text-3xl md:text-5xl text-or-luxe text-center mb-4">
          Échangeons
        </h2>
        <p className="font-body text-blanc-casse/50 text-center mb-16 text-sm tracking-widest uppercase">
          Un espace à sublimer ? Écrivez-nous.
        </p>

        {submitted ? (
          /* Confirmation state — warm and on-brand. The message conveys care
             and attention to detail, values central to the Libellule Senteurs
             identity, while keeping the tone unhurried and refined. */
          <div className="text-center space-y-4">
            <p className="font-heading text-2xl text-or-luxe">Message envoyé</p>
            <p className="font-body text-blanc-casse/70">
              Notre équipe vous répondra avec le soin que mérite chaque détail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Each input has no visible box — only a bottom border that
                transitions from muted white to gold on focus. This keeps the
                form airy and consistent with the wider editorial aesthetic. */}
            <div className="group relative">
              <input
                type="text"
                name="name"
                required
                placeholder="Votre nom"
                className="w-full bg-transparent border-b border-blanc-casse/20 py-3 font-body text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-or-luxe transition-colors duration-500"
              />
            </div>

            <div className="group relative">
              <input
                type="email"
                name="email"
                required
                placeholder="Votre email"
                className="w-full bg-transparent border-b border-blanc-casse/20 py-3 font-body text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-or-luxe transition-colors duration-500"
              />
            </div>

            <div className="group relative">
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Votre message"
                className="w-full bg-transparent border-b border-blanc-casse/20 py-3 font-body text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-or-luxe transition-colors duration-500 resize-none"
              />
            </div>

            <div className="text-center pt-4">
              {/* Ghost button: border-only at rest, fills with gold on hover.
                  The 500 ms transition keeps the interaction unhurried. */}
              <button
                type="submit"
                className="px-12 py-3 border border-or-luxe/40 text-or-luxe text-sm tracking-widest uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-500"
              >
                Envoyer
              </button>
            </div>
          </form>
        )}

        {/* Secondary contact details — low-prominence so they don't compete
            with the form call-to-action but are always findable. */}
        <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-8 text-blanc-casse/40 text-sm font-body">
          <a href="mailto:contacts@libellulessenteurs.com" className="hover:text-or-luxe transition-colors">
            contacts@libellulessenteurs.com
          </a>
          <span className="hidden md:inline">|</span>
          <span>(+221) 77 000 00 00</span>
          <span className="hidden md:inline">|</span>
          <span>Dakar, Sénégal</span>
        </div>
      </div>
    </section>
  );
}
