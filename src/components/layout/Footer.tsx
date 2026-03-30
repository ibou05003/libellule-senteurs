export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/10">
      <div className="max-w-7xl mx-auto" style={{ paddingInline: "clamp(1.5rem, 3vw, 4rem)", marginInline: "auto" }}>

        {/* Main footer content */}
        <div className="py-16 md:py-20 lg:py-24 flex flex-col items-center text-center gap-10">

          {/* Logo */}
          <div>
            <svg
              viewBox="0 0 36 36"
              className="w-10 h-10 mx-auto mb-4"
              style={{ display: "block", marginInline: "auto" }}
              fill="none"
              stroke="#C99700"
              strokeWidth="1"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="14" opacity="0.5" />
              <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.6" />
              <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.4" />
              <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.5" />
            </svg>
            <p className="font-heading text-lg text-blanc-casse/80 tracking-wide">
              Libellule Senteurs
            </p>
            <p className="font-body text-xs text-blanc-casse/50 tracking-[0.25em] uppercase mt-2">
              Parfums d&apos;intérieur Haut de Gamme
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-body text-xs tracking-[0.2em] uppercase text-blanc-casse/60">
            <a href="#collection" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Collection</a>
            <a href="#univers" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Notre Univers</a>
            <a href="#contact" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Contact</a>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-body text-xs text-blanc-casse/50 tracking-wide">
            <a href="mailto:contacts@libellulessenteurs.com" className="hover:text-blanc-casse/60 transition-colors duration-400 cursor-pointer">
              contacts@libellulessenteurs.com
            </a>
            <span className="hidden sm:inline text-blanc-casse/30">|</span>
            <span>Dakar, Sénégal</span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/libellulesenteurs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-blanc-casse/50 tracking-[0.2em] uppercase hover:text-or-luxe/70 transition-colors duration-400 cursor-pointer"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blanc-casse/10 py-6 text-center">
          <p className="font-body text-xs text-blanc-casse/50 tracking-wide">
            &copy; {new Date().getFullYear()} Libellule Senteurs. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
