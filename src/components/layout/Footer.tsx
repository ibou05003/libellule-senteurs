export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Main footer content */}
        <div className="py-16 md:py-20 lg:py-24 flex flex-col items-center text-center gap-10">

          {/* Logo */}
          <div>
            <svg
              viewBox="0 0 36 36"
              className="w-10 h-10 mx-auto mb-4"
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
            <p className="font-body text-[9px] text-blanc-casse/35 tracking-[0.25em] uppercase mt-2">
              Parfums d&apos;intérieur Haut de Gamme
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-body text-[10px] tracking-[0.2em] uppercase text-blanc-casse/40">
            <a href="#histoire" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Notre Histoire</a>
            <a href="#collection" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Collection</a>
            <a href="#experience" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Expérience</a>
            <a href="#contact" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Contact</a>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-body text-[10px] text-blanc-casse/35 tracking-wide">
            <a href="mailto:contacts@libellulessenteurs.com" className="hover:text-blanc-casse/60 transition-colors duration-400 cursor-pointer">
              contacts@libellulessenteurs.com
            </a>
            <span className="hidden sm:inline text-blanc-casse/15">|</span>
            <a href="tel:+221770000000" className="hover:text-blanc-casse/60 transition-colors duration-400 cursor-pointer">
              (+221) 77 000 00 00
            </a>
            <span className="hidden sm:inline text-blanc-casse/15">|</span>
            <span>Dakar, Sénégal</span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/libellulesenteurs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[10px] text-blanc-casse/35 tracking-[0.2em] uppercase hover:text-or-luxe/70 transition-colors duration-400 cursor-pointer"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blanc-casse/[0.06] py-6 text-center">
          <p className="font-body text-[9px] text-blanc-casse/25 tracking-wide">
            &copy; {new Date().getFullYear()} Libellule Senteurs. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
