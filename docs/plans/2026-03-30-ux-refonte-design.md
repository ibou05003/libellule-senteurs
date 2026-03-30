# Refonte UX Homepage — Libellule Senteurs

**Date** : 2026-03-30
**Objectif** : Corriger les problemes UX critiques et ajouter les chemins de conversion manquants
**Approche** : B — Refonte UX (structure + conversion)
**Cible** : Double usage B2B (impressionner) + B2C (convertir via WhatsApp/contact)

---

## Contexte

L'audit a revele :
- Navigation cassee (3 liens sur 4 pointent vers des IDs inexistants)
- 10+ ecrans de scroll avant le premier contenu substantiel
- Contrastes WCAG en echec sur la moitie du texte secondaire
- Tailles de texte illisibles (8-9px)
- Aucun chemin de conversion (formulaire muet, pas de WhatsApp)
- Contenu manquant (pas de storytelling, pas de vue collection)
- Loading screen sans justification technique
- Donnees placeholder (faux numero de telephone)

## Changements

### 1. Corrections fondamentales

#### Navigation — liens fonctionnels
| Lien | Anchor | Action |
|------|--------|--------|
| Notre Histoire | `#histoire` | Nouvelle section storytelling |
| Collection | `#collection` | Nouvelle section grille produits |
| Experience | `#ambiance` | Renommer vers section video existante |
| Contact | `#contact` | Deja correct |

#### Contrastes — plancher global
| Usage | Opacite minimum |
|-------|----------------|
| Texte decoratif (copyright, separateurs) | `/50` |
| Texte secondaire (sous-titres, labels) | `/60` |
| Texte navigation | `/70` |

#### Tailles de texte — plancher 12px
| Avant | Apres | Localisation |
|-------|-------|-------------|
| `text-[8px]` | `text-[11px]` | Sous-titre nav |
| `text-[9px]` | `text-xs` (12px) | Hero subtitle, labels contact, footer |
| `text-[10px]` | `text-xs` (12px) | Nav links, footer links |

#### Placeholders
- Supprimer le faux numero `(+221) 77 000 00 00` partout
- Garder email + "Dakar, Senegal"

### 2. Reduction du scroll

| Section | Avant | Apres |
|---------|-------|-------|
| Hero | 300vh | 200vh |
| Tagline | 150vh | 100vh |
| Ambiance | 400vh | 250vh |
| **Total economise** | | **~300vh** |

### 3. Suppression du loading screen

Ne plus rendre `<LoadingScreen>`. Le hero gere sa propre entree.
Le composant reste dans le code (pas de suppression de fichier).

### 4. Nouvelle section "Notre Histoire"

- **Position** : apres ProductDuo, avant Collection
- **ID** : `histoire`
- **Layout** : fond noir, texte centre, editorial
- **Contenu** :
  - Label or : "Notre Histoire"
  - Ligne separatrice or
  - Titre Playfair : "Nee a Dakar, inspiree par le monde"
  - 2-3 paragraphes Jost, `text-blanc-casse/70`, max-w-2xl
  - Animation : fade-in texte au scroll (meme pattern que les autres sections)
- **Pas d'image** pour l'instant

### 5. Nouvelle section "Collection"

- **Position** : apres Notre Histoire, avant BrandMarquee
- **ID** : `collection`
- **Layout** : fond blanc-casse, grille
- **Contenu** :
  - Titre centre : "La Collection"
  - Grille : 2 cols mobile, 4 cols desktop
  - 5 cartes : Diffuseur, Bougie, Huile, Parfum Noir, Cristal
  - Chaque carte : image + nom + CTA "Decouvrir" (ancre vers la section produit)
  - Animation : staggered fade-in (meme pattern que ProductDuo)

### 6. WhatsApp flottant

- **Position** : fixed bottom-right, z-50
- **Apparition** : apres 100vh de scroll
- **Taille** : 56x56px, cercle vert WhatsApp
- **Lien** : `https://wa.me/221XXXXXXXXX` (placeholder conscient, a remplir)
- **Hover** : scale 1.1 + tooltip "Ecrivez-nous"

### 7. CTA par produit

Dans chaque `ProductSection`, sous la description :
- Bouton ghost "En savoir plus" → lien vers `#contact`
- Style coherent avec le bouton du formulaire contact

### 8. Formulaire contact fonctionnel

- API Route `/api/contact` (Next.js App Router)
- Validation serveur (nom, email, message)
- Envoi via Resend (ou Formspree en fallback)
- Frontend : etat loading, gestion erreur, confirmation reelle

### 9. Optimisation GoldenMist

IntersectionObserver pour pause/resume du rAF quand le hero sort du viewport.

### 10. Structure finale

```
1.  Hero (200vh)              — brand reveal + photo
2.  Tagline (100vh)           — philosophie mot-a-mot
3.  Diffuseur                 — produit star, light
4.  Ambiance Video (250vh)    — scroll canvas
5.  ProductDuo                — Bougie + Huile, light
6.  Notre Histoire            — storytelling, dark        [NOUVEAU]
7.  Collection                — grille produits, light    [NOUVEAU]
8.  BrandMarquee              — double marquee, dark
9.  Parfum Noir               — produit dark
10. ValuesCounters            — chiffres, dark
11. Cristal                   — produit climax, dark
12. Contact                   — formulaire reel, dark
13. Footer
+   WhatsApp flottant                                     [NOUVEAU]
```
