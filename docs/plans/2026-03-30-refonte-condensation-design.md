# Refonte "Condensation" — Libellule Senteurs Homepage

**Date** : 2026-03-30
**Objectif** : Refondre la homepage en 5 sections percutantes pour impressionner le client Libellule Senteurs
**Contexte** : Pitch/demo — le client recoit un lien et scrolle seul, sans presentation guidee
**Approche** : Condensation — chaque section est un moment visuel distinct, un seul scroll-jacking

---

## Diagnostic

La page actuelle souffre de :
- 12 sections, ~1200vh+ de scroll, 3 sections scroll-jacking consecutives (550vh)
- Pattern visuel repetitif (label or / ligne / titre / texte / CTA) sur chaque section
- Pas de hierarchie produit claire (chaque produit vu 2 fois)
- Contenu generique sans informations concretes
- 121 frames canvas + GoldenMist 60fps = perf mobile douteuse
- 11 composants morts dans le codebase

## Principes de la refonte

1. **Impact immediat** — le client voit quelque chose de beau des l'ouverture, pas apres 2 ecrans de scroll
2. **Un seul moment de scroll-jacking** — l'ambiance canvas, la piece maitresse technique
3. **Chaque section a son propre langage visuel** — zero monotonie
4. **30 secondes pour tout voir** — ~500-600vh total au lieu de 1200vh+
5. **Garder les assets et la logique existante** — pas de rework from scratch

---

## Structure : 5 sections

### Section 1 — Hero (100vh, statique)

**Pas de scroll-jacking.** Impact immediat.

- Image plein ecran `collection-complete-packagings.webp` en background (object-fit: cover)
- Overlay gradient sombre du bas (~60%) pour lisibilite du texte
- GoldenMist particules en overlay (reduit a 40 particules max)
- Centre :
  - Logo SVG libellule (~48px)
  - "Libellule Senteurs" en Playfair
  - "Parfums d'interieur haut de gamme · Dakar" en Jost
- Bas : fleche scroll animee (CSS pulse)
- Animation d'entree : fade-in CSS 0.8s au chargement, pas de GSAP

**Composants supprimes** : HeroConvergence (200vh scroll-jacking)

---

### Section 2 — Ambiance Canvas (200vh, piece maitresse)

**Le seul scroll-jacking de la page.** C'est ici que la maitrise technique est demontree.

- ScrollCanvas existant conserve (121 frames webp, 9.4Mo)
- Hauteur : 200vh (reduit de 250vh)
- Phase 1 (0-40%) : frames demarrent, vignette cinematique s'intensifie
- Phase 2 (30-70%) : texte overlay fade-in — "Chaque espace a une ame — nous lui donnons une voix"
- Phase 3 (70-100%) : texte fade-out, frames terminent
- Transition : gradient noir → blanc-casse en bas du canvas (CSS)

**Composants supprimes** : Tagline (100vh pour une phrase — la phrase est integree ici)

**Composants reutilises** : ScrollCanvas, AmbianceVideo (ajuster seuils + hauteur)

---

### Section 3 — La Collection (scroll normal)

**Le coeur du site.** 5 produits, 3 blocs visuellement distincts.

#### Bloc A — Le Diffuseur (produit star, full-width)
- Fond blanc-casse
- Layout asymetrique : image gauche (60%), texte droite (40%)
- Image grande avec parallax subtil (GSAP ScrollTrigger)
- Label or, titre Playfair, description, CTA → #contact
- Animation : fade-in trigger-based (pas scrub)

#### Bloc B — Bougie + Huile (duo)
- Fond blanc-casse
- 2 colonnes egales, images centrees
- Logique ProductDuo reutilisee
- Animation : staggered fade-in

#### Bloc C — Parfum Noir + Cristal (duo sombre)
- **Fond noir** — rupture visuelle au sein de la section
- Transition gradient blanc-casse → noir au-dessus
- Parfum Noir a gauche, Cristal a droite
- Cristal : glow radial dore, plus grand que Parfum Noir
- Texte blanc/or

**Composants supprimes** : 3x ProductSection separees, ProductDuo, CollectionGrid (5 composants → 1 section composee)

**Logique reutilisee** : parallax de ProductSection, animations de ProductDuo

---

### Section 4 — L'Univers (scroll normal)

**Storytelling + moodboard.** Fond noir.

#### Sous-partie A — Notre Histoire (compact)
- Pas plein ecran, juste un bloc editorial centre
- Label or "Notre Histoire"
- Titre : "Nee a Dakar, inspiree par le monde"
- Un seul paragraphe (3 lignes) : ancrage Dakar, fait main, haute parfumerie
- Animation : fade-in simple

#### Sous-partie B — Carousel d'experience
- Bande horizontale scrollable (drag mobile, scroll desktop)
- 8-10 images des assets `images/experience/` (hotel, spa, boutiques, salons)
- Format paysage, legendes discretes ("Hotel 5 etoiles, Dakar")
- En fin de carousel : 4 valeurs en ligne horizontale (texte + separateurs dores, pas de counters animes)

**Composants supprimes** : NotreHistoire (section plein ecran), ValuesCounters (counter a 4), BrandMarquee (decoratif pur)

---

### Section 5 — Contact + Footer (scroll normal)

**Conversion directe.** Fond noir.

- Titre : "Echangeons"
- Sous-titre : "Un projet, une idee ? Ecrivez-nous."
- **2 colonnes (desktop) / empilees (mobile)** :
  - Gauche : formulaire contact (nom, email, message, bouton)
  - Droite : bloc WhatsApp prominent (icone, texte, bouton vert) + email + "Dakar, Senegal"

**Footer** : simplifie — Logo + nom + 4 liens nav + copyright. Une ligne sur desktop.

**Composant reutilise** : Contact (logique form, API route, etats), Footer (simplifie)

---

## Elements transversaux

### Navigation
- Conservee telle quelle (deja bien faite)
- Liens mis a jour : Collection (#collection), Univers (#univers), Contact (#contact)
- CTA "Nous contacter" conserve

### WhatsApp flottant
- Conserve, position fixed bottom-right
- Apparition apres 100vh de scroll

### Custom Cursor
- Conserve

### Performance
- GoldenMist : reduit a 40 particules, pas de glow halo sur mobile
- ScrollCanvas : conserve le progressive loading
- Pas de GSAP scrub sauf ambiance canvas — le reste est trigger-based

### Accessibilite
- prefers-reduced-motion : conserve sur tous les composants
- Contrastes : minimum /60 pour texte secondaire, /70 pour nav
- Focus-visible : conserve

---

## Composants a supprimer du codebase

Ces composants ne sont plus importes nulle part (deja morts ou rendus obsoletes) :
- Hero.tsx, Collection.tsx, Experience.tsx, CinematicScroll.tsx
- ProductMorph.tsx, Storytelling.tsx, Values.tsx, LoadingScreen.tsx
- TextReveal.tsx, ScrollFramePlayer.tsx, ProductCard.tsx
- Tagline.tsx (absorbe dans AmbianceVideo)
- HeroConvergence.tsx (remplace par hero statique)
- ValuesCounters.tsx (remplace par valeurs inline)
- BrandMarquee.tsx (supprime)
- NotreHistoire.tsx (absorbe dans section Univers)
- CollectionGrid.tsx (absorbe dans section Collection)
- ProductSection.tsx (logique reutilisee, composant remplace)
- ProductDuo.tsx (logique reutilisee, composant remplace)

## Page finale (page.tsx)

```tsx
<main>
  <Hero />                 {/* 100vh, statique */}
  <AmbianceCanvas />       {/* 200vh, scroll-driven frames */}
  <Collection />           {/* scroll normal, 3 blocs */}
  <Univers />              {/* scroll normal, histoire + carousel */}
  <Contact />              {/* scroll normal, form + whatsapp */}
</main>
<Footer />
```
