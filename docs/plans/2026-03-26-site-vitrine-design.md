# Design — Site Vitrine Libellule Senteurs

Date: 2026-03-26

## Decisions

- **Structure**: Projet unique Next.js 14+ avec Remotion integre (pas de monorepo)
- **Product Morph**: Image sequence Remotion (90 frames PNG), GSAP ScrollTrigger scrub frame-by-frame
- **Brume Hero**: Canvas 2D temps reel (particules dorees, bruit de Perlin)
- **Loading Screen**: SVG path-draw natif (stroke-dashoffset), pas de Remotion

## Stack

- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- GSAP (ScrollTrigger, SplitText, Draggable, InertiaPlugin) + Lenis (smooth scroll)
- Framer Motion (composants React mount/unmount, hover)
- Remotion 4 + @remotion/three (pre-rendu image sequence Product Morph)
- Three.js / React Three Fiber (particules dorees dans composition Remotion)

## Architecture fichiers

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout (fonts, metadata, Lenis)
    page.tsx                    # Page unique, assemble les sections
    globals.css                 # Tailwind + custom properties
  components/
    layout/
      Navigation.tsx            # Nav transparente fixe + logo
      Footer.tsx
      LoadingScreen.tsx         # SVG path-draw libellule
      CustomCursor.tsx          # Cercle dore GSAP quickTo
    sections/
      Hero.tsx                  # Fullscreen + brume Canvas + text reveal
      ProductMorph.tsx          # Image sequence GSAP ScrollTrigger pin
      Storytelling.tsx          # Texte mot-par-mot au scroll
      Values.tsx                # 4 valeurs staggered entrance
      Collection.tsx            # Carrousel draggable horizontal
      Experience.tsx            # Horizontal scroll section
      Contact.tsx               # Formulaire minimaliste
    animations/
      GoldenMist.tsx            # Canvas 2D particules dorees temps reel
      ScrollFramePlayer.tsx     # Lecteur image sequence au scroll
      TextReveal.tsx            # Composant texte revele au scroll
    ui/
      ProductCard.tsx           # Carte produit hover 3D
      GoldButton.tsx            # CTA style
  hooks/
    useGSAP.ts                  # Wrapper GSAP + cleanup
    useSmoothScroll.ts          # Init Lenis
    useReducedMotion.ts         # prefers-reduced-motion
  lib/
    constants.ts                # Couleurs, breakpoints, config
  remotion/
    Root.tsx                    # RemotionRoot
    ProductMorphSequence.tsx    # Composition: transformation produit 90 frames
    remotion.config.ts
public/
  images/                       # Assets WebP optimises
  frames/                       # Image sequence Product Morph (post-render)
  fonts/
  logo.svg                      # Logo SVG paths separes pour animation
```

## Flux de donnees — Product Morph

```
Remotion (src/remotion/ProductMorphSequence.tsx)
  - Prend image produit AVEC marque
  - Masque le logo (overlay blanc)
  - Anime: masque se dissout, particules dorees, fond blanc->noir, glow
  - Exporte 90 frames PNG (3s @ 30fps)
      |
      v
public/frames/morph-001.png ... morph-090.png
      |
      v
ScrollFramePlayer.tsx
  - GSAP ScrollTrigger pin + scrub
  - Precharge les frames progressivement
  - Affiche frame[N] via canvas drawImage ou img.src swap
      |
      v
Navigateur: animation fluide pilotee par le scroll
```

## Responsive

| Composant | Desktop | Mobile |
|---|---|---|
| Product Morph | 90 frames, pin au scroll | Fondu simple 2 images, pas de pin |
| Brume Hero | Canvas 2D ~100 particules | Canvas 2D ~30 particules |
| Cursor custom | Cercle dore GSAP quickTo | Desactive |
| Carrousel | Drag + hover 3D | Swipe natif |
| Horizontal scroll | Vertical -> horizontal | Vertical classique |
| Texte reveal | Mot par mot au scroll | Paragraphe par paragraphe |

## Performance

- Images: WebP/AVIF via next/image, lazy loading
- Image sequence: preload progressif des 90 frames
- Animations: GPU-only (transform, opacity)
- Code splitting par section (dynamic import)
- Remotion exports: optimises en amont, servis comme assets statiques

## Accessibilite

- `prefers-reduced-motion`: animations desactivees ou reduites a des fades
- Contraste or #C99700 sur noir: ratio 5.2:1 (AA conforme)
- Alt text sur tous les produits
- Navigation clavier
- `aria-hidden` sur elements decoratifs (particules, cursor)

## Images a generer

Les prompts exacts pour les images manquantes sont listes ci-dessous.

### 1. Produit sans marque (pour le Product Morph — CRITIQUE)

**Prompt**: "Product photography of a white ceramic scented candle on a clean white surface, no label, no logo, no text, no branding, minimalist, soft diffused studio lighting, light beige/cream background, high-end luxury feel, same angle as a straight-on front view, 8cm tall cylindrical white matte candle with cream-colored wax visible at the top, photorealistic, 4K"

### 2. Hero — produit phare centre

**Prompt**: "A luxury white ceramic reed diffuser bottle with rattan sticks, centered on a dark matte black background, dramatic studio lighting with golden warm highlights from the side, volumetric light haze, negative space around the product, ultra-premium fragrance product photography, moody atmosphere, no text, no logo, photorealistic, 16:9 aspect ratio, 4K"

### 3. Experience — produit dans un salon luxe

**Prompt**: "Interior design photography of a luxury living room with a white ceramic scented candle on a marble coffee table, warm ambient lighting, dark elegant decor, velvet sofa in deep charcoal, golden accents, soft bokeh background, high-end hotel suite atmosphere, moody and sophisticated, no text, photorealistic, 16:9, 4K"

### 4. Experience — produit dans un hotel

**Prompt**: "Luxury hotel room nightstand with a white reed diffuser bottle with rattan sticks, soft warm bedside lamp lighting, white linen sheets in background, dark wood furniture, golden hour light through sheer curtains, serene and elegant atmosphere, boutique hotel aesthetic, no text, no logo, photorealistic, 16:9, 4K"

### 5. Experience — produit dans un spa

**Prompt**: "Spa treatment room with a white ceramic oil burner with a lit candle, white towels rolled nearby, smooth river stones, bamboo mat, soft diffused natural light, zen minimalist atmosphere, warm tones, premium wellness setting, no text, no logo, photorealistic, 16:9, 4K"

### 6. Experience — produit dans une boutique

**Prompt**: "High-end niche perfumery boutique shelf displaying white ceramic fragrance bottles, dark wood shelving, warm spot lighting from above, luxurious retail environment, shallow depth of field, golden accent lighting, elegant visual merchandising, no text, no logo, photorealistic, 16:9, 4K"
