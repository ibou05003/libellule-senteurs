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
 * Configuration for the product morph animation sequence.
 * The morph effect cycles through pre-rendered PNG frames stored in /public/frames/.
 */
export const PRODUCT_MORPH = {
  totalFrames: 90,
  fps: 30,
  framePrefix: "/frames/morph-",
  frameExtension: ".png",
} as const;
