export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/[0.08] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">

        {/* Brand identity */}
        <div className="text-center md:text-left">
          <p className="font-heading text-base text-blanc-casse/80 tracking-wide">Libellule Senteurs</p>
          <p className="font-body text-blanc-casse/30 text-[9px] tracking-[0.2em] uppercase mt-1.5">
            Parfums d&apos;intérieur Haut de Gamme
          </p>
        </div>

        {/* Social and contact links — /50 base raises contrast from ~3.5:1 to
            ~3.5:1; cursor-pointer makes intent clear on touch devices */}
        <div className="flex items-center gap-8 text-blanc-casse/50 text-[10px] font-body tracking-wide">
          <a
            href="https://instagram.com/libellulesenteurs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Libellule Senteurs sur Instagram"
            className="hover:text-blanc-casse transition-colors duration-400 cursor-pointer"
          >
            Instagram
          </a>
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-blanc-casse transition-colors duration-400 cursor-pointer"
          >
            Email
          </a>
          <a
            href="tel:+221770000000"
            className="hover:text-blanc-casse transition-colors duration-400 cursor-pointer"
          >
            (+221) 77 000 00 00
          </a>
        </div>

        {/* Legal — /35 instead of /25 for minimum readability */}
        <p className="text-blanc-casse/35 text-[9px] font-body tracking-wide">
          &copy; {new Date().getFullYear()} Libellule Senteurs. Dakar, Sénégal.
        </p>
      </div>
    </footer>
  );
}
