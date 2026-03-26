# Assets nécessaires — Guide de préparation pour Claude Code

## A. CE QUE CLAUDE CODE PEUT EXTRAIRE DU PDF (150 Mo)

Commande à exécuter en premier :
```bash
# 1. Inventorier les images embarquées
pdfimages -list original.pdf

# 2. Extraire toutes les images en format original (JPEG reste JPEG, PNG reste PNG)
pdfimages -all original.pdf /tmp/extracted/img

# 3. Extraire en PNG pour les images avec transparence
pdfimages -png original.pdf /tmp/extracted/img

# 4. Extraction alternative avec PyMuPDF (conserve la meilleure qualité + métadonnées)
python3 -c "
import fitz
doc = fitz.open('original.pdf')
for page_num, page in enumerate(doc):
    for img_idx, img in enumerate(page.get_images()):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha > 3:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        pix.save(f'/tmp/extracted/page{page_num}_img{img_idx}_{pix.width}x{pix.height}.png')
"
```

### Images attendues dans le PDF :
- ✅ Logo libellule doré (probablement en PNG avec transparence)
- ✅ Logo complet (symbole + texte "Libellule Senteurs")
- ✅ Icône libellule seule (coin supérieur droit des pages)
- ✅ Photos mockups produits (diffuseur, bougie, flacon, brûle-parfum)
- ✅ Photos du polo et des cartes de visite
- ✅ Photos du flacon cristal
- ✅ Photos du coffret bordeaux
- ✅ Éléments décoratifs (libellule filigrane beige en arrière-plan)

### Après extraction, Claude Code devra :
1. Trier par taille (ignorer les images < 50px, ce sont des artefacts)
2. Identifier chaque image et la renommer de manière descriptive
3. Convertir en WebP/AVIF pour le web (garder les originaux aussi)
4. Créer des versions multiples tailles (thumbnail, medium, large, original)
5. Détourer les produits si nécessaire (fond → transparent)

---

## B. LOGO SVG — À RECRÉER PAR CLAUDE CODE

Le PDF contient le logo en raster (pixels). Pour le site on a BESOIN du SVG pour :
- L'animation de dessin trait par trait (loading screen)
- La netteté sur tous les écrans (retina)
- La légèreté en poids de fichier

### Option 1 : Le designer fournit le SVG original (IDÉAL)
Demander à Clic'ArtGraphique / ZizaProd' le fichier .ai ou .svg du logo.

### Option 2 : Claude Code retrace le logo en SVG
À partir de l'image haute résolution extraite du PDF :
- Utiliser `potrace` ou `autotrace` pour vectoriser
- Nettoyer manuellement les paths SVG
- S'assurer que chaque élément est un path séparé (aile gauche, aile droite, corps, cercle, texte) pour pouvoir les animer indépendamment
- Le texte "Libellule Senteurs" et "Parfums d'intérieur Haut de Gamme" doivent être des paths SVG (pas du texte), OU utiliser la font Playfair Display/Cormorant Garamond comme web font

### Structure SVG nécessaire pour l'animation :
```svg
<svg viewBox="0 0 400 400">
  <!-- Groupe cercle -->
  <path id="circle" d="..." />
  
  <!-- Groupe libellule -->
  <g id="dragonfly">
    <path id="wing-left" d="..." />
    <path id="wing-right" d="..." />
    <path id="body" d="..." />
  </g>
  
  <!-- Groupe texte -->
  <g id="brand-text">
    <path id="libellule" d="..." />
    <path id="senteurs" d="..." />
    <path id="tagline" d="..." />
    <line id="line-left" ... />
    <line id="line-right" ... />
  </g>
</svg>
```

---

## C. IMAGES POUR L'ANIMATION "PRODUCT BRANDING MORPH"

C'est l'élément le plus critique. On a 3 approches possibles :

### Approche 1 : Image Sequence via Remotion (RECOMMANDÉ)
Claude Code crée une composition Remotion qui :
1. Prend l'image du produit AVEC marque (extraite du PDF)
2. Crée programmatiquement la version "sans marque" en masquant/effaçant le logo via un rectangle blanc par-dessus
3. Anime la transition : le masque blanc se dissout progressivement, révélant le logo doré
4. Ajoute les effets (particules dorées, changement de fond blanc→noir, glow)
5. Exporte 90 frames PNG (3 secondes à 30fps)

Au scroll, GSAP affiche ces frames une par une = animation parfaitement fluide.

### Approche 2 : Layers CSS avec GSAP
Deux images superposées :
- Layer bottom : Produit AVEC marque
- Layer top : Produit SANS marque (ou produit avec marque + rectangle blanc par-dessus le logo)
- Au scroll : Le layer top se dissout (opacity 1→0) ou se masque (clip-path animation)
- Le fond change de couleur simultanément (blanc → noir)

Plus simple, moins de dépendances, mais moins spectaculaire.

### Approche 3 : CSS/Canvas paint
- Un seul produit avec marque
- Au scroll, un effet de "peinture dorée" se répand sur la zone du logo (comme si on peignait le logo en temps réel)
- Réalisable avec un canvas overlay et un mask animé

### Ce qu'il faut préparer :
- ✅ Photo du produit haute résolution (sera extraite du PDF)
- ✅ Position exacte du logo sur le produit (pour savoir où animer)
- ⚠️ Idéalement : photo du même produit SANS logo (demander au designer)
- 🔄 Sinon : Claude Code peut masquer le logo avec du clone/inpainting basique ou simplement un overlay blanc/crème

---

## D. VIDÉO DE BRUME/FUMÉE DORÉE (Hero background)

### Option 1 : Remotion (RECOMMANDÉ)
Claude Code crée une composition Remotion avec :
- Canvas 2D ou Three.js (via @remotion/three)
- Système de particules dorées (#C99700) avec mouvement organique
- Bruit de Perlin pour le mouvement fluide
- Export en WebM avec transparence (alpha channel)
- Durée : boucle de 5-10 secondes
- Résolution : 1920x1080

### Option 2 : CSS/Canvas pur
- Canvas 2D avec particules animées en JS
- Plus léger, temps réel, mais moins cinématique
- Bon fallback mobile

### Option 3 : Vidéo stock
- Télécharger une vidéo de fumée/brume dorée sur Pexels, Pixabay, ou Coverr (gratuit)
- La teinter en #C99700 avec ffmpeg ou en CSS (mix-blend-mode)
- Plus rapide à mettre en place

---

## E. AUTRES IMAGES À GÉNÉRER/PRÉPARER

### Icônes des valeurs (SVG)
Claude Code créera 4 icônes SVG minimalistes en doré :
- Élégance (plume ou diamant stylisé)
- Raffinement (détail fin, filigrane)
- Nature (feuille ou goutte)
- Sérénité (vague ou cercle zen)

### Favicon
- Extraire l'icône de la libellule seule du PDF
- Convertir en favicon multi-taille (16x16, 32x32, 180x180 apple-touch-icon)

### Open Graph / Social
- Image OG 1200x630 avec logo centré sur fond noir
- Image pour WhatsApp/Twitter card

### Textures de fond
- Grain subtil en PNG (overlay à 2-5% d'opacité)
- Pattern de libellule en filigrane très léger (SVG, opacité 3-5%)

---

## F. RÉSUMÉ — CHECKLIST AVANT DE LANCER

### Claude Code peut faire seul ✅
- [ ] Extraire toutes les images du PDF 150 Mo
- [ ] Trier, renommer, optimiser les images
- [ ] Retracer le logo en SVG (si le designer ne fournit pas)
- [ ] Créer les icônes SVG des valeurs
- [ ] Générer la brume/fumée dorée (Remotion ou Canvas)
- [ ] Créer l'image sequence du Product Morph (Remotion)
- [ ] Générer le favicon, les images OG
- [ ] Créer les textures de fond

### À demander au designer (IDÉAL mais pas bloquant) 🎨
- [ ] Logo en SVG/AI natif
- [ ] Photo produit SANS marque (même angle que la version avec marque)
- [ ] Photos produits détourées individuellement (fond transparent)
- [ ] Photos des produits en contexte (hôtel, salon, spa)

### Si le designer ne fournit pas, Claude Code peut contourner 🔄
- Logo SVG → retracer avec potrace depuis le PNG haute résolution
- Produit sans marque → masquer le logo avec un patch couleur crème/blanc
- Photos détourées → utiliser rembg (remove background) en Python
- Photos en contexte → utiliser des photos stock de Pexels/Unsplash
