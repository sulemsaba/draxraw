/**
 * Carries a captured GSAP Flip state across a route change so the
 * homepage thumbnail can "carry" its image into the project hero.
 *
 * The state is stored module-locally (not in localStorage) so it
 * only survives a soft in-app navigation. A direct page load finds
 * no state and the project hero reveals via a simple fallback, never
 * blocking navigation. This is the safe-degradation contract.
 *
 * The state is single-use: read once, then discarded. A second visit
 * to the same project (e.g. via browser back) re-captures fresh
 * state from whatever thumbnail the visitor clicked.
 */

import { Flip } from './gsap';

export interface FlipCarrier {
  /** The data-flip-id both elements must share. */
  id: string;
  /** Captured Flip state from the source element. */
  state: ReturnType<typeof Flip.getState>;
  /** Monotonic ms timestamp so stale states never apply. */
  capturedAt: number;
}

let carrier: FlipCarrier | null = null;

const STALE_MS = 4000;

/**
 * Capture the Flip state of an element just before navigation.
 * The element should carry `data-flip-id={id}` so the destination
 * can find it via the same id.
 */
export const stashFlipState = (id: string, source: Element | Element[]): void => {
  try {
    const els = Array.isArray(source) ? source : [source];
    carrier = {
      id,
      state: Flip.getState(els),
      capturedAt: performance.now()
    };
  } catch {
    /* Flip.getState can throw if the element is mid-render. Fail safe. */
    carrier = null;
  }
};

/**
 * Consume the stashed state for a given id. Returns null when:
 *   - no state was stashed (direct page load, refresh)
 *   - the id doesn't match (different project)
 *   - the state is stale (more than STALE_MS old, e.g. user waited)
 *   - the visitor prefers reduced motion
 *   - the viewport changed dramatically between capture and consume
 */
export const consumeFlipState = (id: string): FlipCarrier | null => {
  if (!carrier) return null;
  if (carrier.id !== id) return null;
  if (performance.now() - carrier.capturedAt > STALE_MS) {
    carrier = null;
    return null;
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    carrier = null;
    return null;
  }
  const consumed = carrier;
  carrier = null;
  return consumed;
};

/** Test-only helper. */
export const _resetFlipState = (): void => {
  carrier = null;
};
