export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/10 py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="font-heading text-lg text-or-luxe">Libellule Senteurs</p>
          <p className="text-blanc-casse/50 text-sm mt-1">
            Parfums d&apos;intérieur Haut de Gamme
          </p>
        </div>

        <div className="flex items-center gap-6 text-blanc-casse/50 text-sm">
          <a
            href="https://instagram.com/libellulesenteurs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or-luxe transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-or-luxe transition-colors"
          >
            Email
          </a>
          <span className="text-blanc-casse/30">
            (+221) 77 000 00 00
          </span>
        </div>

        <p className="text-blanc-casse/30 text-xs">
          &copy; {new Date().getFullYear()} Libellule Senteurs. Dakar, Sénégal.
        </p>
      </div>
    </footer>
  );
}
