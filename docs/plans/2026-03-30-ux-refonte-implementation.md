# UX Refonte Homepage — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all critical UX issues (broken nav, contrast, scroll weight, missing content, no conversion paths) and make the homepage functional for both B2B and B2C.

**Architecture:** Modify existing components in-place for corrections. Create 3 new section components (Notre Histoire, Collection, WhatsApp). Create 1 API route for contact form. Assemble in page.tsx last.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, GSAP ScrollTrigger, Zod (already installed), Resend (new dependency for email).

---

## Task 1: Fix contrasts, text sizes, and placeholder data across all components

This is a broad sweep across many files. Each file gets specific, targeted edits.

**Files:**
- Modify: `src/components/layout/Navigation.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/HeroConvergence.tsx`
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/components/sections/AmbianceVideo.tsx`
- Modify: `src/components/sections/ValuesCounters.tsx`
- Modify: `src/components/sections/BrandMarquee.tsx`

### Step 1: Fix Navigation.tsx

**Nav links** — update the `NAV_LINKS` array:
```tsx
const NAV_LINKS = [
  { href: "#histoire", label: "Notre Histoire" },
  { href: "#collection", label: "Collection" },
  { href: "#ambiance", label: "Expérience" },
  { href: "#contact", label: "Contact" },
] as const;
```

**Text sizes** — fix the nav subtitle from `text-[8px]` to `text-[11px]`:
```tsx
// Line 79: change text-[8px] to text-[11px]
<span className="font-body text-[11px] text-blanc-casse/60 tracking-[0.22em] uppercase leading-none hidden sm:block">
```
Note: also changed `/40` to `/60` for contrast.

**Nav link opacity** — change `text-blanc-casse/60` to `text-blanc-casse/70` on desktop links:
```tsx
// Line 91
className="relative text-blanc-casse/70 hover:text-blanc-casse transition-colors duration-400 py-3 cursor-pointer group"
```

**Mobile menu link opacity** — change `text-blanc-casse/70` stays (already acceptable).

**Remove phone number from footer nav links** — no phone in Navigation, so no change needed there.

### Step 2: Fix Footer.tsx

**Remove fake phone number** — delete the phone `<a>` and its preceding separator:
```tsx
// Remove these lines (around lines 47-49):
// <span className="hidden sm:inline text-blanc-casse/15">|</span>
// <a href="tel:+221770000000" ...>(+221) 77 000 00 00</a>
```

**Fix text sizes** — all `text-[9px]` → `text-xs`, all `text-[10px]` → `text-xs`:
- Line 29: `text-[9px]` → `text-xs` (subtitle)
- Line 34: `text-[10px]` → `text-xs` (nav links)
- Line 42: `text-[10px]` → `text-xs` (contact info)
- Line 60: `text-[10px]` → `text-xs` (social)
- Line 69: `text-[9px]` → `text-xs` (copyright)

**Fix contrast** — raise all low opacities:
- `text-blanc-casse/35` → `text-blanc-casse/50` (contact info, social)
- `text-blanc-casse/25` → `text-blanc-casse/50` (copyright)
- `text-blanc-casse/40` → `text-blanc-casse/60` (nav links)
- `text-blanc-casse/15` → `text-blanc-casse/30` (separators)
- `border-blanc-casse/[0.06]` → `border-blanc-casse/10` (borders)

### Step 3: Fix HeroConvergence.tsx

**Text sizes:**
- Line 160: `text-xs md:text-sm lg:text-lg` is fine (12px base)
- Line 168: `text-[9px]` → `text-xs` for the subtitle

**Contrast:**
- Line 168: `text-blanc-casse/40` → `text-blanc-casse/60`

### Step 4: Fix Contact.tsx

**Remove phone number** — delete the phone `<a>` and its separator (lines 126-131):
```tsx
// Remove:
// <span className="hidden md:inline text-blanc-casse/20">·</span>
// <a href="tel:+221770000000" ...>(+221) 77 000 00 00</a>
```

**Text sizes:**
- Line 37: `text-[9px]` → `text-xs` (section label)
- Line 44: `text-[10px]` → `text-xs` (subtitle)
- Line 106: `text-[9px]` → `text-xs` (button)
- Line 118: `text-[10px]` → `text-xs` (contact details)

**Contrast:**
- Line 37: `text-blanc-casse/45` → `text-blanc-casse/60`
- Line 44: `text-blanc-casse/50` → `text-blanc-casse/60`
- Line 118: `text-blanc-casse/45` → `text-blanc-casse/60`
- Line 125: `text-blanc-casse/20` → `text-blanc-casse/30` (separator dots)

### Step 5: Fix AmbianceVideo.tsx

Add `id="ambiance"` to the section so the nav link `#ambiance` works. The ScrollCanvas wrapper needs the id passed through.

In `AmbianceVideo.tsx`, wrap the return in a div with the id:
```tsx
return (
  <div id="ambiance">
    <ScrollCanvas ...>
      ...
    </ScrollCanvas>
  </div>
);
```

Also fix reduced-motion fallback to include the id:
```tsx
return (
  <section id="ambiance" className="relative h-screen">
```

**Text sizes:**
- Line 75: `text-[10px]` → `text-xs`

### Step 6: Fix ValuesCounters.tsx

**Contrast:**
- Line 89: `text-blanc-casse/70` is fine
- Line 91: `text-blanc-casse/40` → `text-blanc-casse/50`
- Line 73, 100: `bg-or-luxe/30` → `bg-or-luxe/40` (decorative borders)

### Step 7: Build check

Run: `npm run build`
Expected: Clean build, no errors.

### Step 8: Commit

```bash
git add src/components/layout/Navigation.tsx src/components/layout/Footer.tsx \
  src/components/sections/HeroConvergence.tsx src/components/sections/Contact.tsx \
  src/components/sections/AmbianceVideo.tsx src/components/sections/ValuesCounters.tsx
git commit -m "Fix navigation links, WCAG contrast, text sizes, and placeholder data"
```

---

## Task 2: Reduce scroll heights and remove loading screen

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/HeroConvergence.tsx:117` (height)
- Modify: `src/components/sections/Tagline.tsx:48` (height)
- Modify: `src/components/sections/AmbianceVideo.tsx:55` (scrollHeight prop)

### Step 1: Reduce Hero from 300vh to 200vh

In `HeroConvergence.tsx` line 117:
```tsx
// Before:
<section ref={containerRef} style={{ height: "300vh" }} className="relative">
// After:
<section ref={containerRef} style={{ height: "200vh" }} className="relative">
```

The scroll animation phases use normalized progress (0-1), so reducing height just makes the animation faster — no phase logic changes needed.

### Step 2: Reduce Tagline from 150vh to 100vh

In `Tagline.tsx` line 48:
```tsx
// Before:
<section ref={containerRef} style={{ height: "150vh" }} className="relative">
// After:
<section ref={containerRef} style={{ height: "100vh" }} className="relative">
```

### Step 3: Reduce AmbianceVideo from 400vh to 250vh

In `AmbianceVideo.tsx` line 55:
```tsx
// Before:
scrollHeight="400vh"
// After:
scrollHeight="250vh"
```

### Step 4: Remove loading screen from page.tsx

In `page.tsx`, remove the loading screen state and rendering:

Remove imports:
```tsx
// Remove: import { useState, useCallback } from "react";
// Replace with: (nothing — no more state needed for loading)
// Remove: import LoadingScreen from "@/components/layout/LoadingScreen";
```

Remove state:
```tsx
// Remove:
// const [loaded, setLoaded] = useState(false);
// const handleLoadingComplete = useCallback(() => { setLoaded(true); }, []);
```

Remove rendering:
```tsx
// Remove:
// {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}
```

Keep `useSmoothScroll()` — it's still needed.

The `page.tsx` becomes simpler: just imports, `useSmoothScroll()`, and JSX.

### Step 5: Build check

Run: `npm run build`
Expected: Clean build.

### Step 6: Commit

```bash
git add src/app/page.tsx src/components/sections/HeroConvergence.tsx \
  src/components/sections/Tagline.tsx src/components/sections/AmbianceVideo.tsx
git commit -m "Reduce scroll heights by 300vh and remove loading screen"
```

---

## Task 3: Create Notre Histoire section

**Files:**
- Create: `src/components/sections/NotreHistoire.tsx`

### Step 1: Create the component

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function NotreHistoire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    });

    const children = content.children;
    for (let i = 0; i < children.length; i++) {
      tl.fromTo(
        children[i],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        i * 0.15
      );
    }

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      id="histoire"
      ref={sectionRef}
      className="relative bg-noir-profond px-4 py-24 md:px-8 md:py-32 lg:py-40"
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-2xl text-center"
      >
        <p
          className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Notre Histoire
        </p>
        <div
          className="mx-auto my-5 h-px w-16 bg-or-luxe/60"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        />
        <h2
          className="font-heading text-2xl leading-tight text-blanc-casse md:text-4xl lg:text-5xl"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Née à Dakar, inspirée par le monde
        </h2>
        <p
          className="mt-8 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Libellule Senteurs est née d&apos;une conviction simple : chaque
          espace mérite une identité olfactive. Depuis Dakar, nous créons des
          parfums d&apos;intérieur qui marient les essences d&apos;Afrique de
          l&apos;Ouest aux traditions de la haute parfumerie.
        </p>
        <p
          className="mt-6 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Chaque création est fabriquée à la main, avec des ingrédients
          naturels soigneusement sélectionnés. Du choix des essences à la
          finition de l&apos;écrin, nous portons une attention méticuleuse à
          chaque détail — parce que le luxe réside dans ce qu&apos;on ne voit
          pas, mais qu&apos;on ressent.
        </p>
      </div>
    </section>
  );
}
```

### Step 2: Build check

Run: `npm run build`
Expected: Clean build (component not yet imported in page.tsx — that's Task 8).

### Step 3: Commit

```bash
git add src/components/sections/NotreHistoire.tsx
git commit -m "Add Notre Histoire storytelling section"
```

---

## Task 4: Create Collection grid section

**Files:**
- Create: `src/components/sections/CollectionGrid.tsx`

### Step 1: Create the component

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: "diffuseur",
    name: "Le Diffuseur",
    image: "/images/products/diffuseur-baguettes-v2.png",
    aspect: "3/4",
  },
  {
    id: "bougie",
    name: "La Bougie",
    image: "/images/products/bougie-sans-marque.webp",
    aspect: "3/4",
  },
  {
    id: "huile",
    name: "L'Huile Essentielle",
    image: "/images/products/flacon-huile-essentielle-detour.webp",
    aspect: "3/4",
  },
  {
    id: "parfum-noir",
    name: "Le Parfum Noir",
    image: "/images/products/parfum-noir-boite-detour.webp",
    aspect: "4/5",
  },
  {
    id: "cristal",
    name: "Le Cristal",
    image: "/images/products/parfum-cristal-detour.webp",
    aspect: "3/5",
  },
];

export default function CollectionGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6 },
        i * 0.1
      );
    });

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative bg-blanc-casse px-4 py-24 md:px-8 md:py-32 lg:px-20 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
            Nos Créations
          </p>
          <div className="mx-auto my-4 h-px w-16 bg-or-luxe" />
          <h2 className="font-heading text-2xl leading-tight text-noir-profond md:text-4xl lg:text-5xl">
            La Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-10 lg:grid-cols-5">
          {PRODUCTS.map((product, i) => (
            <a
              key={product.id}
              href={`#${product.id}`}
              className="group cursor-pointer"
            >
              <div
                ref={(el) => { cardRefs.current[i] = el as HTMLDivElement; }}
                className="flex flex-col items-center"
                style={{ opacity: reducedMotion ? 1 : 0 }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: product.aspect }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 45vw, 20vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-center font-heading text-sm tracking-wide text-noir-profond md:text-base">
                  {product.name}
                </p>
                <span className="mt-2 font-body text-xs uppercase tracking-[0.2em] text-or-luxe opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Découvrir
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 2: Build check

Run: `npm run build`
Expected: Clean build.

### Step 3: Commit

```bash
git add src/components/sections/CollectionGrid.tsx
git commit -m "Add Collection grid section with product overview"
```

---

## Task 5: Create WhatsApp floating button

**Files:**
- Create: `src/components/layout/WhatsAppButton.tsx`

### Step 1: Create the component

```tsx
"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "221XXXXXXXXX"; // Replace with real number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos produits.")}`;

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
```

### Step 2: Build check

Run: `npm run build`
Expected: Clean build.

### Step 3: Commit

```bash
git add src/components/layout/WhatsAppButton.tsx
git commit -m "Add floating WhatsApp contact button"
```

---

## Task 6: Add CTA button to ProductSection

**Files:**
- Modify: `src/components/sections/ProductSection.tsx`

### Step 1: Add CTA prop and button

Add an optional `ctaHref` prop (defaults to `#contact`) and render a ghost button below the description in both centered and side layouts.

In the `ProductSectionProps` interface, add:
```tsx
ctaLabel?: string;
ctaHref?: string;
```

In the side layout, after the description `<p>` (around line 162), add:
```tsx
<a
  href={ctaHref || "#contact"}
  className={`mt-8 inline-block border py-2.5 text-xs uppercase tracking-[0.2em] font-body transition-all duration-500 cursor-pointer ${
    isDark
      ? "border-or-luxe/40 text-or-luxe hover:bg-or-luxe hover:text-noir-profond"
      : "border-noir-profond/30 text-noir-profond hover:bg-noir-profond hover:text-blanc-casse"
  }`}
  style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
>
  {ctaLabel || "En savoir plus"}
</a>
```

Same pattern in the centered layout (after the description, around line 124).

### Step 2: Build check

Run: `npm run build`
Expected: Clean build.

### Step 3: Commit

```bash
git add src/components/sections/ProductSection.tsx
git commit -m "Add CTA button to product sections"
```

---

## Task 7: Make contact form functional

**Files:**
- Create: `src/app/api/contact/route.ts`
- Modify: `src/components/sections/Contact.tsx`

### Step 1: Install Resend

Run: `npm install resend`

### Step 2: Create API route

```ts
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.email("Email invalide"),
  message: z.string().min(1, "Le message est requis"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const resendKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || "contacts@libellulessenteurs.com";

    if (!resendKey) {
      // Dev mode: log and return success
      console.log("[Contact Form] No RESEND_API_KEY set. Message:", data);
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Libellule Senteurs <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Nouveau message de ${data.name}`,
      text: `Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }
    console.error("[Contact Form] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["Une erreur est survenue. Réessayez plus tard."] },
      { status: 500 }
    );
  }
}
```

### Step 3: Update Contact.tsx

Replace the `handleSubmit` function and add loading/error states:

```tsx
const [submitted, setSubmitted] = useState(false);
const [sending, setSending] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSending(true);
  setError(null);

  const form = e.currentTarget;
  const formData = new FormData(form);
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.errors?.[0] || "Une erreur est survenue.");
    }
  } catch {
    setError("Impossible d'envoyer le message. Vérifiez votre connexion.");
  } finally {
    setSending(false);
  }
};
```

Update the submit button to show loading state:
```tsx
<button
  type="submit"
  disabled={sending}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {sending ? "Envoi en cours..." : "Envoyer"}
</button>
```

Add error display above the button:
```tsx
{error && (
  <p className="text-center font-body text-sm text-red-400">{error}</p>
)}
```

### Step 4: Build check

Run: `npm run build`
Expected: Clean build.

### Step 5: Commit

```bash
git add src/app/api/contact/route.ts src/components/sections/Contact.tsx package.json package-lock.json
git commit -m "Make contact form functional with API route and Resend"
```

---

## Task 8: Optimize GoldenMist with IntersectionObserver

**Files:**
- Modify: `src/components/animations/GoldenMist.tsx`

### Step 1: Add visibility-based pause

Inside the `useEffect`, after `const canvas = canvasRef.current`, add an IntersectionObserver that controls whether animation runs:

```tsx
let isVisible = true;

const observer = new IntersectionObserver(
  ([entry]) => { isVisible = entry.isIntersecting; },
  { threshold: 0 }
);
observer.observe(canvas);
```

Then modify the `animate` function to skip work when not visible:

```tsx
const animate = () => {
  if (!isVisible) {
    animationId = requestAnimationFrame(animate);
    return;
  }
  // ... existing animation code
};
```

In the cleanup, add:
```tsx
observer.disconnect();
```

### Step 2: Build check

Run: `npm run build`
Expected: Clean build.

### Step 3: Commit

```bash
git add src/components/animations/GoldenMist.tsx
git commit -m "Pause GoldenMist animation when hero is off-screen"
```

---

## Task 9: Assemble everything in page.tsx

**Files:**
- Modify: `src/app/page.tsx`

### Step 1: Update page.tsx with new sections and structure

The final page.tsx should:
1. Remove LoadingScreen import and state (done in Task 2)
2. Add imports for NotreHistoire, CollectionGrid, WhatsAppButton
3. Add `id="ambiance"` wrapper handled in AmbianceVideo (done in Task 1)
4. Place sections in correct order

```tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroConvergence from "@/components/sections/HeroConvergence";
import Tagline from "@/components/sections/Tagline";
import ProductSection from "@/components/sections/ProductSection";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import ProductDuo from "@/components/sections/ProductDuo";
import NotreHistoire from "@/components/sections/NotreHistoire";
import CollectionGrid from "@/components/sections/CollectionGrid";
import BrandMarquee from "@/components/sections/BrandMarquee";
import ValuesCounters from "@/components/sections/ValuesCounters";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <CustomCursor />
      <Navigation />
      <WhatsAppButton />

      <main>
        {/* TOP NOTES */}
        <HeroConvergence />
        <Tagline text="Chaque espace a une âme — nous lui donnons une voix" />

        {/* HEART NOTES */}
        <ProductSection
          id="diffuseur"
          label="Le Diffuseur"
          title="Chaque espace mérite une signature olfactive"
          description="Nos bâtonnets en bois naturel diffusent lentement un sillage délicat qui transforme chaque pièce en sanctuaire de sérénité."
          imageSrc="/images/products/diffuseur-baguettes-v2.png"
          imageAlt="Diffuseur à bâtonnets Libellule Senteurs"
          imageAspect="904/1400"
          imageSide="right"
          theme="light"
        />
        <AmbianceVideo />
        <ProductDuo
          theme="light"
          products={[
            {
              id: "bougie",
              label: "La Bougie",
              title: "Une flamme, mille sensations",
              description: "La cire fond doucement, libérant des notes soigneusement composées qui enveloppent votre intérieur.",
              imageSrc: "/images/products/bougie-sans-marque.webp",
              imageAlt: "Bougie parfumée Libellule Senteurs",
              imageAspect: "3/2",
            },
            {
              id: "huile",
              label: "L'Huile Essentielle",
              title: "Des essences pures, une sérénité absolue",
              description: "Extraites avec soin, nos huiles capturent la quintessence de chaque plante pour une aromathérapie d'exception.",
              imageSrc: "/images/products/flacon-huile-essentielle-detour.webp",
              imageAlt: "Flacon d'huile essentielle Libellule Senteurs",
              imageAspect: "3/4",
            },
          ]}
        />

        {/* STORY + COLLECTION */}
        <NotreHistoire />
        <CollectionGrid />

        {/* BASE NOTES */}
        <BrandMarquee />
        <ProductSection
          id="parfum-noir"
          label="Le Parfum d'Ambiance"
          title="L'élégance dans chaque détail"
          description="Un parfum d'ambiance raffiné, présenté dans un écrin noir qui allie sophistication et caractère."
          imageSrc="/images/products/parfum-noir-boite-detour.webp"
          imageAlt="Parfum noir avec boîte Libellule Senteurs"
          imageAspect="800/1000"
          imageSide="left"
          theme="dark"
        />
        <ValuesCounters />
        <ProductSection
          id="cristal"
          label="Le Cristal"
          title="Au-delà du parfum, une expérience"
          description="Le flacon cristal incarne la pureté de nos créations — un objet précieux qui sublime chaque intérieur."
          imageSrc="/images/products/parfum-cristal-detour.webp"
          imageAlt="Parfum cristal Libellule Senteurs"
          imageAspect="600/1000"
          imageSide="center"
          theme="dark"
        />

        {/* CONTACT */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
```

### Step 2: Final build check

Run: `npm run build`
Expected: Clean build, zero errors.

### Step 3: Final commit

```bash
git add src/app/page.tsx
git commit -m "Assemble refonte UX with new sections and WhatsApp button"
```

---

## Task Summary

| # | Task | Files | Type |
|---|------|-------|------|
| 1 | Fix contrast, text sizes, nav links, placeholders | 7 files modified | Bugfix |
| 2 | Reduce scroll heights + remove loading screen | 4 files modified | UX |
| 3 | Create Notre Histoire section | 1 file created | Feature |
| 4 | Create Collection grid section | 1 file created | Feature |
| 5 | Create WhatsApp floating button | 1 file created | Feature |
| 6 | Add CTA button to ProductSection | 1 file modified | Feature |
| 7 | Make contact form functional | 2 files (1 new, 1 modified) | Feature |
| 8 | Optimize GoldenMist performance | 1 file modified | Perf |
| 9 | Assemble page.tsx with new structure | 1 file modified | Integration |
