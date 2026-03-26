import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

/**
 * Playfair Display — editorial serif for headings and display text.
 * Conveys the timeless luxury and craftsmanship of the brand.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/**
 * Jost — geometric sans-serif for body copy and UI elements.
 * Pairs cleanly with Playfair Display while maintaining modern readability.
 */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Libellule Senteurs — Parfums d'intérieur Haut de Gamme",
  description:
    "L'essence du raffinement invisible. Libellule Senteurs transforme chaque espace en une expérience sensorielle unique. Parfums d'intérieur premium, Dakar.",
  keywords: ["parfum intérieur", "luxe", "Dakar", "bougie parfumée", "diffuseur"],
  openGraph: {
    title: "Libellule Senteurs — Parfums d'intérieur Haut de Gamme",
    description: "L'essence du raffinement invisible.",
    locale: "fr_FR",
    type: "website",
  },
  // theme-color ensures the browser chrome (address bar, status bar on mobile)
  // matches the site's dark background — important for the immersive feel.
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Font CSS variables are injected on <html> so they cascade to all children
    // and are accessible via var(--font-playfair) / var(--font-jost) in CSS
    <html lang="fr" className={`${playfair.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
