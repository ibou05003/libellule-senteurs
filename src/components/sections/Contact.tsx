"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.errors?.[0] || "Une erreur est survenue.");
      }
    } catch {
      setError("Impossible d'envoyer le message. Vérifiez votre connexion.");
    } finally {
      setSending(false);
    }
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
      {/*
       * No extra paddingInline here — the section already applies 1.5rem on
       * both sides via its own style. Adding another 1.5rem would give 3rem
       * total side padding, shrinking the content to ~279px on a 375px phone.
       */}
      <div className="max-w-5xl mx-auto">
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

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Left column: contact form */}
          <div>
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
                  {error && (
                    <p className="text-center font-body text-sm text-red-400">{error}</p>
                  )}
                  {/* Ghost button: border-only at rest, fills with gold on hover */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="py-3.5 min-h-[44px] border border-or-luxe/40 text-or-luxe text-xs tracking-[0.28em] uppercase font-body hover:bg-or-luxe hover:text-noir-profond hover:border-or-luxe transition-all duration-500 cursor-pointer min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                  >
                    {sending ? "Envoi en cours\u2026" : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right column: WhatsApp + contact info — centred on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="mb-8">
              <p className="font-heading text-lg text-blanc-casse md:text-xl">
                Réponse rapide
              </p>
              <p className="mt-2 font-body text-sm text-blanc-casse/60 leading-relaxed">
                Écrivez-nous directement sur WhatsApp pour une réponse dans l&apos;heure.
              </p>
            </div>
            <a
              href="https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-body text-sm font-medium text-white tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Démarrer une conversation
            </a>
            <div className="mt-12 space-y-3 text-blanc-casse/60 font-body text-sm">
              <a href="mailto:contacts@libellulessenteurs.com" className="block hover:text-or-luxe transition-colors cursor-pointer">
                contacts@libellulessenteurs.com
              </a>
              <p>Dakar, Sénégal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
