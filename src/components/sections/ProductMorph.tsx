import ScrollFramePlayer from "@/components/animations/ScrollFramePlayer";

/**
 * Product morph section wrapper.
 *
 * Thin composition layer that places ScrollFramePlayer into the page layout.
 * Keeping the section and the animation engine separate allows the section to
 * later gain surrounding copy, entrance animations, or metadata without
 * touching the core scroll-scrub logic.
 */
export default function ProductMorph() {
  return <ScrollFramePlayer className="w-full" />;
}
