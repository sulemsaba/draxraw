// Seeded torn-edge outlines for stickers, as CSS clip-path polygons.

const rand = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

/** A rectangle whose edges are ripped. `rough` is the max bite depth in %. */
export const tornClip = (seed: number, rough = 2.4, steps = 14): string => {
  const r = rand(seed);
  const pts: string[] = [];
  const bite = () => (r() * rough).toFixed(2);
  for (let i = 0; i <= steps; i++) pts.push(`${((i / steps) * 100).toFixed(2)}% ${bite()}%`);
  for (let i = 1; i <= steps / 2; i++) pts.push(`${(100 - +bite()).toFixed(2)}% ${((i / (steps / 2)) * 100).toFixed(2)}%`);
  for (let i = steps - 1; i >= 0; i--) pts.push(`${((i / steps) * 100).toFixed(2)}% ${(100 - +bite()).toFixed(2)}%`);
  for (let i = steps / 2 - 1; i >= 1; i--) pts.push(`${bite()}% ${((i / (steps / 2)) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(',')})`;
};

/** Gaffer tape strip: straight long edges, ragged short ends. */
export const tapeClip = (seed: number): string => {
  const r = rand(seed);
  const end = (x: number, dir: number) =>
    Array.from({ length: 6 }, (_, i) => `${(x + dir * r() * 4).toFixed(2)}% ${((i / 5) * 100).toFixed(1)}%`);
  const left = end(0, 1);
  const right = end(100, -1).reverse();
  return `polygon(${[...left.reverse(), ...right.reverse()].join(',')})`;
};

export const tilt = (seed: number, max = 3) => {
  const r = rand(seed + 7);
  return +((r() * 2 - 1) * max).toFixed(2);
};
