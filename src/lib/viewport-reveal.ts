/**
 * Shared viewport-reveal animation for staggered fade-up.
 * Use with motion components: initial="hidden", whileInView="show", viewport={defaultViewport}.
 * Respects prefers-reduced-motion when passed true.
 */

import type { Variants } from "framer-motion";

const DEFAULT_OFFSET = 16;
const DEFAULT_DURATION = 0.5;
const DEFAULT_STAGGER = 0.08;
const DEFAULT_DELAY_CHILDREN = 0.05;

const HIDDEN_EMPTY = {} as const;

export type ViewportRevealVariants = {
  container: Variants;
  item: Variants;
};

/**
 * Returns container and item variants for staggered viewport reveal.
 * Pass the result of useReducedMotion() so animations are disabled when the user prefers reduced motion.
 */
export function getViewportRevealVariants(
  prefersReducedMotion: boolean | null,
): ViewportRevealVariants {
  const reduced = prefersReducedMotion === true;
  const itemOffset = reduced ? 0 : DEFAULT_OFFSET;
  const itemDuration = reduced ? 0 : DEFAULT_DURATION;
  const itemStagger = reduced ? 0 : DEFAULT_STAGGER;
  const delayChildren = reduced ? 0 : DEFAULT_DELAY_CHILDREN;

  return {
    container: {
      hidden: HIDDEN_EMPTY,
      show: {
        transition: {
          staggerChildren: itemStagger,
          delayChildren,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: itemOffset },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: itemDuration },
      },
    },
  } as ViewportRevealVariants;
}

/**
 * Default viewport options for whileInView.
 * - once: true — animate only the first time the element enters view
 * - amount: 0.2 — trigger when 20% of the element is visible
 */
export const defaultViewport = {
  once: true,
  amount: 0.2,
} as const;
