/**
 * Brand design tokens and application constants.
 *
 * These constants mirror the CSS custom properties defined in globals.css
 * and the Tailwind theme tokens. Use these in JavaScript/TypeScript contexts
 * (e.g. GSAP animations, Three.js materials) where CSS variables are not
 * directly accessible.
 */

export const COLORS = {
  orLuxe: "#C99700",
  noirProfond: "#000000",
  blancCasse: "#F8F8F8",
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

/**
 * Timing constants for the loading screen animation sequence.
 *
 * The three values must be kept in sync across LoadingScreen.tsx and Hero.tsx:
 *   - drawDuration:   how long the SVG stroke-draw CSS animation runs (ms)
 *   - fadeDuration:   how long the overlay takes to fade to opacity-0 (ms)
 *   - totalDuration:  sum of the two above — when the overlay is fully gone
 *   - heroRevealDelay: when Hero content should start appearing; includes a small
 *                      buffer beyond totalDuration so the transition feels clean
 *
 * Using a single source of truth here prevents the "hero pops in while the
 * loading screen is still fading" race condition that previously existed when
 * the 3200 ms magic number in Hero.tsx drifted from LoadingScreen.tsx.
 */
export const LOADING_SCREEN = {
  drawDuration: 2000,
  fadeDuration: 800,
  get totalDuration() { return this.drawDuration + this.fadeDuration; },
  heroRevealDelay: 3200,
} as const;

/**
 * Configuration for the product morph animation sequence.
 * The morph effect cycles through pre-rendered PNG frames stored in /public/frames/.
 */
export const PRODUCT_MORPH = {
  totalFrames: 90,
  fps: 30,
  framePrefix: "/frames/morph-",
  frameExtension: ".png",
} as const;
