# Homepage Rebuild — Scroll-Driven Video Design

**Date**: 2026-03-30
**Approche**: GSAP hero animation + 1 Kling scroll-driven canvas + GSAP product sections
**Reference**: blender-website.vercel.app (Vitamix product showcase)
**Updated**: 2026-03-30 — removed coffret video (poor result), changed hero from video to GSAP animation

---

## Concept

"Le Parcours Olfactif" — une experience scroll cinematique avec un hero GSAP (produits convergents), une video Kling (ambiance diffuseur), et des sections produits premium.

Arc de couleur : noir → creme → sombre → noir (tete, coeur, fond — comme un parfum).

Principe cle : **rythme** — jamais deux produits consecutifs sans respiration visuelle.

---

## Structure (12 sections)

### Zone Sombre — L'Ouverture

#### 1. Loading Screen
- **Type**: Animation existante
- **Fond**: Noir `#000`
- **Animation**: SVG path-draw logo libellule dorée
- **Status**: Existant, inchangé

#### 2. Hero Video (Kling 1 — Convergence)
- **Type**: Scroll-driven canvas
- **Hauteur scroll**: 800vh+
- **Frame start**: Produits espacés + brume dorée (à générer via Gemini depuis `collection-complete-packagings.webp`)
- **Frame end**: `public/images/mockups/collection-complete-packagings.webp` (existante)
- **Mouvement Kling**: Brume se dissipe, produits convergent doucement vers le centre, lumière monte
- **Texte**: Aucun pendant l'animation — laisser l'image parler
- **Transition sortie**: Fondu vers section tagline
- **Frames**: ~120-150 extraites de la vidéo Kling (~5s)

#### 3. Tagline / Brand Statement
- **Type**: Respiration typographique
- **Fond**: Noir profond `#000`
- **Texte**: "L'essence du raffinement invisible"
- **Typo**: Playfair Display, ~5-7vw, doré `#C99700`
- **Animation**: GSAP SplitText — mot par mot au scroll
- **Hauteur**: ~200vh pour un reveal lent

---

### Zone Claire — La Decouverte

#### 4. Diffuseur (produit)
- **Fond**: Blanc casse `#F8F8F8`
- **Layout**: Image droite + texte gauche
- **Image**: `public/images/products/diffuseur-baguettes-v2.png`
- **Label**: "Le Diffuseur"
- **Titre**: "Chaque espace merite une signature olfactive"
- **Animation entree**: Image scale 0.8->1 + fade, texte SplitText ligne par ligne
- **Parallax**: Image vertical subtle

#### 5. Ambiance Video (Kling 2 — Diffuseur Hotel)
- **Type**: Scroll-driven canvas
- **Hauteur scroll**: 600vh
- **Frame start**: Diffuseur dans decor hotel, lumiere tamisee (a generer via Gemini)
- **Frame end**: Meme scene, fumee des batonnets visible, lumiere chaude (Gemini optionnel ou Kling libre)
- **Mouvement Kling**: Fumee douce s'echappant des batonnets, lumiere chaude vivante
- **Frames**: ~100-120 extraites

#### 6. Huile Essentielle (produit)
- **Fond**: Blanc casse `#F8F8F8`
- **Layout**: Image gauche + texte droite (miroir du diffuseur)
- **Image**: `public/images/products/flacon-huile-essentielle-detour.webp`
- **Label**: "L'Huile Essentielle"
- **Titre**: "Des essences pures, une serenite absolue"
- **Animation**: Meme pattern que diffuseur, miroir

---

### Transition

#### 7. Marquee
- **Fond**: Transition creme -> sombre
- **Contenu**: "Libellule Senteurs . Parfums d'interieur haut de gamme" en boucle
- **Typo**: Playfair Display, ~8vw, stroke dore (outline, pas rempli)
- **Animation**: Defilement horizontal infini, vitesse lente
- **Hauteur**: ~100vh, centre verticalement

---

### Zone Chaude — La Profondeur

#### 8. Bougie Parfumee (produit)
- **Fond**: Noir `#000`
- **Layout**: Image droite + texte gauche
- **Image**: `public/images/products/bougie-parfumee-dimensions.webp`
- **Label**: "La Bougie"
- **Titre**: A definir
- **Texte**: Couleur creme/doree sur fond sombre

#### 9. Valeurs / Compteurs
- **Fond**: Noir avec texture subtile
- **Layout**: 3-4 compteurs en ligne
- **Compteurs**: "4 fragrances signature" / "100% naturel" / "Fait main" / "Dakar, Senegal"
- **Animation**: Compteurs qui defilent (0->4, 0->100%) au scroll trigger
- **Texte**: Phrase courte sur la philosophie de la marque
- **Note**: Chiffres a confirmer avec les vraies valeurs de la marque

#### 10. Parfum Noir (produit)
- **Fond**: Noir / gris tres fonce
- **Layout**: Image gauche + texte droite
- **Image**: `public/images/products/parfum-noir-boite-detour.webp`
- **Label**: "Le Parfum d'Ambiance"
- **Titre**: "L'elegance dans chaque detail"
- **Texte**: Couleur creme/doree sur fond sombre

---

### Zone Sombre — Le Climax

#### 11. Cristal (produit climax)
- **Fond**: Noir profond
- **Layout**: Image centree, grande (~60vw)
- **Image**: `public/images/products/parfum-cristal-detour.webp`
- **Label**: "Le Cristal"
- **Titre**: "Au-dela du parfum, une experience"
- **Animation**: Scale lent 0.6->1 + glow dore subtil autour du flacon
- **Particularite**: Mise en scene plus dramatique — avant-dernier acte

#### 12. Coffret Video (Kling 3 — Grand Reveal)
- **Type**: Scroll-driven canvas
- **Hauteur scroll**: 600vh
- **Frame start**: `public/images/products/coffret-frame-start.webp` (existante)
- **Frame end**: `public/images/products/coffret-frame-end.webp` (existante)
- **Mouvement Kling**: Coffret s'ouvre, lumiere doree emane
- **Texte post-video**: "Offrir une ame" — fade in apres la video
- **Frames**: ~100-120 extraites

#### 13. Contact + Footer
- **Fond**: Noir
- **Formulaire**: Minimal avec animations underline dorees
- **Status**: Existant, a adapter au nouveau design

---

## Assets a Produire

### Images (Gemini)
| # | Description | Source | Priorite |
|---|-------------|--------|----------|
| 1 | Frame start hero: produits espaces + brume doree | Depuis `collection-complete-packagings.webp` | Haute |
| 2 | Frame start ambiance: diffuseur dans decor hotel | Nouvelle generation | Haute |
| 3 | Frame end ambiance: meme scene + fumee (optionnel) | Nouvelle generation | Moyenne |

### Videos (Kling ~5s chacune)
| # | Description | Start frame | End frame |
|---|-------------|-------------|-----------|
| 1 | Hero convergence | Gemini #1 | `collection-complete-packagings.webp` |
| 2 | Ambiance diffuseur hotel | Gemini #2 | Gemini #3 ou libre |
| 3 | Coffret ouverture | `coffret-frame-start.webp` | `coffret-frame-end.webp` |

### Extraction frames (FFmpeg)
- Chaque video Kling -> 100-150 frames PNG
- Commande: `ffmpeg -i video.mp4 -vf "fps=30" frames/frame_%04d.png`
- Optimiser en WebP pour le web

---

## Stack Technique

- **Next.js 14+** (App Router) — existant
- **GSAP ScrollTrigger** — scroll-driven canvas + animations sections
- **GSAP SplitText** — text reveals
- **Lenis** — smooth scroll (existant)
- **Canvas API** — rendu frames video au scroll
- **Framer Motion** — transitions mount/unmount si besoin
- **Tailwind CSS v4** — styling

---

## Workflow Implementation

1. Generer images Gemini (3 images)
2. Produire videos Kling (3 videos)
3. Extraire frames FFmpeg
4. Implementer le canvas scroll-driven pour les 3 sections video
5. Implementer les sections produits statiques (5 sections)
6. Implementer les respirations (tagline, marquee, valeurs)
7. Assembler, tester performance, optimiser
