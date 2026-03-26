export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/[0.07] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-10">

        {/* Brand identity */}
        <div className="text-center md:text-left">
          <p className="font-heading text-lg text-or-luxe">Libellule Senteurs</p>
          <p className="font-body text-blanc-casse/30 text-[10px] tracking-[0.15em] uppercase mt-1">
            Parfums d&apos;intérieur Haut de Gamme
          </p>
        </div>

        {/* Social and contact links */}
        <div className="flex items-center gap-8 text-blanc-casse/40 text-xs font-body">
          <a
            href="https://instagram.com/libellulesenteurs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or-luxe transition-colors duration-300"
          >
            Instagram
          </a>
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-or-luxe transition-colors duration-300"
          >
            Email
          </a>
          <span className="text-blanc-casse/25">
            (+221) 77 000 00 00
          </span>
        </div>

        {/* Legal */}
        <p className="text-blanc-casse/20 text-[10px] font-body">
          &copy; {new Date().getFullYear()} Libellule Senteurs. Dakar, Sénégal.
        </p>
      </div>
    </footer>
  );
}
