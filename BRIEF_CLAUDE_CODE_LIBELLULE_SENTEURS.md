# Brief — Site Next.js Libellule Senteurs
## Présentation client • Parfums d'intérieur Haut de Gamme

---

## 1. LA MARQUE

**Nom** : Libellule Senteurs
**Tagline** : Parfums d'intérieur Haut de Gamme
**Positionnement** : Premium / Luxe
**Valeurs** : Élégance • Raffinement • Nature • Sérénité
**Cible** : Clientèle haut de gamme, hôtels, boutiques luxe, particuliers exigeants
**Localisation** : Dakar, Sénégal
**Contact** : contacts@libellulessenteurs.com | www.libellulessenteurs.com | (+221) 77 000 00 00
**Instagram** : @libellulesenteurs

**Concept visuel** : La libellule symbolise la légèreté, la pureté et l'évasion olfactive. Le cercle qui l'entoure représente un univers maîtrisé, harmonieux et enveloppant.

**Storytelling** :
> "L'essence du raffinement invisible"
> Libellule Senteurs invite à ralentir, à ressentir, à transformer chaque espace en une expérience sensorielle unique. Ce n'est pas simplement parfumer un espace… c'est lui donner une âme. C'est transformer l'invisible en émotion. Parce que les plus belles expériences ne se voient pas… elles se ressentent.

---

## 2. CHARTE GRAPHIQUE

### Couleurs
| Nom | HEX | RGB | Usage |
|-----|-----|-----|-------|
| Or Luxe | `#C99700` | 201 / 151 / 0 | Couleur signature, logo, éléments premium |
| Noir Profond | `#000000` | 0 / 0 / 0 | Élégance, contraste, packaging luxe |
| Blanc Cassé | `#F8F8F8` | 248 / 248 / 248 | Pureté, minimalisme, fonds |

### Typographie
- **Typo principale (Logo)** : Luxia Display — Serif élégante, pour titres et branding
- **Alternative web** : Utiliser Playfair Display ou Cormorant Garamond comme fallback web (Google Fonts) pour les titres. Pour le body text, utiliser une sans-serif fine comme Lato, Montserrat Light ou Jost.

### Logo
- **Principal** : Or (#C99700) sur fond clair — libellule dorée dans un cercle + texte
- **Inversé** : Or sur fond noir
- **Secondaire** : Noir sur fond blanc (usage économique)
- **Déclinaisons** : Vertical (symbole au-dessus du texte) et Horizontal (symbole à gauche du texte)
- **Zone de protection** : ≈ hauteur du symbole autour du logo
- **Règles** : Ne jamais déformer, ne jamais changer les couleurs

### Produits de la gamme (visibles dans les mockups)
- Diffuseur à bâtonnets (vase blanc avec tiges en rotin)
- Bougie parfumée (pot blanc, 7.1cm × 8cm)
- Flacon compte-gouttes / huile essentielle (flacon givré, bouchon doré)
- Brûle-parfum en céramique blanche (forme arche)
- Flacon de parfum d'ambiance (cristal taillé, version luxe)
- Coffret cadeau (boîtes et pochettes bordeaux/prune avec logo doré)
- Spray d'ambiance (flacon noir avec logo doré)

---

## 3. OBJECTIF DU SITE

Site de **présentation / vitrine** pour montrer au client la marque et ses produits. Ce n'est PAS un e-commerce (pour l'instant). L'objectif est d'impressionner, de transmettre le raffinement et le luxe de la marque.

---

## 4. DIRECTION ARTISTIQUE DU SITE

### Ambiance
- **Luxe discret** : Pas tape-à-l'œil, mais raffiné. Penser Diptyque, Byredo, Le Labo, Acqua di Parma.
- **Fond sombre dominant** (noir / noir profond) avec accents dorés
- **Espaces généreux** : Beaucoup de negative space, respiration
- **Mouvement fluide** : Animations douces, organiques, qui évoquent la diffusion d'un parfum dans l'air
- **Textures** : Grain subtil, effets de lumière dorée, reflets

### Sites de référence pour l'inspiration
- **diptyqueparis.com** — Ton, élégance, navigation luxe
- **acquadiparma.com** — Palette dorée/chaude très proche de Libellule
- **trudon.com** — Bougies de luxe, heritage, raffinement
- **byredo.com** — Minimalisme poussé, espaces immenses
- **carolinaherrera.com** (virtual store) — SOTD Awwwards, expérience 3D immersive
- **madewithgsap.com** — Référence technique pour les effets GSAP

---

## 5. ANIMATION PHARE — "Product Branding Morph" (PIÈCE MAÎTRESSE)

### Concept
Inspiré de l'animation d'ouverture de zymocosmetics.com : un produit sans marque qui se transforme en produit brandé en transitionnant entre deux sections.

### Adaptation pour Libellule Senteurs
Un flacon/bougie/diffuseur blanc **neutre, épuré, sans aucune marque** apparaît dans la première section du site. Au scroll, le produit est **pinned** (reste fixe au centre de l'écran) et accompagne l'utilisateur vers la section suivante. Pendant cette transition scroll :

1. **Phase 1 — Le produit brut** : Le produit blanc neutre est visible, éclairage doux, fond blanc cassé. Texte d'accroche : "Un objet. Un espace. Une attente..."
2. **Phase 2 — La transformation** : Au scroll, le fond commence à s'assombrir (transition vers noir). Des particules dorées subtiles apparaissent autour du produit. Un effet de lumière dorée commence à se poser sur le produit.
3. **Phase 3 — La révélation** : Le logo de la libellule dorée se matérialise sur le produit (fade-in avec léger shimmer/glow doré). Le texte "Libellule Senteurs" apparaît. Le produit est maintenant brandé, sur fond noir luxe. Tagline finale : "C'est lui donner une âme."

### Symbolique
Cette animation traduit visuellement le storytelling de la marque : Libellule Senteurs ne fabrique pas un simple produit — elle lui donne une identité, une âme. Le passage du blanc neutre au noir luxe avec accents dorés raconte cette transformation.

### Technique
- **GSAP ScrollTrigger** : pin du produit, scrub lié au scroll
- **GSAP Timeline** : séquence coordonnée (fond, particules, logo, texte)
- **Remotion** (option A) : Pré-rendre la séquence de transformation du produit comme une image sequence (60-120 frames PNG). Au scroll, GSAP avance frame par frame → animation ultra-fluide type Apple product page. Avantage : rendu pixel-perfect, pas de problème de performance avec les layers.
- **Layers CSS** (option B) : Produit sans marque (layer 1) + Logo overlay (layer 2) avec opacity/clip-path animés via GSAP.
- Référence technique : Effects 006/007 de Made With GSAP (pinned scroll sections)

---

## 6. TOUTES LES ANIMATIONS DU SITE

### Loading Screen
- Animation du logo de la libellule qui se dessine **trait par trait** (SVG path animation)
- Fond noir, trait doré (#C99700) qui dessine progressivement la libellule
- Barre de progression minimale en bas
- **Remotion** : Pré-rendre cette animation en vidéo MP4/WebM optimisée comme fallback ou comme animation principale (rendu parfait, même sur mobile faible)

### Hero Section
- Plein écran, fond sombre
- Produit phare centré avec effet de brume/fumée dorée animée
- **Remotion** : Créer une boucle de fumée/brume dorée animée en React, exporter en vidéo transparente (WebM avec alpha channel), superposer au hero en background
- Texte qui se révèle **lettre par lettre** (GSAP SplitText)
- Parallax multi-couches (produit, fumée, texte à des vitesses différentes)
- Scroll indicator animé en bas (flèche ou cercle qui pulse)
- Réf : Made With GSAP Effect 005 (scroll reveal cinématique)

### Section "Product Branding Morph" (voir §5 ci-dessus)
- C'est la transition entre le Hero et la suite du site
- **L'animation la plus importante et impressionnante du site**
- **Remotion** : Rendre la séquence de transformation du produit (sans marque → avec marque) comme une image sequence de 60-120 frames. GSAP ScrollTrigger scrub l'avancement frame par frame au scroll.

### Section Storytelling — "Notre Histoire"
- Texte du storytelling révélé **mot par mot** au scroll (chaque mot passe de gris foncé à blanc/doré quand on scrolle)
- Libellule SVG en filigrane en arrière-plan, légèrement animée (mouvement d'ailes subtil en boucle)
- Réf : Made With GSAP Effects 009/010/011 (scroll text reveals)

### Section Valeurs
- 4 valeurs (Élégance, Raffinement, Nature, Sérénité) avec icônes dorées
- Animation séquentielle staggered au scroll (chaque valeur apparaît l'une après l'autre)
- Fond qui change subtilement de teinte entre chaque valeur

### Section Collection / Produits
- **Carrousel draggable horizontal** avec inertie (drag & throw)
- Chaque produit : hover avec rotation 3D légère + reflet de lumière qui suit la souris
- Au clic : expansion en modal plein écran avec détails produit
- Réf : Made With GSAP Effects 008/019/026/028 (drag + infinite carousel)

### Section Expérience
- **Horizontal scroll section** : au scroll vertical, la section défile horizontalement
- Montre les produits dans leur contexte : hôtel, salon luxe, spa, boutique
- Chaque scène avec parallax interne (produit au premier plan, décor en fond)
- Réf : Made With GSAP Effects 012/013/014 (scroll + infinite)

### Section Contact
- Formulaire minimaliste, champs avec animation d'underline dorée au focus
- Coordonnées avec icônes animées au hover
- Map optionnelle (style sombre/monochrome)

### Interactions globales
- **Cursor personnalisé** : Cercle doré fin (#C99700) qui suit la souris avec delay (GSAP quickTo)
- **Hover sur les produits** : Effet de lumière qui suit la souris sur la surface du produit (Mouse Move)
- **Transitions entre sections** : Effet de "vague" ou brume dorée
- **Marquee infini** en bas de certaines sections avec noms de fragrances
- Réf : Made With GSAP Effects 000/002/017/020/025 (mouse move effects)

---

## 7. STACK TECHNIQUE

### Core
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** pour le styling de base

### Animations
- **GSAP** (GreenSock) — Moteur d'animation principal
  - ScrollTrigger — animations liées au scroll, pin, scrub
  - SplitText — animation de texte lettre par lettre / mot par mot
  - Draggable — carrousel produits draggable
  - InertiaPlugin — momentum naturel après drag
  - ScrollSmoother ou **Lenis** — smooth scroll
- **Framer Motion** — Animations de composants React (mount/unmount, layout animations, hover states)

### Vidéo & Séquences animées — Remotion
- **Remotion** — Pour créer des séquences animées programmatiques en React :
  - **Loading screen** : Pré-rendre l'animation SVG de la libellule en vidéo MP4/WebM optimisée
  - **Vidéo hero background** : Boucle de fumée/brume dorée animée, export en vidéo transparente WebM
  - **Image sequence Product Morph** : Rendre 60-120 frames PNG de la transformation produit (sans marque → avec marque). Au scroll, GSAP affiche frame par frame = animation ultra-fluide type Apple.
  - **Contenu social / marketing** : Générer des vidéos promo réutilisables pour Instagram/TikTok depuis les composants React du site

### 3D (optionnel)
- **Three.js / React Three Fiber** — Particules dorées, effet de fumée, éventuellement modèle 3D du produit

### Performance
- Lazy loading images (next/image)
- Animations GPU-accelerated (transform, opacity uniquement)
- Code splitting par section
- Vidéos Remotion en format optimisé (WebM + MP4 fallback)
- `prefers-reduced-motion` : désactiver les animations lourdes

---

## 8. STRUCTURE DU SITE (Sections dans l'ordre)

```
1. [Loading Screen] — Libellule SVG qui se dessine (vidéo Remotion ou SVG animé)
2. [Navigation] — Transparente, fixe, logo + liens + CTA
3. [Hero] — Plein écran, produit + brume Remotion + texte animé
4. [Product Morph] — ⭐ PIÈCE MAÎTRESSE : produit neutre → produit brandé au scroll
5. [Storytelling] — Texte révélé au scroll, libellule filigrane
6. [Valeurs] — 4 valeurs avec icônes dorées, apparition séquentielle
7. [Collection] — Carrousel draggable de produits
8. [Expérience] — Horizontal scroll, produits en contexte
9. [Contact] — Formulaire minimaliste
10. [Footer] — Logo, liens, réseaux, copyright
```

---

## 9. ASSETS DISPONIBLES

### Images extraites de la charte (924×1316px — pages complètes)
Les fichiers `1.jpeg` à `12.jpeg` sont des captures de pages de la charte :
- `1.jpeg` : Couverture avec logo
- `2.jpeg` : Storytelling
- `3.jpeg` : ADN de la marque
- `4.jpeg` : Logo & déclinaisons
- `5.jpeg` : Règles d'utilisation du logo
- `6.jpeg` : Palette de couleurs
- `7.jpeg` : Typographie (Luxia Display)
- `8.jpeg` : Packagings mockups (diffuseur, bougie, flacon, brûle-parfum)
- `9.jpeg` : Cartes de visite + polo
- `10.jpeg` : Photos produits (flacon, diffuseur, bougie avec dimensions)
- `11.jpeg` : Parfum cristal + coffret bordeaux + flacon noir
- `12.jpeg` : Crédits

### ⚠️ IMPORTANT — Assets haute résolution nécessaires
Demander au designer (Clic'ArtGraphique / ZizaProd') :
- Logo en **SVG** (avec paths individuels pour l'animation de dessin)
- Logo en **PNG transparent** (différentes tailles)
- Photos produits **individuelles détourées** en haute résolution (fond transparent)
- Version du produit **sans marque** (pour l'animation Product Morph)
- Version du produit **avec marque** (pour l'animation Product Morph)
- Mockups produits en contexte (hôtel, salon, spa)

En attendant les assets finaux, utiliser les images extraites comme placeholders.

---

## 10. RÉFÉRENCES TECHNIQUES MADE WITH GSAP

Catalogue sur madewithgsap.com/effects — effets les plus pertinents :

| Usage sur le site | Effets recommandés | Type |
|---|---|---|
| Hero cinématique | 005 | Scroll |
| Product Morph (pin + scrub) | 006, 007 | Scroll (pinned sections) |
| Carrousel produits | 008, 019, 026, 028 | Drag + Infinite |
| Texte révélé au scroll | 009, 010, 011 | Scroll |
| Horizontal scroll | 012, 013, 014 | Scroll + Infinite |
| Cursor / hover produits | 000, 002, 017, 020, 025 | Mouse Move |
| Marquee infini | 034, 047, 050 | Scroll + Infinite |
| Scroll + Mouse combinés | 043, 045 | Scroll + Mouse Move |

---

## 11. NOTES FINALES POUR CLAUDE CODE

- Le site doit être **exceptionnellement beau**. Niveau Awwwards / FWA. Penser site de marque de niche luxe.
- L'animation "Product Branding Morph" est la **pièce maîtresse** — elle doit être parfaite.
- Chaque animation doit être **fluide et subtile** — jamais aggressive ou flashy. Penser diffusion de parfum : lent, enveloppant, mémorable.
- Le doré (#C99700) est utilisé avec **parcimonie** pour garder son impact premium. Le noir et le blanc dominent, le doré accentue.
- Le texte doit être **aéré** avec beaucoup d'interlignage (1.6-1.8 pour le body) et de spacing généreux.
- **Performance** : WebP/AVIF, lazy loading, GPU-accelerated animations, code splitting.
- **Remotion** : Utiliser pour pré-rendre les séquences complexes (loading, fumée, image sequences produit) → fluidité garantie même sur appareils modestes.
- **Responsive** : Impeccable sur mobile. Sur mobile : pas de cursor custom, drag au lieu de hover, réduire les particules, simplifier le Product Morph (fondu simple au lieu de pin).
- **Langue** : Français principalement.
- **Accessibilité** : `prefers-reduced-motion`, alt text, contraste suffisant.
- **Son** (bonus optionnel) : Micro-sons ambiants très discrets au scroll/hover avec toggle on/off.
