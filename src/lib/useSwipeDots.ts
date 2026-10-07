import { useEffect, useState, type RefObject } from 'react';

/**
 * Which item of a horizontal swipe row is in view, for the position dots.
 * Works on any scroll-snap row whose direct children are the items.
 */
export const useSwipeDots = (rowRef: RefObject<HTMLElement | null>) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const items = Array.from(row.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement));
        });
      },
      { root: row, threshold: 0.6 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rowRef]);

  /** Scroll the row so item i is in view. */
  const goTo = (i: number) => {
    const row = rowRef.current;
    const item = row?.children[i] as HTMLElement | undefined;
    if (row && item) row.scrollTo({ left: item.offsetLeft - row.offsetLeft - 16, behavior: 'smooth' });
  };

  return { active, goTo };
};
